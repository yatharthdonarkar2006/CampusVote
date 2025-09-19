import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { 
  Calendar, 
  Users, 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Play, 
  Pause, 
  Square,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const ElectionManagementPage = () => {
  const { user } = useAuth();
  const [elections, setElections] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingElection, setEditingElection] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
    defaultValues: {
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      positions: [],
      eligibilityCriteria: {
        minYear: 1,
        maxYear: 4,
        branches: [],
        gpa: 0
      },
      settings: {
        allowMultipleVotes: false,
        requireIdVerification: true,
        showResults: false,
        allowAbstain: true
      }
    }
  });

  const positions = [
    'Student Council President',
    'Student Council Vice President',
    'Student Council Secretary',
    'Student Council Treasurer',
    'Class Representative',
    'Cultural Secretary',
    'Sports Secretary',
    'Technical Secretary'
  ];

  const branches = [
    'Computer Science',
    'Electronics',
    'Mechanical',
    'Civil',
    'Electrical',
    'Chemical',
    'Aerospace',
    'Biotechnology'
  ];

  const years = [1, 2, 3, 4];

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    setIsLoading(true);
    try {
      // Mock data - replace with actual API call
      const mockElections = [
        {
          id: 1,
          title: 'Student Council Elections 2024',
          description: 'Annual student council elections for the academic year 2024-25',
          startDate: '2024-12-15T09:00:00Z',
          endDate: '2024-12-20T18:00:00Z',
          status: 'active',
          positions: ['Student Council President', 'Student Council Vice President'],
          totalVoters: 1250,
          votesCast: 890,
          candidates: 8
        },
        {
          id: 2,
          title: 'Class Representative Elections',
          description: 'Elections for class representatives across all departments',
          startDate: '2024-12-25T09:00:00Z',
          endDate: '2024-12-30T18:00:00Z',
          status: 'upcoming',
          positions: ['Class Representative'],
          totalVoters: 1250,
          votesCast: 0,
          candidates: 24
        },
        {
          id: 3,
          title: 'Cultural Committee Elections',
          description: 'Elections for cultural secretary and committee members',
          startDate: '2024-11-01T09:00:00Z',
          endDate: '2024-11-05T18:00:00Z',
          status: 'completed',
          positions: ['Cultural Secretary'],
          totalVoters: 1250,
          votesCast: 1100,
          candidates: 5
        }
      ];
      setElections(mockElections);
    } catch (error) {
      console.error('Error fetching elections:', error);
      toast.error('Failed to fetch elections');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (editingElection) {
        // Update existing election
        console.log('Updating election:', data);
        toast.success('Election updated successfully');
      } else {
        // Create new election
        console.log('Creating election:', data);
        toast.success('Election created successfully');
      }
      
      setShowCreateForm(false);
      setEditingElection(null);
      reset();
      fetchElections();
    } catch (error) {
      console.error('Error saving election:', error);
      toast.error('Failed to save election');
    }
  };

  const handleEdit = (election) => {
    setEditingElection(election);
    setShowCreateForm(true);
    reset({
      title: election.title,
      description: election.description,
      startDate: election.startDate.split('T')[0],
      endDate: election.endDate.split('T')[0],
      positions: election.positions
    });
  };

  const handleDelete = async (electionId) => {
    if (window.confirm('Are you sure you want to delete this election?')) {
      try {
        console.log('Deleting election:', electionId);
        toast.success('Election deleted successfully');
        fetchElections();
      } catch (error) {
        console.error('Error deleting election:', error);
        toast.error('Failed to delete election');
      }
    }
  };

  const handleStatusChange = async (electionId, newStatus) => {
    try {
      console.log('Changing status:', electionId, newStatus);
      toast.success(`Election ${newStatus} successfully`);
      fetchElections();
    } catch (error) {
      console.error('Error changing status:', error);
      toast.error('Failed to change election status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <Play className="w-4 h-4" />;
      case 'upcoming': return <Clock className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'paused': return <Pause className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Election Management</h1>
          <p className="text-gray-600">Create, manage, and monitor campus elections</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Election
        </button>
      </div>

      {/* Elections List */}
      <div className="space-y-6">
        {elections.map((election) => (
          <div key={election.id} className="card">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{election.title}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(election.status)}`}>
                    {getStatusIcon(election.status)}
                    <span className="ml-1 capitalize">{election.status}</span>
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{election.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">{election.candidates}</div>
                    <div className="text-sm text-gray-500">Candidates</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{election.votesCast}</div>
                    <div className="text-sm text-gray-500">Votes Cast</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{election.totalVoters}</div>
                    <div className="text-sm text-gray-500">Total Voters</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.round((election.votesCast / election.totalVoters) * 100)}%
                    </div>
                    <div className="text-sm text-gray-500">Turnout</div>
                  </div>
                </div>

                <div className="text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span>Start: {new Date(election.startDate).toLocaleDateString()}</span>
                    <span>End: {new Date(election.endDate).toLocaleDateString()}</span>
                  </div>
                  <div className="mt-1">
                    Positions: {election.positions.join(', ')}
                  </div>
                </div>
              </div>

              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => handleEdit(election)}
                  className="btn btn-outline btn-sm"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(election.id)}
                  className="btn btn-outline btn-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                {election.status === 'upcoming' && (
                  <button
                    onClick={() => handleStatusChange(election.id, 'active')}
                    className="btn btn-primary btn-sm"
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Start
                  </button>
                )}
                {election.status === 'active' && (
                  <button
                    onClick={() => handleStatusChange(election.id, 'paused')}
                    className="btn btn-warning btn-sm"
                  >
                    <Pause className="w-4 h-4 mr-1" />
                    Pause
                  </button>
                )}
                {election.status === 'paused' && (
                  <button
                    onClick={() => handleStatusChange(election.id, 'active')}
                    className="btn btn-primary btn-sm"
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Resume
                  </button>
                )}
                {election.status === 'active' && (
                  <button
                    onClick={() => handleStatusChange(election.id, 'completed')}
                    className="btn btn-success btn-sm"
                  >
                    <Square className="w-4 h-4 mr-1" />
                    End
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Election Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingElection ? 'Edit Election' : 'Create New Election'}
                </h2>
                <button
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingElection(null);
                    reset();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Election Title *
                  </label>
                  <input
                    type="text"
                    {...register('title', { required: 'Title is required' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter election title"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    {...register('description', { required: 'Description is required' })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter election description"
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date *
                    </label>
                    <input
                      type="datetime-local"
                      {...register('startDate', { required: 'Start date is required' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                    {errors.startDate && (
                      <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date *
                    </label>
                    <input
                      type="datetime-local"
                      {...register('endDate', { required: 'End date is required' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                    {errors.endDate && (
                      <p className="text-red-500 text-sm mt-1">{errors.endDate.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Positions *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {positions.map((position) => (
                      <label key={position} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          value={position}
                          {...register('positions')}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700">{position}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false);
                      setEditingElection(null);
                      reset();
                    }}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    {editingElection ? 'Update Election' : 'Create Election'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ElectionManagementPage;
