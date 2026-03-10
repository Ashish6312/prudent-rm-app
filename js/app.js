// ═════════════════════════════════════════════════════
// PRUDENT MF – RM APP  |  Main Application Logic
// ═════════════════════════════════════════════════════

let currentUser = null;
let currentScreen = 'login';
let currentCPId = null;
let currentReportId = null;
let activeFilter = 'All';
let activeDateRange = 'This Month';
let taskFilter = 'Pending';
let prefilledCP = null;

// Session management constants
const SESSION_STORAGE_KEY = 'prudent_rm_session';
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes for website
let sessionTimer = null;

// ── DOM Ready ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initSessionManagement();
  registerSW();
  initPWAFeatures();
});

// ══════════════════════════════════════════
// SESSION MANAGEMENT
// ══════════════════════════════════════════
function initSessionManagement() {
  // Check if user has existing session
  const savedSession = getSavedSession();
  
  if (savedSession && isSessionValid(savedSession)) {
    // Restore user session
    currentUser = savedSession.user;
    buildApp();
    navigateScreen('dashboard');
    updateNav('dashboard');
    showToast(`👋 Welcome back, ${currentUser.name.split(' ')[0]}!`);
    
    // Setup session management based on app type
    if (isInstalledPWA()) {
      // PWA: Keep session indefinitely until manual logout
      setupPWASession();
    } else {
      // Website: Auto-logout on page leave/close
      setupWebsiteSession();
    }
  } else {
    // No valid session, show login
    clearSession();
    renderLogin();
  }
}

function getSavedSession() {
  try {
    const sessionData = localStorage.getItem(SESSION_STORAGE_KEY);
    return sessionData ? JSON.parse(sessionData) : null;
  } catch (e) {
    return null;
  }
}

function saveSession(user) {
  const sessionData = {
    user: user,
    timestamp: Date.now(),
    isPWA: isInstalledPWA()
  };
  
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
  } catch (e) {
    console.warn('Could not save session:', e);
  }
}

function isSessionValid(sessionData) {
  if (!sessionData || !sessionData.user || !sessionData.timestamp) {
    return false;
  }
  
  // For PWA, session never expires (until manual logout)
  if (isInstalledPWA()) {
    // Always valid for PWA, regardless of what was saved
    return true;
  }
  
  // For website, check if session is within timeout period
  const now = Date.now();
  const sessionAge = now - sessionData.timestamp;
  const isValid = sessionAge < SESSION_TIMEOUT;
  
  console.log('Session validation:', {
    isPWA: isInstalledPWA(),
    sessionAge: Math.round(sessionAge / 1000 / 60) + ' minutes',
    timeout: Math.round(SESSION_TIMEOUT / 1000 / 60) + ' minutes',
    valid: isValid
  });
  
  return isValid;
}

function clearSession() {
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch (e) {
    console.warn('Could not clear session:', e);
  }
  
  if (sessionTimer) {
    clearTimeout(sessionTimer);
    sessionTimer = null;
  }
}

function setupPWASession() {
  // PWA: Update session timestamp periodically to keep it fresh
  // But don't auto-logout - only manual logout
  setInterval(() => {
    if (currentUser) {
      saveSession(currentUser);
    }
  }, 5 * 60 * 1000); // Update every 5 minutes
  
  console.log('PWA Session: Persistent login enabled');
}

function setupWebsiteSession() {
  // Website: Auto-logout on page leave/close and inactivity
  
  // Auto-logout on page unload (close/refresh/navigate away)
  window.addEventListener('beforeunload', () => {
    if (currentUser) {
      clearSession();
    }
  });
  
  // Auto-logout on page visibility change (tab switch/minimize)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && currentUser) {
      // Start logout timer when page becomes hidden
      sessionTimer = setTimeout(() => {
        if (currentUser) {
          autoLogout('Session expired due to inactivity');
        }
      }, 10 * 60 * 1000); // 10 minutes after hiding
    } else if (!document.hidden && sessionTimer) {
      // Cancel logout timer when page becomes visible again
      clearTimeout(sessionTimer);
      sessionTimer = null;
      
      // Refresh session timestamp
      if (currentUser) {
        saveSession(currentUser);
      }
    }
  });
  
  // Auto-logout on inactivity
  let inactivityTimer = null;
  const resetInactivityTimer = () => {
    if (inactivityTimer) clearTimeout(inactivityTimer);
    
    if (currentUser && !isInstalledPWA()) {
      inactivityTimer = setTimeout(() => {
        autoLogout('Session expired due to inactivity');
      }, SESSION_TIMEOUT);
    }
  };
  
  // Reset timer on user activity
  ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'].forEach(event => {
    document.addEventListener(event, resetInactivityTimer, true);
  });
  
  // Start inactivity timer
  resetInactivityTimer();
  
  console.log('Website Session: Auto-logout enabled');
}

function autoLogout(reason) {
  if (currentUser) {
    currentUser = null;
    clearSession();
    navigateScreen('login');
    showToast(`🔒 ${reason}`);
  }
}

function registerSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then(registration => {
        console.log('SW registered:', registration);
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              showToast('🔄 App updated! Refresh to see changes');
            }
          });
        });
      })
      .catch(error => console.log('SW registration failed:', error));
  }
}

function initPWAFeatures() {
  // Initialize download button visibility
  initPWADownloadButton();
  
  // Handle app shortcuts
  const urlParams = new URLSearchParams(window.location.search);
  const shortcut = urlParams.get('shortcut');
  
  if (shortcut && currentUser) {
    setTimeout(() => {
      navTo(shortcut);
    }, 1000);
  }
  
  // Handle online/offline status
  window.addEventListener('online', () => {
    showToast('🌐 Back online!');
  });
  
  window.addEventListener('offline', () => {
    showToast('📴 You\'re offline - app will continue to work');
  });
  
  // Request notification permission (only if not installed)
  if ('Notification' in window && Notification.permission === 'default' && !isInstalledPWA()) {
    setTimeout(() => {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          showToast('🔔 Notifications enabled');
        }
      });
    }, 5000);
  }
}

// ══════════════════════════════════════════
// SCREEN NAVIGATION (show/hide)
// ══════════════════════════════════════════
function navigateScreen(id) {
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.remove('active');
    s.style.opacity = '0';
    s.style.pointerEvents = 'none';
    s.style.transform = 'translateX(40px)';
  });

  const target = document.getElementById(`screen-${id}`);
  if (target) {
    target.style.opacity = '1';
    target.style.pointerEvents = 'all';
    target.style.transform = 'translateX(0)';
    target.classList.add('active');
  }

  currentScreen = id;
  updateNav(id);

  const notifBadge = document.getElementById('notifBadge');
  if (notifBadge && id !== 'login') {
    const unread = APP_DATA.notifications.filter(n => !n.read).length;
    notifBadge.style.display = unread > 0 ? 'block' : 'none';
  }
}

function navTo(id) {
  // re-render tasks screen on navigate to ensure fresh data
  if (id === 'tasks' && currentUser) renderTasks(taskFilter);
  navigateScreen(id);
}

function updateNav(screen) {
  document.querySelectorAll('.nav-item').forEach(n => {
    n.classList.toggle('active', n.dataset.screen === screen);
  });
}

