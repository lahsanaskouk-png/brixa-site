// Admin panel specific functionality
class AdminPanel {
    constructor() {
        this.user = JSON.parse(localStorage.getItem('brixa_user')) || {};
        this.init();
    }
    
    init() {
        // Check if user is admin
        if (!this.user.isAdmin) {
            window.location.href = 'dashboard.html';
            return;
        }
        
        this.updateUI();
        this.loadData();
        this.setupEventListeners();
    }
    
    updateUI() {
        // Update admin info
        const adminNameElement = document.getElementById('adminName');
        const adminEmailElement = document.getElementById('adminEmail');
        
        if (adminNameElement) adminNameElement.textContent = this.user.fullName || 'Admin';
        if (adminEmailElement) adminEmailElement.textContent = this.user.email || '';
    }
    
    loadData() {
        this.loadUsers();
        this.loadStats();
        this.loadInvestments();
    }
    
    loadUsers() {
        // Get users from localStorage (in real app, this would be from Firebase)
        const users = JSON.parse(localStorage.getItem('brixa_users') || '[]');
        const demoUsers = [
            { fullName: 'Demo User', email: 'user@brixa.com', balance: 1250.50, joinDate: '2023-05-15', investments: 3, status: 'active' },
            { fullName: 'Sarah Johnson', email: 'sarah@example.com', balance: 3200.00, joinDate: '2023-06-20', investments: 2, status: 'active' },
            { fullName: 'Michael Chen', email: 'michael@example.com', balance: 850.75, joinDate: '2023-07-10', investments: 1, status: 'pending' },
            { fullName: 'Jessica Williams', email: 'jessica@example.com', balance: 5200.30, joinDate: '2023-04-05', investments: 4, status: 'active' }
        ];
        
        const allUsers = [...demoUsers, ...users];
        this.displayUsers(allUsers);
    }
    
    displayUsers(users) {
        const tableElement = document.getElementById('userTable');
        if (!tableElement) return;
        
        if (users.length === 0) {
            tableElement.innerHTML = `
                <tr>
                    <td colspan="7" style="padding: 30px; text-align: center; color: var(--gray-color);">
                        No users found.
                    </td>
                </tr>
            `;
            return;
        }
        
        let tableHTML = '';
        users.forEach(user => {
            tableHTML += `
                <tr>
                    <td>${user.fullName}</td>
                    <td>${user.email}</td>
                    <td>${user.joinDate || 'N/A'}</td>
                    <td>$${user.balance ? user.balance.toFixed(2) : '0.00'}</td>
                    <td>${user.investments ? user.investments.length : 0}</td>
                    <td><span class="status-${user.status || 'active'}">${user.status ? user.status.charAt(0).toUpperCase() + user.status.slice(1) : 'Active'}</span></td>
                    <td>
                        <div class="admin-actions">
                            <button class="admin-btn edit-btn" onclick="editUser('${user.email}')">Edit</button>
                            <button class="admin-btn telegram-btn" onclick="messageUser('${user.email}')">Message</button>
                        </div>
                    </td>
                </tr>
            `;
        });
        
        tableElement.innerHTML = tableHTML;
    }
    
    loadStats() {
        const users = JSON.parse(localStorage.getItem('brixa_users') || '[]');
        const demoUsers = [
            { fullName: 'Demo User', email: 'user@brixa.com', balance: 1250.50, joinDate: '2023-05-15' },
            { fullName: 'Sarah Johnson', email: 'sarah@example.com', balance: 3200.00, joinDate: '2023-06-20' },
            { fullName: 'Michael Chen', email: 'michael@example.com', balance: 850.75, joinDate: '2023-07-10' },
            { fullName: 'Jessica Williams', email: 'jessica@example.com', balance: 5200.30, joinDate: '2023-04-05' }
        ];
        
        const allUsers = [...demoUsers, ...users];
        
        // Update stats
        const totalUsersElement = document.getElementById('totalUsers');
        const totalInvestmentsElement = document.getElementById('totalInvestments');
        const activeInvestmentsElement = document.getElementById('activeInvestments');
        const todaySignupsElement = document.getElementById('todaySignups');
        
        if (totalUsersElement) totalUsersElement.textContent = allUsers.length;
        
        let totalInvestments = 0;
        let activeInvestments = 0;
        
        allUsers.forEach(user => {
            if (user.balance) totalInvestments += user.balance;
            if (user.investments) activeInvestments += user.investments.length;
        });
        
        if (totalInvestmentsElement) totalInvestmentsElement.textContent = `$${totalInvestments.toFixed(2)}`;
        if (activeInvestmentsElement) activeInvestmentsElement.textContent = activeInvestments;
        
        // Calculate today's signups
        const today = new Date().toISOString().split('T')[0];
        const todaySignups = allUsers.filter(user => user.joinDate === today).length;
        if (todaySignupsElement) todaySignupsElement.textContent = todaySignups;
    }
    
