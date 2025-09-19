import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const CandidateManagementPage = () => {
  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState([]);
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState('');
  const [approving, setApproving] = useState({});

  const loadData = async () => {
    setLoading(true);
    try {
      const [els, cands] = await Promise.all([
        axios.get('/api/admin/elections'),
        axios.get('/api/admin/candidates')
      ]);
      setElections(els.data || []);
      setCandidates(cands.data || []);
      if (!selectedElection && els.data?.length) {
        setSelectedElection(els.data[0]._id);
      }
    } catch (e) {
      console.error('Failed to load admin data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const approve = async (id) => {
    setApproving((prev) => ({ ...prev, [id]: true }));
    try {
      await axios.post(`/api/admin/candidates/${id}/approve`);
      await loadData();
    } catch (e) {
      console.error('Approve candidate failed', e);
    } finally {
      setApproving((prev) => ({ ...prev, [id]: false }));
    }
  };

  const filtered = candidates.filter((c) => !selectedElection || c.electionId?._id === selectedElection);
  const pending = filtered.filter((c) => !c.isApproved);
  const approved = filtered.filter((c) => c.isApproved);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Candidate Management</h1>
      {loading ? (
        <div className="bg-white rounded-lg shadow p-8"><LoadingSpinner /></div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Election</label>
            <select
              value={selectedElection}
              onChange={(e) => setSelectedElection(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">All elections</option>
              {elections.map((el) => (
                <option key={el._id} value={el._id}>{el.title} ({el.status})</option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Pending Approvals</h2>
            {pending.length === 0 ? (
              <p className="text-gray-600">No pending candidates.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Election</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manifesto</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pending.map((c) => (
                      <tr key={c._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{c.userId?.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{c.position}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{c.electionId?.title}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-md">{c.manifesto}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button className="btn btn-primary" disabled={approving[c._id]} onClick={() => approve(c._id)}>
                            {approving[c._id] ? 'Approving...' : 'Approve'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Approved Candidates</h2>
            {approved.length === 0 ? (
              <p className="text-gray-600">No approved candidates.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Election</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approved At</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {approved.map((c) => (
                      <tr key={c._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{c.userId?.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{c.position}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{c.electionId?.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{c.approvedAt ? new Date(c.approvedAt).toLocaleString() : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateManagementPage;