// ══════════════════════════════════════════
// LOGIN
// ══════════════════════════════════════════
function renderLogin() {
  navigateScreen('login');
  
  // Add session type indicator to login form
  setTimeout(() => {
    const loginForm = document.querySelector('.login-form');
    if (loginForm && !loginForm.querySelector('.session-indicator')) {
      const sessionType = isInstalledPWA() ? 'App Mode: Stay logged in' : 'Website Mode: Auto-logout on close';
      const sessionIcon = isInstalledPWA() ? '📱' : '🌐';
      const sessionColor = isInstalledPWA() ? 'var(--green)' : 'var(--gold)';
      
      const indicator = document.createElement('div');
      indicator.className = 'session-indicator';
      indicator.innerHTML = `
        <div style="display:flex;align-items:center;gap:8px;padding:8px 12px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:8px;margin-bottom:16px;font-size:12px;color:${sessionColor}">
          <span>${sessionIcon}</span>
          <span>${sessionType}</span>
        </div>
      `;
      
      loginForm.insertBefore(indicator, loginForm.querySelector('.form-group'));
    }
  }, 100);
}

function doLogin() {
  const empId = document.getElementById('empId').value.trim();
  const password = document.getElementById('password').value.trim();
  const role = document.getElementById('roleSelect').value;

  const user = APP_DATA.users.find(u =>
    u.empId === empId && u.password === password && u.role === role
  );

  if (!user) {
    showToast('❌ Invalid credentials. Try PMF1042 / 1234');
    return;
  }

  currentUser = user;
  
  // Save session based on app type
  saveSession(user);
  
  // Setup session management
  if (isInstalledPWA()) {
    setupPWASession();
  } else {
    setupWebsiteSession();
  }
  
  buildApp();
  navigateScreen('dashboard');
  updateNav('dashboard');
  
  const appType = isInstalledPWA() ? 'app' : 'website';
  showToast(`👋 Welcome, ${user.name.split(' ')[0]}! (${appType})`);
}

// ══════════════════════════════════════════
// BUILD APP SHELL (after login)
// ══════════════════════════════════════════
function buildApp() {
  renderDashboard();
  renderCPList();
  renderReports();
  renderHierarchy();
  renderCallLog();
  renderNotifications();
  renderProfile();
  renderAbout();
  renderTasks('Pending');
}

// ══════════════════════════════════════════
// DASHBOARD
// ══════════════════════════════════════════
function renderDashboard() {
  const u = currentUser;
  const cps = APP_DATA.channelPartners.filter(cp => cp.assignedRM === u.id || u.role !== 'RM');
  const totalAUM = cps.reduce((s, cp) => s + cp.aum.current, 0);
  const totalSIPs = cps.reduce((s, cp) => s + cp.sips.active, 0);
  const pendingTasks = APP_DATA.tasks.filter(t => t.status === 'Pending').length;

  const el = document.getElementById('screen-dashboard');
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' });

  el.innerHTML = `
    ${renderHeader()}
    <div class="screen-content">
      <div class="greeting-bar">
        <div class="greeting-text">Good ${getGreeting()}, ${u.name.split(' ')[0]}! 👋</div>
        <div class="greeting-sub">${today}</div>
      </div>

      <!-- Location / Territory Banner -->
      <div class="location-banner">
        <div class="location-icon">📍</div>
        <div class="location-details">
          <div class="location-title">Your Territory</div>
          <div class="location-row">
            <span class="loc-chip">Zone: ${u.zone}</span>
            <span class="loc-chip">Region: ${u.region}</span>
          </div>
          <div class="location-row">
            <span class="loc-chip">Cluster: ${u.cluster}</span>
            <span class="loc-chip">Area: ${u.area}</span>
          </div>
        </div>
        <div class="cp-count-badge">
          <div class="cp-count-num">${u.totalCPs}</div>
          <div class="cp-count-lbl">CPs Assigned</div>
        </div>
      </div>

      <!-- KPI Cards -->
      <div class="kpi-grid">
        <div class="kpi-card kpi-1" onclick="navTo('partners')">
          <div class="kpi-icon">💼</div>
          <div class="kpi-value">₹${totalAUM.toFixed(1)} Cr</div>
          <div class="kpi-label">Total AUM</div>
          <div class="kpi-change">↑ 11.0% MoM</div>
        </div>
        <div class="kpi-card kpi-2" onclick="navTo('partners')">
          <div class="kpi-icon">🔄</div>
          <div class="kpi-value">${totalSIPs}</div>
          <div class="kpi-label">Active SIPs</div>
          <div class="kpi-change">↑ 3.1% MoM</div>
        </div>
        <div class="kpi-card kpi-3" onclick="navTo('reports')">
          <div class="kpi-icon">📄</div>
          <div class="kpi-value">43</div>
          <div class="kpi-label">New Folios MTD</div>
          <div class="kpi-change">↑ 13.2%</div>
        </div>
        <div class="kpi-card kpi-4" onclick="navTo('tasks')">
          <div class="kpi-icon">✅</div>
          <div class="kpi-value">${pendingTasks}</div>
          <div class="kpi-label">Pending Tasks</div>
          <div class="kpi-change">Due Today: 2</div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="section-header">
        <div class="section-title">Quick Actions</div>
      </div>
      <div class="quick-actions">
        <div class="quick-action-btn" onclick="openCallModal()">
          <span class="qa-icon">📞</span><span class="qa-label">Log Call</span>
        </div>
        <div class="quick-action-btn" onclick="navTo('partners')">
          <span class="qa-icon">🤝</span><span class="qa-label">Partners</span>
        </div>
        <div class="quick-action-btn" onclick="navTo('tasks')">
          <span class="qa-icon">✅</span><span class="qa-label">My Tasks</span>
        </div>
        <div class="quick-action-btn" onclick="navTo('reports')">
          <span class="qa-icon">📊</span><span class="qa-label">Reports</span>
        </div>
        <div class="quick-action-btn" onclick="navTo('hierarchy')">
          <span class="qa-icon">🏢</span><span class="qa-label">Hierarchy</span>
        </div>
        <div class="quick-action-btn" onclick="navTo('notifications')">
          <span class="qa-icon">🔔</span><span class="qa-label">Alerts</span>
        </div>
      </div>

      <!-- Today's Schedule -->
      <div class="section-header">
        <div class="section-title">📅 Today's Call Schedule</div>
        <div class="section-link" onclick="navTo('calllog')">View All</div>
      </div>
      <div class="schedule-list">
        ${APP_DATA.todayCalls.map(c => `
          <div class="schedule-item" onclick="openCP('${c.cpId}')">
            <div class="schedule-time">${c.time}</div>
            <div class="schedule-info">
              <div class="schedule-cp">${c.cp}</div>
              <div class="schedule-person">Contact: ${c.contactPerson}</div>
            </div>
            <div class="schedule-purpose">${c.purpose}</div>
          </div>
        `).join('')}
      </div>
      <div style="height:20px"></div>
    </div>
    ${renderBottomNav()}
  `;
}

