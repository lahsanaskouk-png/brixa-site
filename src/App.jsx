import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { Toaster } from 'react-hot-toast';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Withdraw from './pages/Withdraw';
import Referrals from './pages/Referrals';
import Admin from './pages/Admin';
import Deposit from './pages/Deposit';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-yellow"></div>
      </div>
    );
  }

  return (
    <Router>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#151A1F',
            color: '#EAECEF',
            border: '1px solid #2A2E39',
            direction: 'rtl'
          },
        }}
      />
      <div className="min-h-screen bg-background">
        {user && <Navbar />}
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
            <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
            
            <Route element={<ProtectedRoute user={user} />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/withdraw" element={<Withdraw />} />
              <Route path="/referrals" element={<Referrals />} />
              <Route path="/deposit" element={<Deposit />} />
              
              <Route element={<AdminRoute user={user} />}>
                <Route path="/admin" element={<Admin />} />
              </Route>
            </Route>
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
