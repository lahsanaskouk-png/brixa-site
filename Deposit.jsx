import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import Card from '../components/UI/Card';

const Deposit = () => {
  const [amount, setAmount] = useState('');
  const [receiptFile, setReceiptFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  const bankInfo = {
    titulaire: "LAHCEN ASKOUK",
    rib: "230 010 6779142211027200 15",
    iban: "MA64 2300 1067 7914 2211 0272 0015"
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser || !amount || !receiptFile) return;

    setLoading(true);

    // هنا يجب رفع الملف إلى Firebase Storage
    // لأغراض المثال، سنفترض أن لدينا URL للصورة

    try {
      await addDoc(collection(db, 'deposits'), {
        userId: currentUser.uid,
        amount: parseFloat(amount),
        status: 'pending',
        createdAt: new Date(),
        receiptUrl: 'uploaded_file_url', // استبدل برابط التحميل الفعلي
        transactionRef: `DEP${Date.now()}`
      });

      alert('تم إرسال طلب الإيداع بنجاح! سيتم مراجعته من قبل الإدارة.');
      setAmount('');
      setReceiptFile(null);
    } catch (error) {
      console.error('Error submitting deposit:', error);
      alert('حدث خطأ أثناء إرسال الطلب');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background text-text-primary p-4 md:p-6 rtl">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-primary-yellow">
            إيداع الأموال
          </h1>
          <p className="text-text-muted mt-2">
            قم بتعبية رصيدك عبر التحويل البنكي
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* معلومات البنك */}
          <Card className="border-2 border-primary-yellow/20">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-6 text-primary-yellow">
                🏦 معلومات الحساب البنكي
              </h2>
              
              <div className="space-y-4">
                <div className="bg-card p-4 rounded-lg">
                  <p className="text-text-muted text-sm">اسم الحساب</p>
                  <p className="text-lg font-bold mt-1">{bankInfo.titulaire}</p>
                </div>

                <div className="bg-card p-4 rounded-lg">
                  <p className="text-text-muted text-sm">رقم RIB</p>
                  <p className="text-lg font-bold mt-1 font-mono">
                    {bankInfo.rib}
                  </p>
                </div>

                <div className="bg-card p-4 rounded-lg">
                  <p className="text-text-muted text-sm">رقم IBAN</p>
                  <p className="text-lg font-bold mt-1 font-mono">
                    {bankInfo.iban}
                  </p>
                </div>
              </div>

              <div className="mt-8 p-4 bg-card/50 rounded-lg border border-border">
                <h3 className="font-bold mb-2 text-primary-green">📝 تعليمات الإيداع</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-text-muted">
                  <li>قم بالتحويل إلى الحساب أعلاه</li>
                  <li>احفظ صورة إثبات التحويل</li>
                  <li>املأ النموذج على اليمين</li>
                  <li>ارفع صورة الإثبات</li>
                  <li>سيراجع الإدارة طلبك خلال 24 ساعة</li>
                </ol>
              </div>
            </div>
          </Card>

          {/* نموذج الإيداع */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-6">تقديم طلب إيداع</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-2">
                    المبلغ (MAD)
                  </label>
                  <input
                    type="number"
                    min="10"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-card border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-yellow focus:border-transparent"
                    placeholder="أدخل المبلغ بالدرهم"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-muted mb-2">
                    صورة إثبات التحويل
                  </label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary-yellow/50 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setReceiptFile(e.target.files[0])}
                      className="hidden"
                      id="receipt-upload"
                      required
                    />
                    <label htmlFor="receipt-upload" className="cursor-pointer">
                      <div className="text-4xl mb-2">📎</div>
                      <p className="text-text-primary font-medium">
                        {receiptFile ? receiptFile.name : 'انقر لرفع الصورة'}
                      </p>
                      <p className="text-text-muted text-sm mt-2">
                        PNG, JPG, PDF (حتى 5MB)
                      </p>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-yellow text-background font-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'جاري الإرسال...' : 'إرسال طلب الإيداع'}
                </button>
              </form>

              <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <h4 className="font-bold text-yellow-500 mb-2">⚠️ ملاحظة مهمة</h4>
                <p className="text-sm text-text-muted">
                  تأكد من إضافة اسم المستخدم في وصف التحويل لتسهيل عملية المطابقة.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Deposit;
