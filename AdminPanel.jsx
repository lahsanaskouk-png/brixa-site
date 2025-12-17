import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/UI/Card';

const AdminPanel = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingDeposits: 0,
    pendingWithdrawals: 0,
    pendingTasks: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser?.isAdmin) {
      fetchAdminData();
    }
  }, [currentUser]);

  const fetchAdminData = async () => {
    try {
      // جلب جميع الإحصائيات
      const usersSnap = await getDocs(collection(db, 'users'));
      const depositsSnap = await getDocs(collection(db, 'deposits'));
      const withdrawalsSnap = await getDocs(collection(db, 'withdrawals'));
      const userTasksSnap = await getDocs(collection(db, 'userTasks'));

      const pendingDeposits = depositsSnap.docs.filter(
        doc => doc.data().status === 'pending'
      ).length;

      const pendingWithdrawals = withdrawalsSnap.docs.filter(
        doc => doc.data().status === 'pending'
      ).length;

      const pendingTasks = userTasksSnap.docs.filter(
        doc => doc.data().status === 'pending'
      ).length;

      setStats({
        totalUsers: usersSnap.size,
        pendingDeposits,
        pendingWithdrawals,
        pendingTasks
      });

      // جلب النشاطات الأخيرة
      const allActivities = [
        ...depositsSnap.docs.map(d => ({ ...d.data(), type: 'deposit', id: d.id })),
        ...withdrawalsSnap.docs.map(d => ({ ...d.data(), type: 'withdrawal', id: d.id })),
        ...userTasksSnap.docs.map(d => ({ ...d.data(), type: 'task', id: d.id }))
      ].sort((a, b) => b.createdAt?.toDate() - a.createdAt?.toDate())
       .slice(0, 10);

      setRecentActivity(allActivities);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const approveDeposit = async (depositId) => {
    try {
      const depositRef = doc(db, 'deposits', depositId);
      await updateDoc(depositRef, {
        status: 'approved',
        reviewedAt: new Date(),
        reviewedBy: currentUser.uid
      });

      // هنا يجب زيادة رصيد المستخدم
      alert('تم الموافقة على الإيداع');
      fetchAdminData();
    } catch (error) {
      console.error('Error approving deposit:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-yellow"></div>
      </div>
    );
  }

  if (!currentUser?.isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <div className="text-5xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-primary-red mb-4">غير مسموح</h2>
          <p className="text-text-muted">ليس لديك صلاحية للوصول لهذه الصفحة</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-text-primary p-4 md:p-6 rtl">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-primary-yellow">
            لوحة تحكم الأدمن
          </h1>
          <p className="text-text-muted mt-2">
            إدارة النظام والطلبات
          </p>
        </div>

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-card to-[#1a2028] border-l-4 border-primary-green">
            <div className="p-6">
              <p className="text-text-muted text-sm">إجمالي المستخدمين</p>
              <h3 className="text-3xl font-bold mt-2">{stats.totalUsers}</h3>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-card to-[#1a2028] border-l-4 border-primary-yellow">
            <div className="p-6">
              <p className="text-text-muted text-sm">إيداعات بانتظار المراجعة</p>
              <h3 className="text-3xl font-bold mt-2">{stats.pendingDeposits}</h3>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-card to-[#1a2028] border-l-4 border-primary-red">
            <div className="p-6">
              <p className="text-text-muted text-sm">سحوبات بانتظار المراجعة</p>
              <h3 className="text-3xl font-bold mt-2">{stats.pendingWithdrawals}</h3>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-card to-[#1a2028] border-l-4 border-blue-500">
            <div className="p-6">
              <p className="text-text-muted text-sm">مهام بانتظار الموافقة</p>
              <h3 className="text-3xl font-bold mt-2">{stats.pendingTasks}</h3>
            </div>
          </Card>
        </div>

        {/* النشاطات الأخيرة */}
        <Card className="mb-8">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-6 text-primary-yellow">
              النشاطات الأخيرة
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-right py-3 px-4 text-text-muted">النوع</th>
                    <th className="text-right py-3 px-4 text-text-muted">المستخدم</th>
                    <th className="text-right py-3 px-4 text-text-muted">المبلغ</th>
                    <th className="text-right py-3 px-4 text-text-muted">الحالة</th>
                    <th className="text-right py-3 px-4 text-text-muted">الإجراء</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivity.map((activity, index) => (
                    <tr key={index} className="border-b border-border/50 hover:bg-card/50">
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs ${
                          activity.type === 'deposit' 
                            ? 'bg-blue-500/20 text-blue-400'
                            : activity.type === 'withdrawal'
                            ? 'bg-purple-500/20 text-purple-400'
                            : 'bg-green-500/20 text-green-400'
                        }`}>
                          {activity.type === 'deposit' ? 'إيداع' : 
                           activity.type === 'withdrawal' ? 'سحب' : 'مهمة'}
                        </span>
                      </td>
                      <td className="py-3 px-4">{activity.userId?.substring(0, 8)}...</td>
                      <td className="py-3 px-4">
                        {activity.amount ? `${activity.amount} MAD` : '-'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          activity.status === 'pending'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : activity.status === 'approved'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {activity.status === 'pending' ? 'قيد المراجعة' :
                           activity.status === 'approved' ? 'مقبول' : 'مرفوض'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {activity.status === 'pending' && activity.type === 'deposit' && (
                          <button
                            onClick={() => approveDeposit(activity.id)}
                            className="px-3 py-1 bg-primary-green text-background text-sm rounded hover:opacity-90"
                          >
                            موافقة
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>

        {/* أدوات سريعة */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:border-primary-yellow/30 transition-colors cursor-pointer">
            <div className="p-6 text-center">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="font-bold mb-2">إدارة المستخدمين</h3>
              <p className="text-text-muted text-sm">عرض وتعديل جميع المستخدمين</p>
            </div>
          </Card>

          <Card className="hover:border-primary-yellow/30 transition-colors cursor-pointer">
            <div className="p-6 text-center">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="font-bold mb-2">إدارة الإيداعات</h3>
              <p className="text-text-muted text-sm">مراجعة طلبات الإيداع</p>
            </div>
          </Card>

          <Card className="hover:border-primary-yellow/30 transition-colors cursor-pointer">
            <div className="p-6 text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="font-bold mb-2">إضافة مهام جديدة</h3>
              <p className="text-text-muted text-sm">إنشاء مهام جديدة للمستخدمين</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
