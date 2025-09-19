import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const VoterApprovalPage = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [approving, setApproving] = useState({});

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/admin/users');
      setUsers(res.data || []);
    } catch (e) {
      console.error('Failed to load users', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const approveUser = async (id) => {
    setApproving((prev) => ({ ...prev, [id]: true }));
    try {
      await axios.post(`/api/admin/users/${id}/approve`);
      await loadUsers();
    } catch (e) {
      console.error('Approve failed', e);
    } finally {
      setApproving((prev) => ({ ...prev, [id]: false }));
    }
  };

  const pending = users.filter((u) => !u.isApproved);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Voter Approval</h1>
      {loading ? (
        <div className="bg-white rounded-lg shadow p-8"><LoadingSpinner /></div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          {pending.length === 0 ? (
            <p className="text-gray-600">No pending approvals.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pending.map((u) => (
                    <tr key={u._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.branch}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.year}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          className="btn btn-primary"
                          disabled={approving[u._id]}
                          onClick={() => approveUser(u._id)}
                        >
                          {approving[u._id] ? 'Approving...' : 'Approve'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VoterApprovalPage;
