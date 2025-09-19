import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const ElectionResultsPage = () => {
  const [loading, setLoading] = useState(true);
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState('');
  const [results, setResults] = useState({});

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const els = await axios.get('/api/admin/elections?status=completed');
        setElections(els.data || []);
        if (els.data?.length) setSelectedElection(els.data[0]._id);
      } catch (e) {
        console.error('Failed to load elections', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const loadResults = async () => {
      if (!selectedElection) return;
      setLoading(true);
      try {
        const res = await axios.get(`/api/voting/results/${selectedElection}`);
        setResults(res.data?.results || {});
      } catch (e) {
        console.error('Failed to load results', e);
      } finally {
        setLoading(false);
      }
    };
    loadResults();
  }, [selectedElection]);

  const positions = useMemo(() => Object.keys(results || {}), [results]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Election Results</h1>
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Election</label>
        <select
          value={selectedElection}
          onChange={(e) => setSelectedElection(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2"
        >
          {elections.map((el) => (
            <option key={el._id} value={el._id}>{el.title} ({el.status})</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg shadow p-8"><LoadingSpinner /></div>
      ) : positions.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">No results available for the selected election.</p>
        </div>
      ) : (
        positions.map((position) => (
          <div key={position} className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{position}</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Votes</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {(results[position] || []).map((row) => (
                    <tr key={row.candidateId}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.votes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ElectionResultsPage;
