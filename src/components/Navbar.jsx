import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { Wallet, Target, Users, LogOut, Menu, X, Home, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
      toast.success('تم تسجيل الخروج بنجاح');
    } catch (error) {
      toast.error('حدث خطأ أثناء تسجيل الخروج');
    }
  };

  const navItems = [
    { path: '/dashboard', label: 'لوحة التحكم', icon: <Home size={20} /> },
    { path: '/tasks', label: 'المهام', icon: <Target size={20} /> },
    { path: '/referrals', label: 'الإحالات', icon: <Users size={20} /> },
    { path: '/deposit', label: 'الإيداع', icon: <Wallet size={20} /> },
    { path: '/withdraw', label: 'السحب', icon: <Wallet size={20} /> },
  ];

  const isAdmin = auth.currentUser?.email === 'admin@brixa.ma';

  return (
    <nav className="bg-card border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2 space-x-reverse">
              <div className="bg-primary-yellow p-2 rounded-lg">
                <Wallet className="text-black" size={24} />
              </div>
              <span className="text-xl font-bold text-primary-yellow">BRIXA</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 space-x-reverse">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 space-x-reverse px-3 py-2 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-primary-yellow text-black'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
            
            {isAdmin && (
              <Link
                to="/admin"
                className={`flex items-center space-x-2 space-x-reverse px-3 py-2 rounded-lg transition-colors ${
                  location.pathname === '/admin'
                    ? 'bg-red-500 text-white'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                <Shield size={20} />
                <span>الإدارة</span>
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 space-x-reverse px-3 py-2 text-text-muted hover:text-red-500 transition-colors"
            >
              <LogOut size={20} />
              <span>تسجيل الخروج</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-text-primary"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-2 space-x-reverse px-3 py-2 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? 'bg-primary-yellow text-black'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
              
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-2 space-x-reverse px-3 py-2 rounded-lg transition-colors ${
                    location.pathname === '/admin'
                      ? 'bg-red-500 text-white'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  <Shield size={20} />
                  <span>الإدارة</span>
                </Link>
              )}

              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center space-x-2 space-x-reverse px-3 py-2 text-text-muted hover:text-red-500 transition-colors text-right"
              >
                <LogOut size={20} />
                <span>تسجيل الخروج</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
