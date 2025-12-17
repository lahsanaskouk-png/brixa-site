import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { Card } from '../components/ui/Card';
import {  Wallet, CheckCircle, Users } from 'lucide-react'; // Icons

export default function Dashboard() {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (user) {
      const unsub = onSnapshot(doc(db, "users", user.uid), (doc) => {
        setUserData(doc.data());
      });
      return () => unsub();
    }
  }, [user]);

  return (
    <div className="p-4 space-y-6 max-w-4xl mx-auto">
      {/* Welcome Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">مرحباً، {userData?.name || 'يا بطل'} 👋</h1>
          <p className="text-muted text-sm">شوف أرباحك والمهام ديالك لليوم</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Balance Card - Hero */}
        <Card className="border-primary/30 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 bg-primary/10 w-24 h-24 rounded-full blur-xl group-hover:bg-primary/20 transition-all"></div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/20 rounded-lg text-primary"><Wallet size={20} /></div>
            <span className="text-muted font-medium">الرصيد الحالي</span>
          </div>
          <h2 className="text-3xl font-bold text-text dir-ltr text-right">
            {userData?.balance?.toFixed(2) || '0.00'} <span className="text-primary text-lg">MAD</span>
          </h2>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-success/20 rounded-lg text-success"><CheckCircle size={20} /></div>
            <span className="text-muted font-medium">المهام المكتملة</span>
          </div>
          <h2 className="text-2xl font-bold text-text">{userData?.tasksCompleted || 0}</h2>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-500/20 rounded-lg text-purple-500"><Users size={20} /></div>
            <span className="text-muted font-medium">الإحالات</span>
          </div>
          <h2 className="text-2xl font-bold text-text">{userData?.referralsCount || 0}</h2>
        </Card>
      </div>
      
      {/* Referral Link Section */}
      <Card className="bg-gradient-to-l from-card to-[#1a1f26]">
        <h3 className="text-lg font-bold mb-2">رابط الإحالة ديالك 🚀</h3>
        <p className="text-muted text-sm mb-4">شارك الرابط مع صحابك وربح نسبة على كل واحد يتسجل ويبدا الخدمة.</p>
        <div className="flex gap-2 bg-background p-2 rounded border border-border">
          <code className="flex-1 text-primary truncate text-sm p-1">
            {window.location.origin}/register?ref={userData?.referralCode}
          </code>
          <button className="text-xs bg-border px-3 rounded hover:text-primary transition-colors">نسخ</button>
        </div>
      </Card>
    </div>
  );
}
