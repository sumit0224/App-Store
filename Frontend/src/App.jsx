import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { ChatBotProvider } from './contexts/ChatBotContext'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import ChatBot from './components/ChatBotEnhanced'
import MobileBottomNav from './components/MobileBottomNav'
import Footer from './components/Footer'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import AppStoreHome from './pages/AppStoreHome'
import AppDetail from './pages/AppDetail'
import DeveloperDashboard from './pages/DeveloperDashboard'
import AppForm from './pages/AppForm'
import AppUpload from './pages/AppUpload'
import AdminDashboard from './pages/AdminDashboard'
import Categories from './pages/Categories'
import CategoryDetail from './pages/CategoryDetail'
import Search from './pages/Search'
import Favorites from './pages/Favorites'
import Profile from './pages/Profile'
import ProfileUpdate from './pages/ProfileUpdate'
import NotFoundPage from './pages/NotFound'

const AppContent = () => {
  const location = useLocation()
  const hideFooter = (
    location.pathname === '/login' ||
    location.pathname === '/signup' ||
    location.pathname === '/profile' ||
    location.pathname.startsWith('/profile/')
  )
  return (
    <ThemeProvider>
      <AuthProvider>
        <ChatBotProvider>
          <Routes>
              <Route path="/" element={<Navigate to="/store" replace />} />
              
              {/* Public Routes */}
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/signup" 
                element={
                  <PublicRoute>
                    <Signup />
                  </PublicRoute>
                } 
              />
              
              {/* App Store Routes */}
              <Route path="/store" element={<AppStoreHome />} />
              <Route path="/app/:slug" element={<AppDetail />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/category/:categorySlug" element={<CategoryDetail />} />
              <Route path="/search" element={<Search />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/profile" element={<Profile />} />
              <Route 
                path="/profile/update" 
                element={
                  <ProtectedRoute>
                    <ProfileUpdate />
                  </ProtectedRoute>
                } 
              />
              
              {/* Protected User Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Developer Routes */}
              <Route 
                path="/developer" 
                element={
                  <ProtectedRoute>
                    <DeveloperDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/developer/apps/new" 
                element={
                  <ProtectedRoute>
                    <AppForm />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/developer/apps/:id/edit" 
                element={
                  <ProtectedRoute>
                    <AppForm />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/developer/apps/:id/upload" 
                element={
                  <ProtectedRoute>
                    <AppUpload />
                  </ProtectedRoute>
                } 
              />
              
              {/* Admin Routes */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Error Routes */}
              <Route path="/404" element={<NotFoundPage />} />
              <Route path="*" element={<NotFoundPage />} />
          </Routes>
          
          {/* Global ChatBot Component */}
          <ChatBot />
          
          {/* Mobile Bottom Navigation */}
          <MobileBottomNav />

          {/* Global Footer (hidden on auth pages) */}
          {!hideFooter && <Footer />}
        </ChatBotProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

const App = () => (
  <Router>
    <AppContent />
  </Router>
)

export default App
