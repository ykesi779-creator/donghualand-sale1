import { layout } from './layout'

export function loginPage(error?: string) {
  const content = `
<div class="auth-page">
  <div class="auth-card">
    <!-- Logo -->
    <a href="/" class="auth-logo">
      <div class="li"><i class="fas fa-dragon"></i></div>
      Donghua<span>Land</span>
    </a>
    <p class="auth-sub">Your world of Chinese anime, unlocked.</p>

    <h2 class="auth-title">Sign In</h2>
    <p style="text-align:center; font-size:13px; color:var(--text3); margin-bottom:24px;">Welcome back! Sign in to your account.</p>

    ${error ? `<div style="background:rgba(232,64,64,0.1); border:1px solid rgba(232,64,64,0.3); border-radius:var(--r8); padding:12px; font-size:13px; color:var(--red); margin-bottom:16px; display:flex; align-items:center; gap:8px;"><i class="fas fa-exclamation-circle"></i>${error}</div>` : ''}

    <!-- Social login -->
    <div class="social-btns">
      <button class="social-btn" onclick="showToast('Social login coming soon', 'info')">
        <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
        Continue with Google
      </button>
      <button class="social-btn" onclick="showToast('Social login coming soon', 'info')">
        <i class="fab fa-discord" style="color:#5865F2; font-size:18px;"></i>
        Continue with Discord
      </button>
    </div>

    <div class="divider-text">or sign in with email</div>

    <!-- Login Form -->
    <form id="loginForm" onsubmit="doLogin(event)">
      <div class="form-group">
        <label class="form-label">Email or Username</label>
        <input type="text" name="login" class="form-input" placeholder="Enter email or username" id="loginInput" autocomplete="username">
      </div>
      <div class="form-group">
        <label class="form-label">Password</label>
        <div class="input-wrap">
          <input type="password" name="password" class="form-input" placeholder="Enter your password" id="passInput" autocomplete="current-password">
          <i class="fas fa-eye input-eye" onclick="togglePwd('passInput', this)"></i>
        </div>
      </div>
      <div class="form-bottom">
        <label class="form-check">
          <input type="checkbox" id="rememberMe"> Remember me
        </label>
        <a href="/user/forgot" class="forgot-link">Forgot password?</a>
      </div>
      <button type="submit" class="btn-submit" id="loginBtn">
        Sign In
      </button>
    </form>

    <div class="auth-footer">
      Don't have an account? <a href="/user/register">Create one free</a>
    </div>
  </div>
</div>

<script>
function togglePwd(id, btn) {
  const inp = document.getElementById(id);
  if (inp.type === 'password') { inp.type = 'text'; btn.classList.replace('fa-eye', 'fa-eye-slash'); }
  else { inp.type = 'password'; btn.classList.replace('fa-eye-slash', 'fa-eye'); }
}

async function doLogin(e) {
  e.preventDefault();
  const btn = document.getElementById('loginBtn');
  const login = (document.getElementById('loginInput').value || '').trim();
  const password = (document.getElementById('passInput').value || '');

  if (!login || !password) { showToast('Please enter credentials', 'error'); return; }

  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';

  try {
    const res = await fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: login, password })
    });
    const data = await res.json();

    if (data.success) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      showToast('Welcome back, ' + data.user.username + '!', 'success');
      
      setTimeout(() => { 
        if (data.user.role === 'admin') {
          window.location.href = '/admin';
        } else {
          window.location.href = '/';
        }
      }, 800);
    } else {
      showToast(data.error || 'Invalid credentials', 'error');
      btn.disabled = false;
      btn.innerHTML = 'Sign In';
    }
  } catch (err) {
    showToast('Network error, please try again', 'error');
    btn.disabled = false;
    btn.innerHTML = 'Sign In';
  }
}
</script>
`
  return layout('Sign In - Donghualand', content)
}
