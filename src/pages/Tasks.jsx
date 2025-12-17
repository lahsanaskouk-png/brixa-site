import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function Tasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch tasks and user's submission status logic here...
  // (Assuming we fetch tasks and check if user already submitted)

  const handleStartTask = async (task) => {
    window.open(task.link, '_blank');
    
    if (confirm("واش كملتي المهمة؟ ضغط على OK باش نصيفطوها للمراجعة")) {
        setLoading(true);
        try {
            await addDoc(collection(db, "submissions"), {
                userId: user.uid,
                taskId: task.id,
                taskTitle: task.title,
                reward: task.reward,
                status: "pending",
                submittedAt: serverTimestamp()
            });
            alert("تم إرسال المهمة للمراجعة!");
            // Refresh logic...
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-4">
      <h2 className="text-xl font-bold border-b border-border pb-4 mb-6">المهام المتوفرة 🔥</h2>
      
      {tasks.map(task => (
        <Card key={task.id} className="flex flex-col md:flex-row justify-between items-center gap-4 hover:border-muted transition-colors">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
                <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded border border-primary/20">
                    {task.type === 'video' ? 'مشاهدة' : 'تسجيل'}
                </span>
                <h3 className="font-bold text-lg">{task.title}</h3>
            </div>
            <p className="text-muted text-sm">{task.description}</p>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="text-right">
                <p className="text-muted text-xs">المكافأة</p>
                <p className="text-success font-bold font-mono text-lg">{task.reward} DH</p>
            </div>
            <Button onClick={() => handleStartTask(task)} className="min-w-[100px]">
              ابدأ الآن
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
