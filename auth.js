// Firebase configuration (would normally come from environment variables)
// In a real app, these would be set via Netlify environment variables
const firebaseConfig = {
    apiKey: "AIzaSyBmOOERF0KkDQ7G08L7_F7TuM7SItkoO_o",
    authDomain: "brtiol.firebaseapp.com",
    projectId: "brtiol",
    storageBucket: "brtiol.firebasestorage.app",
    messagingSenderId: "711908351848",
    appId: "1:711908351848:web:a6c1ac4836988c4a7340dd"
};

// Check if user is authenticated (simplified version for demo)
function checkAuth() {
    const user = JSON.parse(localStorage.getItem('brixa_user'));
    if (!user) {
        // Redirect to login if not authenticated
        if (window.location.pathname.includes('dashboard.html') || 
            window.location.pathname.includes('admin.html')) {
            window.location.href = 'login.html';
        }
        return null;
    }
    return user;
}

// Check if user is admin
function checkAdmin() {
    const user = checkAuth();
    if (user && user.isAdmin) {
        return true;
    }
    return false;
}

// Initialize authentication state
document.addEventListener('DOMContentLoaded', function() {
    const user = JSON.parse(localStorage.getItem('brixa_user'));
    
    // Update UI based on authentication state
    if (user) {
        // Update navigation for logged in users
        const loginLinks = document.querySelectorAll('a[href="login.html"]');
        const registerLinks = document.querySelectorAll('a[href="register.html"]');
        
        loginLinks.forEach(link => {
            link.textContent = 'Dashboard';
            link.href = user.isAdmin ? 'admin.html' : 'dashboard.html';
        });
        
        registerLinks.forEach(link => {
            link.textContent = 'Dashboard';
            link.href = user.isAdmin ? 'admin.html' : 'dashboard.html';
        });
    }
});
