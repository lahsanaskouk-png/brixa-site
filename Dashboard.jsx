import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import Card from '../components/UI/Card';
import { formatCurrency } from '../utils/formatters';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    balance: 0,
    completedTasks: 0,
    pendingTasks: 0,
    referralEarnings: 0,
    totalEarned: 0
  });

  useEffect(() => {
    fetchUserStats();
  }, [currentUser]);

  const fetchUserStats = async () => {
    if (!currentUser) return;

    // جلب إحصائيات المستخدم
    const q = query(collection(db, 'userTasks'), 
      where('userId', '==', currentUser.uid));
    
    const snapshot = await getDocs(q);
    const completed = snapshot.docs.filter(doc => 
      doc.data().status === 'approved').length;
    const pending = snapshot.docs.filter(doc => 
      doc.data().status === 'pending').length;

    setStats(prev => ({
      ...prev,
      completedTasks: completed,
      pendingTasks: pending,
      balance: currentUser.balance || 0,
      totalEarned: currentUser.totalEarned || 0
    }));
  };

  return (
    <div className="min-h-screen bg-background text-text-primary p-4 md:p-6 rtl">
      <div className="max-w-7xl mx-auto">
        {/* العنوان */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-primary-yellow">
            مرحبا بك، {currentUser?.username}
          </h1>
          <p className="text-text-muted mt-2">
            تابع إحصائياتك وأرباحك
          </p>
        </div>

        {/* الإحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:scale-[1.02] transition-transform duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-muted text-sm">الرصيد الحالي</p>
                  <h3 className="text-2xl font-bold mt-2 text-primary-green">
                    {formatCurrency(stats.balance)} MAD
                  </h3>
                </div>
                <div className="bg-card p-3 rounded-lg">
                  <span className="text-primary-yellow text-2xl">💰</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="hover:scale-[1.02] transition-transform duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-muted text-sm">المهام المكتملة</p>
                  <h3 className="text-2xl font-bold mt-2">
                    {stats.completedTasks}
                  </h3>
                </div>
                <div className="bg-card p-3 rounded-lg">
                  <span className="text-primary-green text-2xl">✅</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="hover:scale-[1.02] transition-transform duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-muted text-sm">أرباح الإحالات</p>
                  <h3 className="text-2xl font-bold mt-2 text-primary-green">
                    {formatCurrency(stats.referralEarnings)} MAD
                  </h3>
                </div>
                <div className="bg-card p-3 rounded-lg">
                  <span className="text-primary-yellow text-2xl">👥</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="hover:scale-[1.02] transition-transform duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-muted text-sm">إجمالي الأرباح</p>
                  <h3 className="text-2xl font-bold mt-2 text-primary-green">
                    {formatCurrency(stats.totalEarned)} MAD
                  </h3>
                </div>
                <div className="bg-card p-3 rounded-lg">
                  <span className="text-primary-green text-2xl">📈</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* الإجراءات السريعة */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-card to-[#1a2028]">
            <div className="p-6">
              <h3 className="text-lg font-bold mb-4 text-primary-yellow">
                💸 إيداع سريع
              </h3>
              <p className="text-text-muted text-sm mb-4">
                قم بتعبية رصيدك عبر التحويل البنكي
              </p>
              <button className="w-full bg-primary-yellow text-background font-bold py-3 rounded-lg hover:opacity-90 transition-opacity">
                إيداع الآن
              </button>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-card to-[#1a2028]">
            <div className="p-6">
              <h3 className="text-lg font-bold mb-4 text-primary-yellow">
                🎯 مهام جديدة
              </h3>
              <p className="text-text-muted text-sm mb-4">
                ابدأ بربح المال من خلال المهام المتاحة
              </p>
              <button className="w-full bg-primary-green text-background font-bold py-3 rounded-lg hover:opacity-90 transition-opacity">
                عرض المهام
              </button>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-card to-[#1a2028]">
            <div className="p-6">
              <h3 className="text-lg font-bold mb-4 text-primary-yellow">
                👥 دعوة أصدقاء
              </h3>
              <p className="text-text-muted text-sm mb-4">
                اربح 10% من أرباح كل صديق تدعوه
              </p>
              <button className="w-full bg-[#2A2E39] text-text-primary font-bold py-3 rounded-lg hover:bg-[#3a3e49] transition-colors">
                مشاركة رابط الدعوة
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
