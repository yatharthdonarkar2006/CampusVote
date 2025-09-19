import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Vote, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Award,
  Filter,
  Download,
  Eye,
  BarChart3
} from 'lucide-react';

const VotingHistoryPage = () => {
  const { user } = useAuth();
  const [votingHistory, setVotingHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const mockVotingHistory = [
    {
      id: 1,
      electionTitle: 'Student Council Elections 2024',
      position: 'Student Council President',
      candidateVoted: 'John Doe',
      candidateDepartment: 'Computer Science',
      candidateYear: '3rd Year',
      voteDate: '2024-12-18T14:30:00Z',
      status: 'completed',
      electionStatus: 'completed',
      totalCandidates: 3,
      winner: 'John Doe',
      totalVotes: 1100,
      candidateVotes: 425,
      candidatePercentage: 38.6
    },
    {
      id: 2,
      electionTitle: 'Class Representative Elections',
      position: 'Class Representative - Computer Science',
      candidateVoted: 'Jane Smith',
      candidateDepartment: 'Computer Science',
      candidateYear: '2nd Year',
      voteDate: '2024-11-03T10:15:00Z',
      status: 'completed',
      electionStatus: 'completed',
      totalCandidates: 5,
      winner: 'Mike Johnson',
      totalVotes: 980,
      candidateVotes: 180,
      candidatePercentage: 18.4
    },
    {
      id: 3,
      electionTitle: 'Cultural Committee Elections',
      position: 'Cultural Secretary',
      candidateVoted: 'Sarah Wilson',
      candidateDepartment: 'Electronics',
      candidateYear: '4th Year',
      voteDate: '2024-10-03T16:45:00Z',
      status: 'completed',
      electionStatus: 'completed',
      totalCandidates: 4,
      winner: 'Sarah Wilson',
      totalVotes: 850,
      candidateVotes: 320,
      candidatePercentage: 37.6
    },
    {
      id: 4,
      electionTitle: 'Sports Committee Elections',
      position: 'Sports Secretary',
      candidateVoted: null,
      voteDate: '2024-09-15T12:00:00Z',
      status: 'abstained',
      electionStatus: 'completed',
      totalCandidates: 3,
      winner: 'Alex Brown',
      totalVotes: 720,
      candidateVotes: 0,
      candidatePercentage: 0
    }
  ];

  useEffect(() => {
    fetchVotingHistory();
  }, [filter, sortBy]);

  const fetchVotingHistory = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let filteredHistory = [...mockVotingHistory];
      
      // Apply filters
      if (filter === 'completed') {
        filteredHistory = filteredHistory.filter(item => item.status === 'completed');
      } else if (filter === 'abstained') {
        filteredHistory = filteredHistory.filter(item => item.status === 'abstained');
      } else if (filter === 'won') {
        filteredHistory = filteredHistory.filter(item => 
          item.status === 'completed' && item.candidateVoted === item.winner
        );
      }
      
      // Apply sorting
      filteredHistory.sort((a, b) => {
        if (sortBy === 'date') {
          return new Date(b.voteDate) - new Date(a.voteDate);
        } else if (sortBy === 'election') {
          return a.electionTitle.localeCompare(b.electionTitle);
        } else if (sortBy === 'position') {
          return a.position.localeCompare(b.position);
        }
        return 0;
      });
      
      setVotingHistory(filteredHistory);
    } catch (error) {
      console.error('Error fetching voting history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'abstained':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'abstained':
        return <Clock className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getVoteResult = (item) => {
    if (item.status === 'abstained') {
      return 'Abstained';
    }
    if (item.candidateVoted === item.winner) {
      return 'Won';
    }
    return 'Lost';
  };

  const getVoteResultColor = (item) => {
    if (item.status === 'abstained') {
      return 'text-yellow-600';
    }
    if (item.candidateVoted === item.winner) {
      return 'text-green-600';
    }
    return 'text-red-600';
  };

  const handleExport = () => {
    console.log('Exporting voting history...');
    // Implement export functionality
  };

  const stats = {
    totalVotes: votingHistory.filter(item => item.status === 'completed').length,
    abstainedVotes: votingHistory.filter(item => item.status === 'abstained').length,
    winningVotes: votingHistory.filter(item => 
      item.status === 'completed' && item.candidateVoted === item.winner
    ).length,
    participationRate: votingHistory.length > 0 ? 
      ((votingHistory.filter(item => item.status === 'completed').length / votingHistory.length) * 100).toFixed(1) : 0
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Voting History</h1>
          <p className="text-gray-600">Track your participation in campus elections</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleExport}
            className="btn btn-outline"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <Vote className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Votes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalVotes}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <Award className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Winning Votes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.winningVotes}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Abstained</p>
              <p className="text-2xl font-bold text-gray-900">{stats.abstainedVotes}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Participation Rate</p>
              <p className="text-2xl font-bold text-gray-900">{stats.participationRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Sorting */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Status
          </label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Votes</option>
            <option value="completed">Completed Votes</option>
            <option value="abstained">Abstained</option>
            <option value="won">Winning Votes</option>
          </select>
        </div>
        
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort by
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="date">Date (Newest First)</option>
            <option value="election">Election Title</option>
            <option value="position">Position</option>
          </select>
        </div>
      </div>

      {/* Voting History List */}
      <div className="space-y-4">
        {votingHistory.length === 0 ? (
          <div className="text-center py-12">
            <Vote className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No voting history found</h3>
            <p className="text-gray-600">You haven't participated in any elections yet.</p>
          </div>
        ) : (
          votingHistory.map((item) => (
            <div key={item.id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{item.electionTitle}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {getStatusIcon(item.status)}
                      <span className="ml-1 capitalize">{item.status}</span>
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Position</p>
                      <p className="font-medium text-gray-900">{item.position}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">Vote Date</p>
                      <p className="font-medium text-gray-900">
                        {new Date(item.voteDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    
                    {item.candidateVoted && (
                      <div>
                        <p className="text-sm text-gray-600">Candidate Voted For</p>
                        <p className="font-medium text-gray-900">{item.candidateVoted}</p>
                        <p className="text-sm text-gray-500">
                          {item.candidateDepartment} - {item.candidateYear}
                        </p>
                      </div>
                    )}
                    
                    <div>
                      <p className="text-sm text-gray-600">Result</p>
                      <p className={`font-medium ${getVoteResultColor(item)}`}>
                        {getVoteResult(item)}
                      </p>
                    </div>
                  </div>
                  
                  {item.status === 'completed' && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Election Results</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Winner</p>
                          <p className="font-medium text-gray-900">{item.winner}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Total Votes</p>
                          <p className="font-medium text-gray-900">{item.totalVotes}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Your Candidate's Votes</p>
                          <p className="font-medium text-gray-900">{item.candidateVotes}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Percentage</p>
                          <p className="font-medium text-gray-900">{item.candidatePercentage}%</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-2 ml-4">
                  <button className="btn btn-outline btn-sm">
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VotingHistoryPage;
