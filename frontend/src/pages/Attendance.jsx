import React, { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { getAttendance, checkTodayAttendance, markAttendance } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Attendance = () => {
  const { isAdmin } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [todayMarked, setTodayMarked] = useState(false);
  const [todayStatus, setTodayStatus] = useState(null);

  useEffect(() => {
    loadAttendance();
    if (!isAdmin()) {
      checkToday();
    }
  }, []);

  const loadAttendance = async () => {
    try {
      const res = await getAttendance();
      setAttendance(res.data);
    } catch (error) {
      console.error('Failed to load attendance', error);
    }
  };

  const checkToday = async () => {
    try {
      const res = await checkTodayAttendance();
      setTodayMarked(res.data.marked);
      setTodayStatus(res.data.status);
    } catch (error) {
      console.error('Failed to check today attendance', error);
    }
  };

  const handleMarkAttendance = async () => {
    try {
      await markAttendance({
        date: new Date().toISOString().split('T')[0],
        status: 'present'
      });
      loadAttendance();
      checkToday();
    } catch (error) {
      alert(error.response?.data?.detail || 'Failed to mark attendance');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>

      {!isAdmin() && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Today's Attendance</h2>
              <p className="text-sm text-gray-600 mt-1">
                {todayMarked ? (
                  <span className="text-green-600">✓ Marked as {todayStatus}</span>
                ) : (
                  'Not marked yet'
                )}
              </p>
            </div>
            {!todayMarked && (
              <button
                onClick={handleMarkAttendance}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <CheckCircle className="h-5 w-5" />
                Mark Present
              </button>
            )}
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendance.map((record) => (
                <tr key={record.id}>
                  <td className="px-6 py-4 text-sm text-gray-900">{record.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      record.status === 'present' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
