import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { getEmployees, getDepartments, createEmployee, updateEmployee, deleteEmployee } from '../services/api';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    employee_id: '',
    name: '',
    email: '',
    password: '',
    phone: '',
    department_id: '',
    designation: '',
    salary: '',
    joining_date: ''
  });

  useEffect(() => {
    loadEmployees();
    loadDepartments();
  }, []);

  const loadEmployees = async () => {
    try {
      const res = await getEmployees();
      setEmployees(res.data);
    } catch (error) {
      console.error('Failed to load employees', error);
    }
  };

  const loadDepartments = async () => {
    try {
      const res = await getDepartments();
      setDepartments(res.data);
    } catch (error) {
      console.error('Failed to load departments', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEmployee) {
        await updateEmployee(editingEmployee.id, {
          name: formData.name,
          phone: formData.phone,
          department_id: formData.department_id ? parseInt(formData.department_id) : null,
          designation: formData.designation,
          salary: formData.salary ? parseFloat(formData.salary) : null
        });
      } else {
        await createEmployee({
          ...formData,
          department_id: formData.department_id ? parseInt(formData.department_id) : null,
          salary: formData.salary ? parseFloat(formData.salary) : null
        });
      }
      setShowModal(false);
      resetForm();
      loadEmployees();
    } catch (error) {
      alert(error.response?.data?.detail || 'Failed to save employee');
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      employee_id: employee.employee_id,
      name: employee.name,
      email: employee.email,
      password: '',
      phone: employee.phone || '',
      department_id: employee.department_id || '',
      designation: employee.designation || '',
      salary: employee.salary || '',
      joining_date: employee.joining_date || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await deleteEmployee(id);
        loadEmployees();
      } catch (error) {
        alert('Failed to delete employee');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      employee_id: '',
      name: '',
      email: '',
      password: '',
      phone: '',
      department_id: '',
      designation: '',
      salary: '',
      joining_date: ''
    });
    setEditingEmployee(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5" />
          Add Employee
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Designation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Salary</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees.map((employee) => (
                <tr key={employee.id}>
                  <td className="px-6 py-4 text-sm text-gray-900">{employee.employee_id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{employee.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{employee.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{employee.department?.name || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{employee.designation || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">₹{employee.salary?.toLocaleString() || '-'}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(employee)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(employee.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">{editingEmployee ? 'Edit Employee' : 'Add Employee'}</h2>
              <button onClick={() => { setShowModal(false); resetForm(); }}>
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                  <input
                    type="text"
                    value={formData.employee_id}
                    onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                    disabled={editingEmployee}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                    disabled={editingEmployee}
                  />
                </div>
                {!editingEmployee && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select
                    value={formData.department_id}
                    onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
                  <input
                    type="number"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                {!editingEmployee && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Joining Date</label>
                    <input
                      type="date"
                      value={formData.joining_date}
                      onChange={(e) => setFormData({ ...formData, joining_date: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                )}
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  {editingEmployee ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
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

export default Employees;
