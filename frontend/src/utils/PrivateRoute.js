import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function PrivateRoute({ allowedRoles }) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role')?.toLowerCase().trim();
console.log('PrivateRoute check', { role, allowedRoles });


  if (!token) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}
