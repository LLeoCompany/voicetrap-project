/* ==========================================================================
   main.js — 보이스피싱크홀
   ========================================================================== */

(function () {
  'use strict';

  /* ── 화면 전환 ─────────────────────────────────────────────────────────── */
  function goToScreen(nextId) {
    var current = document.querySelector('.screen.active');
    var next    = document.getElementById(nextId);
    if (!next || next === current) return;

    if (current) current.classList.remove('active');

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        next.classList.add('active');
      });
    });
  }

  /* ── 토스트 ────────────────────────────────────────────────────────────── */
  function showToast(msg, duration) {
    duration = duration || 2200;
    var el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    setTimeout(function () { el.classList.remove('show'); }, duration);
  }

  /* ── DOMContentLoaded ──────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {

    // 화면 전환 예시:
    // goToScreen('screen-next');

  });

})();
