import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Homepage from './Homepage';
import Login from './Login';
import SignUp from './SignUp';
import reportWebVitals from './reportWebVitals';
import AdminRoute from "./AdminRoute";
import AdminDashboard from "./AdminDashboard";
import UserProfile from './UserProfile';
import ProtectedRoute from './ProtectedRoute';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<ProtectedRoute><Login /></ProtectedRoute>} />
        <Route path="/signup" element={<ProtectedRoute><SignUp /></ProtectedRoute>} />
        <Route path="/profile" element={<UserProfile />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

reportWebVitals();