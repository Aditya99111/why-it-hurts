// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile';
import Pricing from './components/Pricing';
import BuyCredits from './components/BuyCredits';
import Main from './components/Main';
import UpgradeToPremium from './components/UpgradeToPremium';
import Heal from './components/Heal';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import Terms from './components/Terms';
import Header from './components/Header';
import Privacy from './components/Privacy';
const stripePromise = loadStripe('pk_test_51PP5DCA76ySc9bk0tWkvBOliOPp4wBlAjOtO0UEqaSaFk6Qk75HrTyIjAjeZ7xHZEhtfqlAaBBUYJyEqpAQBHSHS00UaumrumP'); // Replace with your Stripe public key

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
};

const AuthenticatedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? <Navigate to="/profile" /> : children;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Elements stripe={stripePromise}>
          <Header/>

          <Routes>
            <Route path="/register" element={<AuthenticatedRoute><Register /></AuthenticatedRoute>} />
            <Route path="/login" element={<AuthenticatedRoute><Login /></AuthenticatedRoute>} />
            <Route path="/" element={<Main />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/heal" element={<Heal />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/profile" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />
             <Route path="/upgrade" element={
              <PrivateRoute>
                <UpgradeToPremium />
              </PrivateRoute>
            } />

            <Route path="/buy-credits" element={
              <PrivateRoute>
                <BuyCredits />
              </PrivateRoute>
            } />
          </Routes>
        </Elements>
      </Router>
    </AuthProvider>
  );
};

export default App;
