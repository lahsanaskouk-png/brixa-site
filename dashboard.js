// Dashboard specific functionality
class Dashboard {
    constructor() {
        this.user = JSON.parse(localStorage.getItem('brixa_user')) || {};
        this.investments = this.user.investments || [];
        this.init();
    }
    
    init() {
        this.updateUI();
        this.setupEventListeners();
    }
    
    updateUI() {
        // Update user info
        const userNameElement = document.getElementById('userName');
        const userEmailElement = document.getElementById('userEmail');
        const userAvatarElement = document.getElementById('userAvatar');
        
        if (userNameElement) userNameElement.textContent = this.user.fullName || 'User';
        if (userEmailElement) userEmailElement.textContent = this.user.email || '';
        if (userAvatarElement) userAvatarElement.textContent = this.user.fullName ? this.user.fullName.charAt(0).toUpperCase() : 'U';
        
        // Update stats
        this.updateStats();
        
        // Update investment table
        this.updateInvestmentTable();
    }
    
    updateStats() {
        const totalBalanceElement = document.getElementById('totalBalance');
        const totalReturnsElement = document.getElementById('totalReturns');
        const activeInvestmentsElement = document.getElementById('activeInvestments');
        
        if (totalBalanceElement) {
            const balance = this.user.balance || 0;
            totalBalanceElement.textContent = `$${balance.toFixed(2)}`;
        }
        
        if (totalReturnsElement) {
            let totalReturns = 0;
            if (this.investments.length > 0) {
                this.investments.forEach(inv => {
                    totalReturns += inv.return || 0;
                });
            }
            totalReturnsElement.textContent = `+${totalReturns.toFixed(2)}%`;
        }
        
        if (activeInvestmentsElement) {
            activeInvestmentsElement.textContent = this.investments.length;
        }
    }
    
    updateInvestmentTable() {
        const tableElement = document.getElementById('investmentTable');
        if (!tableElement) return;
        
        if (this.investments.length === 0) {
            tableElement.innerHTML = `
                <tr>
                    <td colspan="5" style="padding: 30px; text-align: center; color: var(--gray-color);">
                        No investments yet. Choose a plan above to get started.
                    </td>
                </tr>
            `;
            return;
        }
        
        let tableHTML = '';
        this.investments.forEach(investment => {
            tableHTML += `
                <tr>
                    <td style="padding: 15px;">${investment.name}</td>
                    <td style="padding: 15px;">$${investment.amount.toFixed(2)}</td>
                    <td style="padding: 15px;">${investment.startDate || 'N/A'}</td>
                    <td style="padding: 15px; color: #28a745; font-weight: 500;">+${investment.return ? investment.return.toFixed(2) : '0.00'}%</td>
                    <td style="padding: 15px;"><span style="color: #28a745;">Active</span></td>
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
    }
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('dashboard.html')) {
        // Check authentication
        const user = JSON.parse(localStorage.getItem('brixa_user'));
        if (!user) {
            window.location.href = 'login.html';
            return;
        }
        
        // Initialize dashboard
        new Dashboard();
    }
});