// ══════════════════════════════════════════
// CHANNEL PARTNER LIST
// ══════════════════════════════════════════
function renderCPList(filter = 'All', search = '') {
  let cps = APP_DATA.channelPartners;

  if (currentUser && currentUser.role === 'RM') {
    cps = cps.filter(cp => cp.assignedRM === currentUser.id);
  }

  if (filter !== 'All') cps = cps.filter(cp => cp.status === filter);

  if (search) {
    const q = search.toLowerCase();
    cps = cps.filter(cp =>
      cp.name.toLowerCase().includes(q) ||
      cp.arn.toLowerCase().includes(q) ||
      cp.contactPerson.toLowerCase().includes(q) ||
      cp.city.toLowerCase().includes(q)
    );
  }

  const el = document.getElementById('screen-partners');
  el.innerHTML = `
    ${renderHeader('Channel Partners')}
    <div class="screen-content">
      <div class="search-wrap">
        <span class="search-icon">🔍</span>
        <input class="search-input" type="text" placeholder="Search by name, ARN, city…"
          id="cpSearch" oninput="renderCPList('${filter}', this.value)"
          value="${search}">
      </div>
      <div class="filter-chips">
        ${['All', 'Active', 'Moderate', 'Inactive'].map(f => `
          <div class="chip ${filter === f ? 'active' : ''}"
            onclick="renderCPList('${f}', document.getElementById('cpSearch')?.value || '')">${f}
          </div>
        `).join('')}
      </div>
      <div class="cp-list">
        ${cps.length === 0 ? '<div class="empty-state">No channel partners found</div>' :
      cps.map(cp => `
            <div class="cp-card" onclick="openCP('${cp.id}')">
              <div class="cp-card-header">
                <div>
                  <div class="cp-card-name">${cp.name}</div>
                  <div class="cp-card-arn">${cp.arn} • ${cp.city}</div>
                </div>
                <div class="status-badge status-${cp.status}">${cp.status}</div>
              </div>
              <div class="cp-metrics">
                <div class="cp-metric">
                  <div class="cp-metric-value">₹${cp.aum.current}Cr</div>
                  <div class="cp-metric-label">AUM</div>
                </div>
                <div class="cp-metric">
                  <div class="cp-metric-value">${cp.sips.active}</div>
                  <div class="cp-metric-label">Active SIPs</div>
                </div>
                <div class="cp-metric">
                  <div class="cp-metric-value">${cp.newFolios.mtd}</div>
                  <div class="cp-metric-label">New Folios</div>
                </div>
              </div>
              <div class="cp-card-footer">
                <div class="growth-${cp.growth.mom >= 0 ? 'positive' : 'negative'}">
                  ${cp.growth.mom >= 0 ? '▲' : '▼'} ${Math.abs(cp.growth.mom)}% MoM
                </div>
                <div class="last-contact">Last: ${formatDate(cp.lastContact)}</div>
              </div>
            </div>
          `).join('')}
      </div>
    </div>
    ${renderBottomNav()}
  `;
}

