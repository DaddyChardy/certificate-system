
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import AdminDashboard from './components/AdminDashboard';
import RegistrationPage from './components/RegistrationPage';
import Header from './components/Header';

const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <div className="min-h-screen bg-gray-50 text-gray-800">
          <Header />
          <main className="p-4 sm:p-6 lg:p-8">
            <Routes>
              <Route path="/register" element={<RegistrationPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/" element={<Navigate to="/register" />} />
            </Routes>
          </main>
        </div>
      </HashRouter>
    </AppProvider>
  );
};

export default App;
