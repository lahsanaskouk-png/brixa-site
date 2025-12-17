import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { db } from '../firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

export default function Wallet() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('deposit'); // 'deposit' or 'withdraw'
  const [amount, setAmount] = useState('');
  const [rib, setRib] = useState('');
  const [name, setName] = useState('');

  const handleDeposit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "transactions"), {
        userId: user.uid,
        type: 'deposit',
        amount: parseFloat(amount),
        status: 'pending',
        method: 'CIH',
        createdAt: serverTimestamp()
    });
    alert("وصلنا الطلب ديالك! غادي يتراجع ويدخل الرصيد قريبا.");
    setAmount('');
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    // Check balance logic here (needs user data context)
    await addDoc(collection(db, "transactions"), {
        userId: user.uid,
        type: 'withdraw',
        amount: parseFloat(amount),
        rib: rib,
        fullName: name,
        status: 'pending',
        createdAt: serverTimestamp()
    });
    alert("طلب السحب تسجل. العملية كتاخد 24-48 ساعة.");
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {/* Tabs */}
      <div className="flex bg-card rounded-lg p-1 mb-6 border border-border">
        <button 
            onClick={() => setActiveTab('deposit')}
            className={`flex-1 py-2 rounded-md font-bold transition-all ${activeTab === 'deposit' ? 'bg-primary text-black' : 'text-muted hover:text-text'}`}
        >
            إيداع (Deposit)
        </button>
        <button 
            onClick={() => setActiveTab('withdraw')}
            className={`flex-1 py-2 rounded-md font-bold transition-all ${activeTab === 'withdraw' ? 'bg-primary text-black' : 'text-muted hover:text-text'}`}
        >
            سحب (Withdraw)
        </button>
      </div>

      {activeTab === 'deposit' ? (
        <div className="space-y-6">
            <Card className="bg-primary/5 border-primary/20">
                <h3 className="text-primary font-bold mb-4 text-center text-lg">معلومات البنك للإيداع (CIH BANK)</h3>
                <div className="space-y-3 font-mono text-sm md:text-base bg-background p-4 rounded border border-border select-all">
                    <div className="flex justify-between border-b border-border pb-2">
                        <span className="text-muted">Titulaire:</span>
                        <span className="text-text font-bold">LAHCEN ASKOUK</span>
                    </div>
                    <div className="flex justify-between border-b border-border pb-2">
                        <span className="text-muted">RIB:</span>
                        <span className="text-text">230 010 6779142211027200 15</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted">IBAN:</span>
                        <span className="text-text text-xs md:text-sm">MA64 2300 1067 7914 2211 0272 0015</span>
                    </div>
                </div>
                <p className="text-center text-xs text-muted mt-4">⚠️ المرجو إرسال المبلغ بالضبط، ثم ملء الاستمارة أسفله.</p>
            </Card>

            <form onSubmit={handleDeposit} className="space-y-4">
                <div>
                    <label className="block text-sm text-muted mb-1">المبلغ المرسل (MAD)</label>
                    <input 
                        type="number" 
                        required
                        className="w-full bg-background border border-border rounded p-3 text-white focus:border-primary outline-none"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>
                <Button wFull>تأكيد الإيداع</Button>
            </form>
        </div>
      ) : (
        <form onSubmit={handleWithdraw} className="space-y-4">
            <Card className="mb-4">
                <p className="text-sm text-muted">الحد الأدنى للسحب هو <span className="text-primary font-bold">50 MAD</span></p>
            </Card>
            <div>
                <label className="block text-sm text-muted mb-1">المبلغ المراد سحبه</label>
                <input 
                    type="number" 
                    required
                    className="w-full bg-background border border-border rounded p-3 text-white focus:border-primary outline-none"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
            </div>
            <div>
                <label className="block text-sm text-muted mb-1">الإسم الكامل (مول الحساب)</label>
                <input 
                    type="text" 
                    required
                    className="w-full bg-background border border-border rounded p-3 text-white focus:border-primary outline-none"
                    placeholder="الاسم والنسب"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div>
                <label className="block text-sm text-muted mb-1">رقم الحساب (RIB - 24 digits)</label>
                <input 
                    type="text" 
                    required
                    className="w-full bg-background border border-border rounded p-3 text-white focus:border-primary outline-none"
                    placeholder="230..."
                    value={rib}
                    onChange={(e) => setRib(e.target.value)}
                />
            </div>
            <Button wFull variant="primary">طلب السحب</Button>
        </form>
      )}
    </div>
  );
}
