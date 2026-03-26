from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date, datetime
from enum import Enum

class UserRole(str, Enum):
    ADMIN = "admin"
    EMPLOYEE = "employee"

class LeaveStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

class AttendanceStatus(str, Enum):
    PRESENT = "present"
    ABSENT = "absent"

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    role: UserRole = UserRole.EMPLOYEE

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    employee_id: Optional[int] = None

# Department Schemas
class DepartmentBase(BaseModel):
    name: str

class DepartmentCreate(DepartmentBase):
    pass

class Department(DepartmentBase):
    id: int
    
    class Config:
        from_attributes = True

# Employee Schemas
class EmployeeBase(BaseModel):
    employee_id: str
    name: str
    phone: Optional[str] = None
    department_id: Optional[int] = None
    designation: Optional[str] = None
    salary: Optional[float] = None
    joining_date: Optional[date] = None

class EmployeeCreate(EmployeeBase):
    email: EmailStr
    password: str

class EmployeeUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    department_id: Optional[int] = None
    designation: Optional[str] = None
    salary: Optional[float] = None

class Employee(EmployeeBase):
    id: int
    user_id: int
    email: EmailStr
    department: Optional[Department] = None
    
    class Config:
        from_attributes = True

# Leave Schemas
class LeaveBase(BaseModel):
    leave_type: str
    start_date: date
    end_date: date
    reason: Optional[str] = None

class LeaveCreate(LeaveBase):
    pass

class LeaveUpdate(BaseModel):
    status: LeaveStatus

class Leave(LeaveBase):
    id: int
    employee_id: int
    status: LeaveStatus
    employee_name: Optional[str] = None
    
    class Config:
        from_attributes = True

# Attendance Schemas
class AttendanceBase(BaseModel):
    date: date
    status: AttendanceStatus

class AttendanceCreate(AttendanceBase):
    pass

class Attendance(AttendanceBase):
    id: int
    employee_id: int
    
    class Config:
        from_attributes = True

# Payroll Schemas
class PayrollBase(BaseModel):
    month: str
    bonus: float = 0
    deduction: float = 0

class PayrollCreate(PayrollBase):
    employee_id: int

class Payroll(PayrollBase):
    id: int
    employee_id: int
    base_salary: float
    net_salary: float
    employee_name: Optional[str] = None
    
    class Config:
        from_attributes = True

# Dashboard Schemas
class DashboardStats(BaseModel):
    total_employees: int
    total_departments: int
    pending_leaves: int
    total_salary_expense: float

class EmployeeDashboard(BaseModel):
    leave_balance: int
    attendance_count: int
    latest_salary: Optional[float] = None
