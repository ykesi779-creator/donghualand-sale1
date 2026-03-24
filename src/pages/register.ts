import { layout } from './layout'

export function registerPage() {
  const content = `
<div class="auth-page">
  <div class="auth-card">
    <!-- Logo -->
    <a href="/" class="auth-logo">
      <div class="li"><i class="fas fa-dragon"></i></div>
      Donghua<span>Land</span>
    </a>
    <p class="auth-sub">Your world of Chinese anime, unlocked.</p>

    <h2 class="auth-title">Create Account</h2>
    <p style="text-align:center; font-size:13px; color:var(--text3); margin-bottom:20px;">Join the DonghuaLand community today!</p>

    <!-- Social signup -->
    <div class="social-btns">
      <button class="social-btn" onclick="showToast('Social signup coming soon', 'info')">
        <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
        Sign up with Google
      </button>
    </div>

    <div class="divider-text">or sign up with email</div>

    <!-- Membership Plans -->
    <div style="margin-bottom:20px;">
      <div style="font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--text3); margin-bottom:10px;">Choose Your Plan</div>
      <div class="plans-grid">
        <div class="plan-card" onclick="selectPlan(this,'free')" id="plan-free">
          <div class="plan-name">Free</div>
          <div class="plan-price">$0<span>/forever</span></div>
        </div>
        <div class="plan-card selected" onclick="selectPlan(this,'monthly')" id="plan-monthly">
          <div class="plan-badge">Popular</div>
          <div class="plan-name">Monthly</div>
          <div class="plan-price">$1<span>/month</span></div>
        </div>
        <div class="plan-card" onclick="selectPlan(this,'annual')" id="plan-annual">
          <div class="plan-badge" style="background:var(--gold); color:#000;">Best Value</div>
          <div class="plan-name">Annual</div>
          <div class="plan-price">$10<span>/year</span></div>
        </div>
      </div>
    </div>

    <!-- Register Form -->
    <form id="registerForm" onsubmit="doRegister(event)">
      <input type="hidden" name="plan" id="planInput" value="monthly">
      <div class="form-group">
        <label class="form-label">Username</label>
        <input type="text" name="username" class="form-input" placeholder="Choose a username" required id="usernameInput" autocomplete="username">
        <div class="form-hint">3-20 characters, letters, numbers, underscore only</div>
      </div>
      <div class="form-group">
        <label class="form-label">Email Address</label>
        <input type="email" name="email" class="form-input" placeholder="Enter your email" required id="emailInput" autocomplete="email">
      </div>
      <div class="form-group">
        <label class="form-label">Password</label>
        <div class="input-wrap">
          <input type="password" name="password" class="form-input" placeholder="Create a strong password" required id="regPassInput" autocomplete="new-password" minlength="6">
          <i class="fas fa-eye input-eye" onclick="togglePwd('regPassInput', this)"></i>
        </div>
        <div class="form-hint">Minimum 6 characters</div>
      </div>
      <div class="form-group">
        <label class="form-check" style="gap:8px;">
          <input type="checkbox" id="agreeTerms" required>
          I agree to the <a href="/terms" style="color:var(--purple2);">Terms of Service</a> and <a href="/privacy" style="color:var(--purple2);">Privacy Policy</a>
        </label>
      </div>
      <button type="submit" class="btn-submit" id="regBtn">
        Create Account
      </button>
    </form>

    <div class="auth-footer">
      Already have an account? <a href="/user/login">Sign in here</a>
    </div>
  </div>
</div>

<script>
function selectPlan(el, plan) {
  document.querySelectorAll('.plan-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  document.getElementById('planInput').value = plan;
}
function togglePwd(id, btn) {
  const inp = document.getElementById(id);
  if (inp.type === 'password') { inp.type = 'text'; btn.classList.replace('fa-eye', 'fa-eye-slash'); }
  else { inp.type = 'password'; btn.classList.replace('fa-eye-slash', 'fa-eye'); }
}
async function doRegister(e) {
  e.preventDefault();
  const btn = document.getElementById('regBtn');
  const username = document.getElementById('usernameInput').value.trim();
  const email = document.getElementById('emailInput').value.trim();
  const password = document.getElementById('regPassInput').value;
  const plan = document.getElementById('planInput').value;
  
  if (!username || !email || !password) { showToast('Please fill all fields', 'error'); return; }
  if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) { showToast('Invalid username format', 'error'); return; }
  
  btn.disabled = true; 
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
  
  try {
    const res = await fetch('/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, plan })
    });
    const data = await res.json();
    
    if (data.success) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      showToast('Welcome to DonghuaLand, ' + username + '!', 'success');
      setTimeout(() => { window.location.href = '/'; }, 900);
    } else {
      showToast(data.error || 'Registration failed', 'error');
      btn.disabled = false;
      btn.innerHTML = 'Create Account';
    }
  } catch (err) {
    showToast('Network error, please try again', 'error');
    btn.disabled = false;
    btn.innerHTML = 'Create Account';
  }
}
</script>
`
  return layout('Create Account - Donghualand', content)
}
