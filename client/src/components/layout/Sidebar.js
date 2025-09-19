import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Home,
  Vote,
  MapPin,
  User,
  Settings,
  Users,
  BarChart3,
  X,
  History,
  Award,
  Calendar,
  FileText,
  HelpCircle,
  UserPlus,
  TrendingUp,
  Shield
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Voting', href: '/voting', icon: Vote },
    { name: 'Candidates', href: '/candidates', icon: Award },
    { name: 'Elections', href: '/elections', icon: Calendar },
    { name: 'Voting History', href: '/voting-history', icon: History },
    { name: 'Booth Locator', href: '/booth-locator', icon: MapPin },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'Help & Support', href: '/help', icon: HelpCircle },
  ];

  const candidateNavigation = [
    { name: 'Register as Candidate', href: '/candidate-registration', icon: UserPlus },
  ];

  const adminNavigation = [
    { name: 'Admin Dashboard', href: '/admin', icon: Shield },
    { name: 'Election Management', href: '/admin/elections', icon: Calendar },
    { name: 'Manage Candidates', href: '/admin/candidates', icon: Users },
    { name: 'Voter Approval', href: '/admin/voters', icon: Users },
    { name: 'Election Results', href: '/admin/results', icon: BarChart3 },
    { name: 'Analytics', href: '/admin/analytics', icon: TrendingUp },
  ];

  const isActive = (href) => location.pathname === href;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive(item.href)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={onClose}
                >
                  <Icon className="mr-3 w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Candidate Navigation */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Candidate
            </h3>
            <div className="mt-3 space-y-1">
              {candidateNavigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive(item.href)
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    onClick={onClose}
                  >
                    <Icon className="mr-3 w-5 h-5" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Admin Navigation */}
          {user?.role === 'admin' && (
            <>
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Admin
                </h3>
                <div className="mt-3 space-y-1">
                  {adminNavigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          isActive(item.href)
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                        onClick={onClose}
                      >
                        <Icon className="mr-3 w-5 h-5" />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
