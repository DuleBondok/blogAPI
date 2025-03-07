import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');  // Check if the token exists
  
  // If the user is logged in, redirect to homepage (or wherever you want)
  if (token) {
    return <Navigate to="/" />;  // Redirect to the homepage (or admin dashboard)
  }

  // Otherwise, allow access to the children (signup or login page)
  return children;
};

export default ProtectedRoute;