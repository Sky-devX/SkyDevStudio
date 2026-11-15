// Edit this block when the public repository URL changes.
const SITE_CONFIG = {
  githubUrl: 'https://github.com/Sky-devX',
  cloneUrl: 'https://github.com/Sky-devX/SkyDev_programs',
  // Add your PayPal donation URL here. Use {amount} in a PayPal.Me URL to pass the selected amount.
  paypalUrl: ''
};
document.querySelectorAll('[data-github-link]').forEach(link => { link.href = SITE_CONFIG.githubUrl; });
document.getElementById('clone-command').textContent = 'git clone ' + SITE_CONFIG.cloneUrl;
document.getElementById('copyright-year').textContent = new Date().getFullYear();

const donationDialog = document.getElementById('donation-dialog');
const donationAmount = document.getElementById('donation-amount');
const donationSubmit = document.getElementById('donation-submit');
function updateDonationButton() {
  const amount = Number(donationAmount.value);
  const validAmount = Number.isFinite(amount) && amount >= 1 && amount <= 1000;
  donationSubmit.disabled = !SITE_CONFIG.paypalUrl || !validAmount;
  donationSubmit.textContent = SITE_CONFIG.paypalUrl && validAmount
    ? `Continue with PayPal · €${amount.toFixed(2)}`
    : 'PayPal link coming soon';
}
function openDonation(event) {
  if (event) event.preventDefault();
  if (!donationDialog.open) donationDialog.showModal();
  updateDonationButton();
}
document.getElementById('open-donation').addEventListener('click', openDonation);
document.querySelectorAll('[data-open-donation]').forEach(link => link.addEventListener('click', openDonation));
document.getElementById('close-donation').addEventListener('click', () => donationDialog.close());
donationDialog.addEventListener('click', event => { if (event.target === donationDialog) donationDialog.close(); });
donationAmount.addEventListener('input', updateDonationButton);
donationSubmit.addEventListener('click', () => {
  const amount = Number(donationAmount.value);
  if (!SITE_CONFIG.paypalUrl || !Number.isFinite(amount) || amount < 1 || amount > 1000) return;
  const target = SITE_CONFIG.paypalUrl.replace('{amount}', amount.toFixed(2));
  window.open(target, '_blank', 'noopener,noreferrer');
});
updateDonationButton();

