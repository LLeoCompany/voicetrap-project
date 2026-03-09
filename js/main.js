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
     SVG 이퀄라이저 — 레퍼런스 이미지 재현
     · gradientUnits="userSpaceOnUse" → x 위치 기반 일관된 색상
     · Gaussian 봉우리 엔벨로프 → 멀티 피크 실루엣
     · clipPath 도트 세그먼트 → 작은 사각 블록 스타일
     · rAF + 사인파 합성 → 유기적 파동
  ═══════════════════════════════════════════════════════════════════════ */
  function createWaveBars(containerId, barCount) {
    var container = document.getElementById(containerId);
    if (!container) return;
    barCount = barCount || 64;

    var NS       = 'http://www.w3.org/2000/svg';
    var gradId   = 'wg-' + containerId;
    var filterId = 'wf-' + containerId;
    var clipId   = 'wc-' + containerId;

    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'wave-svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.setAttribute('aria-hidden', 'true');

    var defs = document.createElementNS(NS, 'defs');

    /* ── 레인보우 그라디언트 (x 위치 기반 — 높이 무관) ── */
    var grad = document.createElementNS(NS, 'linearGradient');
    grad.setAttribute('id', gradId);
    grad.setAttribute('gradientUnits', 'userSpaceOnUse');
    grad.setAttribute('x1', '0'); grad.setAttribute('y1', '0');
    grad.setAttribute('x2', '100'); grad.setAttribute('y2', '0');
    var colorStops = [
      { o: '0%',   c: '#ff2200' },
      { o: '14%',  c: '#ff00bb' },
      { o: '28%',  c: '#7700ff' },
      { o: '40%',  c: '#0033ff' },
      { o: '52%',  c: '#00bbff' },
      { o: '63%',  c: '#00ff55' },
      { o: '75%',  c: '#aaff00' },
      { o: '87%',  c: '#ffee00' },
      { o: '100%', c: '#ff7700' }
    ];
    for (var si = 0; si < colorStops.length; si++) {
      var st = document.createElementNS(NS, 'stop');
      st.setAttribute('offset',     colorStops[si].o);
      st.setAttribute('stop-color', colorStops[si].c);
      grad.appendChild(st);
    }

    /* ── 네온 글로우 필터 ── */
    var filter = document.createElementNS(NS, 'filter');
    filter.setAttribute('id', filterId);
    filter.setAttribute('x', '-25%'); filter.setAttribute('y', '-25%');
    filter.setAttribute('width', '150%'); filter.setAttribute('height', '150%');
    var fblur = document.createElementNS(NS, 'feGaussianBlur');
    fblur.setAttribute('in', 'SourceGraphic');
    fblur.setAttribute('stdDeviation', '1.2');
    fblur.setAttribute('result', 'b');
    var fmerge = document.createElementNS(NS, 'feMerge');
    var fm1 = document.createElementNS(NS, 'feMergeNode'); fm1.setAttribute('in', 'b');
    var fm2 = document.createElementNS(NS, 'feMergeNode'); fm2.setAttribute('in', 'SourceGraphic');
    fmerge.appendChild(fm1); fmerge.appendChild(fm2);
    filter.appendChild(fblur); filter.appendChild(fmerge);

    /* ── 도트 세그먼트 클립 (작은 사각 블록) ── */
    var clip = document.createElementNS(NS, 'clipPath');
    clip.setAttribute('id', clipId);
    var DOT_H = 1.6, DOT_G = 0.9;
    for (var s = 0; (s * (DOT_H + DOT_G)) < 100; s++) {
      var cr = document.createElementNS(NS, 'rect');
      cr.setAttribute('x', '0');
      cr.setAttribute('y', (s * (DOT_H + DOT_G)).toFixed(2));
      cr.setAttribute('width', '100');
      cr.setAttribute('height', DOT_H);
      clip.appendChild(cr);
    }

    defs.appendChild(grad);
    defs.appendChild(filter);
    defs.appendChild(clip);
    svg.appendChild(defs);

    /* ── 바 그룹 ── */
    var g = document.createElementNS(NS, 'g');
    g.setAttribute('fill',       'url(#' + gradId   + ')');
    g.setAttribute('clip-path', 'url(#' + clipId   + ')');
    g.setAttribute('filter',    'url(#' + filterId + ')');

    /* 가우시안 함수 — 봉우리 모양 */
    function gauss(x, c, s) {
      return Math.exp(-Math.pow(x - c, 2) / (2 * s * s));
    }

    var BAR_W = 0.82;
    var GAP   = (100 - barCount * BAR_W) / (barCount + 1);
    var bars  = [];

    for (var i = 0; i < barCount; i++) {
      var r = i / (barCount - 1); /* 0~1 */
      var x = GAP + i * (BAR_W + GAP);

      /* 레퍼런스 이미지 봉우리 재현
         ① 파랑 중심 큰 봉우리  ② 초록/노랑 봉우리
         ③ 핑크 봉우리          ④ 노랑 오른쪽 봉우리
         ⑤ 왼쪽 작은 클러스터  ⑥ 오른쪽 테일 */
      var amp = 0.06
              + gauss(r, 0.38, 0.07) * 0.92
              + gauss(r, 0.62, 0.09) * 0.76
              + gauss(r, 0.22, 0.06) * 0.44
              + gauss(r, 0.78, 0.05) * 0.58
              + gauss(r, 0.10, 0.04) * 0.20
              + gauss(r, 0.90, 0.04) * 0.18
              + gauss(r, 0.50, 0.03) * 0.22;
      amp = Math.min(0.96, amp);

      var rect = document.createElementNS(NS, 'rect');
      rect.setAttribute('x',      x.toFixed(2));
      rect.setAttribute('y',      '50');
      rect.setAttribute('width',  BAR_W);
      rect.setAttribute('height', '0');
      rect.setAttribute('class',  'wave-bar');
      g.appendChild(rect);

      bars.push({
        el:    rect,
        amp:   amp,
        phase: r * Math.PI * 9 + Math.random() * Math.PI * 0.5
      });
    }

    svg.appendChild(g);
    var playBtn = container.querySelector('.wave-play-btn');
    container.insertBefore(svg, playBtn);

    /* ── rAF 루프 ── */
    var t0 = null;
    function tick(ts) {
      if (!t0) t0 = ts;
      var t = (ts - t0) / 1000;

      for (var j = 0; j < bars.length; j++) {
        var ph  = bars[j].phase;
        var amp = bars[j].amp;

        /* 3개 사인파 합성 → 자연스러운 파동 */
        var h = Math.sin(t * 2.7 + ph)       * 0.42
              + Math.sin(t * 5.1 + ph * 1.4) * 0.30
              + Math.sin(t * 1.3 + ph * 0.5) * 0.28;
        h = (h + 1) / 2;
        h = Math.max(0.05, h) * amp;

        var barH = h * 94;
        var barY = (100 - barH) / 2;   /* 중앙 기준 상하 대칭 */

        bars[j].el.setAttribute('height', barH.toFixed(1));
        bars[j].el.setAttribute('y',      barY.toFixed(1));
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
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

    /* ── 스크롤 힌트 — 클릭 시 맨 아래로, 최하단 도달 시 숨김 ── */
    var failScreenIds = ['screen-step1-fail', 'screen-step2-fail', 'screen-step3-fail'];
    failScreenIds.forEach(function (id) {
      var screen = document.getElementById(id);
      if (!screen) return;
      var hint = screen.querySelector('.scroll-hint');
      if (!hint) return;

      /* 클릭 → 맨 아래로 스크롤 */
      hint.addEventListener('click', function () {
        screen.scrollTo({ top: screen.scrollHeight, behavior: 'smooth' });
      });

      /* 스크롤 → 최하단 근처면 숨김 */
      screen.addEventListener('scroll', function () {
        var remaining = screen.scrollHeight - screen.scrollTop - screen.clientHeight;
        hint.style.opacity = remaining < 40 ? '0' : '';
        hint.style.pointerEvents = remaining < 40 ? 'none' : '';
      });
    });

    /* ── SVG 이퀄라이저 생성 ── */
    createWaveBars('wave-step1');
    createWaveBars('wave-step2');
    createWaveBars('wave-step3');

    /* ── 오디오 초기화 ── */
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

    /* ── STEP 1 선택 ──
       A: 수사관 안내에 따라 진행 → FAIL (속는 선택)
       B: 전화를 끊고 공식 기관  → SUCCESS (올바른 선택) */
    var btnStep1A = document.getElementById('btn-step1-a');
    if (btnStep1A) btnStep1A.addEventListener('click', function () {
      goToScreen('screen-step1-fail');
    });
    var btnStep1B = document.getElementById('btn-step1-b');
    if (btnStep1B) btnStep1B.addEventListener('click', function () {
      goToScreen('screen-step1-suc');
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
