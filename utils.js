/* ================================================
   DORMEDS - Utility Functions
   ================================================ */

/** Format currency in INR */
export function formatCurrency(amount) {
  return '₹' + Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

/** Format date to readable string */
export function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

/** Format datetime */
export function formatDateTime(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' +
    d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

/** Format relative time */
export function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return Math.floor(seconds / 60) + 'm ago';
  if (seconds < 86400) return Math.floor(seconds / 3600) + 'h ago';
  if (seconds < 604800) return Math.floor(seconds / 86400) + 'd ago';
  return formatDate(dateStr);
}

/** Check if a date is expiring soon (within 90 days) */
export function isExpiringSoon(dateStr) {
  const expiry = new Date(dateStr);
  const now = new Date();
  const diff = (expiry - now) / (1000 * 60 * 60 * 24);
  if (diff < 0) return 'expired';
  if (diff <= 30) return 'critical';
  if (diff <= 90) return 'warning';
  return 'ok';
}

/** Generate a pseudo barcode SVG */
export function generateBarcode(code) {
  const bars = [];
  for (let i = 0; i < code.length; i++) {
    const charCode = code.charCodeAt(i);
    bars.push(charCode % 2 === 0 ? 2 : 1);
    bars.push(charCode % 3 === 0 ? 3 : 1);
  }
  let html = '<div class="barcode-display">';
  bars.forEach(w => {
    html += `<div class="bar" style="width:${w}px"></div><div style="width:1px"></div>`;
  });
  html += '</div>';
  html += `<div style="text-align:center;font-size:12px;font-family:monospace;color:var(--text-secondary)">${code}</div>`;
  return html;
}

/** Debounce function */
export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/** Simple animated counter for stat cards */
export function animateCounter(element, target, duration = 800) {
  const start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic
    const current = Math.round(start + (target - start) * eased);
    element.textContent = current.toLocaleString('en-IN');
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

/** Create SVG donut chart */
export function createDonutChart(data, size = 180) {
  // data: [{ label, value, color }]
  const total = data.reduce((s, d) => s + d.value, 0);
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  let circles = '';
  data.forEach(d => {
    const pct = d.value / total;
    const dashArray = pct * circumference;
    const dashOffset = -offset * circumference;
    circles += `<circle cx="90" cy="90" r="${radius}" fill="none" stroke="${d.color}" stroke-width="20"
      stroke-dasharray="${dashArray} ${circumference - dashArray}" stroke-dashoffset="${dashOffset}"
      style="transition: stroke-dasharray 0.6s ease" />`;
    offset += pct;
  });

  const legend = data.map(d => `
    <div class="donut-legend-item">
      <div class="dot" style="background:${d.color}"></div>
      ${d.label}: ${d.value}
    </div>
  `).join('');

  return `
    <div class="donut-chart" style="width:${size}px;height:${size}px">
      <svg viewBox="0 0 180 180">${circles}</svg>
      <div class="donut-center">
        <h3>${total}</h3>
        <p>Total</p>
      </div>
    </div>
    <div class="donut-legend">${legend}</div>
  `;
}

/** Create bar chart */
export function createBarChart(values, labels, colors) {
  const max = Math.max(...values);
  return values.map((v, i) => {
    const height = (v / max) * 230;
    const color = Array.isArray(colors) ? colors[i % colors.length] : colors;
    return `<div class="chart-bar" style="height:${height}px;background:${color}">
      <div class="chart-tooltip">${labels[i]}: ${formatCurrency(v)}</div>
    </div>`;
  }).join('');
}
