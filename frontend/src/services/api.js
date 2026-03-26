import axios from 'axios';

const API_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const login = (email, password) => api.post('/auth/login', { email, password });
export const register = (data) => api.post('/auth/register', data);

// Employees
export const getEmployees = () => api.get('/employees/');
export const getMyProfile = () => api.get('/employees/me');
export const getEmployee = (id) => api.get(`/employees/${id}`);
export const createEmployee = (data) => api.post('/employees/', data);
export const updateEmployee = (id, data) => api.put(`/employees/${id}`, data);
export const deleteEmployee = (id) => api.delete(`/employees/${id}`);

// Departments
export const getDepartments = () => api.get('/departments/');
export const createDepartment = (data) => api.post('/departments/', data);
export const deleteDepartment = (id) => api.delete(`/departments/${id}`);

// Leaves
export const getLeaves = () => api.get('/leaves/');
export const getPendingLeaves = () => api.get('/leaves/pending');
export const applyLeave = (data) => api.post('/leaves/', data);
export const updateLeaveStatus = (id, status) => api.put(`/leaves/${id}`, { status });
export const deleteLeave = (id) => api.delete(`/leaves/${id}`);

// Attendance
export const getAttendance = () => api.get('/attendance/');
export const checkTodayAttendance = () => api.get('/attendance/today');
export const markAttendance = (data) => api.post('/attendance/', data);
export const getEmployeeAttendance = (id) => api.get(`/attendance/employee/${id}`);

// Payroll
export const getAllPayroll = () => api.get('/payroll/');
export const getMySalary = () => api.get('/payroll/my-salary');
export const generatePayroll = (data) => api.post('/payroll/', data);
export const getEmployeePayroll = (id) => api.get(`/payroll/employee/${id}`);

// Dashboard
export const getAdminDashboard = () => api.get('/dashboard/admin');
export const getEmployeeDashboard = () => api.get('/dashboard/employee');
export const getDashboardStats = () => api.get('/dashboard/stats');

export default api;
