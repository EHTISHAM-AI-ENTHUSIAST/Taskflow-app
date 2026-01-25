"""
Pydantic Schemas

Request and response schemas for API validation.
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


# ==================== User Schemas ====================

class UserCreate(BaseModel):
    """Schema for user registration."""
    email: EmailStr
    name: str = Field(..., min_length=2, max_length=100)
    password: str = Field(..., min_length=6)


class UserResponse(BaseModel):
    """Schema for user data in responses."""
    id: int
    email: str
    name: str
    created_at: datetime
    
    class Config:
        from_attributes = True


class Token(BaseModel):
    """Schema for JWT token response."""
    access_token: str
    token_type: str = "bearer"


# ==================== Task Schemas ====================

class TaskCreate(BaseModel):
    """Schema for creating a new task."""
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    status: str = Field(default="todo", pattern="^(todo|in_progress|completed)$")
    priority: str = Field(default="medium", pattern="^(low|medium|high)$")
    due_date: Optional[datetime] = None


class TaskUpdate(BaseModel):
    """Schema for updating a task. All fields are optional."""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    status: Optional[str] = Field(None, pattern="^(todo|in_progress|completed)$")
    priority: Optional[str] = Field(None, pattern="^(low|medium|high)$")
    due_date: Optional[datetime] = None


class TaskResponse(BaseModel):
    """Schema for task data in responses."""
    id: int
    title: str
    description: Optional[str]
    status: str
    priority: str
    due_date: Optional[datetime]
    created_at: datetime
    updated_at: datetime
    user_id: int
    
    class Config:
        from_attributes = True
