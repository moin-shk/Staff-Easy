import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

// Mock data for dashboard cards
const dashboardCards = [
  { 
    title: 'Employees', 
    value: '124', 
    change: '+12%', 
    positive: true, 
    icon: '👥',
    bgColor: 'bg-blue-50',
    path: '/employees'
  },
  { 
    title: 'Teams', 
    value: '8', 
    change: '+1', 
    positive: true, 
    icon: '🏢',
    bgColor: 'bg-green-50',
    path: '/teams'
  },
  { 
    title: 'Time-off Requests', 
    value: '7', 
    change: '3 pending', 
    positive: null, 
    icon: '📅',
    bgColor: 'bg-yellow-50',
    path: '/time-off'
  },
  { 
    title: 'Payroll', 
    value: '$78,290', 
    change: 'Next: Apr 15', 
    positive: null, 
    icon: '💰',
    bgColor: 'bg-purple-50',
    path: '/payroll'
  }
];

// Mock data for recent activity
const recentActivity = [
  { 
    id: 1, 
    type: 'Employee',
    action: 'Added',
    subject: 'Sarah Johnson',
    timestamp: '2 hours ago',
    user: 'Admin User'
  },
  { 
    id: 2, 
    type: 'Time-off',
    action: 'Approved',
    subject: 'James Wilson - 3 days',
    timestamp: '1 day ago',
    user: 'Team Manager'
  },
  { 
    id: 3, 
    type: 'Team',
    action: 'Updated',
    subject: 'Marketing Team',
    timestamp: '2 days ago',
    user: 'Admin User'
  },
  { 
    id: 4, 
    type: 'Payroll',
    action: 'Processed',
    subject: 'March 2025',
    timestamp: '3 days ago',
    user: 'Finance Manager'
  },
];

const Dashboard = () => {
  const { isAuthenticated, user } = useAuth();

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Welcome Section */}
      <section className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          Welcome back, {user?.username || 'User'}
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your organization today.
        </p>
      </section>

      {/* Dashboard Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dashboardCards.map((card, index) => (
          <DashboardCard key={index} {...card} />
        ))}
      </section>

      {/* Quick Links Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="bg-white rounded-lg shadow-md p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickAction icon="👤" title="Add Employee" path="/employees" />
          <QuickAction icon="🗂️" title="Manage Teams" path="/teams" />
          <QuickAction icon="📋" title="Review Time-off" path="/time-off" />
          <QuickAction icon="📊" title="View Analytics" path="/analytics" />
        </div>
      </section>

      {/* Recent Activity */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">When</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">By</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentActivity.map((activity) => (
                <tr key={activity.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{activity.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.action}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{activity.subject}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.timestamp}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

// Helper Components
const DashboardCard = ({ title, value, change, positive, icon, bgColor, path }) => (
  <div className={`${bgColor} rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow`}>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        {change && (
          <p className={`text-sm mt-1 ${positive === true ? 'text-green-600' : positive === false ? 'text-red-600' : 'text-gray-500'}`}>
            {change}
          </p>
        )}
      </div>
      <div className="text-3xl">{icon}</div>
    </div>
  </div>
);

const QuickAction = ({ icon, title, path }) => (
  <a 
    href={path} 
    className="flex flex-col items-center justify-center p-4 rounded-lg hover:bg-gray-50 transition-colors text-center"
  >
    <span className="text-2xl mb-2">{icon}</span>
    <span className="text-sm font-medium text-gray-700">{title}</span>
  </a>
);

export default Dashboard;