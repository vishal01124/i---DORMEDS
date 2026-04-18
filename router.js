/* ================================================
   DORMEDS - Hash-based Router
   ================================================ */

class Router {
  constructor() {
    this._routes = {};
    this._currentRoute = null;
    this._beforeEach = null;
    window.addEventListener('hashchange', () => this._handleRoute());
  }

  /** Register a route */
  on(path, handler) {
    this._routes[path] = handler;
    return this;
  }

  /** Set a guard that runs before each navigation */
  beforeEach(fn) {
    this._beforeEach = fn;
    return this;
  }

  /** Navigate to a hash route */
  navigate(path) {
    window.location.hash = path;
  }

  /** Get current route */
  current() {
    return this._currentRoute;
  }

  /** Start the router */
  start() {
    this._handleRoute();
  }

  /** Handle route change */
  _handleRoute() {
    const hash = window.location.hash.slice(1) || '/login';
    const path = hash.split('?')[0];
    const params = this._parseQuery(hash);

    // Before guard
    if (this._beforeEach) {
      const allowed = this._beforeEach(path, this._currentRoute);
      if (allowed === false) return;
    }

    this._currentRoute = path;

    // Find matching route
    const handler = this._routes[path];
    if (handler) {
      handler(params);
    } else {
      // 404 - redirect to dashboard or login
      const fallback = this._routes['/login'];
      if (fallback) fallback(params);
    }
  }

  /** Parse query string from hash */
  _parseQuery(hash) {
    const idx = hash.indexOf('?');
    if (idx === -1) return {};
    const queryStr = hash.slice(idx + 1);
    const params = {};
    queryStr.split('&').forEach(pair => {
      const [key, val] = pair.split('=');
      params[decodeURIComponent(key)] = decodeURIComponent(val || '');
    });
    return params;
  }
}

export const router = new Router();
