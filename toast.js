/* ================================================
   DORMEDS - Toast Notification System
   ================================================ */

const ICONS = {
  success: 'check_circle',
  error: 'error',
  warning: 'warning',
  info: 'info'
};

const TITLES = {
  success: 'Success',
  error: 'Error',
  warning: 'Warning',
  info: 'Info'
};

/**
 * Show a toast notification
 * @param {string} message - The message to display
 * @param {string} type - 'success' | 'error' | 'warning' | 'info'
 * @param {number} duration - Auto-dismiss time in ms (default 4000)
 */
export function showToast(message, type = 'info', duration = 4000) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="material-icons-round toast-icon">${ICONS[type]}</span>
    <div class="toast-content">
      <div class="toast-title">${TITLES[type]}</div>
      <div class="toast-message">${message}</div>
    </div>
    <span class="material-icons-round toast-close" onclick="this.closest('.toast').remove()">close</span>
  `;

  container.appendChild(toast);

  // Auto dismiss
  if (duration > 0) {
    setTimeout(() => {
      toast.classList.add('removing');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
}
