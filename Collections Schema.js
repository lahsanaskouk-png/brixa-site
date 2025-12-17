// 1. المستخدمين
users: {
  userId: {
    email: string,
    username: string,
    balance: number, // بالدرهم
    completedTasks: number,
    totalEarned: number,
    referralCode: string,
    referredBy: string, // referral code of referrer
    isAdmin: boolean,
    createdAt: timestamp,
    lastLogin: timestamp,
    bankDetails: {
      fullName: string,
      rib: string
    }
  }
}

// 2. المهام
tasks: {
  taskId: {
    title: string,
    description: string,
    reward: number, // MAD
    type: 'watch' | 'register' | 'download',
    status: 'active' | 'inactive',
    url: string,
    createdBy: userId, // Admin ID
    createdAt: timestamp,
    completionLimit: number, // عدد المستخدمين المسموح
    completedCount: number
  }
}

// 3. مهام المستخدمين
userTasks: {
  id: {
    userId: string,
    taskId: string,
    status: 'pending' | 'approved' | 'rejected',
    screenshotUrl: string, // إن وجد
    submittedAt: timestamp,
    reviewedAt: timestamp,
    reviewedBy: string // Admin ID
  }
}

// 4. الإيداعات
deposits: {
  depositId: {
    userId: string,
    amount: number,
    receiptUrl: string, // صورة التحويل
    status: 'pending' | 'approved' | 'rejected',
    createdAt: timestamp,
    reviewedAt: timestamp,
    reviewedBy: string,
    transactionRef: string // رقم العملية
  }
}

// 5. السحوبات
withdrawals: {
  withdrawalId: {
    userId: string,
    amount: number,
    fullName: string,
    rib: string,
    status: 'pending' | 'approved' | 'rejected',
    createdAt: timestamp,
    reviewedAt: timestamp,
    reviewedBy: string
  }
}

// 6. الإحالات
referrals: {
  referralId: {
    referrerId: string,
    referredUserId: string,
    commission: number, // نسبة الربح
    amount: number, // المبلغ المكتسب
    status: 'pending' | 'completed',
    createdAt: timestamp,
    completedAt: timestamp
  }
}

// 7. الإعدادات
settings: {
  system: {
    minWithdrawal: 100, // الحد الأدنى للسحب
    referralRate: 0.10, // 10%
    bankInfo: {
      titulaire: "LAHCEN ASKOUK",
      rib: "230 010 6779142211027200 15",
      iban: "MA64 2300 1067 7914 2211 0272 0015"
    }
  }
}
