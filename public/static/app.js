// DonghuaLand Main App.js
'use strict';

// ============ TOAST ============
window.showToast = function(msg, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const icons = { success: 'fas fa-check-circle', error: 'fas fa-times-circle', info: 'fas fa-info-circle' };
  const toast = document.createElement('div');
  toast.className = 'toast ' + type;
  toast.innerHTML = `<i class="${icons[type] || icons.info}"></i><span>${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';
    toast.style.transition = 'all 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
};

// ============ AUTH ============
function checkAuth() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const signInBtn = document.getElementById('headerSignIn');
  const joinBtn = document.getElementById('headerJoin');
  const userWrap = document.getElementById('userMenuWrap');
  const ava = document.getElementById('userAva');
  const nameLabel = document.getElementById('userNameLabel');
  const mobSignIn = document.getElementById('mobSignIn');
  const mobJoin = document.getElementById('mobJoin');
  const bnavProfile = document.getElementById('bnav-profile');
  const mobAuthBtn = document.getElementById('mobAuthBtn');

  if (token && user) {
    if (signInBtn) signInBtn.classList.add('hidden');
    if (joinBtn) joinBtn.classList.add('hidden');
    if (mobAuthBtn) mobAuthBtn.classList.add('hidden');
    if (userWrap) userWrap.classList.remove('hidden');
    if (ava) ava.src = user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=6c5ce7&color=fff&size=40&bold=true`;
    if (nameLabel) nameLabel.textContent = user.username;
    if (mobSignIn) { mobSignIn.textContent = user.username; mobSignIn.href = '/user/profile'; }
    if (mobJoin) mobJoin.style.display = 'none';
    if (bnavProfile) {
      bnavProfile.href = '/user/profile';
      const span = bnavProfile.querySelector('span');
      const icon = bnavProfile.querySelector('i');
      if (span) span.textContent = 'Profile';
      if (icon) icon.className = 'fas fa-user-circle';
    }
  } else {
    if (mobAuthBtn) mobAuthBtn.classList.remove('hidden');
  }
}

window.doLogout = function() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  showToast('Logged out successfully', 'info');
  setTimeout(() => { window.location.href = '/'; }, 800);
};

// ============ USER MENU ============
function initUserMenu() {
  const btn = document.getElementById('userMenuBtn');
  const wrap = document.getElementById('userMenuWrap');
  if (btn && wrap) {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      wrap.classList.toggle('open');
    });
    document.addEventListener('click', () => wrap?.classList.remove('open'));
  }
}

// ============ HEADER SCROLL ============
function initHeaderScroll() {
  const header = document.getElementById('siteHeader');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

// ============ MOBILE MENU ============
function initMobileMenu() {
  const btn = document.getElementById('mobMenuBtn');
  const drawer = document.getElementById('mobDrawer');
  const icon = document.getElementById('mobMenuIcon');
  if (btn && drawer) {
    btn.addEventListener('click', () => {
      const isOpen = drawer.classList.toggle('open');
      if (icon) icon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    drawer.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        drawer.classList.remove('open');
        if (icon) icon.className = 'fas fa-bars';
        document.body.style.overflow = '';
      });
    });
  }
}

// ============ UNIFIED SEARCH OVERLAY ============
// Used by: header search btn (desktop+mobile), bottom nav search btn
let searchOverlayTimer;

window.toggleSearchOverlay = function() {
  const overlay = document.getElementById('searchOverlay');
  if (!overlay) return;
  if (overlay.classList.contains('open')) {
    closeSearchOverlay();
  } else {
    openSearchOverlay();
  }
};

window.openSearchOverlay = function() {
  const overlay = document.getElementById('searchOverlay');
  const desktopBtn = document.getElementById('desktopSearchBtn');
  if (!overlay) return;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  if (desktopBtn) desktopBtn.classList.add('active');
  setTimeout(() => {
    const inp = document.getElementById('overlaySearchInput');
    if (inp) inp.focus();
  }, 80);
};

window.closeSearchOverlay = function() {
  const overlay = document.getElementById('searchOverlay');
  const desktopBtn = document.getElementById('desktopSearchBtn');
  const drop = document.getElementById('searchOverlayDrop');
  if (overlay) overlay.classList.remove('open');
  if (desktopBtn) desktopBtn.classList.remove('active');
  if (drop) { drop.innerHTML = ''; drop.classList.remove('show'); }
  document.body.style.overflow = '';
};

window.handleSearchOverlayClick = function(e) {
  const box = document.querySelector('.search-overlay-box');
  if (box && !box.contains(e.target)) {
    closeSearchOverlay();
  }
};

function initSearchOverlay() {
  const input = document.getElementById('overlaySearchInput');
  const drop = document.getElementById('searchOverlayDrop');
  if (!input || !drop) return;

  input.addEventListener('input', (e) => {
    const q = e.target.value.trim();
    clearTimeout(searchOverlayTimer);
    if (q.length < 2) {
      drop.classList.remove('show');
      drop.innerHTML = '';
      return;
    }
    searchOverlayTimer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search/quick?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        if (data.data && data.data.length > 0) {
          drop.innerHTML = data.data.map(a => `
            <a href="/anime/${a.slug}" class="sovl-result" onclick="closeSearchOverlay()">
              <img src="${a.cover_image || 'https://placehold.co/44x62/0f0f17/6c5ce7?text=?'}"
                   alt="${a.title}"
                   onerror="this.src='https://placehold.co/44x62/0f0f17/6c5ce7?text=?'">
              <div class="sovl-info">
                <div class="sovl-name">${a.title}</div>
                <div class="sovl-meta">${a.type || 'ONA'} &middot; ${a.status || ''} &middot; ${a.release_year || ''}</div>
              </div>
              <i class="fas fa-chevron-right sovl-arrow"></i>
            </a>`).join('');
          drop.classList.add('show');
        } else {
          drop.innerHTML = `<div class="sovl-empty"><i class="fas fa-search"></i> No results for "${q}"</div>`;
          drop.classList.add('show');
        }
      } catch {
        drop.classList.remove('show');
      }
    }, 280);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeSearchOverlay(); return; }
    if (e.key === 'Enter') {
      e.preventDefault();
      const q = input.value.trim();
      closeSearchOverlay();
      window.location.href = q ? '/search?q=' + encodeURIComponent(q) : '/search';
    }
  });
}

