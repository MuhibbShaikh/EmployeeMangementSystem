import React, { useEffect, useState } from 'react';
import { Calendar, Clock, DollarSign } from 'lucide-react';
import { getEmployeeDashboard } from '../services/api';

const EmployeeDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await getEmployeeDashboard();
      setStats(res.data);
    } catch (error) {
      console.error('Failed to load dashboard', error);
    }
  };

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  const statCards = [
    { name: 'Leave Balance', value: `${stats.leave_balance} days`, icon: Calendar, color: 'bg-orange-500' },
    { name: 'Attendance Count', value: `${stats.attendance_count} days`, icon: Clock, color: 'bg-blue-500' },
    { name: 'Latest Salary', value: stats.latest_salary ? `₹${stats.latest_salary.toLocaleString()}` : 'N/A', icon: DollarSign, color: 'bg-green-500' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Employee Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="px-4 py-3 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 font-medium">
            Apply Leave
          </button>
          <button className="px-4 py-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-medium">
            Mark Attendance
          </button>
          <button className="px-4 py-3 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 font-medium">
            View Salary
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow p-6 text-white">
        <h3 className="text-xl font-semibold mb-2">Welcome Back!</h3>
        <p className="text-indigo-100">
          Here's your overview. Use the navigation menu to access different sections.
        </p>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