const view = document.getElementById('app-view');
const title = document.getElementById('view-title');
const crumb = document.getElementById('current-page');
const nav = [...document.querySelectorAll('.side-item')];
const toast = document.getElementById('toast');
let toastTimer;
let demoPaused = false;
function notify(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3300);
}
function appCard(icon, name, desc, color) {
  return `<article class="sample-app"><span class="state">PREVIEW</span><span class="sample-icon ${color}">${icon}</span><b>${name}</b><small>${desc}</small></article>`;
}
function render(page) {
  nav.forEach(button => button.classList.toggle('is-current', button.dataset.page === page));
  crumb.textContent = page.toUpperCase();
  if (page === 'Home') {
    title.textContent = 'Welcome back.';
    view.innerHTML = `<div class="home-welcome"><small>YOUR SKYDEV WORKSPACE</small><h3>Everything new, all in one place.</h3><p>Discover new programs and stay up to date with news and releases.</p><button class="welcome-link" data-goto="Apps">Explore the app catalog <span>↗</span></button></div><div class="view-row"><b>Try something new</b><button data-goto="Apps">All apps →</button></div><div class="sample-apps">${appCard('⌘','SkyDev Quick Tools','Small desktop utilities','')}${appCard('▶','SkyDev Motion Lab','Motion and streaming','violet')}</div>`;
  } else if (page === 'Apps') {
    title.textContent = 'Discover apps.';
    view.innerHTML = `<span class="view-overline">APP CATALOG · PREVIEW</span><div class="view-row"><b>Test apps</b><button>2 examples</button></div><div class="sample-apps">${appCard('⌘','SkyDev Quick Tools','Everyday utilities','')}${appCard('▶','SkyDev Motion Lab','Motion and streaming','violet')}</div><div class="home-welcome" style="margin-top:12px;padding:11px 13px"><p>This is a preview of the app catalog. Installable programs will appear here once they are published in the SkyDev catalog.</p></div>`;
  } else if (page === 'Collections') {
    title.textContent = 'Your collections.';
    view.innerHTML = `<span class="view-overline">BROWSE BY TOPIC</span><div class="view-row"><b>Collections</b><button>Easy to find</button></div><div class="sample-apps">${appCard('◈','Productivity','Tools and everyday helpers','')}${appCard('▶','Creative','Motion, video, and design','violet')}</div><p style="margin-top:12px;color:#969093;font-size:9px;line-height:1.5">Collections group programs by topic in the Studio.</p>`;
  } else if (page === 'Calendar') {
    title.textContent = 'What’s coming up.';
    view.innerHTML = `<span class="view-overline">SKYDEV EVENTS</span><div class="view-row"><b>Calendar preview</b><button>All events →</button></div><div class="home-welcome"><small>DEMO EVENT</small><h3>New programs in the Studio</h3><p>Events and announcements will appear here as SkyDev publishes new updates.</p></div><p style="margin-top:12px;color:#969093;font-size:9px">This calendar is an example preview of the website.</p>`;
  } else {
    title.textContent = 'Your downloads, at a glance.';
    view.innerHTML = `<span class="view-overline">DOWNLOADS & UPDATES</span><div class="view-row"><b>Activity</b><button id="auto-setting">Automatic updates: Off</button></div><div class="progress-demo"><div class="progress-head"><b>SkyDev Motion Lab</b><span id="download-state">Ready to install</span></div><div class="progress-track"><i id="progress-fill" style="width:0"></i></div><div class="progress-foot"><span>Preview · 0 MB</span><b id="progress-percent">0%</b></div><div class="progress-actions"><button id="download-demo">↓&nbsp; Start demo</button><span>Pause downloads at any time</span></div></div><p style="margin-top:12px;color:#969093;font-size:9px">This progress indicator is a preview of the Studio interface.</p>`;
    wireDownloads();
  }
  view.querySelectorAll('[data-goto]').forEach(button => button.addEventListener('click', () => render(button.dataset.goto)));
}
function wireDownloads() {
  const start = document.getElementById('download-demo');
  const fill = document.getElementById('progress-fill');
  const state = document.getElementById('download-state');
  const percent = document.getElementById('progress-percent');
  const setting = document.getElementById('auto-setting');
  let amount = 0;
  let timer;
  start.addEventListener('click', () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
      start.innerHTML = '▶&nbsp; Fortsetzen';
      state.textContent = 'Paused';
      return;
    }
    if (amount >= 100) amount = 0;
    start.innerHTML = 'Ⅱ&nbsp; Pause';
    state.textContent = 'Downloading';
    timer = setInterval(() => {
      amount = Math.min(100, amount + 7);
      fill.style.width = amount + '%';
      percent.textContent = amount + '%';
      if (amount >= 100) {
        clearInterval(timer);
        timer = null;
        start.innerHTML = '↻&nbsp; Replay';
        state.textContent = 'Preview complete';
      }
    }, 300);
  });
  setting.addEventListener('click', () => {
    const enabled = setting.textContent.endsWith('Off');
    setting.textContent = 'Automatic updates: ' + (enabled ? 'On' : 'Off');
    notify('Setting changed in the Studio preview.');
  });
}
nav.forEach(button => button.addEventListener('click', () => render(button.dataset.page)));
document.getElementById('pause-demo').addEventListener('click', event => {
  demoPaused = !demoPaused;
  event.currentTarget.innerHTML = demoPaused ? '▶&nbsp; Resume' : 'Ⅱ&nbsp; Pause';
  const bar = document.querySelector('.progress-track i');
  bar.style.width = demoPaused ? '45%' : '68%';
  notify(demoPaused ? 'Download paused in the preview.' : 'Download resumed in the preview.');
});
render('Home');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -35px 0px' });
  document.querySelectorAll('.section-heading, .feature-card, .download-banner, .faq > div').forEach(element => {
    element.classList.add('reveal');
    revealObserver.observe(element);
  });
} else {
  document.querySelectorAll('.section-heading, .feature-card, .download-banner, .faq > div').forEach(element => element.classList.add('is-visible'));
}

