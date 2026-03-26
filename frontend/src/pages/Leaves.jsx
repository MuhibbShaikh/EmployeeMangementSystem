import React, { useEffect, useState } from 'react';
import { Plus, Check, X as CloseIcon } from 'lucide-react';
import { getLeaves, getPendingLeaves, applyLeave, updateLeaveStatus } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Leaves = () => {
  const { isAdmin } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    leave_type: '',
    start_date: '',
    end_date: '',
    reason: ''
  });

  useEffect(() => {
    loadLeaves();
  }, []);

  const loadLeaves = async () => {
    try {
      const res = isAdmin() ? await getPendingLeaves() : await getLeaves();
      setLeaves(res.data);
    } catch (error) {
      console.error('Failed to load leaves', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await applyLeave(formData);
      setShowModal(false);
      setFormData({ leave_type: '', start_date: '', end_date: '', reason: '' });
      loadLeaves();
    } catch (error) {
      alert('Failed to apply leave');
    }
  };

  const handleApprove = async (id) => {
    try {
      await updateLeaveStatus(id, 'approved');
      loadLeaves();
    } catch (error) {
      alert('Failed to approve leave');
    }
  };

  const handleReject = async (id) => {
    try {
      await updateLeaveStatus(id, 'rejected');
      loadLeaves();
    } catch (error) {
      alert('Failed to reject leave');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {isAdmin() ? 'Pending Leave Requests' : 'My Leaves'}
        </h1>
        {!isAdmin() && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Plus className="h-5 w-5" />
            Apply Leave
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {isAdmin() && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">End Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                {isAdmin() && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leaves.map((leave) => (
                <tr key={leave.id}>
                  {isAdmin() && <td className="px-6 py-4 text-sm text-gray-900">{leave.employee_name}</td>}
                  <td className="px-6 py-4 text-sm text-gray-900">{leave.leave_type}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{leave.start_date}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{leave.end_date}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{leave.reason}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(leave.status)}`}>
                      {leave.status}
                    </span>
                  </td>
                  {isAdmin() && (
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(leave.id)}
                          className="text-green-600 hover:text-green-800"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleReject(leave.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <CloseIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  )}
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
              <h2 className="text-xl font-semibold">Apply Leave</h2>
              <button onClick={() => setShowModal(false)}>
                <CloseIcon className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                <select
                  value={formData.leave_type}
                  onChange={(e) => setFormData({ ...formData, leave_type: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Annual Leave">Annual Leave</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows="3"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Submit
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

export default Leaves;
