// src/components/PublicRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicRoute = ({ children }) => {
  const { currentUser } = useAuth();

  return currentUser ? <Navigate to="/profile" /> : children;
};

export default PublicRoute;
