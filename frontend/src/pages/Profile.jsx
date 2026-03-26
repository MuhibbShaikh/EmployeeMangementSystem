import React, { useEffect, useState } from 'react';
import { User, Mail, Phone, Building2, Briefcase, Calendar, DollarSign } from 'lucide-react';
import { getMyProfile } from '../services/api';

const Profile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await getMyProfile();
      setProfile(res.data);
    } catch (error) {
      console.error('Failed to load profile', error);
    }
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  const fields = [
    { icon: User, label: 'Employee ID', value: profile.employee_id },
    { icon: User, label: 'Name', value: profile.name },
    { icon: Mail, label: 'Email', value: profile.email },
    { icon: Phone, label: 'Phone', value: profile.phone || '-' },
    { icon: Building2, label: 'Department', value: profile.department?.name || '-' },
    { icon: Briefcase, label: 'Designation', value: profile.designation || '-' },
    { icon: Calendar, label: 'Joining Date', value: profile.joining_date || '-' },
    { icon: DollarSign, label: 'Salary', value: profile.salary ? `₹${profile.salary.toLocaleString()}` : '-' },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-t-lg">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-indigo-600" />
            </div>
            <div className="text-white">
              <h2 className="text-2xl font-bold">{profile.name}</h2>
              <p className="text-indigo-100">{profile.designation || 'Employee'}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {fields.map((field, index) => (
            <div key={index} className="flex items-start gap-4 py-3 border-b last:border-0">
              <field.icon className="h-5 w-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-600">{field.label}</p>
                <p className="text-gray-900 font-medium">{field.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
