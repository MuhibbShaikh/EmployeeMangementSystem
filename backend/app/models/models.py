from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey, Enum as SQLEnum, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.db.database import Base

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    EMPLOYEE = "employee"

class LeaveStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

class AttendanceStatus(str, enum.Enum):
    PRESENT = "present"
    ABSENT = "absent"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(SQLEnum(UserRole), default=UserRole.EMPLOYEE, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    employee = relationship("Employee", back_populates="user", uselist=False)

class Department(Base):
    __tablename__ = "departments"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    employees = relationship("Employee", back_populates="department")

class Employee(Base):
    __tablename__ = "employees"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    employee_id = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False)
    phone = Column(String)
    department_id = Column(Integer, ForeignKey("departments.id"))
    designation = Column(String)
    salary = Column(Float)
    joining_date = Column(Date)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="employee")
    department = relationship("Department", back_populates="employees")
    leaves = relationship("Leave", back_populates="employee")
    attendance = relationship("Attendance", back_populates="employee")
    payroll = relationship("Payroll", back_populates="employee")

class Leave(Base):
    __tablename__ = "leaves"
    
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    leave_type = Column(String, nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    reason = Column(String)
    status = Column(SQLEnum(LeaveStatus), default=LeaveStatus.PENDING, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    employee = relationship("Employee", back_populates="leaves")

class Attendance(Base):
    __tablename__ = "attendance"
    
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    date = Column(Date, nullable=False)
    status = Column(SQLEnum(AttendanceStatus), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    employee = relationship("Employee", back_populates="attendance")

class Payroll(Base):
    __tablename__ = "payroll"
    
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    month = Column(String, nullable=False)
    base_salary = Column(Float, nullable=False)
    bonus = Column(Float, default=0)
    deduction = Column(Float, default=0)
    net_salary = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    employee = relationship("Employee", back_populates="payroll")
