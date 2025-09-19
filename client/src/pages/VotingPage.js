import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const VotingPage = () => {
  const { getElections, getCandidates, castVote, checkVotingStatus } = useAuth();
  const [loading, setLoading] = useState(true);
  const [elections, setElections] = useState([]);
  const [selectedElectionId, setSelectedElectionId] = useState('');
  const [candidatesByPosition, setCandidatesByPosition] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [votingStatus, setVotingStatus] = useState(null);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const [els, status] = await Promise.all([getElections(), checkVotingStatus()]);
      setElections(els || []);
      setVotingStatus(status);
      if (els && els.length > 0) {
        setSelectedElectionId(els[0]._id || els[0].id);
      }
      setLoading(false);
    };
    init();
  }, [getElections, checkVotingStatus]);

  useEffect(() => {
    const loadCandidates = async () => {
      if (!selectedElectionId) return;
      setLoading(true);
      const data = await getCandidates(selectedElectionId);
      setCandidatesByPosition(data?.candidates || {});
      setLoading(false);
    };
    loadCandidates();
  }, [selectedElectionId, getCandidates]);

  const positions = useMemo(() => Object.keys(candidatesByPosition || {}), [candidatesByPosition]);

  const handleVote = async (candidateId, position) => {
    if (!selectedElectionId) return;
    setSubmitting(true);
    const result = await castVote({ electionId: selectedElectionId, candidateId, position });
    if (result.success) {
      const status = await checkVotingStatus();
      setVotingStatus(status);
    }
    setSubmitting(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Voting</h1>

      {loading ? (
        <div className="bg-white rounded-lg shadow p-8">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Election</label>
            <select
              value={selectedElectionId}
              onChange={(e) => setSelectedElectionId(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              {elections.map((el) => (
                <option key={el._id || el.id} value={el._id || el.id}>
                  {el.title} ({el.status})
                </option>
              ))}
            </select>
            {votingStatus && (
              <p className="text-sm text-gray-600 mt-2">
                {votingStatus.hasVoted ? 'You have already voted in the active election.' : 'You have not voted yet.'}
              </p>
            )}
          </div>

          {positions.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600">No approved candidates available for this election yet.</p>
            </div>
          ) : (
            positions.map((position) => (
              <div key={position} className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">{position}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(candidatesByPosition[position] || []).map((c) => (
                    <div key={c._id} className="border rounded-lg p-4">
                      <h3 className="font-medium text-gray-900">{c.name}</h3>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-3">{c.manifesto}</p>
                      <button
                        disabled={submitting || votingStatus?.hasVoted}
                        className="mt-4 btn btn-primary disabled:opacity-50"
                        onClick={() => handleVote(c._id, position)}
                      >
                        {submitting ? 'Submitting...' : 'Vote'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default VotingPage;
