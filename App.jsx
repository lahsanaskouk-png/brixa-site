import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import AdminRoute from './components/Auth/AdminRoute';
import Navbar from './components/Layout/Navbar';
import Sidebar from './components/Layout/Sidebar';

// صفحات المستخدم
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Deposit from './pages/Deposit';
import Withdraw from './pages/Withdraw';
import Referral from './pages/Referral';

// صفحات الأدمن
import AdminPanel from './pages/Admin/AdminPanel';
import UsersManagement from './pages/Admin/UsersManagement';
import DepositsManagement from './pages/Admin/DepositsManagement';
import WithdrawalsManagement from './pages/Admin/WithdrawalsManagement';
import TasksManagement from './pages/Admin/TasksManagement';

// صفحات المصادقة
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// الأنماط
import './styles/globals.css';

function App() {
  useEffect(() => {
    // إضافة فئة direction للجسم
    document.body.dir = 'rtl';
    
    // منع inspect element
    document.addEventListener('contextmenu', (e) => e.preventDefault());
    document.addEventListener('keydown', (e) => {
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
        e.preventDefault();
      }
    });
  }, []);

  return (
    <Router>
      <AuthProvider>
        <UserProvider>
          <div className="min-h-screen bg-background text-text-primary rtl">
            <Routes>
              {/* الصفحات العامة */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* الصفحات المحمية */}
              <Route path="/" element={
                <ProtectedRoute>
                  <WithNavbar>
                    <Dashboard />
                  </WithNavbar>
                </ProtectedRoute>
              } />

              <Route path="/tasks" element={
                <ProtectedRoute>
                  <WithNavbar>
                    <Tasks />
                  </WithNavbar>
                </ProtectedRoute>
              } />

              <Route path="/deposit" element={
                <ProtectedRoute>
                  <WithNavbar>
                    <Deposit />
                  </WithNavbar>
                </ProtectedRoute>
              } />

              <Route path="/withdraw" element={
                <ProtectedRoute>
                  <WithNavbar>
                    <Withdraw />
                  </WithNavbar>
                </ProtectedRoute>
              } />

              <Route path="/referral" element={
                <ProtectedRoute>
                  <WithNavbar>
                    <Referral />
                  </WithNavbar>
                </ProtectedRoute>
              } />

              {/* صفحات الأدمن */}
              <Route path="/admin" element={
                <AdminRoute>
                  <WithNavbar admin={true}>
                    <AdminPanel />
                  </WithNavbar>
                </AdminRoute>
              } />

              <Route path="/admin/users" element={
                <AdminRoute>
                  <WithNavbar admin={true}>
                    <UsersManagement />
                  </WithNavbar>
                </AdminRoute>
              } />

              <Route path="/admin/deposits" element={
                <AdminRoute>
                  <WithNavbar admin={true}>
                    <DepositsManagement />
                  </WithNavbar>
                </AdminRoute>
              } />

              <Route path="/admin/withdrawals" element={
                <AdminRoute>
                  <WithNavbar admin={true}>
                    <WithdrawalsManagement />
                  </WithNavbar>
                </AdminRoute>
              } />

              <Route path="/admin/tasks" element={
                <AdminRoute>
                  <WithNavbar admin={true}>
                    <TasksManagement />
                  </WithNavbar>
                </AdminRoute>
              } />

              {/* إعادة التوجيه */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </UserProvider>
      </AuthProvider>
    </Router>
  );
}

// مكون مجمع للنافبار والسايدبار
const WithNavbar = ({ children, admin = false }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="flex">
      {/* السايدبار */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        admin={admin}
      />
      
      {/* المحتوى الرئيسي */}
      <div className="flex-1">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="min-h-screen pt-16">
          {children}
        </main>
      </div>
    </div>
  );
};

export default App;
