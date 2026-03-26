import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as apiLogin } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const employeeId = localStorage.getItem('employeeId');
    
    if (token && role) {
      setUser({ role, employeeId: employeeId ? parseInt(employeeId) : null });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await apiLogin(email, password);
      const { access_token, role, employee_id } = response.data;
      
      localStorage.setItem('token', access_token);
      localStorage.setItem('role', role);
      if (employee_id) {
        localStorage.setItem('employeeId', employee_id.toString());
      }
      
      setUser({ role, employeeId: employee_id });
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Login failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('employeeId');
    setUser(null);
  };

  const isAdmin = () => user?.role === 'admin';
  const isEmployee = () => user?.role === 'employee';

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, isEmployee, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
