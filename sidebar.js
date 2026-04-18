/* ================================================
   DORMEDS - Sidebar Component
   ================================================ */
import { store } from '../store.js';
import { router } from '../router.js';

/** Admin navigation items */
const ADMIN_NAV = [
  { section: 'Overview', items: [
    { id: 'dashboard', icon: 'dashboard', label: 'Dashboard', route: '/dashboard' },
    { id: 'analytics', icon: 'analytics', label: 'Analytics', route: '/analytics' },
  ]},
  { section: 'Management', items: [
    { id: 'pharmacies', icon: 'storefront', label: 'Pharmacies', route: '/pharmacies' },
    { id: 'orders', icon: 'shopping_bag', label: 'All Orders', route: '/orders' },
    { id: 'documents', icon: 'description', label: 'Documents', route: '/documents' },
  ]},
  { section: 'Finance', items: [
    { id: 'subscriptions', icon: 'card_membership', label: 'Subscriptions', route: '/subscriptions' },
    { id: 'billing', icon: 'receipt_long', label: 'Billing', route: '/billing' },
    { id: 'returns', icon: 'assignment_return', label: 'Returns', route: '/returns' },
  ]},
  { section: 'Support', items: [
    { id: 'support', icon: 'support_agent', label: 'Support', route: '/support', badge: '3' },
    { id: 'settings', icon: 'settings', label: 'Settings', route: '/settings' },
  ]},
];

/** Pharmacy navigation items */
const PHARMACY_NAV = [
  { section: 'Overview', items: [
    { id: 'dashboard', icon: 'dashboard', label: 'Dashboard', route: '/dashboard' },
  ]},
  { section: 'Operations', items: [
    { id: 'inventory', icon: 'inventory_2', label: 'Inventory', route: '/inventory' },
    { id: 'orders', icon: 'shopping_bag', label: 'Orders', route: '/orders', badge: '2' },
    { id: 'documents', icon: 'description', label: 'Documents', route: '/documents' },
  ]},
  { section: 'Finance', items: [
    { id: 'billing', icon: 'receipt_long', label: 'Billing', route: '/billing' },
    { id: 'subscriptions', icon: 'card_membership', label: 'Subscription', route: '/subscriptions' },
    { id: 'returns', icon: 'assignment_return', label: 'Returns', route: '/returns' },
  ]},
  { section: 'Help', items: [
    { id: 'support', icon: 'support_agent', label: 'Support', route: '/support' },
    { id: 'settings', icon: 'settings', label: 'Settings', route: '/settings' },
  ]},
];

/** Render the sidebar */
export function renderSidebar() {
  const user = store.get('currentUser');
  if (!user) return '';

  const isAdmin = user.role === 'admin';
  const navSections = isAdmin ? ADMIN_NAV : PHARMACY_NAV;
  const collapsed = store.get('sidebarCollapsed');
  const currentRoute = router.current() || '/dashboard';

  let navHTML = '';
  navSections.forEach(section => {
    navHTML += `<div class="nav-section">
      <div class="nav-section-title">${section.section}</div>`;
    section.items.forEach(item => {
      const isActive = currentRoute === item.route;
      navHTML += `
        <div class="nav-item ${isActive ? 'active' : ''}" data-route="${item.route}" onclick="window.DORMEDS.navigate('${item.route}')">
          <span class="material-icons-round">${item.icon}</span>
          <span class="nav-label">${item.label}</span>
          ${item.badge ? `<span class="badge">${item.badge}</span>` : ''}
        </div>`;
    });
    navHTML += '</div>';
  });

  return `
    <aside class="sidebar ${collapsed ? 'collapsed' : ''}" id="sidebar">
      <div class="sidebar-header">
        <div class="logo-mark">
          <span class="material-icons-round">local_pharmacy</span>
        </div>
        <div class="logo-text">
          <h2>DORMEDS</h2>
          <span>${isAdmin ? 'Admin Portal' : 'Pharmacy Portal'}</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        ${navHTML}
      </nav>

      <div class="sidebar-footer">
        <div class="user-info" onclick="window.DORMEDS.navigate('/settings')">
          <div class="user-avatar">${user.avatar || user.name.charAt(0)}</div>
          <div class="user-details">
            <div class="user-name">${user.name}</div>
            <div class="user-role">${isAdmin ? 'Administrator' : 'Pharmacy'}</div>
          </div>
        </div>
      </div>
    </aside>
  `;
}

/** Toggle sidebar collapse */
export function toggleSidebar() {
  const collapsed = !store.get('sidebarCollapsed');
  store.set('sidebarCollapsed', collapsed);

  const sidebar = document.getElementById('sidebar');
  const mainWrapper = document.querySelector('.main-wrapper');
  const header = document.querySelector('.header');

  if (sidebar) sidebar.classList.toggle('collapsed', collapsed);
  if (mainWrapper) mainWrapper.classList.toggle('sidebar-collapsed', collapsed);
  if (header) header.classList.toggle('sidebar-collapsed', collapsed);
}

/** Toggle mobile sidebar */
export function toggleMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('mobile-overlay');

  if (sidebar) {
    sidebar.classList.toggle('mobile-open');
    if (overlay) {
      overlay.classList.toggle('hidden');
    }
  }
}
