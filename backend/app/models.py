"""
Database Models

SQLAlchemy models for User and Task entities.
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship

from app.database import Base


class User(Base):
    """User model for authentication."""
    
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship to tasks
    tasks = relationship("Task", back_populates="owner", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<User(id={self.id}, email={self.email})>"


class Task(Base):
    """Task model for task management."""
    
    __tablename__ = "tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    
    # Status: todo, in_progress, completed
    status = Column(String(50), default="todo", nullable=False)
    
    # Priority: low, medium, high
    priority = Column(String(50), default="medium", nullable=False)
    
    # Due date (optional)
    due_date = Column(DateTime, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Foreign key to user
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Relationship to user
    owner = relationship("User", back_populates="tasks")
    
    def __repr__(self):
        return f"<Task(id={self.id}, title={self.title}, status={self.status})>"
