import { layout } from './layout'
import { animeCard, genresFromJson, formatRating, recentEpCard } from './components'

export function homePage(data: {
  featured: any[]
  trending: any[]
  recent: any[]
  popular: any[]
  ongoing: any[]
  schedule: any[]
  siteName?: string
  siteUrl?: string
}) {
  const { featured, trending, recent, popular, ongoing, schedule, siteName = 'ANIME WORLD', siteUrl = '' } = data

  // Hero slider - use featured array (up to 5)
  const heroItems = featured.length > 0 ? featured.slice(0, 5) : []

  const heroSlider = heroItems.length > 0 ? `
<section class="hero-slider" id="heroSlider">
  ${heroItems.map((f, i) => `
  <div class="hero-slide${i === 0 ? ' active' : ''}" data-index="${i}">
    <img src="${f.banner_image || f.cover_image || ''}" 
         alt="${f.title}" class="hero-bg-img" loading="${i === 0 ? 'eager' : 'lazy'}"
         onerror="this.style.opacity='0'">
    <div class="hero-gradient"></div>
    <div class="hero-content">
      <div class="hero-badges">
        <span class="hbadge hbadge-purple">${f.type || 'ONA'}</span>
        <span class="hbadge ${f.status === 'Ongoing' ? 'hbadge-green' : f.status === 'Completed' ? 'hbadge-blue' : 'hbadge-gray'}">${f.status || 'Ongoing'}</span>
        ${f.release_year ? `<span class="hbadge hbadge-gray">${f.release_year}</span>` : ''}
      </div>
      <h1 class="hero-title">${f.title}</h1>
      ${f.title_native ? `<div class="hero-native">${f.title_native}</div>` : ''}
      ${f.rating ? `
      <div class="hero-rating-row">
        <span class="hrating-num">${formatRating(f.rating)}</span>
        <span class="hrating-stars"><i class="fas fa-star"></i></span>
        <span class="hrating-count">${f.vote_count || 0} votes</span>
      </div>` : ''}
      <div class="hero-meta-row">
        ${f.release_year ? `<span>${f.release_year}</span><span class="hmeta-dot"></span>` : ''}
        <span>${genresFromJson(f.genres).slice(0, 3).join(' · ')}</span>
      </div>
      <p class="hero-desc">${f.description || ''}</p>
      <div class="hero-btns">
        <a href="/watch/${f.slug}-episode-1" class="btn-watch">
          <i class="fas fa-play"></i> Watch Now
        </a>
        <a href="/anime/${f.slug}" class="btn-info">
          <i class="fas fa-info-circle"></i> Details
        </a>
      </div>
    </div>
  </div>`).join('')}

  ${heroItems.length > 1 ? `
  <button class="hero-arrow prev" id="heroPrevBtn" aria-label="Previous"><i class="fas fa-chevron-left"></i></button>
  <button class="hero-arrow next" id="heroNextBtn" aria-label="Next"><i class="fas fa-chevron-right"></i></button>
  <div class="hero-dots" id="heroDots">
    ${heroItems.map((_, i) => `<div class="hero-dot${i === 0 ? ' active' : ''}" data-idx="${i}"></div>`).join('')}
  </div>` : ''}
</section>
<script>
(function(){
  if (window.__heroSliderInit) return;
  window.__heroSliderInit = true;

  var slider = document.getElementById('heroSlider');
  if (!slider) return;

  var slides = slider.querySelectorAll('.hero-slide');
  var dots   = slider.querySelectorAll('.hero-dot');
  var total  = slides.length;
  if (total === 0) return;

  var cur = 0;
  var timer = null;

  function go(n) {
    slides[cur].classList.remove('active');
    if (dots[cur]) dots[cur].classList.remove('active');
    cur = ((n % total) + total) % total;
    slides[cur].classList.add('active');
    if (dots[cur]) dots[cur].classList.add('active');
  }

  function resetTimer() {
    clearInterval(timer);
    if (total > 1) timer = setInterval(function(){ go(cur + 1); }, 6500);
  }

  window.heroSlide = function(d) { go(cur + d); resetTimer(); };
  window.heroGoTo  = function(n) { go(n);       resetTimer(); };

  var prevBtn = document.getElementById('heroPrevBtn');
  var nextBtn = document.getElementById('heroNextBtn');
  if (prevBtn) prevBtn.addEventListener('click', function(){ go(cur - 1); resetTimer(); });
  if (nextBtn) nextBtn.addEventListener('click', function(){ go(cur + 1); resetTimer(); });

  var dotsWrap = document.getElementById('heroDots');
  if (dotsWrap) {
    dotsWrap.addEventListener('click', function(e) {
      var dot = e.target.closest('.hero-dot');
      if (!dot) return;
      var idx = parseInt(dot.getAttribute('data-idx'), 10);
      if (!isNaN(idx)) { go(idx); resetTimer(); }
    });
  }

  // Touch/swipe support
  var touchStartX = 0;
  slider.addEventListener('touchstart', function(e){ touchStartX = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend', function(e){
    var diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { go(diff > 0 ? cur + 1 : cur - 1); resetTimer(); }
  }, { passive: true });

  resetTimer();
})();
</script>
` : `
<section class="hero-slider" style="background: linear-gradient(135deg, #080810 0%, #111120 50%, #1c1c32 100%); min-height: 360px; display:flex; align-items:center; justify-content:center;">
  <div style="text-align:center; padding:48px 24px;">
    <div style="width:72px;height:72px;background:linear-gradient(135deg,#7c3aed,#4f46e5);border-radius:18px;display:flex;align-items:center;justify-content:center;margin:0 auto 22px;box-shadow:0 8px 32px rgba(124,58,237,0.45);">
      <i class="fas fa-dragon" style="font-size:32px; color:#fff;"></i>
    </div>
    <h1 style="font-size:36px; font-weight:900; margin-bottom:12px; background:linear-gradient(135deg,#a78bfa,#818cf8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">Welcome to ${siteName}</h1>
    <p style="color:var(--text3); font-size:15px; margin-bottom:28px; max-width:420px; margin-left:auto; margin-right:auto; line-height:1.7;">Stream the best Chinese anime (Donghua) online, completely free in HD quality.</p>
    <a href="/search" class="btn-watch" style="display:inline-flex;"><i class="fas fa-compass"></i> Browse Anime</a>
  </div>
</section>`

  // ──────────────────────────────────────────────────────────────────────
  // SCHEDULE SECTION — Date-aware, hides/shows by exact day tab click
  // ──────────────────────────────────────────────────────────────────────
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const schedByDay: Record<string, any[]> = {}
  days.forEach(d => { schedByDay[d] = [] })
  schedule.forEach(s => { if (schedByDay[s.day_of_week]) schedByDay[s.day_of_week].push(s) })

  // JS getDay(): 0=Sun,1=Mon...6=Sat → our index: Mon=0...Sun=6
  const todayJS = new Date().getDay()
  const todayIdx = todayJS === 0 ? 6 : todayJS - 1
  const todayName = days[todayIdx]

  // Generate the actual calendar date for each day of the current week
  const now = new Date()
  const weekDates: { date: number; month: string; full: string }[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(now)
    d.setDate(now.getDate() + (i - todayIdx))
    weekDates.push({
      date: d.getDate(),
      month: d.toLocaleDateString('en-US', { month: 'short' }),
      full: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    })
  }

  // Sort each day by air_time
  days.forEach(d => {
    schedByDay[d].sort((a: any, b: any) => {
      if (!a.air_time) return 1
      if (!b.air_time) return -1
      return a.air_time.localeCompare(b.air_time)
    })
  })

  // Build schedule data as JS object to embed
  const schedDataJs = JSON.stringify(schedByDay)
  const weekDatesJs = JSON.stringify(weekDates)

  const scheduleSection = `
<section class="section section-alt home-schedule-section">
  <div class="container">
    <div class="sec-head">
      <div class="sec-title"><i class="fas fa-calendar-alt" style="color:var(--purple3);margin-right:6px;"></i> Weekly Schedule</div>
      <a href="/schedule" class="sec-more">Full Schedule <i class="fas fa-chevron-right"></i></a>
    </div>
    <p class="sched-note">
      <i class="fas fa-satellite-dish" style="margin-right:5px;color:var(--purple3);"></i>
      New episodes available approximately 20–60 minutes after official broadcast time.
    </p>

    <!-- Day tabs with dates -->
    <div class="sched-tabs sched-tabs-dated" id="homeSchedTabs">
      ${days.map((d, i) => `
      <button class="sched-tab sched-tab-dated${i === todayIdx ? ' active' : ''}" data-day="${d}" data-dayidx="${i}" onclick="homeSwitchDay('${d}', ${i}, this)">
        <span class="stab-day">${d.slice(0, 3)}</span>
        <span class="stab-date">${weekDates[i].date}</span>
        ${i === todayIdx ? '<span class="today-dot"></span>' : ''}
      </button>`).join('')}
    </div>

    <!-- Banner + Right Slider Layout for Schedule -->
    <div class="banner-slider-layout" id="homeSchedBannerLayout">
      <!-- Left Banner -->
      <div class="bsl-banner bsl-banner-sched" id="homeSchedBanner">
        <a href="#" class="bsl-banner-link" id="homeSchedBannerLink">
          <img src="" alt="" class="bsl-banner-img" id="homeSchedBannerImg"
               onerror="this.src='https://placehold.co/600x400/111120/8b5cf6?text=Schedule'">
          <div class="bsl-banner-gradient"></div>
          <div class="bsl-banner-info">
            <div class="bsl-banner-badges" id="homeSchedBannerBadges"></div>
            <div class="bsl-banner-title" id="homeSchedBannerTitle">Loading...</div>
            <div class="bsl-banner-meta" id="homeSchedBannerMeta"></div>
            <div class="bsl-banner-extra" id="homeSchedBannerExtra"></div>
          </div>
        </a>
        <!-- Day header overlay -->
        <div class="bsl-sched-day-hd" id="homeSchedDayHd">
          <span id="homeSchedDayLabel"><i class="fas fa-calendar-day"></i> Loading...</span>
          <span class="sched-today-badge" id="homeSchedTodayBadge" style="display:none;"><i class="fas fa-circle" style="font-size:6px;margin-right:4px;"></i>Today</span>
        </div>
      </div>
      <!-- Right Scrollable Slider -->
      <div class="bsl-slider-wrap">
        <button class="bsl-arrow bsl-arrow-up" onclick="bslScroll('homeSchedSlider','up')" aria-label="Scroll up"><i class="fas fa-chevron-up"></i></button>
        <div class="bsl-slider" id="homeSchedSlider">
          <!-- Populated by JS -->
          <div style="padding:40px 16px;text-align:center;color:var(--text3);font-size:13px;">
            <i class="fas fa-spinner fa-spin"></i>
          </div>
        </div>
        <button class="bsl-arrow bsl-arrow-down" onclick="bslScroll('homeSchedSlider','down')" aria-label="Scroll down"><i class="fas fa-chevron-down"></i></button>
      </div>
    </div>

    <!-- Empty state (shown when no items for selected day) -->
    <div class="sched-empty home-sched-empty" id="homeSchedEmpty" style="display:none;">
      <i class="fas fa-moon"></i>
      <strong id="homeSchedEmptyMsg">No releases today</strong>
      <span>Check back later</span>
    </div>
  </div>
</section>
<script>
(function(){
  var _schedData = ${schedDataJs};
  var _weekDates = ${weekDatesJs};
  var _days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  var _todayIdx = ${todayIdx};
  var _curDay = _days[_todayIdx];
  var _curDayIdx = _todayIdx;

  function renderSchedSlider(day, dayIdx) {
    var items = _schedData[day] || [];
    var slider = document.getElementById('homeSchedSlider');
    var bannerLink = document.getElementById('homeSchedBannerLink');
    var bannerImg = document.getElementById('homeSchedBannerImg');
    var bannerTitle = document.getElementById('homeSchedBannerTitle');
    var bannerMeta = document.getElementById('homeSchedBannerMeta');
    var bannerBadges = document.getElementById('homeSchedBannerBadges');
    var bannerExtra = document.getElementById('homeSchedBannerExtra');
    var dayHdLabel = document.getElementById('homeSchedDayLabel');
    var todayBadge = document.getElementById('homeSchedTodayBadge');
    var emptyEl = document.getElementById('homeSchedEmpty');
    var bannerLayout = document.getElementById('homeSchedBannerLayout');
    var emptyMsg = document.getElementById('homeSchedEmptyMsg');
    var dateInfo = _weekDates[dayIdx] || {};

    // Update day header
    if (dayHdLabel) dayHdLabel.innerHTML = '<i class="fas fa-calendar-day"></i> ' + day + (dateInfo.full ? ' \u2014 ' + dateInfo.full : '');
    if (todayBadge) todayBadge.style.display = (dayIdx === _todayIdx) ? 'inline-flex' : 'none';

    if (items.length === 0) {
      // Show empty state, hide slider layout
      if (bannerLayout) bannerLayout.style.display = 'none';
      if (emptyEl) {
        emptyEl.style.display = 'flex';
        if (emptyMsg) emptyMsg.textContent = 'No releases on ' + day;
      }
      return;
    }

    // Show slider layout, hide empty state
    if (bannerLayout) bannerLayout.style.display = 'flex';
    if (emptyEl) emptyEl.style.display = 'none';

    // Populate slider items
    if (slider) {
      slider.innerHTML = items.map(function(s, i) {
        var epHref = s.next_episode ? '/watch/' + s.slug + '-episode-' + s.next_episode : '/anime/' + s.slug;
        var imgSafe = (s.cover_image || '').replace(/'/g, "\\'");
        var titleSafe = (s.title || '').replace(/'/g, "\\'");
        var bannerSafe = (s.banner_image || s.cover_image || '').replace(/'/g, "\\'");
        return '<a href="' + epHref + '" class="bsl-item' + (i === 0 ? ' active' : '') + '" data-idx="' + i + '" ' +
          'onmouseenter="homeSchedBannerHover(\'' + imgSafe + '\',\'' + titleSafe + '\',\'' + (s.air_time || 'TBA') + '\',' + (s.next_episode || 0) + ',\'' + epHref + '\',\'' + (s.type || '') + '\',\'' + (s.status || '') + '\',this)">' +
          '<img src="' + (s.cover_image || '') + '" alt="' + (s.title || '') + '" class="bsl-item-img" loading="lazy" ' +
          'onerror="this.src=\'https://placehold.co/60x85/111120/8b5cf6?text=?\'">' +
          '<div class="bsl-item-info">' +
          '<div class="bsl-item-title">' + (s.title || '') + '</div>' +
          '<div class="bsl-item-meta">' +
          (s.air_time ? '<span class="bsl-item-tag"><i class="fas fa-clock" style="font-size:8px;"></i> ' + s.air_time + '</span>' : '') +
          (s.next_episode ? '<span class="bsl-item-year">EP ' + s.next_episode + '</span>' : '') +
          '</div>' +
          '</div>' +
          '<div class="bsl-item-num">' + String(i + 1).padStart(2, '0') + '</div>' +
          '</a>';
      }).join('');
    }

    // Set banner from first item
    if (items.length > 0) {
      var first = items[0];
      var epHref0 = first.next_episode ? '/watch/' + first.slug + '-episode-' + first.next_episode : '/anime/' + first.slug;
      updateSchedBanner(first.cover_image || '', first.title, first.air_time || 'TBA', first.next_episode, epHref0, first.type || '', first.status || '');
    }
  }

  function updateSchedBanner(img, title, airTime, nextEp, href, type, status) {
    var bannerLink = document.getElementById('homeSchedBannerLink');
    var bannerImg = document.getElementById('homeSchedBannerImg');
    var bannerTitle = document.getElementById('homeSchedBannerTitle');
    var bannerMeta = document.getElementById('homeSchedBannerMeta');
    var bannerBadges = document.getElementById('homeSchedBannerBadges');
    var bannerExtra = document.getElementById('homeSchedBannerExtra');
    if (bannerLink) bannerLink.href = href;
    if (bannerImg && img) bannerImg.src = img;
    if (bannerTitle) bannerTitle.textContent = title;
    if (bannerMeta) {
      bannerMeta.innerHTML = (airTime ? '<span><i class="fas fa-clock" style="font-size:9px;"></i> ' + airTime + '</span>' : '') +
        (nextEp ? '<span>Episode ' + nextEp + ' upcoming</span>' : '');
    }
    if (bannerBadges) {
      var sc = (status || '').toLowerCase() === 'ongoing' ? 'bsl-badge-green' : 'bsl-badge-blue';
      bannerBadges.innerHTML =
        (type ? '<span class="bsl-badge bsl-badge-purple">' + type + '</span>' : '') +
        (status ? '<span class="bsl-badge ' + sc + '">' + status + '</span>' : '');
    }
    if (bannerExtra) {
      bannerExtra.innerHTML = nextEp
        ? '<span class="bsl-sched-ep-pill"><i class="fas fa-play-circle"></i> EP ' + nextEp + ' upcoming</span>'
        : '<span class="sched-badge">Ongoing</span>';
    }
  }

  window.homeSchedBannerHover = function(img, title, airTime, nextEp, href, type, status, el) {
    // Update active item highlight
    document.querySelectorAll('#homeSchedSlider .bsl-item').forEach(function(item) { item.classList.remove('active'); });
    if (el) el.classList.add('active');
    updateSchedBanner(img, title, airTime, nextEp, href, type, status);
  };

  window.homeSwitchDay = function(day, dayIdx, btn) {
    _curDay = day;
    _curDayIdx = dayIdx;
    // Remove active from ALL tabs
    document.querySelectorAll('#homeSchedTabs .sched-tab').forEach(function(t) {
      t.classList.remove('active');
    });
    // Activate clicked tab
    if (btn) btn.classList.add('active');
    // Render slider for selected day
    renderSchedSlider(day, dayIdx);
  };

  // Initial render for today
  renderSchedSlider(_curDay, _curDayIdx);
})();
</script>`

  const content = `
${heroSlider}

${scheduleSection}

${ongoing.length > 0 ? `
<section class="section">
  <div class="container">
    <div class="sec-head">
      <div class="sec-title"><i class="fas fa-fire" style="color:#f59e0b;margin-right:6px;"></i> Ongoing Anime</div>
      <a href="/search?status=Ongoing" class="sec-more">View All <i class="fas fa-chevron-right"></i></a>
    </div>
    <div class="scroll-row wide">
      ${ongoing.map(a => animeCard(a)).join('')}
    </div>
  </div>
</section>` : ''}

${recent.length > 0 ? `
<section class="section section-alt">
  <div class="container">
    <div class="sec-head">
      <div class="sec-title"><i class="fas fa-clock" style="color:var(--accent2);margin-right:6px;"></i> Recently Updated</div>
      <a href="/search" class="sec-more">View All <i class="fas fa-chevron-right"></i></a>
    </div>
    <div class="scroll-row wide">
      ${recent.slice(0, 12).map(a => recentEpCard(a)).join('')}
    </div>
  </div>
</section>` : ''}

${popular.length > 0 ? `
<section class="section">
  <div class="container">
    <div class="sec-head">
      <div class="sec-title"><i class="fas fa-star" style="color:var(--gold);margin-right:6px;"></i> Popular Anime</div>
      <a href="/search" class="sec-more">View All <i class="fas fa-chevron-right"></i></a>
    </div>
    <!-- Banner + Right Slider Layout -->
    <div class="banner-slider-layout" id="popularBannerLayout">
      <!-- Left Banner (featured popular) -->
      <div class="bsl-banner" id="popularBanner">
        ${popular[0] ? `
        <a href="/anime/${popular[0].slug}" class="bsl-banner-link">
          <img src="${popular[0].banner_image || popular[0].cover_image || ''}" alt="${popular[0].title}" class="bsl-banner-img"
               onerror="this.src='https://placehold.co/600x400/111120/8b5cf6?text=Popular+Anime'">
          <div class="bsl-banner-gradient"></div>
          <div class="bsl-banner-info">
            <div class="bsl-banner-badges">
              ${popular[0].type ? `<span class="bsl-badge bsl-badge-purple">${popular[0].type}</span>` : ''}
              ${popular[0].status ? `<span class="bsl-badge ${(popular[0].status || '').toLowerCase() === 'ongoing' ? 'bsl-badge-green' : 'bsl-badge-blue'}">${popular[0].status}</span>` : ''}
            </div>
            <div class="bsl-banner-title">${popular[0].title}</div>
            <div class="bsl-banner-meta">
              ${popular[0].release_year ? `<span>${popular[0].release_year}</span>` : ''}
              ${popular[0].rating ? `<span><i class="fas fa-star" style="color:var(--gold);font-size:9px;"></i> ${parseFloat(popular[0].rating).toFixed(1)}</span>` : ''}
            </div>
          </div>
        </a>` : ''}
      </div>
      <!-- Right Scrollable Slider -->
      <div class="bsl-slider-wrap">
        <button class="bsl-arrow bsl-arrow-up" id="popularSliderUp" onclick="bslScroll('popularSlider','up')" aria-label="Scroll up"><i class="fas fa-chevron-up"></i></button>
        <div class="bsl-slider" id="popularSlider">
          ${popular.slice(0, 12).map((a, i) => `
          <a href="/anime/${a.slug}" class="bsl-item${i === 0 ? ' active' : ''}" data-idx="${i}" onmouseenter="bslHover('popularBanner','popularSlider','${a.slug}','${(a.banner_image || a.cover_image || '').replace(/'/g,"\\'")}','${a.title.replace(/'/g,"\\'")}','${a.type || ''}','${a.status || ''}','${a.release_year || ''}','${a.rating ? parseFloat(a.rating).toFixed(1) : ''}',this)">
            <img src="${a.cover_image || 'https://placehold.co/60x85/111120/8b5cf6?text=?'}" alt="${a.title}" class="bsl-item-img" loading="lazy"
                 onerror="this.src='https://placehold.co/60x85/111120/8b5cf6?text=?'">
            <div class="bsl-item-info">
              <div class="bsl-item-title">${a.title}</div>
              <div class="bsl-item-meta">
                ${a.type ? `<span class="bsl-item-tag">${a.type}</span>` : ''}
                ${a.release_year ? `<span class="bsl-item-year">${a.release_year}</span>` : ''}
              </div>
              ${a.rating ? `<div class="bsl-item-score"><i class="fas fa-star" style="color:var(--gold);font-size:8px;"></i> ${parseFloat(a.rating).toFixed(1)}</div>` : ''}
            </div>
            <div class="bsl-item-num">${String(i + 1).padStart(2, '0')}</div>
          </a>`).join('')}
        </div>
        <button class="bsl-arrow bsl-arrow-down" id="popularSliderDown" onclick="bslScroll('popularSlider','down')" aria-label="Scroll down"><i class="fas fa-chevron-down"></i></button>
      </div>
    </div>
  </div>
</section>
<script>
(function(){
  // Banner+Slider shared helpers
  if (window.__bslInit) return;
  window.__bslInit = true;

  window.bslScroll = function(sliderId, dir) {
    var el = document.getElementById(sliderId);
    if (!el) return;
    el.scrollBy({ top: dir === 'down' ? 180 : -180, behavior: 'smooth' });
  };

  window.bslHover = function(bannerId, sliderId, slug, img, title, type, status, year, rating, hoveredEl) {
    var banner = document.getElementById(bannerId);
    if (!banner) return;
    // Update active state on slider items
    if (sliderId) {
      document.querySelectorAll('#' + sliderId + ' .bsl-item').forEach(function(it) { it.classList.remove('active'); });
      if (hoveredEl) hoveredEl.classList.add('active');
    }
    var link = banner.querySelector('.bsl-banner-link');
    var imgEl = banner.querySelector('.bsl-banner-img');
    var titleEl = banner.querySelector('.bsl-banner-title');
    var metaEl = banner.querySelector('.bsl-banner-meta');
    var badgesEl = banner.querySelector('.bsl-banner-badges');
    if (link) link.href = '/anime/' + slug;
    if (imgEl && img) { imgEl.src = img; }
    if (titleEl) titleEl.textContent = title;
    if (metaEl) {
      metaEl.innerHTML = (year ? '<span>' + year + '</span>' : '') +
        (rating ? '<span><i class="fas fa-star" style="color:var(--gold);font-size:9px;"></i> ' + rating + '</span>' : '');
    }
    if (badgesEl) {
      var statusClass = (status || '').toLowerCase() === 'ongoing' ? 'bsl-badge-green' : 'bsl-badge-blue';
      badgesEl.innerHTML =
        (type ? '<span class="bsl-badge bsl-badge-purple">' + type + '</span>' : '') +
        (status ? '<span class="bsl-badge ' + statusClass + '">' + status + '</span>' : '');
    }
  };
})();
</script>` : ''}

${trending.length > 0 ? `
<section class="section section-alt">
  <div class="container">
    <div class="sec-head">
      <div class="sec-title"><i class="fas fa-chart-line" style="color:var(--pink);margin-right:6px;"></i> Trending Now</div>
      <a href="/search" class="sec-more">View All <i class="fas fa-chevron-right"></i></a>
    </div>
    <div class="scroll-row">
      ${trending.map(a => animeCard(a)).join('')}
    </div>
  </div>
</section>` : ''}
`

  return layout(`${siteName} — Free Anime Streaming Online`, content, '', siteName, siteUrl)
}