const copyClone = document.getElementById('copy-clone');
copyClone.addEventListener('click', async () => {
  const command = 'git clone ' + SITE_CONFIG.cloneUrl;
  try {
    await navigator.clipboard.writeText(command);
    notify('Clone command copied to clipboard.');
  } catch {
    const field = document.createElement('textarea');
    field.value = command;
    field.style.position = 'fixed';
    field.style.opacity = '0';
    document.body.append(field);
    field.select();
    document.execCommand('copy');
    field.remove();
    notify('Clone command copied to clipboard.');
  }
});
document.querySelectorAll('[data-placeholder]').forEach(link => link.addEventListener('click', event => {
  event.preventDefault();
  notify(link.dataset.placeholder);
}));

const teaserDialog = document.getElementById('teaser-dialog');
const teaserCanvas = document.getElementById('teaser-canvas');
const teaserContext = teaserCanvas.getContext('2d');
const teaserVideo = document.getElementById('teaser-video');
const teaserToggle = document.getElementById('teaser-toggle');
const teaserToggleIcon = document.getElementById('teaser-toggle-icon');
const teaserToggleLabel = document.getElementById('teaser-toggle-label');
const teaserProgress = document.getElementById('teaser-progress');
const teaserClock = document.getElementById('teaser-clock');
const teaserSceneLabel = document.getElementById('teaser-scene-label');
const teaserCaption = document.getElementById('teaser-live-caption');
const teaserDuration = 20;
let teaserElapsed = 0;
let teaserPlaying = false;
let teaserAnimation = 0;
let teaserRecorder = null;
let teaserStream = null;
let teaserChunks = [];
let teaserVideoUrl = '';
let teaserVideoMode = false;
let teaserCompleted = false;
let teaserLastScene = -1;
const configuredTeaserVideo = teaserVideo.dataset.videoSrc?.trim() || '';

