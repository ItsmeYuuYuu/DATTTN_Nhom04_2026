import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Chặn người dùng nếu họ vào sai URL của role khác
    const redirectUrl = user.role === 'admin' ? '/admin/dashboard' : 
                        user.role === 'lecturer' ? '/lecturer/classes' : '/student/dashboard';
    return <Navigate to={redirectUrl} replace />;
  }

  return children;
};

export default ProtectedRoute;
