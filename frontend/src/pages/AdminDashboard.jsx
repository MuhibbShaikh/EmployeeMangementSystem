import React, { useEffect, useState } from 'react';
import { Users, Building2, Calendar, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getAdminDashboard, getDashboardStats } from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState({ salary: [], departments: [] });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [statsRes, chartRes] = await Promise.all([
        getAdminDashboard(),
        getDashboardStats()
      ]);
      setStats(statsRes.data);
      setChartData({
        salary: chartRes.data.salary_chart,
        departments: chartRes.data.department_distribution
      });
    } catch (error) {
      console.error('Failed to load dashboard', error);
    }
  };

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  const statCards = stats ? [
    { name: 'Total Employees', value: stats.total_employees, icon: Users, color: 'bg-blue-500' },
    { name: 'Departments', value: stats.total_departments, icon: Building2, color: 'bg-purple-500' },
    { name: 'Pending Leaves', value: stats.pending_leaves, icon: Calendar, color: 'bg-orange-500' },
    { name: 'Salary Expense', value: `₹${stats.total_salary_expense.toLocaleString()}`, icon: DollarSign, color: 'bg-green-500' },
  ] : [];

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Salary Expenses</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.salary}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#6366f1" name="Salary (₹)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Department Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData.departments}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, count }) => `${name}: ${count}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {chartData.departments.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