function rounded(ctx, x, y, w, h, radius, color, stroke) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, radius);
  ctx.fillStyle = color;
  ctx.fill();
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1; ctx.stroke(); }
}
function drawLabel(ctx, value, x, y, size, color, weight = 500, align = 'left') {
  ctx.fillStyle = color;
  ctx.font = weight + ' ' + size + 'px Segoe UI, Arial, sans-serif';
  ctx.textAlign = align;
  ctx.fillText(value, x, y);
}
function drawTeaserFrame(seconds) {
  const ctx = teaserContext;
  const width = teaserCanvas.width, height = teaserCanvas.height;
  const scenes = [
    {tag:'01 / APP CATALOG', title:'Find your next favorite.', subtitle:'Browse new SkyDev apps in one clear catalog.', caption:'Find new tools and test apps in one clean catalog.'},
    {tag:'02 / ONE-CLICK INSTALL', title:'One click gets you started.', subtitle:'Install a program and watch each step.', caption:'Start an install and watch the progress live.'},
    {tag:'03 / WHAT’S NEW', title:'Fresh news, right at home.', subtitle:'See new programs and announcements on Home.', caption:'Catch new releases, short videos, and announcements.'},
    {tag:'04 / DOWNLOAD CONTROL', title:'Your updates. Your call.', subtitle:'Pause, resume, and choose your update settings.', caption:'Pause or resume downloads whenever you need.'},
    {tag:'05 / SKYDEV STUDIO', title:'Your apps. One place.', subtitle:'A growing home for everything SkyDev.', caption:'SkyDev Studio. One place for what’s next.'}
  ];
  const safeSeconds = Number.isFinite(Number(seconds)) ? Math.max(0, Math.min(teaserDuration, Number(seconds))) : 0;
  const scene = Math.max(0, Math.min(scenes.length - 1, Math.floor(safeSeconds / 4)));
  const local = ((safeSeconds === teaserDuration ? safeSeconds - .001 : safeSeconds) % 4) / 4;
  const info = scenes[scene];
  ctx.clearRect(0, 0, width, height);
  const background = ctx.createLinearGradient(0, 0, width, height);
  background.addColorStop(0, '#070708'); background.addColorStop(.62, '#0c0b0c'); background.addColorStop(1, '#1a0e0b');
  ctx.fillStyle = background; ctx.fillRect(0, 0, width, height);
  ctx.save(); ctx.globalAlpha = .055;
  ctx.fillStyle = '#fff'; ctx.font = '800 206px Segoe UI, Arial, sans-serif'; ctx.textAlign = 'center'; ctx.fillText('SKYDEV', width / 2, 180);
  ctx.restore();
  const glow = ctx.createRadialGradient(1020, 600, 20, 1020, 600, 460);
  glow.addColorStop(0, '#c4441d2e'); glow.addColorStop(1, '#c4441d00');
  ctx.fillStyle = glow; ctx.fillRect(0, 0, width, height);
  const focusPoints = [[700,390],[700,345],[710,340],[1010,270],[640,380]];
  const focus = focusPoints[scene];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const swayX = reduceMotion ? 0 : Math.sin(safeSeconds * .92) * 19 + Math.sin(safeSeconds * 1.7) * 4;
  const swayY = reduceMotion ? 0 : Math.cos(safeSeconds * .74) * 8;
  const zoom = reduceMotion ? 1 : 1.035 + Math.sin(safeSeconds * .62) * .018;
  ctx.save();
  ctx.translate(width / 2 + swayX, height / 2 + swayY);
  ctx.scale(zoom, zoom);
  ctx.translate(-width / 2 - (focus[0] - width / 2) * .065, -height / 2 - (focus[1] - height / 2) * .065);
  const x = 74, y = 54, w = 1132, h = 612, barH = 49, sideW = 190;
  rounded(ctx, x, y, w, h, 18, '#101011', '#403a3c');
  ctx.save(); ctx.beginPath(); ctx.roundRect(x, y, w, barH, [18,18,0,0]); ctx.clip(); ctx.fillStyle = '#171617'; ctx.fillRect(x, y, w, barH); ctx.restore();
  ['#f16b61','#e4b34e','#69b87b'].forEach((color, i) => { ctx.beginPath(); ctx.fillStyle = color; ctx.arc(x + 23 + i * 15, y + 24, 4.5, 0, Math.PI * 2); ctx.fill(); });
  rounded(ctx, x + 78, y + 12, 24, 24, 7, '#392019');
  drawLabel(ctx, '✦', x + 90, y + 29, 15, '#ff8b64', 700, 'center');
  drawLabel(ctx, 'SkyDev Studio', x + 112, y + 29, 14, '#eee', 700);
  drawLabel(ctx, 'APP CENTER', x + w - 22, y + 28, 9, '#858082', 600, 'right');
  ctx.fillStyle = '#0c0c0d'; ctx.fillRect(x, y + barH, sideW, h - barH);
  ctx.strokeStyle = '#2a2728'; ctx.beginPath(); ctx.moveTo(x + sideW, y + barH); ctx.lineTo(x + sideW, y + h); ctx.stroke();
  drawLabel(ctx, 'WORKSPACE', x + 23, y + 83, 9, '#777174', 700);
  const navRows = [['⌂','Home'],['▦','Apps'],['◈','Collections'],['▣','Calendar'],['↓','Downloads']];
  navRows.forEach((row, i) => {
    const rowY = y + 100 + i * 39;
    if (i === (scene === 2 ? 0 : scene === 3 ? 4 : 1)) rounded(ctx, x + 11, rowY - 21, sideW - 22, 31, 6, '#252223');
    drawLabel(ctx, row[0], x + 30, rowY, 14, '#ff835b', 600);
    drawLabel(ctx, row[1], x + 52, rowY, 12, '#d2cdce', 500);
  });
  const contentX = x + sideW + 34;
  drawLabel(ctx, 'SKYDEV STUDIO  /  ' + (scene === 2 ? 'HOME' : scene === 3 ? 'DOWNLOADS' : 'APPS'), contentX, y + 82, 9, '#858082', 600);
  const enter = Math.max(.18, Math.min(1, local * 4));
  ctx.save(); ctx.globalAlpha = enter; ctx.translate(0, (1 - enter) * 10);
  drawLabel(ctx, info.title, contentX, y + 128, 27, '#f5f3f3', 650);
  drawLabel(ctx, info.subtitle, contentX, y + 153, 12, '#aaa4a6', 400);
  if (scene === 0) {
    drawLabel(ctx, 'FEATURED TEST APPS', contentX, y + 200, 9, '#ff936e', 700);
    const cards = [
      {name:'SkyDev Quick Tools', detail:'Small utilities for everyday tasks', glyph:'⌘', hue:'#46291e'},
      {name:'SkyDev Motion Lab', detail:'Motion graphics and stream tools', glyph:'▶', hue:'#30271f'}
    ];
    cards.forEach((card, i) => {
      const cx = contentX + i * 435, cy = y + 220;
      rounded(ctx, cx, cy, 406, 143, 12, '#171617', '#393435');
      rounded(ctx, cx + 18, cy + 18, 38, 38, 9, card.hue);
      drawLabel(ctx, card.glyph, cx + 37, cy + 44, 19, '#ff976f', 700, 'center');
      drawLabel(ctx, 'TEST APP · PREVIEW', cx + 377, cy + 29, 8, '#c2876d', 700, 'right');
      drawLabel(ctx, card.name, cx + 18, cy + 82, 15, '#f1eeee', 650);
      drawLabel(ctx, card.detail, cx + 18, cy + 108, 10, '#a7a1a3', 400);
      rounded(ctx, cx + 18, cy + 118, 87, 21, 11, '#eee');
      drawLabel(ctx, 'Explore app', cx + 61, cy + 132, 8, '#111', 700, 'center');
    });
  } else if (scene === 1) {
    rounded(ctx, contentX, y + 190, 820, 210, 13, '#171617', '#383334');
    rounded(ctx, contentX + 22, y + 213, 47, 47, 11, '#38231b');
    drawLabel(ctx, '⌘', contentX + 46, y + 245, 24, '#ff956c', 700, 'center');
    drawLabel(ctx, 'SkyDev Quick Tools', contentX + 86, y + 226, 16, '#f5f1f2', 650);
    drawLabel(ctx, 'TEST APP · VERSION 0.8', contentX + 86, y + 250, 9, '#999194', 500);
    drawLabel(ctx, 'INSTALLING', contentX + 790, y + 230, 9, '#ff916b', 700, 'right');
    rounded(ctx, contentX + 22, y + 290, 770, 7, 4, '#302c2d');
    const progress = Math.min(1, local * 1.5);
    const gradient = ctx.createLinearGradient(contentX + 22, 0, contentX + 22 + 770 * progress, 0);
    gradient.addColorStop(0, '#ff874c'); gradient.addColorStop(1, '#ed4825');
    rounded(ctx, contentX + 22, y + 290, Math.max(10, 770 * progress), 7, 4, gradient);
    drawLabel(ctx, Math.round(progress * 100) + '%', contentX + 792, y + 324, 11, '#ff986f', 700, 'right');
    drawLabel(ctx, 'Downloads stay visible. Pause or resume whenever you want.', contentX + 22, y + 360, 10, '#aaa4a6', 400);
  } else if (scene === 2) {
    rounded(ctx, contentX, y + 192, 820, 224, 13, '#171617', '#383334');
    rounded(ctx, contentX + 22, y + 215, 776, 174, 10, '#1d1819', '#473133');
    drawLabel(ctx, '✦   NEW IN THE STUDIO', contentX + 44, y + 248, 9, '#ff9872', 700);
    drawLabel(ctx, 'Quick Tools just got smarter.', contentX + 44, y + 294, 22, '#f5f1f1', 650);
    drawLabel(ctx, 'A fresh update is ready to install from your app catalog.', contentX + 44, y + 322, 11, '#aaa3a6', 400);
    rounded(ctx, contentX + 44, y + 345, 116, 27, 14, '#ef532b');
    drawLabel(ctx, 'See what’s new  ↗', contentX + 102, y + 363, 9, '#fff', 700, 'center');
  } else if (scene === 3) {
    const rows = [['SkyDev Motion Lab','Update ready','1.2.0'],['SkyDev Quick Tools','Installed','0.8'],['Pixel Board','Queued','0.4']];
    rows.forEach((row, i) => {
      const cy = y + 192 + i * 65;
      rounded(ctx, contentX, cy, 820, 51, 9, '#151415', '#332f30');
      rounded(ctx, contentX + 14, cy + 9, 31, 31, 8, i === 0 ? '#38231b' : '#252123');
      drawLabel(ctx, ['▶','⌘','▧'][i], contentX + 29, cy + 29, 13, '#ff926b', 700, 'center');
      drawLabel(ctx, row[0], contentX + 58, cy + 22, 11, '#eee', 600);
      drawLabel(ctx, row[1], contentX + 58, cy + 38, 8, '#8f898c', 400);
      drawLabel(ctx, 'v' + row[2], contentX + 790, cy + 30, 9, '#b0a9ab', 500, 'right');
      if (i === 0) { rounded(ctx, contentX + 671, cy + 12, 100, 26, 13, '#ed512a'); drawLabel(ctx, 'Update', contentX + 721, cy + 29, 9, '#fff', 700, 'center'); }
    });
  } else {
    ctx.save(); ctx.textAlign = 'center';
    drawLabel(ctx, 'SKYDEV STUDIO', x + w / 2, y + 264, 12, '#ff926c', 700, 'center');
    drawLabel(ctx, 'One Studio.', x + w / 2, y + 326, 42, '#f4f2f2', 650, 'center');
    drawLabel(ctx, 'Many possibilities.', x + w / 2, y + 373, 38, '#999395', 450, 'center');
    rounded(ctx, x + w / 2 - 79, y + 405, 158, 36, 18, '#f1efef');
    drawLabel(ctx, 'GET THE STUDIO  ↓', x + w / 2, y + 428, 9, '#111', 700, 'center');
    ctx.restore();
  }
  ctx.restore();
  const focusBoxes = [
    {x:contentX,y:y + 220,w:406,h:143},
    {x:contentX + 12,y:y + 272,w:794,h:48},
    {x:contentX + 22,y:y + 215,w:776,h:174},
    {x:contentX,y:y + 192,w:820,h:51},
    {x:x + w / 2 - 155,y:y + 292,w:310,h:152}
  ];
  const box = focusBoxes[scene];
  ctx.save();
  ctx.globalAlpha = reduceMotion ? .72 : .62 + Math.sin(safeSeconds * 5.2) * .2;
  ctx.strokeStyle = '#ff946c'; ctx.lineWidth = 2; ctx.shadowColor = '#ff683d'; ctx.shadowBlur = 22;
  ctx.setLineDash(reduceMotion ? [] : [8, 6]); ctx.lineDashOffset = reduceMotion ? 0 : -safeSeconds * 18;
  ctx.beginPath(); ctx.roundRect(box.x, box.y, box.w, box.h, 13); ctx.stroke();
  ctx.setLineDash([]); ctx.shadowBlur = 0;
  drawLabel(ctx, 'FEATURE 0' + (scene + 1), box.x + 7, box.y - 8, 8, '#ffad87', 750);
  ctx.restore();
  ctx.restore();
  const fade = Math.min(1, Math.min(local * 5, (1 - local) * 5));
  ctx.save(); ctx.globalAlpha = .45 + fade * .55;
  drawLabel(ctx, info.tag, width / 2, height - 23, 9, '#d98b6e', 700, 'center');
  ctx.restore();
}
function updateTeaserStatus() {
  const current = Math.min(teaserDuration, teaserElapsed);
  teaserProgress.style.width = (current / teaserDuration * 100) + '%';
  const seconds = Math.floor(current);
  teaserClock.textContent = '0:' + String(seconds).padStart(2, '0') + ' / 0:20';
  const scene = Math.min(4, Math.floor(current / 4));
  const labels = ['01 / APP CATALOG','02 / ONE-CLICK INSTALL','03 / WHAT’S NEW','04 / DOWNLOAD CONTROL','05 / SKYDEV STUDIO'];
  const captions = ['Find new tools and test apps in one clean catalog.','Start an install and watch the progress live.','Catch new releases, short videos, and announcements.','Pause or resume downloads whenever you need.','SkyDev Studio. One place for what’s next.'];
  teaserSceneLabel.textContent = labels[scene];
  if (scene !== teaserLastScene) {
    teaserLastScene = scene;
    teaserCaption.classList.remove('caption-enter');
    teaserCaption.textContent = captions[scene];
    void teaserCaption.offsetWidth;
    teaserCaption.classList.add('caption-enter');
  }
}
function stopTeaserRecorder() {
  if (teaserRecorder && teaserRecorder.state === 'recording') teaserRecorder.stop();
  if (teaserStream) teaserStream.getTracks().forEach(track => track.stop());
  teaserStream = null;
}
function playTeaserVideo(source = teaserVideoUrl) {
  if (!source) return;
  teaserVideoMode = true;
  teaserCanvas.hidden = true;
  teaserVideo.hidden = false;
  teaserVideo.controls = false;
  teaserVideo.muted = true;
  teaserVideo.volume = 0;
  teaserVideo.src = source;
  teaserVideo.currentTime = 0;
  teaserVideo.play().catch(() => notify('Use the video controls to play the teaser.'));
  teaserToggleIcon.textContent = 'Ⅱ';
  teaserToggleLabel.textContent = 'Pause teaser';
}
function formatTeaserTime(value) {
  const seconds = Math.floor(Math.max(0, value || 0));
  return Math.floor(seconds / 60) + ':' + String(seconds % 60).padStart(2, '0');
}
function updateVideoProgress() {
  if (!Number.isFinite(teaserVideo.duration) || teaserVideo.duration <= 0) return;
  const duration = teaserVideo.duration;
  const current = Math.min(duration, teaserVideo.currentTime || 0);
  teaserProgress.style.width = (current / duration * 100) + '%';
  teaserClock.textContent = formatTeaserTime(current) + ' / ' + formatTeaserTime(duration);
}
function runTeaserFrom(offset = 0) {
  teaserPlaying = true;
  teaserToggleIcon.textContent = 'Ⅱ';
  teaserToggleLabel.textContent = 'Pause teaser';
  let start = Date.now() - offset * 1000;
  const tick = () => {
    if (!teaserPlaying) return;
    teaserElapsed = Math.min(teaserDuration, Math.max(0, (Date.now() - start) / 1000));
    drawTeaserFrame(teaserElapsed);
    updateTeaserStatus();
    if (teaserElapsed >= teaserDuration) {
      teaserPlaying = false;
      teaserCompleted = true;
      teaserToggleIcon.textContent = '↻';
      teaserToggleLabel.textContent = 'Replay teaser';
      stopTeaserRecorder();
      return;
    }
    teaserAnimation = requestAnimationFrame(tick);
  };
  teaserAnimation = requestAnimationFrame(tick);
}
function startTeaser() {
  if (configuredTeaserVideo) {
    teaserElapsed = 0;
    teaserProgress.style.width = '0%';
    teaserClock.textContent = '0:00 / 0:00';
    teaserSceneLabel.textContent = 'SKYDEV STUDIO VIDEO';
    teaserCaption.textContent = 'A closer look at SkyDev Studio.';
    playTeaserVideo(configuredTeaserVideo);
    return;
  }
  if (teaserVideoUrl) { playTeaserVideo(teaserVideoUrl); return; }
  teaserVideoMode = false;
  teaserCompleted = false;
  teaserLastScene = -1;
  teaserCanvas.hidden = false;
  teaserVideo.hidden = true;
  teaserVideo.controls = false;
  teaserElapsed = 0;
  teaserProgress.style.width = '0%';
  teaserClock.textContent = '0:00 / 0:20';
  drawTeaserFrame(0);
  updateTeaserStatus();
  teaserChunks = [];
  try {
    if (teaserCanvas.captureStream && window.MediaRecorder) {
      teaserStream = teaserCanvas.captureStream(24);
      const types = ['video/webm;codecs=vp9','video/webm;codecs=vp8','video/webm'];
      const mimeType = types.find(type => MediaRecorder.isTypeSupported(type));
      teaserRecorder = mimeType ? new MediaRecorder(teaserStream, { mimeType, videoBitsPerSecond: 1400000 }) : new MediaRecorder(teaserStream);
      teaserRecorder.ondataavailable = event => { if (event.data && event.data.size) teaserChunks.push(event.data); };
      teaserRecorder.onstop = () => {
        if (!teaserCompleted) { teaserChunks = []; return; }
        const blob = new Blob(teaserChunks, { type: teaserRecorder.mimeType || 'video/webm' });
        if (blob.size > 0) {
          if (teaserVideoUrl) URL.revokeObjectURL(teaserVideoUrl);
          teaserVideoUrl = URL.createObjectURL(blob);
          teaserToggleIcon.textContent = '↻';
          teaserToggleLabel.textContent = 'Replay video';
        }
      };
      teaserRecorder.start(250);
    }
  } catch {
    teaserRecorder = null;
    if (teaserStream) teaserStream.getTracks().forEach(track => track.stop());
    teaserStream = null;
  }
  runTeaserFrom(0);
}
function openTeaser() {
  if (!teaserDialog.open) teaserDialog.showModal();
  if (!teaserPlaying) startTeaser();
}
document.getElementById('watch-teaser').addEventListener('click', openTeaser);
document.querySelectorAll('[data-open-teaser]').forEach(link => link.addEventListener('click', event => { event.preventDefault(); openTeaser(); }));
document.getElementById('close-teaser').addEventListener('click', () => teaserDialog.close());
teaserDialog.addEventListener('click', event => { if (event.target === teaserDialog) teaserDialog.close(); });
teaserDialog.addEventListener('close', () => {
  teaserPlaying = false;
  cancelAnimationFrame(teaserAnimation);
  stopTeaserRecorder();
  teaserVideo.pause();
  if (teaserVideoMode && teaserVideo.duration && teaserVideo.currentTime < teaserVideo.duration) teaserVideo.currentTime = 0;
});
teaserToggle.addEventListener('click', () => {
  if (teaserVideoMode) {
    if (teaserVideo.ended) { teaserVideo.currentTime = 0; teaserVideo.play().catch(() => {}); }
    else if (teaserVideo.paused) teaserVideo.play().catch(() => {});
    else teaserVideo.pause();
    return;
  }
  if (teaserPlaying) {
    teaserPlaying = false;
    cancelAnimationFrame(teaserAnimation);
    teaserToggleIcon.textContent = '▶';
    teaserToggleLabel.textContent = 'Resume teaser';
  } else if (teaserElapsed < teaserDuration) {
    runTeaserFrom(teaserElapsed);
  } else if (teaserVideoUrl) {
    playTeaserVideo();
  } else {
    startTeaser();
  }
});
teaserVideo.addEventListener('play', () => { teaserToggleIcon.textContent = 'Ⅱ'; teaserToggleLabel.textContent = 'Pause teaser'; });
teaserVideo.addEventListener('pause', () => { if (teaserVideoMode && !teaserVideo.ended) { teaserToggleIcon.textContent = '▶'; teaserToggleLabel.textContent = 'Resume teaser'; } });
teaserVideo.addEventListener('timeupdate', updateVideoProgress);
teaserVideo.addEventListener('loadedmetadata', () => {
  updateVideoProgress();
  const durationLabel = document.getElementById('teaser-duration-label');
  if (durationLabel && Number.isFinite(teaserVideo.duration)) durationLabel.textContent = formatTeaserTime(teaserVideo.duration);
});
teaserVideo.addEventListener('ended', () => { teaserToggleIcon.textContent = '↻'; teaserToggleLabel.textContent = 'Replay teaser'; });
teaserVideo.addEventListener('error', () => notify('The teaser video could not be loaded. Please check its file path.'));
