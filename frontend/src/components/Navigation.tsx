import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { profileAPI } from '../lib/api';
import { NotificationBell } from './NotificationSystem';
import { Activity, LineChart as ChartLine, Apple, Users, User, Stethoscope } from 'lucide-react';

export default function Navigation() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    if (user) {
      const profile = profileAPI.get(user.id);
      setUserProfile(profile);
    }
  }, [user]);

  if (!user) return null;

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2 text-indigo-600 font-bold text-xl">
              <Activity className="h-6 w-6" />
              <span>FitTrack</span>
            </Link>
            
            <div className="hidden md:flex space-x-4">
              <Link to="/workout-plans" className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600">
                <span>💪 Workouts</span>
              </Link>
              <Link to="/diet-tracking" className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600">
                <Apple className="h-5 w-5" />
                <span>Diet</span>
              </Link>
              <Link to="/progress" className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600">
                <ChartLine className="h-5 w-5" />
                <span>Progress</span>
              </Link>
              <Link to="/social" className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600">
                <Users className="h-5 w-5" />
                <span>Social</span>
              </Link>
              <Link to="/virtual-doctor" className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600">
                <Stethoscope className="h-5 w-5" />
                <span>Doctor</span>
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <NotificationBell />
            <Link to="/profile" className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600">
              <User className="h-5 w-5" />
              <span>{userProfile?.fullName || userProfile?.username || user.email}</span>
            </Link>
            <button
              onClick={handleSignOut}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}