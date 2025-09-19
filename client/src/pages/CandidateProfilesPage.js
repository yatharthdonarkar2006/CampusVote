import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  User, 
  Award, 
  BookOpen, 
  Target, 
  Star,
  Filter,
  Search,
  Calendar,
  MapPin,
  Mail,
  Phone,
  ExternalLink,
  Vote,
  ThumbsUp,
  MessageCircle
} from 'lucide-react';

const CandidateProfilesPage = () => {
  const { user } = useAuth();
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPosition, setFilterPosition] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const mockCandidates = [
    {
      id: 1,
      name: 'John Doe',
      position: 'Student Council President',
      department: 'Computer Science',
      year: '3rd Year',
      rollNumber: 'CS2021001',
      email: 'john.doe@university.edu',
      phone: '+1 (555) 123-4567',
      photo: null,
      manifesto: 'I believe in creating a more inclusive and engaging campus environment. My vision is to bridge the gap between students and administration, ensuring every voice is heard and every concern is addressed. I will focus on improving campus facilities, enhancing student services, and fostering a stronger sense of community.',
      experience: [
        'Class Representative for 2 years',
        'Organized 5 major campus events',
        'Led the Computer Science Student Association',
        'Volunteered with 3 community service projects'
      ],
      achievements: [
        'Best Student Leader Award 2023',
        'Event of the Year Award 2022',
        'Community Service Excellence Award 2023',
        'Academic Excellence Scholarship 2022'
      ],
      goals: [
        'Improve campus Wi-Fi infrastructure',
        'Establish 24/7 study spaces',
        'Create mental health support programs',
        'Enhance career counseling services',
        'Implement sustainable campus initiatives'
      ],
      socialMedia: {
        linkedin: 'https://linkedin.com/in/johndoe',
        twitter: 'https://twitter.com/johndoe',
        instagram: 'https://instagram.com/johndoe'
      },
      endorsements: 45,
      rating: 4.8,
      isVerified: true,
      campaignStartDate: '2024-12-01T00:00:00Z',
      manifestoFile: null
    },
    {
      id: 2,
      name: 'Jane Smith',
      position: 'Student Council President',
      department: 'Electronics',
      year: '4th Year',
      rollNumber: 'EC2020001',
      email: 'jane.smith@university.edu',
      phone: '+1 (555) 234-5678',
      photo: null,
      manifesto: 'As a fourth-year student, I have witnessed the challenges and opportunities our campus offers. I am committed to leveraging technology to improve student life, creating better communication channels, and ensuring transparency in all student government activities.',
      experience: [
        'Cultural Secretary for 1 year',
        'Founded the Tech Innovation Club',
        'Led 3 successful fundraising campaigns',
        'Mentored 20+ junior students'
      ],
      achievements: [
        'Innovation Excellence Award 2023',
        'Leadership in Technology Award 2022',
        'Outstanding Community Service 2023',
        'Dean\'s List for 4 consecutive semesters'
      ],
      goals: [
        'Implement digital voting for all student decisions',
        'Create a mobile app for campus services',
        'Establish tech mentorship programs',
        'Improve lab facilities and equipment',
        'Promote diversity and inclusion initiatives'
      ],
      socialMedia: {
        linkedin: 'https://linkedin.com/in/janesmith',
        twitter: 'https://twitter.com/janesmith',
        instagram: 'https://instagram.com/janesmith'
      },
      endorsements: 38,
      rating: 4.6,
      isVerified: true,
      campaignStartDate: '2024-12-01T00:00:00Z',
      manifestoFile: null
    },
    {
      id: 3,
      name: 'Mike Johnson',
      position: 'Student Council Vice President',
      department: 'Mechanical',
      year: '3rd Year',
      rollNumber: 'ME2021001',
      email: 'mike.johnson@university.edu',
      phone: '+1 (555) 345-6789',
      photo: null,
      manifesto: 'I am passionate about creating a more sustainable and environmentally conscious campus. My focus will be on implementing green initiatives, improving campus infrastructure, and ensuring that student voices are heard in all major decisions.',
      experience: [
        'Environmental Club President',
        'Organized 2 sustainability conferences',
        'Led campus clean-up initiatives',
        'Student representative in sustainability committee'
      ],
      achievements: [
        'Environmental Leadership Award 2023',
        'Sustainability Champion 2022',
        'Community Impact Award 2023',
        'Academic Merit Scholarship 2022'
      ],
      goals: [
        'Implement solar panel installations',
        'Create campus recycling programs',
        'Establish green transportation options',
        'Improve campus landscaping',
        'Promote sustainable living practices'
      ],
      socialMedia: {
        linkedin: 'https://linkedin.com/in/mikejohnson',
        twitter: 'https://twitter.com/mikejohnson',
        instagram: 'https://instagram.com/mikejohnson'
      },
      endorsements: 32,
      rating: 4.4,
      isVerified: true,
      campaignStartDate: '2024-12-01T00:00:00Z',
      manifestoFile: null
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      position: 'Cultural Secretary',
      department: 'Electronics',
      year: '4th Year',
      rollNumber: 'EC2020002',
      email: 'sarah.wilson@university.edu',
      phone: '+1 (555) 456-7890',
      photo: null,
      manifesto: 'Culture and arts are the soul of any educational institution. I aim to create a vibrant cultural environment that celebrates diversity, promotes creativity, and provides platforms for all students to showcase their talents.',
      experience: [
        'Cultural Committee Member for 2 years',
        'Organized 8 major cultural events',
        'Founded the Art Appreciation Society',
        'Led inter-college cultural competitions'
      ],
      achievements: [
        'Cultural Excellence Award 2023',
        'Event Management Excellence 2022',
        'Art and Culture Ambassador 2023',
        'Student Creativity Award 2022'
      ],
      goals: [
        'Establish cultural exchange programs',
        'Create dedicated art and music spaces',
        'Organize monthly cultural festivals',
        'Support student artist initiatives',
        'Promote cultural diversity awareness'
      ],
      socialMedia: {
        linkedin: 'https://linkedin.com/in/sarahwilson',
        twitter: 'https://twitter.com/sarahwilson',
        instagram: 'https://instagram.com/sarahwilson'
      },
      endorsements: 28,
      rating: 4.7,
      isVerified: true,
      campaignStartDate: '2024-12-01T00:00:00Z',
      manifestoFile: null
    }
  ];

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

  const departments = [
    'Computer Science',
    'Electronics',
    'Mechanical',
    'Civil',
    'Electrical',
    'Chemical',
    'Aerospace',
    'Biotechnology'
  ];

  useEffect(() => {
    fetchCandidates();
  }, [searchQuery, filterPosition, filterDepartment]);

  const fetchCandidates = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let filteredCandidates = [...mockCandidates];
      
      // Apply search filter
      if (searchQuery) {
        filteredCandidates = filteredCandidates.filter(candidate =>
          candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          candidate.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
          candidate.department.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      // Apply position filter
      if (filterPosition !== 'all') {
        filteredCandidates = filteredCandidates.filter(candidate =>
          candidate.position === filterPosition
        );
      }
      
      // Apply department filter
      if (filterDepartment !== 'all') {
        filteredCandidates = filteredCandidates.filter(candidate =>
          candidate.department === filterDepartment
        );
      }
      
      setCandidates(filteredCandidates);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndorse = (candidateId) => {
    console.log('Endorsing candidate:', candidateId);
    // Implement endorsement functionality
  };

  const handleContact = (candidate) => {
    console.log('Contacting candidate:', candidate);
    // Implement contact functionality
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Candidate Profiles</h1>
        <p className="text-gray-600">Learn about the candidates running for various positions</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search candidates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          <select
            value={filterPosition}
            onChange={(e) => setFilterPosition(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Positions</option>
            {positions.map((position) => (
              <option key={position} value={position}>
                {position}
              </option>
            ))}
          </select>
          
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Departments</option>
            {departments.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Candidates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {candidates.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No candidates found</h3>
            <p className="text-gray-600">Try adjusting your search criteria.</p>
          </div>
        ) : (
          candidates.map((candidate) => (
            <div key={candidate.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start space-x-4 mb-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold text-primary-600">
                      {candidate.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {candidate.name}
                    </h3>
                    {candidate.isVerified && (
                      <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                        <Award className="w-3 h-3 text-blue-600" />
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{candidate.position}</p>
                  <p className="text-sm text-gray-500">
                    {candidate.department} - {candidate.year}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-700 line-clamp-3">
                  {candidate.manifesto}
                </p>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>{candidate.rating}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ThumbsUp className="w-4 h-4 text-green-500" />
                    <span>{candidate.endorsements}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCandidate(candidate)}
                  className="w-full btn btn-outline btn-sm"
                >
                  <User className="w-4 h-4 mr-2" />
                  View Full Profile
                </button>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEndorse(candidate.id)}
                    className="flex-1 btn btn-primary btn-sm"
                  >
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    Endorse
                  </button>
                  <button
                    onClick={() => handleContact(candidate)}
                    className="flex-1 btn btn-outline btn-sm"
                  >
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Contact
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Candidate Detail Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary-600">
                      {selectedCandidate.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedCandidate.name}</h2>
                    <p className="text-lg text-gray-600">{selectedCandidate.position}</p>
                    <p className="text-gray-500">
                      {selectedCandidate.department} - {selectedCandidate.year}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Manifesto</h3>
                    <p className="text-gray-700">{selectedCandidate.manifesto}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Experience</h3>
                    <ul className="space-y-2">
                      {selectedCandidate.experience.map((exp, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700">{exp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Achievements</h3>
                    <ul className="space-y-2">
                      {selectedCandidate.achievements.map((achievement, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Award className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Goals & Objectives</h3>
                    <ul className="space-y-2">
                      {selectedCandidate.goals.map((goal, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Target className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{goal}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{selectedCandidate.email}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{selectedCandidate.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Social Media</h3>
                    <div className="space-y-2">
                      {Object.entries(selectedCandidate.socialMedia).map(([platform, url]) => (
                        <a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span className="text-sm capitalize">{platform}</span>
                        </a>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Campaign Stats</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Endorsements</span>
                        <span className="text-sm font-medium text-gray-900">
                          {selectedCandidate.endorsements}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Rating</span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm font-medium text-gray-900">
                            {selectedCandidate.rating}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Campaign Started</span>
                        <span className="text-sm font-medium text-gray-900">
                          {new Date(selectedCandidate.campaignStartDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => handleEndorse(selectedCandidate.id)}
                      className="w-full btn btn-primary"
                    >
                      <ThumbsUp className="w-4 h-4 mr-2" />
                      Endorse Candidate
                    </button>
                    <button
                      onClick={() => handleContact(selectedCandidate)}
                      className="w-full btn btn-outline"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Contact Candidate
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateProfilesPage;
