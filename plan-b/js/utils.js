/* utils.js — 보이스피싱 헬스키친 B안 (A안과 동일 구조, B안 전용 함수 추가) */
const Utils = (() => {
  function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

  function onTap(el, cb) {
    if (!el) return;
    let startY = 0;
    el.addEventListener('touchstart', e => { startY = e.touches[0].clientY; }, { passive: true });
    el.addEventListener('touchend', e => {
      if (Math.abs(e.changedTouches[0].clientY - startY) < 10) {
        e.preventDefault(); cb(e);
      }
    }, { passive: false });
    el.addEventListener('click', cb);
  }

  function typeWriter(el, text, speed = 65) {
    return new Promise(resolve => {
      el.textContent = '';
      const chars = Array.from(text);
      let i = 0;
      function next() {
        if (i >= chars.length) { resolve(); return; }
        const ch = chars[i++];
        if (ch === '\n') el.appendChild(document.createElement('br'));
        else el.appendChild(document.createTextNode(ch));
        setTimeout(next, speed);
      }
      next();
    });
  }

  function fadeIn(el, duration = 400) {
    return new Promise(resolve => {
      if (!el) { resolve(); return; }
      el.style.transition = `opacity ${duration}ms`;
      el.style.opacity = '0';
      requestAnimationFrame(() => requestAnimationFrame(() => {
        el.style.opacity = '1';
        el.addEventListener('transitionend', function h() {
          el.removeEventListener('transitionend', h); resolve();
        });
      }));
    });
  }

  function fadeOut(el, duration = 400) {
    return new Promise(resolve => {
      if (!el) { resolve(); return; }
      el.style.transition = `opacity ${duration}ms`;
      el.style.opacity = '1';
      requestAnimationFrame(() => requestAnimationFrame(() => {
        el.style.opacity = '0';
        el.addEventListener('transitionend', function h() {
          el.removeEventListener('transitionend', h); resolve();
        });
      }));
    });
  }

  function flashClass(el, className, duration = 600) {
    return new Promise(resolve => {
      if (!el) { resolve(); return; }
      el.classList.add(className);
      setTimeout(() => { el.classList.remove(className); resolve(); }, duration);
    });
  }

  function createWaveform(container, barCount = 28, type = 'div') {
    if (!container) return [];
    container.innerHTML = '';
    const bars = [];
    for (let i = 0; i < barCount; i++) {
      if (type === 'svg') {
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        const h = 8 + Math.random() * 40;
        rect.setAttribute('x', (i * (360 / barCount)).toFixed(1));
        rect.setAttribute('y', ((120 - h) / 2).toFixed(1));
        rect.setAttribute('width', ((360 / barCount) * 0.6).toFixed(1));
        rect.setAttribute('height', h.toFixed(1));
        rect.setAttribute('rx', '2');
        rect.classList.add('waveform-bar');
        rect.style.animationDelay = `${(i * 0.05).toFixed(2)}s`;
        container.appendChild(rect); bars.push(rect);
      } else {
        const bar = document.createElement('div');
        bar.classList.add('waveform-bar-div');
        bar.style.animationDelay = `${(i * 0.04).toFixed(2)}s`;
        container.appendChild(bar); bars.push(bar);
      }
    }
    return bars;
  }

  function animateWaveform(bars, isPlaying) {
    bars.forEach(bar => bar.classList.toggle('playing', isPlaying));
  }

  function showToast(msg, duration = 2200) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg; t.classList.add('show');
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove('show'), duration);
  }

  async function copyToClipboard(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text); return true;
      }
      const ta = document.createElement('textarea');
      ta.value = text; ta.style.cssText = 'position:fixed;top:-9999px';
      document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); document.body.removeChild(ta); return true;
    } catch { return false; }
  }

  function encodeResult(score, total = 4) {
    return `${location.origin}${location.pathname}?score=${score}&total=${total}`;
  }

  /* B안 전용: CSS 변수로 맛 단계 컬러 동적 교체 */
  function applySpiceTheme(spiceColor) {
    document.documentElement.style.setProperty('--color-current-spice', spiceColor);
  }

  /* B안 전용: 불꽃 파티클 DOM 생성 */
  function createFireParticles(container, count = 12) {
    container.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'fire-particle';
      p.style.left   = `${10 + Math.random() * 80}%`;
      p.style.bottom = `${Math.random() * 30}%`;
      p.style.animationDelay    = `${(Math.random() * 0.4).toFixed(2)}s`;
      p.style.animationDuration = `${(0.6 + Math.random() * 0.6).toFixed(2)}s`;
      p.style.width  = `${6 + Math.random() * 10}px`;
      p.style.height = p.style.width;
      container.appendChild(p);
    }
  }

  /* B안 전용: 금색 파티클 생성 */
  function createGoldParticles(container, count = 16) {
    container.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'gold-particle';
      p.style.left   = `${5 + Math.random() * 90}%`;
      p.style.top    = `${Math.random() * 40}%`;
      p.style.animationDelay    = `${(Math.random() * 0.5).toFixed(2)}s`;
      p.style.animationDuration = `${(0.8 + Math.random() * 0.6).toFixed(2)}s`;
      container.appendChild(p);
    }
  }

  function qs(sel, scope = document) { return scope.querySelector(sel); }
  function qsa(sel, scope = document) { return Array.from(scope.querySelectorAll(sel)); }
  function clamp(v, min, max) { return Math.min(Math.max(v, min), max); }

  return {
    delay, onTap, typeWriter, fadeIn, fadeOut, flashClass,
    createWaveform, animateWaveform, showToast, copyToClipboard,
    encodeResult, applySpiceTheme, createFireParticles, createGoldParticles,
    qs, qsa, clamp,
  };
})();

window.Utils = Utils;
