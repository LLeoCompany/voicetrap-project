/* ==========================================================================
   utils.js — 보이스피싱크홀 A+B 조합안
   ========================================================================== */

const Utils = (() => {
  'use strict';

  /* ── delay ────────────────────────────────────────────────────────────── */
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /* ── onTap (iOS 300ms 딜레이 방지) ────────────────────────────────────── */
  function onTap(el, handler) {
    if (!el) return;
    let startY = 0;
    el.addEventListener('touchstart', e => { startY = e.touches[0].clientY; }, { passive: true });
    el.addEventListener('touchend', e => {
      const dy = Math.abs(e.changedTouches[0].clientY - startY);
      if (dy < 10) { e.preventDefault(); handler(e); }
    }, { passive: false });
    el.addEventListener('click', handler);
  }

  /* ── typeWriter ───────────────────────────────────────────────────────── */
  async function typeWriter(el, text, speed = 60) {
    el.textContent = '';
    for (const ch of Array.from(text)) {
      el.textContent += ch;
      await delay(ch === '\n' ? speed * 3 : speed);
    }
  }

  /* ── flashClass ────────────────────────────────────────────────────────── */
  function flashClass(el, cls, duration = 400) {
    if (!el) return Promise.resolve();
    el.classList.add(cls);
    return delay(duration).then(() => el.classList.remove(cls));
  }

  /* ── createWaveform ───────────────────────────────────────────────────── */
  function createWaveform(container, count = 30, type = 'div') {
    if (!container) return [];
    container.innerHTML = '';
    const bars = [];

    if (type === 'svg') {
      const W = 300, H = 60;
      const gap = 2;
      const barW = (W - gap * (count - 1)) / count;
      for (let i = 0; i < count; i++) {
        const maxH = 12 + Math.random() * 36;
        const bar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        bar.setAttribute('x', i * (barW + gap));
        bar.setAttribute('y', (H - maxH) / 2);
        bar.setAttribute('width', barW);
        bar.setAttribute('height', maxH);
        bar.setAttribute('rx', barW / 2);
        bar.setAttribute('class', 'waveform-bar');
        bar.style.animationDelay = `${(i / count) * 1.8}s`;
        container.appendChild(bar);
        bars.push(bar);
      }
    } else {
      for (let i = 0; i < count; i++) {
        const bar = document.createElement('div');
        bar.className = 'waveform-bar-div';
        bar.style.height = `${6 + Math.random() * 18}px`;
        bar.style.animationDelay = `${(i / count) * 0.8}s`;
        container.appendChild(bar);
        bars.push(bar);
      }
    }
    return bars;
  }

  /* ── animateWaveform ──────────────────────────────────────────────────── */
  function animateWaveform(bars, playing) {
    bars.forEach(b => b.classList.toggle('playing', playing));
  }

  /* ── showToast ────────────────────────────────────────────────────────── */
  function showToast(msg, duration = 2500) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), duration);
  }

  /* ── copyToClipboard ─────────────────────────────────────────────────── */
  async function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try { await navigator.clipboard.writeText(text); return true; } catch(e) {}
    }
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch(e) { return false; }
  }

  /* ── applySpiceTheme (B안 방식 CSS 변수 동적 교체) ───────────────────── */
  function applySpiceTheme(color, bg) {
    document.documentElement.style.setProperty('--color-current', color);
    document.documentElement.style.setProperty('--color-current-bg', bg);
  }

  /* ── flashOverlay ────────────────────────────────────────────────────── */
  function flashOverlay(colorClass, duration = 400) {
    const el = document.getElementById('flash-overlay');
    if (!el) return Promise.resolve();
    el.classList.add(colorClass);
    el.style.opacity = '1';
    return delay(duration / 2).then(() => {
      el.style.opacity = '0';
      return delay(duration / 2);
    }).then(() => {
      el.classList.remove(colorClass);
    });
  }

  /* ── createGoldParticles ─────────────────────────────────────────────── */
  function createGoldParticles(count = 12, duration = 800) {
    const container = document.getElementById('particle-container');
    if (!container) return;
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;

    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'gold-particle';
      const size = 6 + Math.random() * 8;
      p.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${cx + (Math.random() - 0.5) * 120}px;
        top: ${cy + (Math.random() - 0.5) * 80}px;
        animation-duration: ${duration + Math.random() * 400}ms;
        animation-delay: ${Math.random() * 200}ms;
      `;
      container.appendChild(p);
      setTimeout(() => p.remove(), duration + 600);
    }
  }

  /* ── createMegaBurstParticles (지옥맛 대폭발) ───────────────────────── */
  function createMegaBurstParticles(duration = 1000) {
    const container = document.getElementById('particle-container');
    if (!container) return;
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;

    // 금색 파티클 (많이)
    for (let i = 0; i < 24; i++) {
      const p = document.createElement('div');
      p.className = 'gold-particle';
      const size = 6 + Math.random() * 12;
      const angle = (i / 24) * Math.PI * 2;
      const dist  = 60 + Math.random() * 100;
      p.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${cx + Math.cos(angle) * (dist * 0.3)}px;
        top: ${cy + Math.sin(angle) * (dist * 0.3)}px;
        animation-duration: ${duration + Math.random() * 400}ms;
        animation-delay: ${Math.random() * 150}ms;
      `;
      container.appendChild(p);
      setTimeout(() => p.remove(), duration + 600);
    }

    // 흰색 파티클
    for (let i = 0; i < 16; i++) {
      const p = document.createElement('div');
      p.className = 'white-particle';
      const size  = 4 + Math.random() * 10;
      const angle = Math.random() * Math.PI * 2;
      const dist  = 80 + Math.random() * 140;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist;
      p.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${cx}px;
        top: ${cy}px;
        --dx: ${dx}px;
        --dy: ${dy}px;
        animation-duration: ${duration + Math.random() * 300}ms;
        animation-delay: ${Math.random() * 200}ms;
      `;
      container.appendChild(p);
      setTimeout(() => p.remove(), duration + 600);
    }
  }

  return {
    delay,
    onTap,
    typeWriter,
    flashClass,
    createWaveform,
    animateWaveform,
    showToast,
    copyToClipboard,
    applySpiceTheme,
    flashOverlay,
    createGoldParticles,
    createMegaBurstParticles,
  };
})();

window.Utils = Utils;
