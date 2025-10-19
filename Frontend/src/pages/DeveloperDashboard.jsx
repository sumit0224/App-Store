import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Upload, Eye, Download, BarChart3, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';

export default function DeveloperDashboard() {
  const { user } = useAuth();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalApps: 0,
    publishedApps: 0,
    totalDownloads: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    loadDeveloperApps();
  }, []);

  const loadDeveloperApps = async () => {
    try {
      setLoading(true);
      const [appsResp, statsResp] = await Promise.all([
        apiService.getDeveloperApps({ limit: 20 }),
        apiService.getDeveloperStats(),
      ]);
      setApps(appsResp.apps || []);
      setStats({
        totalApps: statsResp.totalApps || 0,
        publishedApps: statsResp.publishedApps || 0,
        totalDownloads: statsResp.totalDownloads || 0,
        totalRevenue: statsResp.totalRevenue || 0,
      });
    } catch (error) {
      console.error('Failed to load developer apps:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (app) => {
    if (app.flags?.includes('pending_review')) {
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Pending Review</span>;
    }
    if (app.isPublished) {
      return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Published</span>;
    }
    return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Draft</span>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Developer Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.name || user?.email}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/developer/apps/new"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create New App
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Apps</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalApps}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Published Apps</p>
                <p className="text-2xl font-bold text-gray-900">{stats.publishedApps}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Download className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Downloads</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalDownloads}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Settings className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Apps Section */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">My Apps</h2>
              <Link
                to="/developer/apps/new"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Create New App
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="p-6">
              <div className="animate-pulse space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : apps.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-gray-400 text-6xl mb-4">📱</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Apps Yet</h3>
              <p className="text-gray-600 mb-6">Create your first app to get started!</p>
              <Link
                to="/developer/apps/new"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Create Your First App
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {apps.map((app) => (
                <div key={app._id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* App Icon */}
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                        {app.title?.charAt(0) || 'A'}
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{app.title}</h3>
                        <p className="text-gray-600 text-sm">{app.shortDescription}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm text-gray-500">
                            {app.downloadsCount} downloads
                          </span>
                          <span className="text-sm text-gray-500">
                            {app.averageRating > 0 ? `${app.averageRating}★` : 'No ratings'}
                          </span>
                          <span className="text-sm text-gray-500">
                            ${app.price === 0 ? 'Free' : app.price}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      {getStatusBadge(app)}
                      
                      <div className="flex space-x-2">
                        <Link
                          to={`/app/${app.slug}`}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          title="View App"
                        >
                          <Eye className="h-5 w-5" />
                        </Link>
                        
                        <Link
                          to={`/developer/apps/${app._id}/edit`}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Edit App"
                        >
                          <Edit className="h-5 w-5" />
                        </Link>
                        
                        <Link
                          to={`/developer/apps/${app._id}/upload`}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Upload Files"
                        >
                          <Upload className="h-5 w-5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/developer/apps/new"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Plus className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Create New App</h3>
                <p className="text-gray-600">Start building your next app</p>
              </div>
            </div>
          </Link>

          <Link
            to="/developer/analytics"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Analytics</h3>
                <p className="text-gray-600">View detailed app statistics</p>
              </div>
            </div>
          </Link>

          <Link
            to="/developer/settings"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Settings className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
                <p className="text-gray-600">Manage your developer account</p>
              </div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
