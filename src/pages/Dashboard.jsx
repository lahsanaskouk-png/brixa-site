import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { Wallet, Users, Target, TrendingUp } from 'lucide-react';
import BalanceCard from '../components/BalanceCard';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState({
    balance: 0,
    completedTasks: 0,
    pendingTasks: 0,
    referrals: 0,
    referralEarnings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      // Get user document
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();

      // Get completed tasks
      const tasksQuery = query(
        collection(db, 'userTasks'),
        where('userId', '==', user.uid),
        where('status', '==', 'approved')
      );
      const tasksSnapshot = await getDocs(tasksQuery);

      // Get pending tasks
      const pendingTasksQuery = query(
        collection(db, 'userTasks'),
        where('userId', '==', user.uid),
        where('status', '==', 'pending')
      );
      const pendingTasksSnapshot = await getDocs(pendingTasksQuery);

      // Get referrals
      const referralsQuery = query(
        collection(db, 'referrals'),
        where('referrerId', '==', user.uid)
      );
      const referralsSnapshot = await getDocs(referralsQuery);

      setStats({
        balance: userData?.balance || 0,
        completedTasks: tasksSnapshot.size,
        pendingTasks: pendingTasksSnapshot.size,
        referrals: referralsSnapshot.size,
        referralEarnings: referralsSnapshot.docs.reduce((sum, doc) => sum + (doc.data().earnings || 0), 0)
      });
    } catch (error) {
      toast.error('حدث خطأ في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-yellow"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-text-primary">لوحة التحكم</h1>
        <a
          href="https://t.me/brixaofficial"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary flex items-center space-x-2 space-x-reverse"
        >
          <span>قناة Telegram الرسمية</span>
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <BalanceCard
          title="الرصيد الحالي"
          value={`${stats.balance.toFixed(2)} MAD`}
          icon={<Wallet className="text-primary-yellow" />}
          color="yellow"
        />
        
        <BalanceCard
          title="المهام المكتملة"
          value={stats.completedTasks}
          icon={<Target className="text-primary-green" />}
          color="green"
        />
        
        <BalanceCard
          title="المهام المنتظرة"
          value={stats.pendingTasks}
          icon={<Target className="text-text-muted" />}
          color="gray"
        />
        
        <BalanceCard
          title="أرباح الإحالات"
          value={`${stats.referralEarnings.toFixed(2)} MAD`}
          icon={<Users className="text-primary-yellow" />}
          color="yellow"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="card">
          <h2 className="text-xl font-bold text-text-primary mb-4">إجراءات سريعة</h2>
          <div className="grid grid-cols-2 gap-4">
            <a
              href="/tasks"
              className="bg-gray-800 hover:bg-gray-700 rounded-lg p-4 text-center transition-colors"
            >
              <Target className="mx-auto mb-2" size={24} />
              <span>المهام</span>
            </a>
            
            <a
              href="/referrals"
              className="bg-gray-800 hover:bg-gray-700 rounded-lg p-4 text-center transition-colors"
            >
              <Users className="mx-auto mb-2" size={24} />
              <span>الإحالات</span>
            </a>
            
            <a
              href="/deposit"
              className="bg-gray-800 hover:bg-gray-700 rounded-lg p-4 text-center transition-colors"
            >
              <TrendingUp className="mx-auto mb-2" size={24} />
              <span>إيداع</span>
            </a>
            
            <a
              href="/withdraw"
              className="bg-gray-800 hover:bg-gray-700 rounded-lg p-4 text-center transition-colors"
            >
              <Wallet className="mx-auto mb-2" size={24} />
              <span>سحب</span>
            </a>
          </div>
        </div>

        {/* Referral Stats */}
        <div className="card">
          <h2 className="text-xl font-bold text-text-primary mb-4">إحصائيات الإحالات</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-text-muted">عدد الإحالات</span>
              <span className="text-text-primary font-bold">{stats.referrals}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-muted">الأرباح من الإحالات</span>
              <span className="text-primary-green font-bold">{stats.referralEarnings.toFixed(2)} MAD</span>
            </div>
            <div className="pt-4 border-t border-border">
              <p className="text-text-muted text-sm mb-2">شارك رابط الإحالة الخاص بك:</p>
              <div className="flex space-x-2 space-x-reverse">
                <input
                  type="text"
                  readOnly
                  value={`https://brixa.ma/register?ref=${auth.currentUser?.uid}`}
                  className="input-field flex-1"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`https://brixa.ma/register?ref=${auth.currentUser?.uid}`);
                    toast.success('تم نسخ رابط الإحالة');
                  }}
                  className="btn-primary px-4"
                >
                  نسخ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