    loadInvestments() {
        // Sample investment data
        const investments = [
            { user: 'Demo User', plan: 'Growth Plan', amount: 500, startDate: '2023-05-20', endDate: '2024-05-20', returns: '+10.5%', status: 'active' },
            { user: 'Sarah Johnson', plan: 'Pro Plan', amount: 2000, startDate: '2023-06-25', endDate: '2025-06-25', returns: '+15.2%', status: 'active' },
            { user: 'Michael Chen', plan: 'Starter Plan', amount: 150, startDate: '2023-07-15', endDate: '2024-01-15', returns: '+6.8%', status: 'active' },
            { user: 'Jessica Williams', plan: 'Pro Plan', amount: 3500, startDate: '2023-04-10', endDate: '2025-04-10', returns: '+14.7%', status: 'active' },
            { user: 'Jessica Williams', plan: 'Growth Plan', amount: 1200, startDate: '2023-05-05', endDate: '2024-05-05', returns: '+9.3%', status: 'completed' }
        ];
        
        this.displayInvestments(investments);
    }
    
    displayInvestments(investments) {
        const tableElement = document.getElementById('investmentTable');
        if (!tableElement) return;
        
        if (investments.length === 0) {
            tableElement.innerHTML = `
                <tr>
                    <td colspan="7" style="padding: 30px; text-align: center; color: var(--gray-color);">
                        No investments found.
                    </td>
                </tr>
            `;
            return;
        }
        
        let tableHTML = '';
        investments.forEach(investment => {
            tableHTML += `
                <tr>
                    <td>${investment.user}</td>
                    <td>${investment.plan}</td>
                    <td>$${investment.amount.toFixed(2)}</td>
                    <td>${investment.startDate}</td>
                    <td>${investment.endDate}</td>
                    <td style="color: #28a745;">${investment.returns}</td>
                    <td><span class="status-${investment.status}">${investment.status.charAt(0).toUpperCase() + investment.status.slice(1)}</span></td>
                </tr>
            `;
        });
        
        tableElement.innerHTML = tableHTML;
    }
    
    setupEventListeners() {
        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                localStorage.removeItem('brixa_user');
                window.location.href = 'index.html';
            });
        }
        
        // Announcement form
        const sendAnnouncementBtn = document.querySelector('button[onclick="sendAnnouncement()"]');
        if (sendAnnouncementBtn) {
            sendAnnouncementBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.sendAnnouncement();
            });
        }
    }
    
    sendAnnouncement() {
        const title = document.getElementById('announcementTitle').value;
        const message = document.getElementById('announcementMessage').value;
        const sendTelegram = document.getElementById('sendTelegram').checked;
        
        if (!title || !message) {
            alert('Please fill in both title and message');
            return;
        }
        
        // Simulate sending announcement
        alert(`Announcement sent to all users:\n\nTitle: ${title}\nMessage: ${message}\n\nTelegram: ${sendTelegram ? 'Yes' : 'No'}`);
        
        if (sendTelegram) {
            console.log('Simulating Telegram announcement:', { title, message });
            // In a real implementation, this would call the Netlify Function
            // this.sendTelegramNotification(title, message);
        }
        
        // Clear form
        document.getElementById('announcementTitle').value = '';
        document.getElementById('announcementMessage').value = '';
    }
    
    sendTelegramNotification(title, message) {
        // This would be the actual fetch to the Netlify Function
        /*
        fetch('/.netlify/functions/telegram', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title,
                message,
                type: 'announcement'
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Telegram notification sent:', data);
        })
        .catch(error => {
            console.error('Error sending Telegram notification:', error);
        });
        */
    }
}

// Initialize admin panel when page loads
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('admin.html')) {
        new AdminPanel();
    }
});

// Global functions for inline onclick handlers
function editUser(email) {
    alert(`Edit user: ${email}\n\nIn a real application, this would open a user editing form.`);
}

function messageUser(email) {
    const message = prompt(`Send message to ${email}:`, 'Hello! We have an important update about your investments...');
    if (message) {
        alert(`Message sent to ${email}: "${message}"`);
        console.log(`Simulating Telegram notification to admin about message sent to ${email}`);
    }
}

function sendAnnouncement() {
    // This is handled by the AdminPanel class
    // The onclick handler in HTML will be overridden by the event listener
                          }
