"""
Task Tracker MVP - Backend API

A FastAPI-based REST API for task management with JWT authentication.

Author: Ehtisham Ashraf
Email: kingehtsham0@gmail.com
"""

from datetime import datetime
from typing import List, Optional

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.database import engine, Base, get_db
from app.models import User, Task
from app.schemas import (
    UserCreate, UserResponse, Token,
    TaskCreate, TaskUpdate, TaskResponse
)
from app.auth import (
    hash_password, verify_password, create_access_token,
    get_current_user
)


# Create database tables
Base.metadata.create_all(bind=engine)


# Initialize FastAPI app
app = FastAPI(
    title="Task Tracker API",
    description="A simple task management API with authentication",
    version="1.0.0"
)


# Configure CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==================== Auth Routes ====================

@app.post("/auth/register", response_model=UserResponse, status_code=201)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user account."""
    
    # Check if email already exists
    existing = db.query(User).filter(User.email == user_data.email).first()
    if existing:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    
    # Create new user
    new_user = User(
        email=user_data.email,
        name=user_data.name,
        hashed_password=hash_password(user_data.password)
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user


@app.post("/auth/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """Login and get access token."""
    
    # Find user
    user = db.query(User).filter(User.email == form_data.username).first()
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )
    
    # Create token
    token = create_access_token({"sub": user.email})
    
    return {"access_token": token, "token_type": "bearer"}


@app.get("/auth/me", response_model=UserResponse)
async def get_profile(current_user: User = Depends(get_current_user)):
    """Get current user's profile."""
    return current_user


# ==================== Task Routes ====================

@app.get("/tasks", response_model=List[TaskResponse])
async def get_tasks(
    status: Optional[str] = None,
    priority: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all tasks for the current user.
    
    Optional filters:
    - status: todo, in_progress, completed
    - priority: low, medium, high
    """
    query = db.query(Task).filter(Task.user_id == current_user.id)
    
    if status:
        query = query.filter(Task.status == status)
    if priority:
        query = query.filter(Task.priority == priority)
    
    # Order by priority (high first) then due date
    tasks = query.order_by(
        Task.priority.desc(),
        Task.due_date.asc()
    ).all()
    
    return tasks


@app.get("/tasks/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific task by ID."""
    
    task = db.query(Task).filter(
        Task.id == task_id,
        Task.user_id == current_user.id
    ).first()
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    return task


@app.post("/tasks", response_model=TaskResponse, status_code=201)
async def create_task(
    task_data: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new task."""
    
    new_task = Task(
        **task_data.model_dump(),
        user_id=current_user.id
    )
    
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    
    return new_task


@app.put("/tasks/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: int,
    task_data: TaskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update an existing task."""
    
    task = db.query(Task).filter(
        Task.id == task_id,
        Task.user_id == current_user.id
    ).first()
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Update fields
    update_data = task_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(task, field, value)
    
    task.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(task)
    
    return task


@app.delete("/tasks/{task_id}", status_code=204)
async def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a task."""
    
    task = db.query(Task).filter(
        Task.id == task_id,
        Task.user_id == current_user.id
    ).first()
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    db.delete(task)
    db.commit()
    
    return None


# ==================== Stats Route ====================

@app.get("/tasks/stats/summary")
async def get_task_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get task statistics for the dashboard."""
    
    total = db.query(Task).filter(Task.user_id == current_user.id).count()
    
    completed = db.query(Task).filter(
        Task.user_id == current_user.id,
        Task.status == "completed"
    ).count()
    
    in_progress = db.query(Task).filter(
        Task.user_id == current_user.id,
        Task.status == "in_progress"
    ).count()
    
    todo = db.query(Task).filter(
        Task.user_id == current_user.id,
        Task.status == "todo"
    ).count()
    
    return {
        "total": total,
        "completed": completed,
        "in_progress": in_progress,
        "todo": todo,
        "completion_rate": round((completed / total * 100) if total > 0 else 0, 1)
    }


# ==================== Health Check ====================

@app.get("/health")
async def health_check():
    """API health check endpoint."""
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}
