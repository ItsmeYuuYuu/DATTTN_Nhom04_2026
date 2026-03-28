import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import LecturerLayout from './layouts/LecturerLayout';
import StudentLayout from './layouts/StudentLayout';

// Pages
import Login from './pages/auth/Login';
import Dashboard from './pages/admin/Dashboard';
import StudentManagement from './pages/admin/StudentManagement';
import LecturerManagement from './pages/admin/LecturerManagement';
import ClassManagement from './pages/admin/ClassManagement';
import SubjectManagement from './pages/admin/SubjectManagement';

import LecturerDashboard from './pages/lecturer/LecturerDashboard';
import LecturerClasses from './pages/lecturer/LecturerClasses';
import SessionsManagement from './pages/lecturer/SessionsManagement';
import QRAttendance from './pages/lecturer/QRAttendance';
import ManualAttendance from './pages/lecturer/ManualAttendance';

import StudentDashboard from './pages/student/StudentDashboard';
import StudentCheckin from './pages/student/StudentCheckin';
import StudentComplaints from './pages/student/StudentComplaints';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="lecturers" element={<LecturerManagement />} />
          </Route>

          {/* Lecturer Routes */}
          <Route path="/lecturer" element={
            <ProtectedRoute allowedRoles={['lecturer']}>
              <LecturerLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/lecturer/dashboard" replace />} />
            <Route path="dashboard" element={<LecturerDashboard />} />
            <Route path="classes" element={<LecturerClasses />} />
            <Route path="students" element={<StudentManagement />} />
            <Route path="subjects" element={<SubjectManagement />} />
            <Route path="subjects/:monId/classes" element={<ClassManagement />} />
            <Route path="sessions/:classId" element={<SessionsManagement />} />
            <Route path="qr-attendance/:classId" element={<QRAttendance />} />
            <Route path="manual/:classId" element={<ManualAttendance />} />
          </Route>

          {/* Student Routes */}
          <Route path="/student" element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/student/dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="complaints" element={<StudentComplaints />} />
            <Route path="history" element={
              <div className="p-4 mt-5 text-center text-muted">
                <i className="fas fa-history fs-1 mb-3 opacity-50"></i>
                <h5>Lịch sử chi tiết (Tính năng đang phát triển)</h5>
              </div>
            } />
            <Route path="checkin/:classId" element={<StudentCheckin />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