// ============ DESKTOP SEARCH TOGGLE ============
window.toggleDesktopSearch = function() {
  toggleSearchOverlay();
};

// Keep old mobile search fns for backward compat
window.toggleMobileSearch = function() { toggleSearchOverlay(); };
window.closeMobileSearch = function() { closeSearchOverlay(); };

// ============ BOTTOM NAV ACTIVE STATE ============
function initBottomNav() {
  const path = window.location.pathname;
  const map = {
    'bnav-home': ['/', '/home'],
    'bnav-browse': ['/search'],
    'bnav-watchlist': ['/user/watchlist'],
    'bnav-profile': ['/user/profile', '/user/login', '/user/register', '/user/settings', '/user/history']
  };
  Object.entries(map).forEach(([id, paths]) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (paths.some(p => p === path || (p !== '/' && path.startsWith(p)))) {
      el.classList.add('active');
    }
  });
  if (path.startsWith('/watch/') || path.startsWith('/anime/')) {
    document.getElementById('bnav-browse')?.classList.add('active');
  }
  if (path === '/') {
    document.getElementById('bnav-home')?.classList.add('active');
  }
}

// ============ SEARCH AUTOCOMPLETE (legacy header - now unified) ============
window.headerSearchSubmit = function(e, form) {
  const q = form.querySelector('input[name="q"]')?.value?.trim();
  if (!q) { e.preventDefault(); window.location.href = '/search'; return false; }
  return true;
};

// ============ ACTIVE NAV LINK ============
function initNavActive() {
  const path = window.location.pathname;
  document.querySelectorAll('.nav-link').forEach(a => {
    const href = a.getAttribute('href');
    if (href && (href === path || (href !== '/' && path.startsWith(href)))) {
      a.classList.add('active');
    }
  });
  document.querySelectorAll('.mob-nav-link').forEach(a => {
    const href = a.getAttribute('href');
    if (href && (href === path || (href !== '/' && path.startsWith(href)))) {
      a.classList.add('active');
    }
  });
}

// ============ SCHEDULE TABS ============
function initScheduleTabs() {
  const tabs = document.querySelectorAll('.sched-tab');
  const days = document.querySelectorAll('.sched-day');
  if (!tabs.length) return;
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      days.forEach(d => d.classList.remove('active'));
      tab.classList.add('active');
      const dayEl = document.getElementById('day-' + tab.dataset.day);
      if (dayEl) dayEl.classList.add('active');
    });
  });
}

// ============ HERO SLIDER ============
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  if (slides.length <= 1) return;
  let current = 0;
  let timer;
  function goTo(i) {
    slides[current].classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (i + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current]?.classList.add('active');
  }
  function next() { goTo(current + 1); }
  function start() { timer = setInterval(next, 5000); }
  function stop() { clearInterval(timer); }
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { stop(); goTo(i); start(); });
  });
  const prevBtn = document.getElementById('heroPrev');
  const nextBtn = document.getElementById('heroNext');
  if (prevBtn) prevBtn.addEventListener('click', () => { stop(); goTo(current - 1); start(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { stop(); goTo(current + 1); start(); });
  start();
}

// ============ WATCHLIST (localStorage) ============
window.getWatchlist = function() {
  try { return JSON.parse(localStorage.getItem('watchlist') || '[]'); } catch { return []; }
};
window.saveWatchlist = function(list) {
  localStorage.setItem('watchlist', JSON.stringify(list));
};
window.isInWatchlist = function(slug) {
  return getWatchlist().some(item => item.slug === slug);
};
window.toggleWatchlist = function(slug, title, cover, type) {
  const list = getWatchlist();
  const idx = list.findIndex(item => item.slug === slug);
  if (idx >= 0) {
    list.splice(idx, 1);
    saveWatchlist(list);
    showToast('Removed from watchlist', 'info');
    const btn = document.getElementById('wlBtn');
    if (btn) { btn.innerHTML = '<i class="fas fa-bookmark"></i> Add to Watchlist'; btn.classList.remove('active'); }
    return false;
  } else {
    list.unshift({ slug, title, cover: cover || '', type: type || 'ONA', addedAt: new Date().toISOString() });
    saveWatchlist(list);
    showToast('Added to watchlist!', 'success');
    const btn = document.getElementById('wlBtn');
    if (btn) { btn.innerHTML = '<i class="fas fa-bookmark"></i> In Watchlist'; btn.classList.add('active'); }
    return true;
  }
};

// Init watchlist button state on anime/watch pages
function initWatchlistBtn() {
  const btn = document.getElementById('wlBtn');
  if (!btn) return;
  const slug = btn.dataset.slug;
  if (!slug) return;
  if (isInWatchlist(slug)) {
    btn.innerHTML = '<i class="fas fa-bookmark"></i> In Watchlist';
    btn.classList.add('active');
  }
}

// ============ INIT ============
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  initUserMenu();
  initHeaderScroll();
  initMobileMenu();
  initSearchOverlay();
  initBottomNav();
  initNavActive();
  initScheduleTabs();
  initHeroSlider();
  initWatchlistBtn();
});
