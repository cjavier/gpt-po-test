//import logo from './logo.png';
import './App.css';
import Login from './components/Accounts/Login';
import Dashboard from './components/Dashboard';
import Account from './components/Accounts/Account';
import Onboarding from './components/Onboarding/Onboarding';
import OnboardingStripe from './components/Onboarding/Onboarding-stripe';
import OnboardingApikey from './components/Onboarding/Onboarding-apikey';
import Register from './components/Accounts/Register';
import ForgotPassword from './components/ForgotPassword';

import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import React, { useContext } from 'react';
import { AuthContext } from './AuthContext';

function App() {
  const { currentUser } = useContext(AuthContext);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/recuperar-contrasena" element={<ForgotPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cuenta" element={<Account />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/onboarding-stripe" element={<OnboardingStripe />} />
          <Route path="/onboarding-apikey" element={<OnboardingApikey />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
