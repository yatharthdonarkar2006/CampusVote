import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Calendar, 
  Clock, 
  Users, 
  Vote, 
  Award,
  Filter,
  ChevronLeft,
  ChevronRight,
  Plus,
  Eye,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';

const ElectionCalendarPage = () => {
  const { user } = useAuth();
  const [elections, setElections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // month, week, list
  const [filterStatus, setFilterStatus] = useState('all');

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
      candidates: 8,
      location: 'Main Campus - Student Center',
      organizer: 'Election Committee',
      eligibility: 'All students enrolled in 2024-25',
      rules: [
        'One vote per student per position',
        'Voting is confidential and secure',
        'Results will be announced within 24 hours',
        'No campaigning within 50 meters of voting booths'
      ]
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
      candidates: 24,
      location: 'Department-wise voting booths',
      organizer: 'Academic Affairs Office',
      eligibility: 'Students from respective classes',
      rules: [
        'Only students from the same class can vote',
        'Voting will be conducted during class hours',
        'Results will be announced immediately after voting'
      ]
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
      candidates: 5,
      location: 'Cultural Center',
      organizer: 'Cultural Affairs Office',
      eligibility: 'All students interested in cultural activities',
      rules: [
        'Open to all students',
        'Candidates must have cultural experience',
        'Voting will be online and offline'
      ]
    },
    {
      id: 4,
      title: 'Sports Committee Elections',
      description: 'Elections for sports secretary and committee members',
      startDate: '2024-10-15T09:00:00Z',
      endDate: '2024-10-20T18:00:00Z',
      status: 'completed',
      positions: ['Sports Secretary'],
      totalVoters: 1250,
      votesCast: 850,
      candidates: 4,
      location: 'Sports Complex',
      organizer: 'Sports Department',
      eligibility: 'Students with sports background preferred',
      rules: [
        'Candidates must have sports experience',
        'Voting will be conducted at sports complex',
        'Results will be announced at closing ceremony'
      ]
    },
    {
      id: 5,
      title: 'Technical Committee Elections',
      description: 'Elections for technical secretary and committee members',
      startDate: '2025-01-10T09:00:00Z',
      endDate: '2025-01-15T18:00:00Z',
      status: 'upcoming',
      positions: ['Technical Secretary'],
      totalVoters: 1250,
      votesCast: 0,
      candidates: 6,
      location: 'Computer Lab Complex',
      organizer: 'Technical Affairs Office',
      eligibility: 'Students with technical background',
      rules: [
        'Candidates must have technical skills',
        'Voting will be online only',
        'Results will be announced via email'
      ]
    }
  ];

  const statusColors = {
    active: 'bg-green-100 text-green-800 border-green-200',
    upcoming: 'bg-blue-100 text-blue-800 border-blue-200',
    completed: 'bg-gray-100 text-gray-800 border-gray-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200'
  };

  const statusIcons = {
    active: <Vote className="w-4 h-4" />,
    upcoming: <Clock className="w-4 h-4" />,
    completed: <CheckCircle className="w-4 h-4" />,
    cancelled: <XCircle className="w-4 h-4" />
  };

  useEffect(() => {
    fetchElections();
  }, [filterStatus]);

  const fetchElections = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let filteredElections = [...mockElections];
      
      if (filterStatus !== 'all') {
        filteredElections = filteredElections.filter(election => election.status === filterStatus);
      }
      
      setElections(filteredElections);
    } catch (error) {
      console.error('Error fetching elections:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getElectionsForDate = (date) => {
    if (!date) return [];
    
    const dateStr = date.toISOString().split('T')[0];
    return elections.filter(election => {
      const startDate = new Date(election.startDate).toISOString().split('T')[0];
      const endDate = new Date(election.endDate).toISOString().split('T')[0];
      return dateStr >= startDate && dateStr <= endDate;
    });
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTurnoutPercentage = (election) => {
    return Math.round((election.votesCast / election.totalVoters) * 100);
  };

  const renderMonthView = () => {
    const days = getDaysInMonth(currentDate);
    const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{monthName}</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigateMonth(1)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="bg-gray-50 p-2 text-center text-sm font-medium text-gray-700">
              {day}
            </div>
          ))}
          
          {days.map((day, index) => {
            const electionsForDay = getElectionsForDate(day);
            const isToday = day && day.toDateString() === new Date().toDateString();
            
            return (
              <div
                key={index}
                className={`bg-white p-2 min-h-[100px] ${
                  isToday ? 'bg-blue-50 border-2 border-blue-200' : ''
                }`}
              >
                {day && (
                  <>
                    <div className={`text-sm font-medium mb-1 ${
                      isToday ? 'text-blue-600' : 'text-gray-900'
                    }`}>
                      {day.getDate()}
                    </div>
                    <div className="space-y-1">
                      {electionsForDay.slice(0, 2).map(election => (
                        <div
                          key={election.id}
                          className={`text-xs p-1 rounded truncate ${
                            statusColors[election.status]
                          }`}
                        >
                          {election.title}
                        </div>
                      ))}
                      {electionsForDay.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{electionsForDay.length - 2} more
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderListView = () => (
    <div className="space-y-4">
      {elections.map(election => (
        <div key={election.id} className="card">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{election.title}</h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[election.status]}`}>
                  {statusIcons[election.status]}
                  <span className="ml-1 capitalize">{election.status}</span>
                </span>
              </div>
              
              <p className="text-gray-600 mb-4">{election.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Start Date</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(new Date(election.startDate))}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatTime(new Date(election.startDate))}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">End Date</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(new Date(election.endDate))}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatTime(new Date(election.endDate))}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Candidates</p>
                  <p className="font-medium text-gray-900">{election.candidates}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Turnout</p>
                  <p className="font-medium text-gray-900">
                    {getTurnoutPercentage(election)}%
                  </p>
                  <p className="text-sm text-gray-500">
                    {election.votesCast} / {election.totalVoters}
                  </p>
                </div>
              </div>
              
              <div className="text-sm text-gray-600">
                <p><strong>Positions:</strong> {election.positions.join(', ')}</p>
                <p><strong>Location:</strong> {election.location}</p>
                <p><strong>Organizer:</strong> {election.organizer}</p>
              </div>
            </div>
            
            <div className="flex space-x-2 ml-4">
              <button className="btn btn-outline btn-sm">
                <Eye className="w-4 h-4 mr-1" />
                View Details
              </button>
              {election.status === 'active' && (
                <button className="btn btn-primary btn-sm">
                  <Vote className="w-4 h-4 mr-1" />
                  Vote Now
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Election Calendar</h1>
          <p className="text-gray-600">Stay updated with upcoming and ongoing elections</p>
        </div>
        <div className="flex space-x-3">
          <button className="btn btn-outline">
            <Plus className="w-4 h-4 mr-2" />
            Add to Calendar
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('month')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              viewMode === 'month'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Month View
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              viewMode === 'list'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            List View
          </button>
        </div>
        
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="all">All Elections</option>
          <option value="upcoming">Upcoming</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Calendar Content */}
      {viewMode === 'month' ? renderMonthView() : renderListView()}

      {/* Quick Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Elections</p>
              <p className="text-2xl font-bold text-gray-900">{elections.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <Vote className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Elections</p>
              <p className="text-2xl font-bold text-gray-900">
                {elections.filter(e => e.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Upcoming</p>
              <p className="text-2xl font-bold text-gray-900">
                {elections.filter(e => e.status === 'upcoming').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {elections.filter(e => e.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElectionCalendarPage;
