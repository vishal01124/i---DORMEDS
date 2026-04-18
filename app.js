/* ================================================
   DORMEDS - Main App Entry
   ================================================ */
import { store } from './store.js';
import { router } from './router.js';

// Pages
import { renderLoginPage } from './pages/login.js';
import { renderDashboard } from './pages/dashboard.js';
import { renderOrders } from './pages/orders.js';
import { renderInventory } from './pages/inventory.js';
import { renderPharmacies } from './pages/pharmacies.js';
import { renderSettings } from './pages/settings.js';
import { renderSupport } from './pages/support.js';
import { renderReturns } from './pages/returns.js';
import { renderDocuments } from './pages/documents.js';
import { renderBilling } from './pages/billing.js';
import { renderSubscriptions } from './pages/subscriptions.js';

// Components
import { renderSidebar, toggleSidebar, toggleMobileSidebar } from './components/sidebar.js';
import { renderHeader, renderNotificationPanel } from './components/header.js';

// UI actions
import * as toast from './toast.js';

// Global window object to expose generic helpers if needed by inline handlers
window.DORMEDS = {
  renderPage: (path) => router.navigate(path),
  navigate: (path) => router.navigate(path),
  logout: () => {
    store.clear && store.clear('currentUser');
    store.set('currentUser', null);
    router.navigate('/login');
    toast.showToast('Logged out successfully', 'success');
  },
  toggleSidebar: () => toggleSidebar(),
  toggleMobileSidebar: () => toggleMobileSidebar(),
  toggleTheme: () => {
    const current = store.get('theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    store.set('theme', next);
    document.documentElement.setAttribute('data-theme', next);
    renderCurrentPage();
  },
  toggleNotifications: () => {
    let panel = document.getElementById('notification-panel');
    if (panel) {
      panel.remove();
    } else {
      const btn = document.getElementById('notif-btn');
      if (btn) {
        btn.insertAdjacentHTML('afterend', renderNotificationPanel());
        // Close on outside click
        setTimeout(() => {
          document.addEventListener('click', function closePanel(e) {
            const panel = document.getElementById('notification-panel');
            if (panel && !panel.contains(e.target) && e.target.id !== 'notif-btn' && !e.target.closest('#notif-btn')) {
              panel.remove();
              document.removeEventListener('click', closePanel);
            }
          });
        }, 0);
      }
    }
  },
  markNotifRead: (id) => {
    const notifications = store.get('notifications') || [];
    const notif = notifications.find(n => n.id === id);
    if (notif) {
      notif.read = true;
      store.set('notifications', notifications);
      renderCurrentPage();
    }
  },
  markAllRead: () => {
    const notifications = store.get('notifications') || [];
    notifications.forEach(n => n.read = true);
    store.set('notifications', notifications);
    renderCurrentPage();
    toast.showToast('All notifications marked as read', 'success');
  },
  exportReport: () => {
    toast.showToast('Report exported successfully', 'success');
  },
  renderCurrentPage: () => renderCurrentPage(),
};

/** Re-render the current page (used after data changes) */
function renderCurrentPage() {
  const path = router.current();
  if (path) {
    const handler = routeHandlers[path];
    if (handler) handler();
  }
}

// Route handler map
const routeHandlers = {
  '/login': () => mount(renderLoginPage, true),
  '/dashboard': () => mount(renderDashboard),
  '/orders': () => mount(renderOrders),
  '/inventory': () => mount(renderInventory),
  '/pharmacies': () => mount(renderPharmacies),
  '/settings': () => mount(renderSettings),
  '/support': () => mount(renderSupport),
  '/returns': () => mount(renderReturns),
  '/documents': () => mount(renderDocuments),
  '/billing': () => mount(renderBilling),
  '/subscriptions': () => mount(renderSubscriptions),
};

/** Initialize Application */
function init() {
  // Apply saved theme
  const theme = store.get('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', theme);

  // Re-export page handlers to window.DORMEDS for inline HTML event handlers
  import('./pages/orders.js').then(m => Object.assign(window.DORMEDS, m));
  import('./pages/inventory.js').then(m => Object.assign(window.DORMEDS, m));
  import('./pages/pharmacies.js').then(m => Object.assign(window.DORMEDS, m));
  import('./pages/support.js').then(m => Object.assign(window.DORMEDS, m));
  import('./pages/returns.js').then(m => Object.assign(window.DORMEDS, m));
  import('./pages/documents.js').then(m => Object.assign(window.DORMEDS, m));
  import('./pages/billing.js').then(m => Object.assign(window.DORMEDS, m));
  import('./pages/subscriptions.js').then(m => Object.assign(window.DORMEDS, m));
  import('./pages/login.js').then(m => Object.assign(window.DORMEDS, m));
  import('./pages/settings.js').then(m => Object.assign(window.DORMEDS, m));
  import('./pages/dashboard.js').then(m => Object.assign(window.DORMEDS, m));
  import('./components/header.js').then(m => Object.assign(window.DORMEDS, m));
  import('./components/sidebar.js').then(m => Object.assign(window.DORMEDS, m));

  // Configure Router
  router.beforeEach((path) => {
    const user = store.get('currentUser');
    if (!user && path !== '/login') {
      router.navigate('/login');
      return false;
    }
    if (user && path === '/login') {
      router.navigate('/dashboard');
      return false;
    }
  });

  // Register routes
  Object.entries(routeHandlers).forEach(([path, handler]) => {
    router.on(path, handler);
  });

  router.start();
}

/** Mount a page component */
function mount(renderFn, isAuthPage = false) {
  const root = document.getElementById('app-root');
  
  if (isAuthPage) {
    // Render without layout
    root.innerHTML = renderFn();
  } else {
    // Render with app layout
    root.innerHTML = `
      <div class="app-layout">
        ${renderSidebar(router.current())}
        <div class="app-main">
          ${renderHeader()}
          <div class="app-content slide-up">
            ${renderFn()}
          </div>
        </div>
      </div>
    `;
    
    // Setup header dropdowns after mount
    if (window.DORMEDS.setupHeaderListeners) {
      setTimeout(window.DORMEDS.setupHeaderListeners, 0);
    }

    // Animate counters on dashboard
    if (window.DORMEDS.initDashboardCounters) {
      setTimeout(window.DORMEDS.initDashboardCounters, 0);
    }
  }

  // Auto-scroll to top
  window.scrollTo(0, 0);
}

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', init);
