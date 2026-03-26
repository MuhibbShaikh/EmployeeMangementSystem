# 🏢 Employee Management System

A full-stack Role-Based Employee Management System with Authentication, Leave Management, Attendance Tracking, and Payroll.

## 🎯 Features

- ✅ JWT Authentication & Role-Based Access Control
- ✅ Employee CRUD Operations
- ✅ Department Management
- ✅ Leave Application & Approval System
- ✅ Attendance Tracking
- ✅ Automated Payroll Calculation
- ✅ Interactive Dashboards with Charts
- ✅ Production-Ready & Deployable

## 🏗 Tech Stack

### Frontend
- React (Vite)
- TailwindCSS
- Axios
- React Router
- Recharts

### Backend
- FastAPI
- SQLAlchemy
- Pydantic
- JWT Authentication
- PostgreSQL/SQLite

## 🚀 Quick Start

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend runs on: http://localhost:8000
API Docs: http://localhost:8000/docs

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: http://localhost:5173

## 👤 Default Admin Credentials

- Email: admin@company.com
- Password: admin123

## 📊 Database Schema

- **users** - Authentication & roles
- **employees** - Employee profiles
- **departments** - Department management
- **leaves** - Leave requests
- **attendance** - Daily attendance
- **payroll** - Salary records

## 🎨 Screenshots

Admin can:
- Manage all employees
- Approve/reject leaves
- Generate payroll
- View analytics

Employees can:
- View their profile
- Apply for leave
- Check attendance
- View salary slips

## 📝 License

MIT
