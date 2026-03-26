import React, { useEffect, useState } from 'react';
import { Plus, X } from 'lucide-react';
import { getAllPayroll, getMySalary, generatePayroll, getEmployees } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Payroll = () => {
  const { isAdmin } = useAuth();
  const [payrolls, setPayrolls] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    employee_id: '',
    month: '',
    bonus: '',
    deduction: ''
  });

  useEffect(() => {
    loadPayroll();
    if (isAdmin()) {
      loadEmployees();
    }
  }, []);

  const loadPayroll = async () => {
    try {
      const res = isAdmin() ? await getAllPayroll() : await getMySalary();
      setPayrolls(res.data);
    } catch (error) {
      console.error('Failed to load payroll', error);
    }
  };

  const loadEmployees = async () => {
    try {
      const res = await getEmployees();
      setEmployees(res.data);
    } catch (error) {
      console.error('Failed to load employees', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await generatePayroll({
        employee_id: parseInt(formData.employee_id),
        month: formData.month,
        bonus: parseFloat(formData.bonus) || 0,
        deduction: parseFloat(formData.deduction) || 0
      });
      setShowModal(false);
      setFormData({ employee_id: '', month: '', bonus: '', deduction: '' });
      loadPayroll();
    } catch (error) {
      alert(error.response?.data?.detail || 'Failed to generate payroll');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {isAdmin() ? 'Payroll Management' : 'My Salary'}
        </h1>
        {isAdmin() && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Plus className="h-5 w-5" />
            Generate Payroll
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {isAdmin() && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Base Salary</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bonus</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deduction</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Salary</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payrolls.map((payroll) => (
                <tr key={payroll.id}>
                  {isAdmin() && <td className="px-6 py-4 text-sm text-gray-900">{payroll.employee_name}</td>}
                  <td className="px-6 py-4 text-sm text-gray-900">{payroll.month}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">₹{payroll.base_salary.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-green-600">+₹{payroll.bonus.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-red-600">-₹{payroll.deduction.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">₹{payroll.net_salary.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">Generate Payroll</h2>
              <button onClick={() => setShowModal(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
                <select
                  value={formData.employee_id}
                  onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                >
                  <option value="">Select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                <input
                  type="month"
                  value={formData.month}
                  onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bonus</label>
                <input
                  type="number"
                  value={formData.bonus}
                  onChange={(e) => setFormData({ ...formData, bonus: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deduction</label>
                <input
                  type="number"
                  value={formData.deduction}
                  onChange={(e) => setFormData({ ...formData, deduction: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="0"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Generate
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payroll;
