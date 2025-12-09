import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import PatientDetails from './pages/PatientDetails';
import Tasks from './pages/Tasks';
import Invoices from './pages/Invoices';
import Doctors from './pages/Doctors';
import DoctorDetails from './pages/DoctorDetails';
import DoctorHistory from './pages/DoctorHistory';
import DoctorPayments from './pages/DoctorPayments';
import ConsultationRoom from './components/telemedicine/ConsultationRoom';
import Settings from './pages/Settings';
import Users from './pages/Users';
import Plans from './pages/Plans';
import PlatformSettings from './pages/PlatformSettings';
import Login from './pages/Login';
import Register from './pages/Register';

// Admin Imports
// Admin Imports
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import TenantList from './pages/admin/TenantList';
import SaaSPlans from './pages/admin/SaaSPlans';
import SuperAdminRoute from './components/auth/SuperAdminRoute';

import { PatientProvider } from './context/PatientContext';
import { DoctorProvider } from './context/DoctorContext';
import { BrandingProvider } from './context/BrandingContext';
import { FeatureProvider } from './context/FeatureContext';

function App() {
  return (
    <BrandingProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <FeatureProvider>
                  <PatientProvider>
                    <DoctorProvider>
                      <Layout />
                    </DoctorProvider>
                  </PatientProvider>
                </FeatureProvider>
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="patients" element={<Patients />} />
              <Route path="patients/:id" element={<PatientDetails />} />
              <Route path="tasks" element={<Tasks />} />
              <Route path="invoices" element={<Invoices />} />
              <Route path="doctors" element={<Doctors />} />
              <Route path="doctors/:id" element={<DoctorDetails />} />
              <Route path="doctors/:id/history" element={<DoctorHistory />} />
              <Route path="doctors/:id/payments" element={<DoctorPayments />} />
              <Route path="consultation/:sessionId" element={<ConsultationRoom />} />
              <Route path="settings" element={<Settings />} />
              <Route path="users" element={<Users />} />
              <Route path="plans" element={<Plans />} />
              <Route path="platform" element={<PlatformSettings />} />
            </Route>

            {/* Super Admin Routes */}
            <Route path="/admin" element={
              <SuperAdminRoute>
                <AdminLayout />
              </SuperAdminRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="tenants" element={<TenantList />} />
              <Route path="plans" element={<SaaSPlans />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </BrandingProvider>
  );
}

export default App;
