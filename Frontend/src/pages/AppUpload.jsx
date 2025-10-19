import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, File, CheckCircle, AlertCircle, Download } from 'lucide-react';
import apiService from '../services/api';

export default function AppUpload() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [versionNumber, setVersionNumber] = useState('1.0.0');
  const [versions, setVersions] = useState([]);
  const [uploadStatus, setUploadStatus] = useState(null);

  useEffect(() => {
    loadApp();
  }, [id]);

  const loadApp = async () => {
    try {
      setLoading(true);
      // Note: You'll need to add a get single app endpoint for developers
      // For now, we'll simulate loading an app
      const mockApp = {
        _id: id,
        title: 'My Awesome App',
        slug: 'my-awesome-app',
        versions: [
          {
            _id: '1',
            versionNumber: '1.0.0',
            key: 'apps/uuid-v1.0.0.apk',
            uploadedAt: new Date().toISOString()
          }
        ]
      };
      
      setApp(mockApp);
      setVersions(mockApp.versions || []);
    } catch (error) {
      console.error('Failed to load app:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        'application/vnd.android.package-archive', // APK
        'application/zip', // ZIP
        'application/x-msdownload' // EXE
      ];
      
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a valid app file (APK, ZIP, or EXE)');
        return;
      }
      
      // Validate file size (max 100MB)
      if (file.size > 100 * 1024 * 1024) {
        alert('File size must be less than 100MB');
        return;
      }
      
      setSelectedFile(file);
      setUploadStatus(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file to upload');
      return;
    }

    if (!versionNumber.trim()) {
      alert('Please enter a version number');
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      // Step 1: Get upload URL
      const uploadUrlResponse = await apiService.getUploadUrl(
        id,
        selectedFile.name,
        selectedFile.type
      );

      // Step 2: Upload file to S3
      const uploadResponse = await fetch(uploadUrlResponse.uploadURL, {
        method: 'PUT',
        body: selectedFile,
        headers: {
          'Content-Type': selectedFile.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error('Upload to S3 failed');
      }

      setUploadProgress(50);

      // Step 3: Complete upload (add version)
      const completeResponse = await apiService.completeUpload(
        id,
        uploadUrlResponse.key,
        versionNumber
      );

      setUploadProgress(100);
      setUploadStatus('success');
      
      // Update versions list
      setVersions(prev => [...prev, {
        _id: Date.now().toString(),
        versionNumber,
        key: uploadUrlResponse.key,
        uploadedAt: new Date().toISOString()
      }]);

      // Reset form
      setSelectedFile(null);
      setVersionNumber('');
      
      alert('File uploaded successfully!');
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadStatus('error');
      alert(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handlePublish = async () => {
    if (versions.length === 0) {
      alert('Please upload at least one version before publishing');
      return;
    }

    try {
      await apiService.publishApp(id);
      alert('App submitted for review! It will be auto-approved in 5 minutes.');
      navigate('/developer');
    } catch (error) {
      console.error('Publish failed:', error);
      alert(`Publish failed: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading app details...</p>
        </div>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📱</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">App Not Found</h2>
          <p className="text-gray-600 mb-4">The app you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/developer')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <button
              onClick={() => navigate('/developer')}
              className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Upload Files</h1>
              <p className="text-gray-600">{app.title}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            {/* File Upload */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Upload New Version</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Version Number
                  </label>
                  <input
                    type="text"
                    value={versionNumber}
                    onChange={(e) => setVersionNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="1.0.0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    App File
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <input
                      type="file"
                      onChange={handleFileSelect}
                      accept=".apk,.zip,.exe"
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">
                        {selectedFile ? selectedFile.name : 'Click to select file'}
                      </p>
                      <p className="text-sm text-gray-500">
                        APK, ZIP, or EXE files up to 100MB
                      </p>
                    </label>
                  </div>
                </div>

                {selectedFile && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">File Details</span>
                      <span className="text-sm text-gray-500">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </span>
                    </div>
                    <div className="flex items-center">
                      <File className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">{selectedFile.name}</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleUpload}
                  disabled={uploading || !selectedFile}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 rounded-lg transition-colors flex items-center justify-center"
                >
                  <Upload className="h-5 w-5 mr-2" />
                  {uploading ? 'Uploading...' : 'Upload File'}
                </button>

                {/* Upload Progress */}
                {uploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Upload Status */}
                {uploadStatus === 'success' && (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    <span>Upload successful!</span>
                  </div>
                )}

                {uploadStatus === 'error' && (
                  <div className="flex items-center text-red-600">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    <span>Upload failed. Please try again.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Publish App */}
            {versions.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Publish App</h2>
                <p className="text-gray-600 mb-4">
                  Your app is ready to be published. It will be submitted for review and auto-approved in 5 minutes.
                </p>
                <button
                  onClick={handlePublish}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition-colors"
                >
                  Submit for Review
                </button>
              </div>
            )}
          </div>

          {/* Versions List */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">App Versions</h2>
              
              {versions.length === 0 ? (
                <div className="text-center py-8">
                  <File className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No versions uploaded yet</p>
                  <p className="text-sm text-gray-400">Upload your first version to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {versions.map((version, index) => (
                    <div key={version._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            Version {version.versionNumber}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Uploaded {new Date(version.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {index === versions.length - 1 ? 'Latest' : 'Previous'}
                          </span>
                          <button
                            onClick={() => {
                              // Download functionality would go here
                              alert('Download functionality would be implemented here');
                            }}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                            title="Download"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upload Guidelines */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Upload Guidelines</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• Supported formats: APK, ZIP, EXE</li>
                <li>• Maximum file size: 100MB</li>
                <li>• Use semantic versioning (e.g., 1.0.0, 1.1.0)</li>
                <li>• Test your app thoroughly before uploading</li>
                <li>• Each version must be unique</li>
                <li>• Apps are auto-approved after 5 minutes</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
