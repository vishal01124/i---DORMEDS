/* ================================================
   DORMEDS - Header Component
   ================================================ */
import { store } from '../store.js';
import { timeAgo } from '../utils.js';

/** Render the header bar */
export function renderHeader(pageTitle = 'Dashboard') {
  const collapsed = store.get('sidebarCollapsed');
  const theme = store.get('theme');
  const notifications = store.get('notifications') || [];
  const unreadCount = notifications.filter(n => !n.read).length;

  return `
    <header class="header ${collapsed ? 'sidebar-collapsed' : ''}" id="main-header">
      <div class="header-left">
        <button class="header-btn" onclick="window.DORMEDS.toggleSidebar()" title="Toggle sidebar">
          <span class="material-icons-round">menu</span>
        </button>
        <div>
          <h1 class="page-title">${pageTitle}</h1>
        </div>
      </div>

      <div class="header-right">
        <div class="header-search">
          <span class="material-icons-round">search</span>
          <input type="text" placeholder="Search anything..." id="global-search" />
        </div>

        <button class="header-btn" onclick="window.DORMEDS.toggleTheme()" title="Toggle theme">
          <span class="material-icons-round">${theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
        </button>

        <button class="header-btn" onclick="window.DORMEDS.toggleNotifications()" title="Notifications" id="notif-btn" style="position:relative">
          <span class="material-icons-round">notifications</span>
          ${unreadCount > 0 ? '<span class="notification-dot"></span>' : ''}
        </button>

        <button class="header-btn" onclick="window.DORMEDS.logout()" title="Logout">
          <span class="material-icons-round">logout</span>
        </button>
      </div>
    </header>

    <div id="mobile-overlay" class="mobile-overlay hidden" onclick="window.DORMEDS.toggleMobileSidebar()"></div>
  `;
}

/** Render notification panel */
export function renderNotificationPanel() {
  const notifications = store.get('notifications') || [];
  const ICON_MAP = {
    warning: { icon: 'warning', bg: 'rgba(253,203,110,0.15)', color: '#FDCB6E' },
    error: { icon: 'error', bg: 'rgba(255,107,107,0.15)', color: '#FF6B6B' },
    info: { icon: 'info', bg: 'rgba(116,185,255,0.15)', color: '#74B9FF' },
    success: { icon: 'check_circle', bg: 'rgba(0,184,148,0.15)', color: '#00B894' },
  };

  const items = notifications.slice(0, 8).map(n => {
    const t = ICON_MAP[n.type] || ICON_MAP.info;
    return `
      <div class="notif-item ${n.read ? '' : 'unread'}" onclick="window.DORMEDS.markNotifRead('${n.id}')">
        <div class="notif-icon" style="background:${t.bg};color:${t.color}">
          <span class="material-icons-round">${t.icon}</span>
        </div>
        <div class="notif-content">
          <h4>${n.title}</h4>
          <p>${n.message}</p>
          <div class="notif-time">${timeAgo(n.createdAt)}</div>
        </div>
      </div>`;
  }).join('');

  return `
    <div class="notification-panel" id="notification-panel">
      <div class="notif-header">
        <h3>Notifications</h3>
        <button class="btn btn-ghost btn-sm" onclick="window.DORMEDS.markAllRead()">Mark all read</button>
      </div>
      <div class="notif-list">
        ${items || '<div style="padding:2rem;text-align:center;color:var(--text-tertiary)">No notifications</div>'}
      </div>
    </div>
  `;
}
