import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [userTasks, setUserTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchTasks();
    fetchUserTasks();
  }, [currentUser]);

  const fetchTasks = async () => {
    const q = query(collection(db, 'tasks'), where('status', '==', 'active'));
    const snapshot = await getDocs(q);
    const tasksData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setTasks(tasksData);
    setLoading(false);
  };

  const fetchUserTasks = async () => {
    if (!currentUser) return;
    
    const q = query(collection(db, 'userTasks'), 
      where('userId', '==', currentUser.uid));
    const snapshot = await getDocs(q);
    const userTasksData = snapshot.docs.map(doc => doc.data().taskId);
    setUserTasks(userTasksData);
  };

  const startTask = async (taskId) => {
    if (!currentUser) return;

    // فتح المهمة في نافذة جديدة
    const task = tasks.find(t => t.id === taskId);
    if (task.url) {
      window.open(task.url, '_blank');
    }

    // تسجيل بدء المهمة
    try {
      await addDoc(collection(db, 'userTasks'), {
        userId: currentUser.uid,
        taskId: taskId,
        status: 'pending',
        submittedAt: new Date(),
        screenshotUrl: '' // سيتم رفعها لاحقاً
      });

      alert('تم بدء المهمة! قم بإكمالها ثم ارجع هنا لتقديم الإثبات.');
      fetchUserTasks();
    } catch (error) {
      console.error('Error starting task:', error);
    }
  };

  const isTaskCompleted = (taskId) => {
    return userTasks.includes(taskId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-yellow"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-text-primary p-4 md:p-6 rtl">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-primary-yellow">
            المهام المتاحة
          </h1>
          <p className="text-text-muted mt-2">
            أكمل المهام واربح المال
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map(task => (
            <Card 
              key={task.id}
              className="hover:shadow-lg transition-all duration-300 hover:border-primary-yellow/30"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="inline-block px-3 py-1 text-xs rounded-full bg-card text-primary-yellow border border-border">
                      {task.type === 'watch' ? 'مشاهدة' : 
                       task.type === 'register' ? 'تسجيل' : 'تحميل'}
                    </span>
                  </div>
                  <div className="text-primary-green font-bold text-xl">
                    {task.reward} MAD
                  </div>
                </div>

                <h3 className="text-lg font-bold mb-3">{task.title}</h3>
                <p className="text-text-muted text-sm mb-6">{task.description}</p>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-text-muted">
                    {task.completedCount || 0} شخص أكملها
                  </div>
                  
                  {isTaskCompleted(task.id) ? (
                    <button
                      disabled
                      className="px-6 py-2 bg-border text-text-muted rounded-lg cursor-not-allowed"
                    >
                      مكتملة ✓
                    </button>
                  ) : (
                    <Button
                      onClick={() => startTask(task.id)}
                      className="bg-primary-yellow text-background hover:bg-primary-yellow/90"
                    >
                      ابدأ المهمة
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {tasks.length === 0 && (
          <Card className="text-center py-12">
            <div className="text-5xl mb-4">😴</div>
            <h3 className="text-xl font-bold mb-2">لا توجد مهام حالياً</h3>
            <p className="text-text-muted">تفقد لاحقاً للحصول على مهام جديدة</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Tasks;
