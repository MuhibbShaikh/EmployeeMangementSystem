from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import engine, Base, SessionLocal
from app.models.models import User, Department
from app.core.security import get_password_hash
from app.api import auth, employees, departments, leaves, attendance, payroll, dashboard

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Employee Management System API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(employees.router)
app.include_router(departments.router)
app.include_router(leaves.router)
app.include_router(attendance.router)
app.include_router(payroll.router)
app.include_router(dashboard.router)

@app.on_event("startup")
def startup_event():
    db = SessionLocal()
    try:
        # Create default admin if not exists
        admin = db.query(User).filter(User.email == "admin@company.com").first()
        if not admin:
            admin = User(
                email="admin@company.com",
                hashed_password=get_password_hash("admin123"),
                role="admin"
            )
            db.add(admin)
            db.commit()
            print("Default admin created: admin@company.com / admin123")
        
        # Create default departments if not exist
        default_departments = ["Engineering", "HR", "Sales", "Marketing", "Finance"]
        for dept_name in default_departments:
            existing = db.query(Department).filter(Department.name == dept_name).first()
            if not existing:
                dept = Department(name=dept_name)
                db.add(dept)
        db.commit()
        print("Default departments created")
        
    finally:
        db.close()

@app.get("/")
def root():
    return {
        "message": "Employee Management System API",
        "version": "1.0.0",
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