// ══════════════════════════════════════════
// CP DETAIL
// ══════════════════════════════════════════
function openCP(cpId) {
  currentCPId = cpId;
  const cp = APP_DATA.channelPartners.find(c => c.id === cpId);
  if (!cp) return;

  const el = document.getElementById('screen-cpdetail');
  const initials = cp.name.split(' ').map(w => w[0]).join('').substring(0, 2);
  const cpTasks = APP_DATA.tasks.filter(t => t.cpId === cpId);

  el.innerHTML = `
    <div class="cp-detail-header">
      <div class="back-btn" onclick="navigateScreen('partners')">← Back</div>
      <div class="cp-profile-row">
        <div class="cp-avatar">${initials}</div>
        <div>
          <div class="cp-profile-name">${cp.name}</div>
          <div class="cp-profile-arn">${cp.arn}</div>
          <div class="cp-profile-meta">📍 ${cp.area}, ${cp.city}</div>
          <div class="cp-profile-meta">👤 ${cp.contactPerson} • 📱 ${cp.mobile}</div>
        </div>
        <div class="status-badge status-${cp.status}" style="margin-left:auto;flex-shrink:0">${cp.status}</div>
      </div>
    </div>

    <!-- ✅ Action Buttons: Call / WhatsApp / Message / Set Task -->
    <div class="cp-action-bar">
      <div class="cp-action-btn call" onclick="doCall('${cp.mobile}')">
        <span class="ca-icon">📞</span>Call
      </div>
      <div class="cp-action-btn whatsapp" onclick="doWhatsApp('${cp.mobile}')">
        <span class="ca-icon">💬</span>WhatsApp
      </div>
      <div class="cp-action-btn message" onclick="doSMS('${cp.mobile}')">
        <span class="ca-icon">✉️</span>Message
      </div>
      <div class="cp-action-btn task" onclick="openAddTaskModal('${cp.id}', '${cp.name}')">
        <span class="ca-icon">✅</span>Set Task
      </div>
    </div>

    <div class="detail-tabs" id="detailTabs">
      ${['Overview', 'AUM & Growth', 'Schemes', 'Tasks', 'Notes'].map((t, i) => `
        <div class="tab-btn ${i === 0 ? 'active' : ''}" onclick="switchTab('${t.replace(/ & /g, '_').replace(/ /g, '_')}', this)">${t}</div>
      `).join('')}
    </div>

    <div class="screen-content" style="padding-bottom: calc(var(--nav-h) + 80px)">

      <!-- OVERVIEW TAB -->
      <div id="tab-Overview" class="tab-content active">
        <div class="metric-row"><span class="metric-row-label">Current AUM</span><span class="metric-row-value">₹${cp.aum.current} Cr</span></div>
        <div class="metric-row"><span class="metric-row-label">Previous Month AUM</span><span class="metric-row-value">₹${cp.aum.previous} Cr</span></div>
        <div class="metric-row"><span class="metric-row-label">Active SIPs</span><span class="metric-row-value">${cp.sips.active}</span></div>
        <div class="metric-row"><span class="metric-row-label">SIP Amount</span><span class="metric-row-value">₹${cp.sips.amount} Cr</span></div>
        <div class="metric-row"><span class="metric-row-label">New Folios – MTD</span><span class="metric-row-value">${cp.newFolios.mtd}</span></div>
        <div class="metric-row"><span class="metric-row-label">New Folios – YTD</span><span class="metric-row-value">${cp.newFolios.ytd}</span></div>
        <div class="metric-row"><span class="metric-row-label">Transactions – MTD</span><span class="metric-row-value">${cp.transactions.mtd}</span></div>
        <div class="metric-row"><span class="metric-row-label">Transactions – YTD</span><span class="metric-row-value">${cp.transactions.ytd}</span></div>
        <div class="metric-row"><span class="metric-row-label">Empanelment Date</span><span class="metric-row-value">${formatDate(cp.empanelmentDate)}</span></div>
        <div class="metric-row"><span class="metric-row-label">Email</span><span class="metric-row-value" style="font-size:13px">${cp.email}</span></div>
      </div>

      <!-- AUM & GROWTH TAB -->
      <div id="tab-AUM_&_Growth" class="tab-content">
        <div class="growth-grid">
          <div class="growth-card ${cp.growth.mom >= 0 ? 'positive' : 'negative'}">
            <div class="growth-emoji">${cp.growth.mom >= 0 ? '📈' : '📉'}</div>
            <div class="growth-pct ${cp.growth.mom >= 0 ? 'positive' : 'negative'}">${cp.growth.mom >= 0 ? '+' : ''}${cp.growth.mom}%</div>
            <div class="growth-label">Month-on-Month</div>
          </div>
          <div class="growth-card ${cp.growth.yoy >= 0 ? 'positive' : 'negative'}">
            <div class="growth-emoji">${cp.growth.yoy >= 0 ? '🚀' : '⚠️'}</div>
            <div class="growth-pct ${cp.growth.yoy >= 0 ? 'positive' : 'negative'}">${cp.growth.yoy >= 0 ? '+' : ''}${cp.growth.yoy}%</div>
            <div class="growth-label">Year-on-Year</div>
          </div>
        </div>
        <div style="background:var(--card-bg);border:1px solid var(--card-border);border-radius:var(--radius);padding:16px;margin-bottom:16px">
          <div style="font-size:13px;font-weight:700;margin-bottom:16px;color:var(--text-3)">AUM TIMELINE</div>
          <div class="aum-row"><div class="aum-period">Current Month</div><div class="aum-value" style="color:var(--green)">₹${cp.aum.current} Cr</div></div>
          <div class="aum-row"><div class="aum-period">Last Month</div><div class="aum-value">₹${cp.aum.previous} Cr</div></div>
          <div class="aum-row"><div class="aum-period">Same Month Last Year</div><div class="aum-value" style="color:var(--text-3)">₹${cp.aum.lastYear} Cr</div></div>
        </div>
      </div>

      <!-- SCHEMES TAB -->
      <div id="tab-Schemes" class="tab-content">
        <div style="background:var(--card-bg);border:1px solid var(--card-border);border-radius:var(--radius);padding:16px">
          <div style="font-size:13px;font-weight:700;margin-bottom:16px;color:var(--text-3)">SCHEME-WISE AUM</div>
          <div class="scheme-bar-wrap">
            ${cp.schemes.map(s => `
              <div class="scheme-bar-item">
                <div class="scheme-bar-header">
                  <span class="scheme-bar-name">${s.name}</span>
                  <span class="scheme-bar-val">₹${s.aum}Cr (${s.pct}%)</span>
                </div>
                <div class="scheme-bar-track">
                  <div class="scheme-bar-fill" style="width:${s.pct}%"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- TASKS TAB (CP-specific) -->
      <div id="tab-Tasks" class="tab-content">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
          <div style="font-size:14px;color:var(--text-3)">${cpTasks.length} task(s) for this CP</div>
          <div class="section-link" onclick="openAddTaskModal('${cp.id}','${cp.name}')">+ New Task</div>
        </div>
        ${cpTasks.length === 0
      ? '<div class="empty-state">No tasks for this CP yet.<br>Tap + New Task to create one.</div>'
      : cpTasks.map(t => renderTaskCard(t, true)).join('')}
      </div>

      <!-- NOTES TAB -->
      <div id="tab-Notes" class="tab-content">
        <div style="margin-bottom:12px;font-size:13px;color:var(--text-3)">${cp.callHistory.length} call records</div>
        ${cp.callHistory.map(call => `
          <div class="call-item">
            <div class="call-item-header">
              <span class="call-date">📅 ${formatDate(call.date)}</span>
              <span class="call-outcome ${call.outcome}">${call.outcome}</span>
            </div>
            <div class="call-notes">${call.notes}</div>
            <div class="call-followup">Next Follow-up: ${formatDate(call.nextFollowUp)}</div>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="fab" onclick="openCallModalForCP('${cp.id}')">📞</div>
  `;

  navigateScreen('cpdetail');
}

// CP Actions
function doCall(mobile) {
  window.location.href = `tel:${mobile}`;
  showToast(`📞 Calling ${mobile}…`);
}

function doWhatsApp(mobile) {
  const clean = mobile.replace(/\D/g, '');
  window.open(`https://wa.me/91${clean}`, '_blank');
  showToast('💬 Opening WhatsApp…');
}

function doSMS(mobile) {
  window.location.href = `sms:${mobile}`;
  showToast(`✉️ Opening messages for ${mobile}…`);
}

function switchTab(tabId, btnEl) {
  document.querySelectorAll('#screen-cpdetail .tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('#screen-cpdetail .tab-content').forEach(t => t.classList.remove('active'));
  btnEl.classList.add('active');
  const target = document.getElementById(`tab-${tabId}`);
  if (target) target.classList.add('active');
}

// ══════════════════════════════════════════
// TASKS SCREEN
// ══════════════════════════════════════════
const TASK_ICONS = {
  'Call': '📞', 'Meeting': '🤝', 'Document': '📄',
  'Follow-up': '🔁', 'Task': '✅', 'Review': '🔍'
};

function renderTasks(filter = 'Pending') {
  taskFilter = filter;
  const all = APP_DATA.tasks;
  const pending = all.filter(t => t.status === 'Pending');
  const completed = all.filter(t => t.status === 'Completed');
  const high = pending.filter(t => t.priority === 'High');
  const today = pending.filter(t => t.dueDate === '2026-03-10');

  let shown = filter === 'All' ? all : filter === 'Completed' ? completed : pending;

  const el = document.getElementById('screen-tasks');
  el.innerHTML = `
    ${renderHeader('Tasks & Reminders')}
    <div class="screen-content" style="padding-bottom:calc(var(--nav-h)+80px)">

      <!-- Summary Row -->
      <div class="task-summary-row">
        <div class="task-summary-card" onclick="renderTasks('Pending');navigateScreen('tasks')">
          <div class="task-summary-num" style="color:var(--gold)">${pending.length}</div>
          <div class="task-summary-lbl">Pending</div>
        </div>
        <div class="task-summary-card" onclick="renderTasks('All');navigateScreen('tasks')">
          <div class="task-summary-num" style="color:var(--red)">${high.length}</div>
          <div class="task-summary-lbl">High Priority</div>
        </div>
        <div class="task-summary-card">
          <div class="task-summary-num" style="color:var(--blue-2)">${today.length}</div>
          <div class="task-summary-lbl">Due Today</div>
        </div>
        <div class="task-summary-card" onclick="renderTasks('Completed');navigateScreen('tasks')">
          <div class="task-summary-num" style="color:var(--green)">${completed.length}</div>
          <div class="task-summary-lbl">Done</div>
        </div>
      </div>

      <!-- Filter Chips -->
      <div class="filter-chips" style="padding:0 20px 12px">
        ${['Pending', 'All', 'Completed'].map(f => `
          <div class="chip ${taskFilter === f ? 'active' : ''}"
            onclick="renderTasks('${f}');navigateScreen('tasks')">${f}</div>
        `).join('')}
        ${['Call', 'Meeting', 'Document', 'Follow-up'].map(f => `
          <div class="chip" onclick="filterTasksByType('${f}')">${TASK_ICONS[f]} ${f}</div>
        `).join('')}
      </div>

      <!-- Task List -->
      <div style="padding:0 20px">
        ${shown.length === 0
      ? '<div class="empty-state">🎉 No tasks here!<br>All caught up.</div>'
      : shown.map(t => renderTaskCard(t, false)).join('')}
      </div>
    </div>

    <!-- FAB -->
    <div class="fab" onclick="openAddTaskModal(null,null)" style="bottom:calc(var(--nav-h)+16px)">+</div>
    ${renderBottomNav()}
  `;
}

function renderTaskCard(t, compact) {
  const icon = TASK_ICONS[t.type] || '✅';
  const isDone = t.status === 'Completed';
  return `
    <div class="task-card priority-${t.priority} ${isDone ? 'completed' : ''}">
      <div class="task-card-header" style="padding-right:40px">
        <div class="task-type-icon">${icon}</div>
        <div style="flex:1">
          <div class="task-title ${isDone ? 'done' : ''}">${t.title}</div>
          <div class="task-cp-name">🤝 ${t.cpName}</div>
        </div>
      </div>
      <div class="task-meta">
        <span class="task-meta-item">📅 ${formatDate(t.dueDate)}</span>
        <span class="task-meta-item">🕐 ${t.dueTime}</span>
        <span class="task-type-chip">${t.type}</span>
        <span class="priority-badge ${t.priority}">${t.priority}</span>
      </div>
      <div class="reminder-tag">🔔 Reminder: ${t.reminder}</div>
      ${!isDone ? `
        <div class="task-done-btn" onclick="markTaskDone('${t.id}',event)" title="Mark complete">✓</div>
      ` : `
        <div class="task-done-btn done" title="Completed">✓</div>
      `}
    </div>
  `;
}

function markTaskDone(id, e) {
  e.stopPropagation();
  const t = APP_DATA.tasks.find(t => t.id === id);
  if (t) {
    t.status = 'Completed';
    showToast('✅ Task marked as complete!');

    // Re-render wherever we are
    if (currentScreen === 'tasks') { renderTasks(taskFilter); navigateScreen('tasks'); }
    else if (currentScreen === 'cpdetail' && currentCPId) openCP(currentCPId);
  }
}

function filterTasksByType(type) {
  const shown = APP_DATA.tasks.filter(t => t.type === type);
  const el = document.getElementById('screen-tasks');
  const listEl = el ? el.querySelector('[data-task-list]') : null;
  // Just re-render with type filter via a simple approach
  taskFilter = 'Type:' + type;
  const container = el.querySelector('.screen-content > div:last-child');
  if (container) {
    container.innerHTML = shown.length === 0
      ? `<div class="empty-state">No ${type} tasks found</div>`
      : shown.map(t => renderTaskCard(t, false)).join('');
  }
}

// ══════════════════════════════════════════
// ADD TASK MODAL
// ══════════════════════════════════════════
function openAddTaskModal(cpId, cpName) {
  prefilledCP = { id: cpId, name: cpName };
  const modal = document.getElementById('addTaskModal');
  const cpField = document.getElementById('taskCPName');
  if (cpField) cpField.value = cpName || '';
  modal.classList.add('active');
}

function saveTask() {
  const title = document.getElementById('taskTitle').value.trim();
  const cpName = document.getElementById('taskCPName').value.trim();
  const type = document.getElementById('taskType').value;
  const priority = document.getElementById('taskPriority').value;
  const dueDate = document.getElementById('taskDueDate').value;
  const dueTime = document.getElementById('taskDueTime').value;
  const reminder = document.getElementById('taskReminder').value;
  const notes = document.getElementById('taskNotes').value.trim();

  if (!title || !dueDate) { showToast('⚠️ Please fill title and due date'); return; }

  const newTask = {
    id: 't' + Date.now(),
    cpId: prefilledCP?.id || null,
    cpName: cpName || 'General',
    title, type, priority,
    dueDate, dueTime: dueTime || '—',
    reminder, status: 'Pending', notes
  };

  APP_DATA.tasks.unshift(newTask);
  closeModal('addTaskModal');
  showToast('✅ Task saved!');

  // refresh
  renderTasks(taskFilter === 'Completed' ? 'Pending' : taskFilter);
  if (currentScreen === 'tasks') navigateScreen('tasks');
  if (currentScreen === 'cpdetail' && currentCPId) openCP(currentCPId);
}

// ══════════════════════════════════════════
// REPORTS
// ══════════════════════════════════════════
function renderReports(dateRange = 'This Month') {
  activeDateRange = dateRange;
  const role = currentUser?.role || 'RM';
  const el = document.getElementById('screen-reports');

  el.innerHTML = `
    ${renderHeader('Reports')}
    <div class="screen-content">
      <div class="date-range-tabs">
        ${['This Month', 'Last Month', 'YTD'].map(d => `
          <div class="dr-tab ${dateRange === d ? 'active' : ''}" onclick="renderReports('${d}')">${d}</div>
        `).join('')}
      </div>
      <div class="reports-grid">
        ${APP_DATA.reports.map(r => {
    const hasAccess = r.roles.includes(role);
    return `
            <div class="report-card ${!hasAccess ? 'locked' : ''}"
              onclick="${hasAccess ? `openReport('${r.id}')` : 'showToast(\"🔒 Access restricted for your role\")'}"
            >
              ${!hasAccess ? '<div class="lock-badge">🔒</div>' : ''}
              <div class="report-icon">${r.icon}</div>
              <div class="report-title">${r.title}</div>
              <div class="report-desc">${r.description}</div>
            </div>
          `;
  }).join('')}
      </div>
      <div style="padding:16px 20px;margin-top:8px">
        <div style="padding:14px;background:rgba(245,166,35,0.08);border:1px solid rgba(245,166,35,0.2);border-radius:var(--radius-sm)">
          <div style="font-size:12px;color:var(--gold);font-weight:700;margin-bottom:4px">🔐 Access Level: ${role}</div>
          <div style="font-size:12px;color:var(--text-3)">
            ${role === 'RM' ? 'You can access Business Summary, SIP Report, and New Business reports.' :
      role === 'Senior RM' ? 'You can access all reports including Scheme Analysis and Top Performers.' :
        'You have full access to all reports and hierarchy data.'}
          </div>
        </div>
      </div>
    </div>
    ${renderBottomNav()}
  `;
}

function openReport(reportId) {
  const report = APP_DATA.reports.find(r => r.id === reportId);
  if (!report) return;
  currentReportId = reportId;

  const el = document.getElementById('screen-reportdetail');
  el.innerHTML = `
    <div style="padding:16px 20px;background:linear-gradient(135deg,rgba(26,59,110,0.6),rgba(37,99,235,0.2));border-bottom:1px solid var(--glass-border)">
      <div class="back-btn" onclick="navigateScreen('reports')">← Back to Reports</div>
      <div class="report-detail-header">
        <div class="report-detail-icon">${report.icon}</div>
        <div>
          <div class="report-detail-title">${report.title}</div>
          <div class="report-detail-desc">${report.description} • ${activeDateRange}</div>
        </div>
      </div>
    </div>
    <div class="screen-content">
      <div class="report-detail">
        <div style="background:var(--card-bg);border:1px solid var(--card-border);border-radius:var(--radius);padding:16px;overflow-x:auto">
          <table class="report-table">
            <thead><tr>${report.data.headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
            <tbody>
              ${report.data.rows.map(row => `
                <tr>${row.map((cell, i) => `<td style="${(typeof cell === 'string' && cell.includes('+') && i > 0) ? 'color:var(--green)' :
      (typeof cell === 'string' && cell.includes('-') && i > 0) ? 'color:var(--red)' : ''
    }">${cell}</td>`).join('')}</tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        <div style="margin-top:16px;padding:12px;background:rgba(245,166,35,0.06);border:1px solid rgba(245,166,35,0.15);border-radius:var(--radius-sm)">
          <div style="font-size:12px;color:var(--text-3)">📌 Data as of March 10, 2026 • ${activeDateRange}</div>
        </div>
      </div>
    </div>
  `;
  navigateScreen('reportdetail');
}

// ══════════════════════════════════════════
// HIERARCHY
// ══════════════════════════════════════════
function renderHierarchy() {
  const el = document.getElementById('screen-hierarchy');
  const tree = APP_DATA.hierarchy.tree;
  const colors = ['#F5A623', '#10B981', '#A855F7', '#F5A623', '#F5A623'];

  el.innerHTML = `
    ${renderHeader('Hierarchy')}
    <div class="screen-content">
      <div style="padding:12px 20px 0">
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px">
          <span class="loc-chip">Zone: ${APP_DATA.hierarchy.zone}</span>
          <span class="loc-chip">Region: ${APP_DATA.hierarchy.region}</span>
          <span class="loc-chip">Cluster: ${APP_DATA.hierarchy.cluster}</span>
        </div>
      </div>
      <div style="padding:0 20px 8px;font-size:13px;font-weight:700;color:var(--text-3)">REPORTING STRUCTURE</div>
      <div class="hierarchy-tree">
        ${tree.map((node, i) => {
    const isSelf = node.id === currentUser?.id;
    const roleKey = node.role.replace(' ', '-');
    return `
            <div class="h-node ${isSelf ? 'self' : ''} h-node-indent-${node.level}" onclick="showToast('${node.cps} CPs • ₹${node.aum} Cr AUM')">
              ${node.level > 1 ? '<div class="h-connector"></div>' : ''}
              <div class="h-avatar" style="background:linear-gradient(135deg,${colors[i]},${colors[i]}88)">
                ${node.name.split(' ').map(w => w[0]).join('').substring(0, 2)}
              </div>
              <div class="h-info">
                <div class="h-name">${node.name} ${isSelf ? '(You)' : ''}</div>
                <div class="h-role-badge h-role-${roleKey}">${node.role}</div>
              </div>
              <div class="h-stats">
                <div class="h-aum">₹${node.aum}Cr</div>
                <div class="h-cps">${node.cps} CPs</div>
              </div>
            </div>
          `;
  }).join('')}
      </div>
    </div>
    ${renderBottomNav()}
  `;
}

// ══════════════════════════════════════════
// CALL LOG
// ══════════════════════════════════════════
function renderCallLog() {
  const allCalls = [];
  APP_DATA.channelPartners.forEach(cp => {
    cp.callHistory.forEach(c => allCalls.push({ ...c, cpName: cp.name, cpId: cp.id }));
  });
  allCalls.sort((a, b) => new Date(b.date) - new Date(a.date));

  const el = document.getElementById('screen-calllog');
  el.innerHTML = `
    ${renderHeader('Call Log')}
    <div class="screen-content" style="padding-bottom:calc(var(--nav-h)+80px)">
      <div style="padding:16px 20px 8px">
        <div style="font-size:14px;color:var(--text-3)">${allCalls.length} total call records</div>
      </div>
      <div class="notif-list" style="padding-bottom:20px">
        ${allCalls.map(c => `
          <div class="call-item" onclick="openCP('${c.cpId}')">
            <div class="call-item-header">
              <div>
                <span style="font-size:14px;font-weight:700">${c.cpName}</span>
                <span class="call-date" style="margin-left:8px">📅 ${formatDate(c.date)}</span>
              </div>
              <span class="call-outcome ${c.outcome}">${c.outcome}</span>
            </div>
            <div class="call-notes">${c.notes}</div>
            <div class="call-followup">Next: ${formatDate(c.nextFollowUp)}</div>
          </div>
        `).join('')}
      </div>
    </div>
    <div class="fab" onclick="openCallModal()">+</div>
    ${renderBottomNav()}
  `;
}

// ══════════════════════════════════════════
// NOTIFICATIONS
// ══════════════════════════════════════════
function renderNotifications() {
  const el = document.getElementById('screen-notifications');
  el.innerHTML = `
    ${renderHeader('Notifications')}
    <div class="screen-content">
      <div style="padding:12px 20px 8px;display:flex;justify-content:space-between;align-items:center">
        <div style="font-size:14px;color:var(--text-3)">${APP_DATA.notifications.filter(n => !n.read).length} unread</div>
        <div class="section-link" onclick="markAllRead()">Mark all read</div>
      </div>
      <div class="notif-list">
        ${APP_DATA.notifications.map(n => `
          <div class="notif-item ${!n.read ? 'unread' : ''}" onclick="markRead('${n.id}')">
            <div class="notif-emoji">${n.icon}</div>
            <div class="notif-body">
              <div class="notif-title">${n.title}</div>
              <div class="notif-text">${n.body}</div>
              <div class="notif-time">${n.time}</div>
            </div>
            ${!n.read ? '<div style="width:8px;height:8px;background:var(--blue-2);border-radius:50%;flex-shrink:0;margin-top:4px"></div>' : ''}
          </div>
        `).join('')}
      </div>
    </div>
    ${renderBottomNav()}
  `;
}

function markAllRead() {
  APP_DATA.notifications.forEach(n => n.read = true);
  renderNotifications(); navigateScreen('notifications');
  const b = document.getElementById('notifBadge');
  if (b) b.style.display = 'none';
}
function markRead(id) {
  const n = APP_DATA.notifications.find(n => n.id === id);
  if (n) n.read = true;
  renderNotifications(); navigateScreen('notifications');
}

// ══════════════════════════════════════════
// ABOUT SCREEN
// ══════════════════════════════════════════
function renderAbout() {
  const el = document.getElementById('screen-about');
  el.innerHTML = `
    <div style="padding:16px 20px;background:linear-gradient(135deg,rgba(26,59,110,0.7),rgba(37,99,235,0.2));border-bottom:1px solid var(--glass-border)">
      <div class="back-btn" onclick="navigateScreen('profile')">← Back</div>
      <div style="text-align:center;padding:8px 0 4px">
        <img src="assets/logo.png" alt="Prudent Logo" style="width:120px;border-radius:12px;margin-bottom:12px;box-shadow:0 4px 16px rgba(0,0,0,0.4)">
        <div style="font-size:22px;font-weight:800;">Prudent Corporate</div>
        <div style="font-size:13px;color:var(--gold);font-weight:600;margin-top:4px">Advisory Services Ltd.</div>
        <div style="font-size:12px;color:var(--text-3);margin-top:6px">NSE/BSE Listed • CIN: L65100GJ2003PLC042458</div>
      </div>
    </div>
    <div class="screen-content">
      <div style="padding:16px 20px">

        <!-- About Card -->
        <div style="background:var(--card-bg);border:1px solid var(--card-border);border-radius:var(--radius);padding:18px;margin-bottom:14px">
          <div style="font-size:13px;font-weight:800;color:var(--gold);margin-bottom:10px;text-transform:uppercase;letter-spacing:0.5px">About Us</div>
          <div style="font-size:14px;color:var(--text-2);line-height:1.7">
            Prudent Corporate Advisory Services Ltd. is one of India's leading mutual fund distributors operating on a <strong>B2B2C model</strong>. Founded in <strong>2000 by Sanjay Shah</strong> in Ahmedabad, we have grown into a diversified financial services group providing mutual funds, insurance, PMS/AIF, equities, bonds, and loan products.
          </div>
        </div>

        <!-- Key Stats Grid -->
        <div style="font-size:13px;font-weight:800;color:var(--text-3);margin-bottom:10px;text-transform:uppercase;letter-spacing:0.5px">Key Milestones</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">
          ${[
      { icon: '💼', value: '₹1 Lakh Cr+', label: 'Total AUM' },
      { icon: '🤝', value: '32,000+', label: 'Qualified Partners' },
      { icon: '🏢', value: '135 Branches', label: 'Pan India' },
      { icon: '🗺️', value: '21 States', label: 'Geographic Reach' },
      { icon: '👥', value: '1,400+', label: 'Professionals' },
      { icon: '📅', value: 'Since 2000', label: 'Founded' }
    ].map(s => `
            <div style="background:var(--card-bg);border:1px solid var(--card-border);border-radius:var(--radius-sm);padding:14px;text-align:center">
              <div style="font-size:22px;margin-bottom:6px">${s.icon}</div>
              <div style="font-size:16px;font-weight:800;color:var(--gold)">${s.value}</div>
              <div style="font-size:11px;color:var(--text-3);margin-top:3px">${s.label}</div>
            </div>
          `).join('')}
        </div>

        <!-- Journey Timeline -->
        <div style="background:var(--card-bg);border:1px solid var(--card-border);border-radius:var(--radius);padding:18px;margin-bottom:14px">
          <div style="font-size:13px;font-weight:800;color:var(--gold);margin-bottom:14px;text-transform:uppercase;letter-spacing:0.5px">Our Journey</div>
          ${[
      { year: '2000', text: 'Founded by Sanjay Shah in Ahmedabad – focused on MF distribution' },
      { year: '2003', text: 'Expanded to multiple branches across Gujarat and nearby cities' },
      { year: '2005', text: 'Shirish Patel joined as CEO, accelerating network growth' },
      { year: '2016', text: 'Launched Fundzbazar – digital MF transactional platform' },
      { year: '2019', text: 'Evolved into a full-spectrum wealth management company' },
      { year: '2024', text: 'AUM crossed ₹84,000 Cr; PMS/AIF AUM at ₹14,500 Cr' },
    ].map(j => `
            <div style="display:flex;gap:12px;margin-bottom:14px">
              <div style="background:rgba(245,166,35,0.15);border:1px solid rgba(245,166,35,0.3);border-radius:8px;padding:4px 10px;font-size:12px;font-weight:800;color:var(--gold);white-space:nowrap;height:fit-content">${j.year}</div>
              <div style="font-size:13px;color:var(--text-2);line-height:1.5;padding-top:2px">${j.text}</div>
            </div>
          `).join('')}
        </div>

        <!-- Products -->
        <div style="background:var(--card-bg);border:1px solid var(--card-border);border-radius:var(--radius);padding:18px;margin-bottom:14px">
          <div style="font-size:13px;font-weight:800;color:var(--gold);margin-bottom:12px;text-transform:uppercase;letter-spacing:0.5px">Products & Services</div>
          <div style="display:flex;flex-wrap:wrap;gap:8px">
            ${['Mutual Funds', 'Insurance', 'Equities', 'PMS / AIF', 'Bonds', 'Fixed Income', 'Loan Products', 'NPS'].map(p => `
              <div style="padding:6px 14px;background:rgba(37,99,235,0.15);border:1px solid rgba(37,99,235,0.25);border-radius:20px;font-size:12px;font-weight:600;color:#93C5FD">${p}</div>
            `).join('')}
          </div>
        </div>

        <!-- App Version -->
        <div style="text-align:center;padding:16px 0;color:var(--text-3);font-size:12px">
          <div>Prudent RM App v1.0.0</div>
          <div style="margin-top:4px">For internal use by Prudent MF Distribution Team</div>
          <div style="margin-top:4px">© 2026 Prudent Corporate Advisory Services Ltd.</div>
        </div>
      </div>
    </div>
  `;
}

// ══════════════════════════════════════════
// PROFILE
// ══════════════════════════════════════════
function renderProfile() {
  const u = currentUser;
  const sessionType = isInstalledPWA() ? 'App (Persistent Login)' : 'Website (Auto-logout)';
  const sessionIcon = isInstalledPWA() ? '📱' : '🌐';
  const isPWA = isInstalledPWA();
  
  const el = document.getElementById('screen-profile');
  el.innerHTML = `
    ${renderHeader('My Profile')}
    <div class="screen-content">
      <div class="profile-hero">
        <div class="profile-avatar">${u.avatar}</div>
        <div class="profile-name">${u.name}</div>
        <div class="profile-role">${u.role}</div>
        <div class="profile-emp">Employee ID: ${u.empId}</div>
      </div>

      <div class="profile-info-list">
        <div class="profile-info-item">
          <span class="pi-label">${sessionIcon} Session Type</span>
          <span class="pi-value" style="font-size:13px">${sessionType}</span>
        </div>
        <div class="profile-info-item"><span class="pi-label">🗺️ Zone</span><span class="pi-value">${u.zone}</span></div>
        <div class="profile-info-item"><span class="pi-label">📌 Region</span><span class="pi-value">${u.region}</span></div>
        <div class="profile-info-item"><span class="pi-label">🏘️ Cluster</span><span class="pi-value">${u.cluster}</span></div>
        <div class="profile-info-item"><span class="pi-label">📍 Area</span><span class="pi-value">${u.area}</span></div>
        <div class="profile-info-item"><span class="pi-label">🤝 CPs Assigned</span><span class="pi-value">${u.totalCPs}</span></div>
        <div class="profile-info-item"><span class="pi-label">👤 Reports To</span><span class="pi-value" style="font-size:13px">${u.reportingTo}</span></div>
        <div class="profile-info-item" onclick="navigateScreen('about')" style="cursor:pointer">
          <span class="pi-label">ℹ️ About Prudent</span>
          <span class="pi-value" style="color:var(--gold)">›</span>
        </div>
        ${!isPWA ? `
          <div class="profile-info-item" onclick="testPWAMode()" style="cursor:pointer">
            <span class="pi-label">🧪 Test PWA Mode</span>
            <span class="pi-value" style="color:var(--blue-2)">›</span>
          </div>
        ` : ''}
      </div>

      <button class="logout-btn" onclick="doLogout()">🚪 Logout</button>
      
      ${!isPWA ? `
        <div style="margin:16px 20px 0;padding:12px;background:rgba(245,166,35,0.1);border:1px solid rgba(245,166,35,0.3);border-radius:var(--radius-sm);font-size:12px;color:var(--gold);text-align:center">
          🌐 Website Mode: You'll be automatically logged out when you close this tab or after 30 minutes of inactivity
        </div>
      ` : `
        <div style="margin:16px 20px 0;padding:12px;background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.3);border-radius:var(--radius-sm);font-size:12px;color:var(--green);text-align:center">
          📱 App Mode: You'll stay logged in until you manually logout
        </div>
      `}
      
      <div style="margin:16px 20px 0;padding:8px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:var(--radius-sm);font-size:11px;color:var(--text-3);text-align:center">
        Debug: PWA Detection = ${isPWA ? 'TRUE' : 'FALSE'}
      </div>
    </div>
    ${renderBottomNav()}
  `;
}

// Test function to simulate PWA mode
function testPWAMode() {
  // Temporarily override PWA detection for testing
  window.testPWAMode = true;
  showToast('🧪 PWA mode enabled for testing');
  
  // Re-initialize PWA features
  initPWADownloadButton();
  
  // Re-render current screen
  if (currentScreen === 'profile') {
    renderProfile();
    navigateScreen('profile');
  }
}

function doLogout() {
  currentUser = null;
  clearSession();
  navigateScreen('login');
  
  const appType = isInstalledPWA() ? 'app' : 'website';
  showToast(`👋 Logged out successfully (${appType})`);
}

// ══════════════════════════════════════════
// CALL LOG MODAL
// ══════════════════════════════════════════
function openCallModal(cpId = null) {
  const cp = cpId ? APP_DATA.channelPartners.find(c => c.id === cpId) : null;
  const modal = document.getElementById('addCallModal');
  document.getElementById('callCPName').value = cp ? cp.name : '';
  modal.classList.add('active');
}

function openCallModalForCP(cpId) { openCallModal(cpId); }

function closeModal(id) {
  document.getElementById(id).classList.remove('active');
}

function saveCallLog() {
  const cp = document.getElementById('callCPName').value;
  const notes = document.getElementById('callNotes').value;
  if (!cp || !notes) { showToast('Please fill required fields'); return; }
  closeModal('addCallModal');
  showToast('✅ Call log saved successfully!');
}

// ══════════════════════════════════════════
// SHARED RENDERERS
// ══════════════════════════════════════════
function renderHeader(title = '') {
  const u = currentUser;
  if (!u) return '';
  const unread = APP_DATA.notifications.filter(n => !n.read).length;
  const isInstalled = isInstalledPWA();
  
  return `
    <div class="app-header">
      <div class="header-left">
        <div class="header-avatar">${u.avatar}</div>
        <div>
          <div class="header-name">${title || u.name}</div>
          <div class="header-role">${title ? u.role : `${u.area} • ${u.region}`}</div>
        </div>
      </div>
      <div class="header-right">
        ${!isInstalled ? `
          <div class="header-icon-btn" onclick="showPWAInstallModal()" title="Install App">
            📥
          </div>
          <div class="header-icon-btn" onclick="window.open('https://prudent-rm-app.onrender.com', '_blank')" title="Share App">
            📤
          </div>
        ` : ''}
        <div class="header-icon-btn" onclick="navTo('notifications')">
          🔔
          <div class="notif-badge" id="notifBadge" style="display:${unread > 0 ? 'block' : 'none'}"></div>
        </div>
      </div>
    </div>
  `;
}

function renderBottomNav() {
  const tabs = [
    { id: 'dashboard', icon: '🏠', label: 'Home' },
    { id: 'partners', icon: '🤝', label: 'Partners' },
    { id: 'tasks', icon: '✅', label: 'Tasks' },
    { id: 'reports', icon: '📊', label: 'Reports' },
    { id: 'profile', icon: '👤', label: 'Profile' }
  ];
  const pendingTasks = APP_DATA.tasks.filter(t => t.status === 'Pending').length;

  return `
    <div class="bottom-nav">
      ${tabs.map(t => `
        <div class="nav-item ${currentScreen === t.id ? 'active' : ''}" data-screen="${t.id}" onclick="navTo('${t.id}')">
          <div class="nav-icon" style="position:relative">
            ${t.icon}
            ${t.id === 'tasks' && pendingTasks > 0
      ? `<span style="position:absolute;top:-4px;right:-8px;background:var(--red);color:#fff;font-size:9px;font-weight:700;border-radius:10px;padding:1px 5px;min-width:16px;text-align:center">${pendingTasks}</span>`
      : ''}
          </div>
          <div class="nav-label">${t.label}</div>
        </div>
      `).join('')}
    </div>
  `;
}

// ══════════════════════════════════════════
// UTILITIES
// ══════════════════════════════════════════
function getGreeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Morning' : h < 17 ? 'Afternoon' : 'Evening';
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

// PWA Install functionality
let deferredPrompt;
let pwaInstallShown = false;

// Check if app is running as installed PWA
function isInstalledPWA() {
  // Test mode override
  if (window.testPWAMode) return true;
  
  // Multiple detection methods for better accuracy
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const isIOSStandalone = window.navigator.standalone === true;
  const isAndroidApp = document.referrer.includes('android-app://');
  const isWindowsApp = window.location.protocol === 'ms-appx-web:';
  const hasAppInstalled = window.matchMedia('(display-mode: fullscreen)').matches;
  
  // Check if running in TWA (Trusted Web Activity) - Android
  const isTWA = window.location.search.includes('utm_source=homescreen') || 
                window.location.search.includes('source=pwa');
  
  const detected = isStandalone || isIOSStandalone || isAndroidApp || isWindowsApp || hasAppInstalled || isTWA;
  
  // Debug logging (remove in production)
  if (detected) {
    console.log('PWA Detected:', {
      standalone: isStandalone,
      iOS: isIOSStandalone, 
      android: isAndroidApp,
      windows: isWindowsApp,
      fullscreen: hasAppInstalled,
      twa: isTWA
    });
  }
  
  return detected;
}

// Initialize PWA download button visibility
function initPWADownloadButton() {
  const downloadBtn = document.getElementById('pwaDownloadBtn');
  const installModal = document.getElementById('pwaInstallModal');
  const isPWA = isInstalledPWA();
  
  console.log('Initializing PWA buttons - isPWA:', isPWA);
  
  if (isPWA) {
    // App is installed - hide all download/install UI completely
    if (downloadBtn) {
      downloadBtn.style.display = 'none';
      downloadBtn.classList.remove('show-for-website');
      console.log('Hidden download button for PWA');
    }
    if (installModal) {
      installModal.classList.add('hide-for-installed');
      console.log('Hidden install modal for PWA');
    }
  } else {
    // App is running in browser - show download button
    if (downloadBtn) {
      downloadBtn.classList.add('show-for-website');
      console.log('Showing download button for website');
    }
    if (installModal) {
      installModal.classList.remove('hide-for-installed');
      console.log('Showing install modal for website');
    }
  }
  
  // Force header re-render to update button visibility
  if (currentUser) {
    const headerElements = document.querySelectorAll('.app-header');
    headerElements.forEach(header => {
      if (header.parentElement) {
        const screenId = header.parentElement.id.replace('screen-', '');
        if (screenId && typeof window[`render${screenId.charAt(0).toUpperCase() + screenId.slice(1)}`] === 'function') {
          // Re-render the current screen to update header
          setTimeout(() => {
            if (currentScreen === screenId.replace('screen-', '')) {
              const renderFunction = window[`render${screenId.charAt(0).toUpperCase() + screenId.slice(1)}`];
              if (renderFunction) renderFunction();
            }
          }, 100);
        }
      }
    });
  }
}

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  
  // Only show download features if not already installed
  if (!isInstalledPWA()) {
    const downloadBtn = document.getElementById('pwaDownloadBtn');
    if (downloadBtn) {
      downloadBtn.classList.add('show-for-website');
    }
    
    // Auto-show install modal after 10 seconds if not installed
    setTimeout(() => {
      if (!pwaInstallShown && !isInstalledPWA()) {
        showPWAInstallModal();
        pwaInstallShown = true;
      }
    }, 10000);
  }
});

// Check if already installed
window.addEventListener('appinstalled', () => {
  const downloadBtn = document.getElementById('pwaDownloadBtn');
  if (downloadBtn) {
    downloadBtn.style.display = 'none';
    downloadBtn.classList.remove('show-for-website');
  }
  showToast('🎉 App installed successfully!');
});

function showPWAInstallModal() {
  // Only show modal if not installed
  if (isInstalledPWA()) return;
  
  const modal = document.getElementById('pwaInstallModal');
  if (modal) {
    modal.classList.add('active');
  }
}

function closePWAInstallModal() {
  const modal = document.getElementById('pwaInstallModal');
  if (modal) {
    modal.classList.remove('active');
  }
}

function installPWAFromModal() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        showToast('📱 Installing app...');
        closePWAInstallModal();
      } else {
        showToast('📱 Installation cancelled');
      }
      deferredPrompt = null;
    });
  } else {
    // Fallback instructions for different browsers
    const userAgent = navigator.userAgent.toLowerCase();
    let instructions = '';
    
    if (userAgent.includes('chrome') && !userAgent.includes('edg')) {
      instructions = '1. Tap the menu (⋮) in Chrome\n2. Select "Add to Home screen"\n3. Tap "Add"';
    } else if (userAgent.includes('safari')) {
      instructions = '1. Tap the Share button (□↗)\n2. Select "Add to Home Screen"\n3. Tap "Add"';
    } else if (userAgent.includes('firefox')) {
      instructions = '1. Tap the menu (⋮) in Firefox\n2. Select "Install"\n3. Tap "Add to Home screen"';
    } else if (userAgent.includes('edg')) {
      instructions = '1. Tap the menu (⋯) in Edge\n2. Select "Add to phone"\n3. Tap "Add"';
    } else {
      instructions = 'Look for "Add to Home Screen" or "Install" in your browser menu';
    }
    
    alert(`To install this app:\n\n${instructions}`);
    closePWAInstallModal();
  }
}

function installPWA() {
  // Only show install modal if not already installed
  if (!isInstalledPWA()) {
    showPWAInstallModal();
  }
}