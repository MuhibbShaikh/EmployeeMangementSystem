import React, { useEffect, useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { getDepartments, createDepartment, deleteDepartment } from '../services/api';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => {
    loadDepartments();
  }, []);

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
      await createDepartment({ name });
      setShowModal(false);
      setName('');
      loadDepartments();
    } catch (error) {
      alert(error.response?.data?.detail || 'Failed to create department');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await deleteDepartment(id);
        loadDepartments();
      } catch (error) {
        alert('Failed to delete department');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5" />
          Add Department
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((dept) => (
          <div key={dept.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">{dept.name}</h3>
              <button
                onClick={() => handleDelete(dept.id)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">Add Department</h2>
              <button onClick={() => setShowModal(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Create
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

export default Departments;
