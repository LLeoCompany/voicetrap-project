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
        next.scrollTop = 0;
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


  /* ═══════════════════════════════════════════════════════════════════════
     음파 웨이브폼 생성 + 오디오 플레이어
     ─────────────────────────────────────────────────────────────────────
     waveId    : .phone-wave 컨테이너 id
     btnId     : .wave-play-btn id
     audioSrc  : 오디오 파일 경로 (없으면 null — 비주얼만 표시)
  ═══════════════════════════════════════════════════════════════════════ */

  function initWavePlayer(waveId, btnId, audioSrc) {
    var btn = document.getElementById(btnId);
    if (!btn) return;

    /* 오디오 없으면 비주얼만 (이미지 애니메이션은 CSS로 항상 동작) */
    if (!audioSrc) return;

    /* iOS Safari AudioContext unlock */
    var audio    = new Audio(audioSrc);
    var unlocked = false;

    function unlockAudio() {
      if (unlocked) return;
      try {
        var ctx = new (window.AudioContext || window.webkitAudioContext)();
        var buf = ctx.createBuffer(1, 1, 22050);
        var src = ctx.createBufferSource();
        src.buffer = buf;
        src.connect(ctx.destination);
        src.start(0);
        ctx.resume().then(function () { unlocked = true; });
      } catch (e) { unlocked = true; }
    }

    btn.addEventListener('click', function () {
      unlockAudio();
      if (audio.paused) {
        audio.play().catch(function () {});
        btn.classList.add('playing');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        audio.pause();
        btn.classList.remove('playing');
        btn.setAttribute('aria-pressed', 'false');
      }
    });

    audio.addEventListener('ended', function () {
      btn.classList.remove('playing');
      btn.setAttribute('aria-pressed', 'false');
      audio.currentTime = 0;
    });
  }


  /* ── DOMContentLoaded ──────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {

    /* ── 음파 + 오디오 초기화 (step1·2·3) ──
       오디오 파일 준비 시 경로를 두 번째 인수로 변경
       예) 'audio/step1.mp3'                          */
    initWavePlayer('wave-step1', 'btn-step1-play', null);
    initWavePlayer('wave-step2', 'btn-step2-play', null);
    initWavePlayer('wave-step3', 'btn-step3-play', null);


    /* ── INTRO 1 → INTRO 2 ── */
    var btnIntro1 = document.getElementById('btn-intro1-next');
    if (btnIntro1) btnIntro1.addEventListener('click', function () {
      goToScreen('screen-intro2');
    });

    /* ── INTRO 2 → MAIN ── */
    var btnIntro2 = document.getElementById('btn-intro2-next');
    if (btnIntro2) btnIntro2.addEventListener('click', function () {
      goToScreen('screen-main');
    });

    /* ── MAIN → STEP 1 ── */
    var btnMainStart = document.getElementById('btn-main-start');
    if (btnMainStart) btnMainStart.addEventListener('click', function () {
      goToScreen('screen-step1');
    });

    /* ── STEP 1 선택 ── */
    var btnStep1A = document.getElementById('btn-step1-a');
    if (btnStep1A) btnStep1A.addEventListener('click', function () {
      goToScreen('screen-step1-suc');
    });
    var btnStep1B = document.getElementById('btn-step1-b');
    if (btnStep1B) btnStep1B.addEventListener('click', function () {
      goToScreen('screen-step1-fail');
    });

    /* ── STEP 1 결과 → STEP 2 ── */
    var btnStep1SucNext = document.getElementById('btn-step1-suc-next');
    if (btnStep1SucNext) btnStep1SucNext.addEventListener('click', function () {
      goToScreen('screen-step2');
    });
    var btnStep1FailNext = document.getElementById('btn-step1-fail-next');
    if (btnStep1FailNext) btnStep1FailNext.addEventListener('click', function () {
      goToScreen('screen-step2');
    });

    /* ── STEP 2 선택 ── */
    var btnStep2A = document.getElementById('btn-step2-a');
    if (btnStep2A) btnStep2A.addEventListener('click', function () {
      goToScreen('screen-step2-suc');
    });
    var btnStep2B = document.getElementById('btn-step2-b');
    if (btnStep2B) btnStep2B.addEventListener('click', function () {
      goToScreen('screen-step2-fail');
    });

    /* ── STEP 2 결과 → STEP 3 ── */
    var btnStep2SucNext = document.getElementById('btn-step2-suc-next');
    if (btnStep2SucNext) btnStep2SucNext.addEventListener('click', function () {
      goToScreen('screen-step3');
    });
    var btnStep2FailNext = document.getElementById('btn-step2-fail-next');
    if (btnStep2FailNext) btnStep2FailNext.addEventListener('click', function () {
      goToScreen('screen-step3');
    });

    /* ── STEP 3 선택 ── */
    var btnStep3A = document.getElementById('btn-step3-a');
    if (btnStep3A) btnStep3A.addEventListener('click', function () {
      goToScreen('screen-step3-suc');
    });
    var btnStep3B = document.getElementById('btn-step3-b');
    if (btnStep3B) btnStep3B.addEventListener('click', function () {
      goToScreen('screen-step3-fail');
    });

    /* ── STEP 3 결과 → RESULT ── */
    var btnStep3SucNext = document.getElementById('btn-step3-suc-next');
    if (btnStep3SucNext) btnStep3SucNext.addEventListener('click', function () {
      goToScreen('screen-result');
    });
    var btnStep3FailNext = document.getElementById('btn-step3-fail-next');
    if (btnStep3FailNext) btnStep3FailNext.addEventListener('click', function () {
      goToScreen('screen-result');
    });

    /* ── RESULT → 처음으로 ── */
    var btnRetry = document.getElementById('btn-retry');
    if (btnRetry) btnRetry.addEventListener('click', function () {
      goToScreen('screen-intro1');
    });

  });

})();
