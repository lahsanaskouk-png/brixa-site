import { runTransaction, doc } from "firebase/firestore";

const approveSubmission = async (submissionId, userId, rewardAmount) => {
  try {
    await runTransaction(db, async (transaction) => {
      // 1. Get User Ref
      const userRef = doc(db, "users", userId);
      const subRef = doc(db, "submissions", submissionId);
      
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists()) throw "User not found";

      const newBalance = (userDoc.data().balance || 0) + parseFloat(rewardAmount);
      const newCompleted = (userDoc.data().tasksCompleted || 0) + 1;

      // 2. Update Submission Status
      transaction.update(subRef, { status: "approved", approvedAt: new Date() });

      // 3. Update User Balance
      transaction.update(userRef, { 
        balance: newBalance,
        tasksCompleted: newCompleted
      });
      
      // Bonus: Check referral logic here if it's the first task
    });
    alert("تمت الموافقة وإضافة الرصيد بنجاح");
  } catch (e) {
    console.error("Transaction failed: ", e);
    alert("فشل العملية");
  }
};
