// admin/utils/admin.js

document.addEventListener("DOMContentLoaded", async () => {
    // Basic auth check logic based on localStorage (replace with real auth as needed)
    const token = localStorage.getItem('admin_token');
    const isLoginPage = window.location.pathname.endsWith('/index.html') || window.location.pathname.endsWith('/') || window.location.pathname.includes('/login');

    const pathPrefix = isLoginPage ? '' : '../';

    // Add Global CSS dynamically if not present
    if (!document.querySelector('link[href*="sidebar.css"]')) {
        const styleLink = document.createElement('link');
        styleLink.rel = 'stylesheet';
        styleLink.href = pathPrefix + 'layouts/sidebar.css';
        document.head.appendChild(styleLink);
    }

    // Font Awesome for icons
    if (!document.querySelector('link[href*="font-awesome"]')) {
        const faLink = document.createElement('link');
        faLink.rel = 'stylesheet';
        faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
        document.head.appendChild(faLink);
    }

    if (!isLoginPage) {
        if (!token) {
            window.location.href = pathPrefix + 'index.html';
            return;
        }
        await initLayout(pathPrefix);
    } else {
        if (token) {
            // Already logged in
            window.location.href = pathPrefix + 'pages/dashboard.html';
        }
    }
});

async function initLayout(pathPrefix) {
    const root = document.getElementById('admin-root');
    if (!root) return;

    // Fetch sidebar HTML
    let sidebarHtml = '';
    try {
        const res = await fetch(pathPrefix + 'layouts/sidebar.html');
        if (res.ok) {
            sidebarHtml = await res.text();
        } else {
            // Fallback for local file protocol or fetching issues
            sidebarHtml = '<p>Sidebar load failed.</p>';
        }
    } catch (e) {
        console.error("Failed to load sidebar", e);
    }

    // Wrap the existing body children safely inside the admin layout
    const originalContent = root.innerHTML;

    root.innerHTML = `
        <div class="admin-page-layout">
            <aside class="admin-sidebar" id="admin-sidebar">
                ${sidebarHtml}
            </aside>
            <main class="admin-main-content">
                <header class="admin-topbar">
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <button id="mobile-menu-btn" style="background:none;border:none;font-size:1.5rem;cursor:pointer;display:none;"><i class="fas fa-bars"></i></button>
                        <h2 class="topbar-title" id="admin-page-title">Dashboard</h2>
                    </div>
                    <div class="topbar-actions">
                        <div class="notification-icon"><i class="fas fa-bell"></i></div>
                        <div class="profile-icon"><i class="fas fa-user-circle"></i></div>
                    </div>
                </header>
                <div class="admin-workspace">
                    ${originalContent}
                </div>
            </main>
            <div id="sidebar-overlay" style="display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:90;"></div>
        </div>
    `;

    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const sidebar = document.getElementById('admin-sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    if (window.innerWidth <= 768) {
        mobileMenuBtn.style.display = 'block';
    }

    window.addEventListener('resize', () => {
        if (window.innerWidth <= 768) {
            mobileMenuBtn.style.display = 'block';
        } else {
            mobileMenuBtn.style.display = 'none';
            sidebar.classList.remove('show');
            overlay.style.display = 'none';
        }
    });

    mobileMenuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('show');
        overlay.style.display = sidebar.classList.contains('show') ? 'block' : 'none';
    });

    overlay.addEventListener('click', () => {
        sidebar.classList.remove('show');
        overlay.style.display = 'none';
    });

    // Dispatch event to let page-specific scripts know they can now safely interact with the DOM
    document.dispatchEvent(new CustomEvent('adminLayoutReady'));

    // Active link highlighting & Page Title
    const links = document.querySelectorAll('.sidebar-link');
    links.forEach(link => {
        const url = new URL(link.href, window.location.origin).pathname;
        if (window.location.pathname.includes(url) || window.location.pathname === url) {
            link.classList.add('active');
            let text = link.querySelector('span') ? link.querySelector('span').innerText : link.innerText;
            document.getElementById('admin-page-title').innerText = text.trim();
        }
    });

    // Logout handling
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('admin_token');
            window.location.href = pathPrefix + 'index.html';
        });
    }
}
