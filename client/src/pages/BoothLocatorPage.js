import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { MapPin, Clock, Users, Building, Calendar } from 'lucide-react';

const BoothLocatorPage = () => {
  const { getBoothInfo } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [mapExpanded, setMapExpanded] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      const res = await getBoothInfo();
      if (!res || res.error) {
        setError(res?.error || 'Failed to load booth info');
      } else {
        setData(res);
      }
      setLoading(false);
    };
    load();
  }, [getBoothInfo]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Booth Locator</h1>
      <p className="text-gray-600 mb-6">Find your assigned voting booth location and details</p>
      
      {loading ? (
        <div className="bg-white rounded-lg shadow p-8 flex justify-center items-center min-h-[300px]">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-red-600 flex items-center">
            <span className="mr-2">⚠️</span> {error}
          </p>
          <p className="mt-2 text-gray-600">Please try again later or contact support if the problem persists.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Election Card */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="bg-primary-600 p-4 text-white">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                <h2 className="text-xl font-semibold">Election Information</h2>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{data?.election?.title}</h3>
              <div className="flex items-center text-gray-600 mb-4">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{new Date(data?.election?.startDate).toLocaleDateString()} - {new Date(data?.election?.endDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                <span>{new Date(data?.election?.startDate).toLocaleTimeString()} - {new Date(data?.election?.endDate).toLocaleTimeString()}</span>
              </div>
            </div>
          </div>

          {/* Booth Card */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="bg-primary-600 p-4 text-white">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                <h2 className="text-xl font-semibold">Your Assigned Booth</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{data?.booth?.name}</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <Building className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Location</p>
                        <p className="text-gray-700">{data?.booth?.location?.building}, Floor {data?.booth?.location?.floor}, Room {data?.booth?.location?.room}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Users className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Capacity</p>
                        <p className="text-gray-700">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">
                            {data?.booth?.currentOccupancy} / {data?.booth?.capacity}
                          </span>
                          {data?.booth?.currentOccupancy < data?.booth?.capacity * 0.5 ? 'Low occupancy' : 
                           data?.booth?.currentOccupancy < data?.booth?.capacity * 0.8 ? 'Moderate occupancy' : 
                           'High occupancy'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Clock className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Timing</p>
                        <p className="text-gray-700">{data?.booth?.openingTime} - {data?.booth?.closingTime}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {data?.booth?.location?.coordinates?.latitude && (
                  <div className={`flex-1 ${mapExpanded ? 'col-span-2' : ''}`}>
                    <div className="border rounded-lg overflow-hidden h-full">
                      <div className="p-3 bg-gray-50 border-b flex justify-between items-center">
                        <p className="font-medium text-gray-900">Location Map</p>
                        <button 
                          onClick={() => setMapExpanded(!mapExpanded)}
                          className="text-sm text-primary-600 hover:text-primary-800"
                        >
                          {mapExpanded ? 'Collapse' : 'Expand'}
                        </button>
                      </div>
                      <div className={`${mapExpanded ? 'h-[400px]' : 'h-[200px]'} relative`}>
                        <iframe
                          title="Booth Location"
                          width="100%"
                          height="100%"
                          frameBorder="0"
                          src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${data.booth.location.coordinates.latitude},${data.booth.location.coordinates.longitude}&zoom=18`}
                          allowFullScreen
                        ></iframe>
                      </div>
                      <div className="p-3 border-t">
                        <a
                          href={`https://www.google.com/maps?q=${data.booth.location.coordinates.latitude},${data.booth.location.coordinates.longitude}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary-600 hover:text-primary-800 font-medium flex items-center"
                        >
                          <MapPin className="w-4 h-4 mr-1" />
                          Get Directions
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Additional Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-blue-100 rounded-full p-1">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Important Information</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Please bring your voter ID card and a valid photo ID</li>
                    <li>Arrive at least 15 minutes before your scheduled time</li>
                    <li>Follow all COVID-19 safety protocols at the booth</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoothLocatorPage;
