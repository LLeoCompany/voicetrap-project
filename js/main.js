/* ==========================================================================
   main.js — 보이스피싱크홀
   ========================================================================== */

(function () {
  "use strict";

  /* ── 화면 전환 ─────────────────────────────────────────────────────────── */

  /* 성공/실패 효과음 */
  var sucAudio  = new Audio("image/step1/success/audio/05. 박수5(웃음+공연장).mp3");
  var failAudio = new Audio("image/step1/fail/audio/[Track 01] Building Collapse Sound Effect.wav");

  /* 전체 오디오 풀 — 화면 이동 시 일괄 정지용 (glitchAudio·wavePlayers는 아래서 추가) */
  var allAudios = [sucAudio, failAudio];
  var wavePlayers = []; /* { audio, btn } 쌍 — 버튼 UI 리셋 포함 */

  function stopAllAudio() {
    allAudios.forEach(function (a) {
      a.pause();
      a.currentTime = 0;
    });
    wavePlayers.forEach(function (p) {
      p.audio.pause();
      p.audio.currentTime = 0;
      p.btn.classList.remove("playing");
      p.btn.setAttribute("aria-pressed", "false");
    });
  }

  function playScreenAudio(audio) {
    stopAllAudio();
    audio.currentTime = 0;
    audio.muted = false;
    audio.play().catch(function () {
      audio.muted = true;
      audio.play().then(function () {
        audio.muted = false;
      }).catch(function () {});
    });
  }

  var sucScreens  = ["screen-step1-suc",  "screen-step2-suc",  "screen-step3-suc"];
  var failScreens = ["screen-step1-fail", "screen-step2-fail", "screen-step3-fail"];

  function goToScreen(nextId) {
    var current = document.querySelector(".screen.active");
    var next = document.getElementById(nextId);
    if (!next || next === current) return;

    if (current) current.classList.remove("active");

    /* 성공/실패 화면: 효과음 교체 재생 / 그 외 화면: 모든 오디오 정지 */
    if (sucScreens.indexOf(nextId) !== -1) {
      playScreenAudio(sucAudio);
    } else if (failScreens.indexOf(nextId) !== -1) {
      playScreenAudio(failAudio);
    } else {
      stopAllAudio();
    }

    /* intro 벗어날 때 glitch 오디오 + 반복 루프 정지 */
    var introScreens = ["screen-intro1", "screen-intro2"];
    if (introScreens.indexOf(nextId) === -1) {
      glitchAudio.pause();
      glitchAudio.currentTime = 0;
      if (glitchLoopTimer) { clearTimeout(glitchLoopTimer); glitchLoopTimer = null; }
    }

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        next.classList.add("active");
        next.scrollTop = 0;

        /* 성공/실패 화면: 티커 + 텍스트/박스 요소 애니메이션 처음부터 재시작 */
        if (sucScreens.indexOf(nextId) !== -1 || failScreens.indexOf(nextId) !== -1) {
          var resetSelectors = [
            ".ticker-overlay", ".ticker-track",
            ".suc-mo-whitebg", ".suc-mo-img1", ".suc-mo-img2", ".suc-mo-text", ".suc-mo-button",
            ".suc-whitebg", ".suc-img1", ".suc-img2", ".suc-text", ".suc-button-img",
            ".fail-mo-people", ".fail-mo-back", ".fail-mo-emoji-bar1", ".fail-mo-emoji-bar2", ".fail-mo-text", ".fail-mo-button",
            ".fail-people", ".fail-back", ".fail-text", ".fail-button-img"
          ];
          resetSelectors.forEach(function (sel) {
            var el = next.querySelector(sel);
            if (el) {
              el.style.animation = "none";
              el.offsetHeight; /* reflow */
              el.style.animation = "";
            }
          });
        }
      });
    });
  }

  /* ── 토스트 ────────────────────────────────────────────────────────────── */
  function showToast(msg, duration) {
    duration = duration || 2200;
    var el = document.getElementById("toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("show");
    setTimeout(function () {
      el.classList.remove("show");
    }, duration);
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

    var NS = "http://www.w3.org/2000/svg";
    var gradId = "wg-" + containerId;
    var filterId = "wf-" + containerId;
    var clipId = "wc-" + containerId;

    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("class", "wave-svg");
    svg.setAttribute("viewBox", "0 0 100 100");
    svg.setAttribute("preserveAspectRatio", "none");
    svg.setAttribute("aria-hidden", "true");

    var defs = document.createElementNS(NS, "defs");

    /* ── 레인보우 그라디언트 (x 위치 기반 — 높이 무관) ── */
    var grad = document.createElementNS(NS, "linearGradient");
    grad.setAttribute("id", gradId);
    grad.setAttribute("gradientUnits", "userSpaceOnUse");
    grad.setAttribute("x1", "0");
    grad.setAttribute("y1", "0");
    grad.setAttribute("x2", "100");
    grad.setAttribute("y2", "0");
    var colorStops = [
      { o: "0%", c: "#ff2200" },
      { o: "14%", c: "#ff00bb" },
      { o: "28%", c: "#7700ff" },
      { o: "40%", c: "#0033ff" },
      { o: "52%", c: "#00bbff" },
      { o: "63%", c: "#00ff55" },
      { o: "75%", c: "#aaff00" },
      { o: "87%", c: "#ffee00" },
      { o: "100%", c: "#ff7700" },
    ];
    for (var si = 0; si < colorStops.length; si++) {
      var st = document.createElementNS(NS, "stop");
      st.setAttribute("offset", colorStops[si].o);
      st.setAttribute("stop-color", colorStops[si].c);
      grad.appendChild(st);
    }

    /* ── 네온 글로우 필터 ── */
    var filter = document.createElementNS(NS, "filter");
    filter.setAttribute("id", filterId);
    filter.setAttribute("x", "-25%");
    filter.setAttribute("y", "-25%");
    filter.setAttribute("width", "150%");
    filter.setAttribute("height", "150%");
    var fblur = document.createElementNS(NS, "feGaussianBlur");
    fblur.setAttribute("in", "SourceGraphic");
    fblur.setAttribute("stdDeviation", "1.2");
    fblur.setAttribute("result", "b");
    var fmerge = document.createElementNS(NS, "feMerge");
    var fm1 = document.createElementNS(NS, "feMergeNode");
    fm1.setAttribute("in", "b");
    var fm2 = document.createElementNS(NS, "feMergeNode");
    fm2.setAttribute("in", "SourceGraphic");
    fmerge.appendChild(fm1);
    fmerge.appendChild(fm2);
    filter.appendChild(fblur);
    filter.appendChild(fmerge);

    /* ── 도트 세그먼트 클립 (작은 사각 블록) ── */
    var clip = document.createElementNS(NS, "clipPath");
    clip.setAttribute("id", clipId);
    var DOT_H = 1.6,
      DOT_G = 0.9;
    for (var s = 0; s * (DOT_H + DOT_G) < 100; s++) {
      var cr = document.createElementNS(NS, "rect");
      cr.setAttribute("x", "0");
      cr.setAttribute("y", (s * (DOT_H + DOT_G)).toFixed(2));
      cr.setAttribute("width", "100");
      cr.setAttribute("height", DOT_H);
      clip.appendChild(cr);
    }

    defs.appendChild(grad);
    defs.appendChild(filter);
    defs.appendChild(clip);
    svg.appendChild(defs);

    /* ── 바 그룹 ── */
    var g = document.createElementNS(NS, "g");
    g.setAttribute("fill", "url(#" + gradId + ")");
    g.setAttribute("clip-path", "url(#" + clipId + ")");
    g.setAttribute("filter", "url(#" + filterId + ")");

    /* 가우시안 함수 — 봉우리 모양 */
    function gauss(x, c, s) {
      return Math.exp(-Math.pow(x - c, 2) / (2 * s * s));
    }

    var BAR_W = 0.82;
    var GAP = (100 - barCount * BAR_W) / (barCount + 1);
    var bars = [];

    for (var i = 0; i < barCount; i++) {
      var r = i / (barCount - 1); /* 0~1 */
      var x = GAP + i * (BAR_W + GAP);

      /* 레퍼런스 이미지 봉우리 재현
         ① 파랑 중심 큰 봉우리  ② 초록/노랑 봉우리
         ③ 핑크 봉우리          ④ 노랑 오른쪽 봉우리
         ⑤ 왼쪽 작은 클러스터  ⑥ 오른쪽 테일 */
      var amp =
        0.06 +
        gauss(r, 0.38, 0.07) * 0.92 +
        gauss(r, 0.62, 0.09) * 0.76 +
        gauss(r, 0.22, 0.06) * 0.44 +
        gauss(r, 0.78, 0.05) * 0.58 +
        gauss(r, 0.1, 0.04) * 0.2 +
        gauss(r, 0.9, 0.04) * 0.18 +
        gauss(r, 0.5, 0.03) * 0.22;
      amp = Math.min(0.96, amp);

      var rect = document.createElementNS(NS, "rect");
      rect.setAttribute("x", x.toFixed(2));
      rect.setAttribute("y", "50");
      rect.setAttribute("width", BAR_W);
      rect.setAttribute("height", "0");
      rect.setAttribute("class", "wave-bar");
      g.appendChild(rect);

      bars.push({
        el: rect,
        amp: amp,
        phase: r * Math.PI * 9 + Math.random() * Math.PI * 0.5,
      });
    }

    svg.appendChild(g);
    var playBtn = container.querySelector(".wave-play-btn");
    container.insertBefore(svg, playBtn);

    /* ── rAF 루프 ── */
    var t0 = null;
    function tick(ts) {
      if (!t0) t0 = ts;
      var t = (ts - t0) / 1000;

      for (var j = 0; j < bars.length; j++) {
        var ph = bars[j].phase;
        var amp = bars[j].amp;

        /* 3개 사인파 합성 → 자연스러운 파동 */
        var h =
          Math.sin(t * 2.7 + ph) * 0.42 +
          Math.sin(t * 5.1 + ph * 1.4) * 0.3 +
          Math.sin(t * 1.3 + ph * 0.5) * 0.28;
        h = (h + 1) / 2;
        h = Math.max(0.05, h) * amp;

        var barH = h * 94;
        var barY = (100 - barH) / 2; /* 중앙 기준 상하 대칭 */

        bars[j].el.setAttribute("height", barH.toFixed(1));
        bars[j].el.setAttribute("y", barY.toFixed(1));
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

  /* 전역 AudioContext 싱글톤 — 클릭 이후 최초 1회 생성 (iOS 정책) */
  var _audioCtx = null;
  function getAudioContext() {
    if (!_audioCtx) {
      _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return _audioCtx;
  }

  function initWavePlayer(waveId, btnId, audioSrc) {
    var btn = document.getElementById(btnId);
    if (!btn) return;

    if (!audioSrc) return;

    var audio = new Audio(audioSrc);
    wavePlayers.push({ audio: audio, btn: btn });

    btn.addEventListener("click", function () {
      var ctx = getAudioContext();
      var resume = ctx.state === 'suspended' ? ctx.resume() : Promise.resolve();
      resume.then(function () {
        if (audio.paused) {
          audio.play().catch(function () {});
          btn.classList.add("playing");
          btn.setAttribute("aria-pressed", "true");
        } else {
          audio.pause();
          btn.classList.remove("playing");
          btn.setAttribute("aria-pressed", "false");
        }
      });
    });

    audio.addEventListener("ended", function () {
      btn.classList.remove("playing");
      btn.setAttribute("aria-pressed", "false");
      audio.currentTime = 0;
    });
  }

  /* ── 글리치 텍스트 시퀀스 ─────────────────────────────────────────────── */
  /* 파일명 기준 타이밍: 1s(클린) → 0.05s(글리치A) → 0.1s(글리치B) → 0.1s(글리치C) → 유지(클린) */
  /* ── BGM (인트로→메인 구간 반복 재생) ── */
  var bgmAudio = new Audio("image/intro1/audio/theblackwaltz.mp3");
  bgmAudio.loop = true;

  function playBgmAudio() {
    bgmAudio.currentTime = 0;
    bgmAudio.muted = false;
    bgmAudio.play().catch(function () {
      bgmAudio.muted = true;
      bgmAudio.play().then(function () {
        bgmAudio.muted = false;
      }).catch(function () {
        var retry = function () {
          bgmAudio.muted = false;
          bgmAudio.play().catch(function () {});
        };
        document.addEventListener("click",      retry, { once: true });
        document.addEventListener("touchstart", retry, { once: true });
      });
    });
  }

  playBgmAudio();

  var glitchTimers = [];
  var glitchLoopTimer = null;
  var glitchAudio = new Audio("image/intro1/audio/Digital TV Glitch 2.mp3");
  /* glitchAudio는 allAudios에 넣지 않음 — intro 구간에서 계속 재생되어야 하므로 별도 관리 */

  function playGlitchAudio() {
    glitchAudio.currentTime = 0;
    /* 1차: 소리 있는 자동재생 시도 */
    glitchAudio.muted = false;
    glitchAudio.play().catch(function () {
      /* 실패 시: muted 자동재생 → 즉시 unmute (Chrome 정책 우회) */
      glitchAudio.muted = true;
      glitchAudio.play().then(function () {
        glitchAudio.muted = false;
      }).catch(function () {
        /* 모두 실패 시 첫 인터랙션에서 재시도 */
        var retry = function () {
          glitchAudio.currentTime = 0;
          glitchAudio.muted = false;
          glitchAudio.play().catch(function () {});
        };
        document.addEventListener("click",      retry, { once: true });
        document.addEventListener("touchstart", retry, { once: true });
      });
    });
  }

  function runGlitch() {
    var container = document.getElementById("intro1-glitch");
    if (!container) return;

    /* 진행 중인 타이머 초기화 */
    for (var t = 0; t < glitchTimers.length; t++) clearTimeout(glitchTimers[t]);
    glitchTimers = [];

    /* 글리치 효과음 재생 */
    playGlitchAudio();

    var isMo = window.matchMedia("(max-width: 768px)").matches;
    var frames = container.querySelectorAll(isMo ? ".glitch-mo" : ".glitch-pc");

    /* 전체 숨김 */
    for (var i = 0; i < frames.length; i++) frames[i].classList.remove("gf-active");

    /* 순서대로 표시 — 이전 프레임 숨기고 다음 표시 */
    var delays = [0, 1000, 1050, 1150, 1250];
    for (var idx = 0; idx < frames.length; idx++) {
      (function (cur, prev, delay) {
        glitchTimers.push(setTimeout(function () {
          if (prev) prev.classList.remove("gf-active");
          cur.classList.add("gf-active");
        }, delay));
      })(frames[idx], idx > 0 ? frames[idx - 1] : null, delays[idx]);
    }

    /* 시퀀스 완료 후 3초 대기 → 반복 */
    if (glitchLoopTimer) clearTimeout(glitchLoopTimer);
    glitchLoopTimer = setTimeout(function () {
      glitchLoopTimer = null;
      runGlitch();
    }, 1250 + 3000);
  }

  /* ── DOMContentLoaded ──────────────────────────────────────────────────── */
  document.addEventListener("DOMContentLoaded", function () {
    /* ── 스크롤 힌트 — 클릭 시 맨 아래로, 최하단 도달 시 숨김 ── */
    var failScreenIds = [
      "screen-main",
      "screen-step1-fail",
      "screen-step2-fail",
      "screen-step3-fail",
      "screen-result",
    ];
    failScreenIds.forEach(function (id) {
      var screen = document.getElementById(id);
      if (!screen) return;
      var hint = screen.querySelector(".scroll-hint");
      if (!hint) return;

      /* 클릭 → 맨 아래로 스크롤 */
      hint.addEventListener("click", function () {
        screen.scrollTo({ top: screen.scrollHeight, behavior: "smooth" });
      });

      /* 스크롤 → 최하단 근처면 숨김 */
      screen.addEventListener("scroll", function () {
        var remaining =
          screen.scrollHeight - screen.scrollTop - screen.clientHeight;
        hint.style.opacity = remaining < 40 ? "0" : "";
        hint.style.pointerEvents = remaining < 40 ? "none" : "";
      });
    });

    /* ── 글리치 시퀀스 시작 (intro1이 초기 화면) ── */
    runGlitch();

    /* ── SVG 이퀄라이저 생성 ── */
    createWaveBars("wave-step1");
    createWaveBars("wave-step2");
    createWaveBars("wave-step3");

    /* ── 오디오 초기화 ── */
    initWavePlayer("wave-step1", "btn-step1-play", "audio/stage1.mp3");
    initWavePlayer("wave-step2", "btn-step2-play", "audio/stage2.mp3");
    initWavePlayer("wave-step3", "btn-step3-play", "audio/stage3.mp3");

    /* ── intro1 첫 터치/클릭 시 glitch 오디오 재시도 (autoplay 정책 우회) ── */
    var intro1Screen = document.getElementById("screen-intro1");
    if (intro1Screen) {
      var glitchRetry = function () {
        if (glitchAudio.paused) {
          glitchAudio.currentTime = 0;
          glitchAudio.play().catch(function () {});
        }
      };
      intro1Screen.addEventListener("click",      glitchRetry, { once: true });
      intro1Screen.addEventListener("touchstart", glitchRetry, { once: true, passive: true });
    }

    /* ── INTRO 1 → INTRO 2 (클릭도 유지) ── */
    var btnIntro1 = document.getElementById("btn-intro1-next");
    if (btnIntro1)
      btnIntro1.addEventListener("click", function () {
        goToScreen("screen-intro2");
      });

    /* ── INTRO 2 → MAIN (클릭도 유지) ── */
    var btnIntro2 = document.getElementById("btn-intro2-next");
    if (btnIntro2)
      btnIntro2.addEventListener("click", function () {
        goToScreen("screen-main");
      });

    /* ── MAIN → STEP 1 ── */
    var btnMainStart = document.getElementById("btn-main-start");
    if (btnMainStart)
      btnMainStart.addEventListener("click", function () {
        bgmAudio.pause();
        bgmAudio.currentTime = 0;
        goToScreen("screen-step1");
      });

    /* ── STEP 1 선택 ──
       A: 수사관 안내에 따라 진행 → FAIL (속는 선택)
       B: 전화를 끊고 공식 기관  → SUCCESS (올바른 선택) */
    var btnStep1A = document.getElementById("btn-step1-a");
    if (btnStep1A)
      btnStep1A.addEventListener("click", function () {
        goToScreen("screen-step1-fail");
      });
    var btnStep1B = document.getElementById("btn-step1-b");
    if (btnStep1B)
      btnStep1B.addEventListener("click", function () {
        goToScreen("screen-step1-suc");
      });

    /* ── STEP 1 결과 → STEP 2 ── */
    var btnStep1SucNext = document.getElementById("btn-step1-suc-next");
    if (btnStep1SucNext)
      btnStep1SucNext.addEventListener("click", function () {
        goToScreen("screen-step2");
      });
    var btnStep1FailNext = document.getElementById("btn-step1-fail-next");
    if (btnStep1FailNext)
      btnStep1FailNext.addEventListener("click", function () {
        goToScreen("screen-step2");
      });

    /* ── STEP 2 선택 ── */
    var btnStep2A = document.getElementById("btn-step2-a");
    if (btnStep2A)
      btnStep2A.addEventListener("click", function () {
        goToScreen("screen-step2-suc");
      });
    var btnStep2B = document.getElementById("btn-step2-b");
    if (btnStep2B)
      btnStep2B.addEventListener("click", function () {
        goToScreen("screen-step2-fail");
      });

    /* ── STEP 2 결과 → STEP 3 ── */
    var btnStep2SucNext = document.getElementById("btn-step2-suc-next");
    if (btnStep2SucNext)
      btnStep2SucNext.addEventListener("click", function () {
        goToScreen("screen-step3");
      });
    var btnStep2FailNext = document.getElementById("btn-step2-fail-next");
    if (btnStep2FailNext)
      btnStep2FailNext.addEventListener("click", function () {
        goToScreen("screen-step3");
      });

    /* ── STEP 3 선택 ── */
    var btnStep3A = document.getElementById("btn-step3-a");
    if (btnStep3A)
      btnStep3A.addEventListener("click", function () {
        goToScreen("screen-step3-suc");
      });
    var btnStep3B = document.getElementById("btn-step3-b");
    if (btnStep3B)
      btnStep3B.addEventListener("click", function () {
        goToScreen("screen-step3-fail");
      });

    /* ── STEP 3 결과 → RESULT ── */
    var btnStep3SucNext = document.getElementById("btn-step3-suc-next");
    if (btnStep3SucNext)
      btnStep3SucNext.addEventListener("click", function () {
        goToScreen("screen-result");
      });
    var btnStep3FailNext = document.getElementById("btn-step3-fail-next");
    if (btnStep3FailNext)
      btnStep3FailNext.addEventListener("click", function () {
        goToScreen("screen-result");
      });

    /* ── RESULT → 처음으로 ── */
    var btnRetry = document.getElementById("btn-retry");
    if (btnRetry)
      btnRetry.addEventListener("click", function () {
        goToScreen("screen-intro1");
        setTimeout(runGlitch, 50); /* 화면 전환 후 글리치 재시작 */
        playBgmAudio(); /* BGM 재시작 */
      });

    /* ── RESULT: 유튜브 영상 버튼 ── */
    var videoUrls = [
      "https://www.youtube.com/watch?v=Czm1SWI-x5c",
      "https://www.youtube.com/watch?v=EiSKt7UHyFc",
      "https://www.youtube.com/watch?v=R5Gm71eEJhg",
    ];
    ["btn-video-1", "btn-video-2", "btn-video-3"].forEach(
      function (btnId, idx) {
        var btn = document.getElementById(btnId);
        if (!btn) return;
        btn.addEventListener("click", function () {
          window.open(videoUrls[idx], "_blank", "noopener");
        });
      },
    );

    /* ── RESULT: 등록 팝업 ── */
    var popup = document.getElementById("popup-register");
    var btnReg = document.getElementById("btn-result-register");
    var btnClose = document.getElementById("btn-popup-close");
    var formReg = document.getElementById("form-register");

    function openPopup() {
      if (popup) popup.classList.add("active");
    }
    function closePopup() {
      if (popup) popup.classList.remove("active");
    }

    if (btnReg) btnReg.addEventListener("click", openPopup);
    if (btnClose) btnClose.addEventListener("click", closePopup);
    if (popup)
      popup.addEventListener("click", function (e) {
        if (e.target === popup) closePopup();
      });

    var btnPrivacyDetail = document.getElementById("btn-privacy-detail");
    var privacyDetail = document.getElementById("privacy-detail");
    if (btnPrivacyDetail && privacyDetail)
      btnPrivacyDetail.addEventListener("click", function () {
        var hidden = privacyDetail.hidden;
        privacyDetail.hidden = !hidden;
        btnPrivacyDetail.textContent = hidden ? "닫기" : "내용보기";
      });

    if (formReg)
      formReg.addEventListener("submit", function (e) {
        e.preventDefault();
        var name = (document.getElementById("input-name") || {}).value || "";
        var phone = (document.getElementById("input-phone") || {}).value || "";
        var chk = document.getElementById("chk-privacy");
        if (!name.trim() || !phone.trim()) {
          showToast("이름과 전화번호를 입력해 주세요.");
          return;
        }
        if (!chk || !chk.checked) {
          showToast("개인정보 수집·이용에 동의해 주세요.");
          return;
        }
        var SHEET_URL = "https://script.google.com/macros/s/AKfycbx2aBU6AiD77Fm9y4VqbMXF9V9Dpfpd7xq7v-qOpHsWnfzsi5Qg0m7gBzVnTaUp-1bvng/exec";
        var iframe = document.getElementById('gs-iframe') || (function() {
          var f = document.createElement('iframe');
          f.id = 'gs-iframe';
          f.name = 'gs-iframe';
          f.style.display = 'none';
          document.body.appendChild(f);
          return f;
        })();
        var form = document.createElement('form');
        form.method = 'POST';
        form.action = SHEET_URL;
        form.target = 'gs-iframe';
        [['name', name], ['phone', phone], ['privacy', chk.checked ? '동의' : '미동의']].forEach(function(pair) {
          var inp = document.createElement('input');
          inp.type = 'hidden'; inp.name = pair[0]; inp.value = pair[1];
          form.appendChild(inp);
        });
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
        closePopup();
        showToast("응모가 완료되었습니다!", 3000);
      });

    /* ── RESULT: 공유하기 ── */
    var btnShare = document.getElementById("btn-result-share");
    if (btnShare)
      btnShare.addEventListener("click", function () {
        var url = window.location.href;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard
            .writeText(url)
            .then(function () {
              showToast("링크가 복사되었습니다. 공유하세요!", 3000);
            })
            .catch(function () {
              fallbackCopy(url);
            });
        } else {
          fallbackCopy(url);
        }
      });

    /* ── PC 전용 버튼 위임 ── */
    var btnRegPc = document.getElementById("btn-result-register-pc");
    if (btnRegPc) btnRegPc.addEventListener("click", openPopup);

    var btnSharePc = document.getElementById("btn-result-share-pc");
    if (btnSharePc)
      btnSharePc.addEventListener("click", function () {
        var url = window.location.href;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard
            .writeText(url)
            .then(function () {
              showToast("링크가 복사되었습니다. 공유하세요!", 3000);
            })
            .catch(function () {
              fallbackCopy(url);
            });
        } else {
          fallbackCopy(url);
        }
      });

    function fallbackCopy(text) {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        showToast("링크가 복사되었습니다. 공유하세요!", 3000);
      } catch (e) {
        showToast("링크를 직접 복사해 주세요: " + text, 4000);
      }
      document.body.removeChild(ta);
    }
  });

  /* ── 데스크탑 반응형 스케일 ──────────────────────────────────────────────── */
  /* 기준 1920px 디자인을 모든 데스크탑 해상도에 맞게 zoom으로 축소/확대 */
  function applyDesktopScale() {
    var app = document.getElementById("app");
    if (!app) return;
    var vw = window.innerWidth;
    var vh = window.innerHeight;

    if (vw < 769) {
      /* 모바일: 스케일 리셋 */
      app.style.zoom = "";
      app.style.width = "";
      app.style.height = "";
      return;
    }

    var scale = vw / 1920;
    var scaledH = Math.ceil(vh / scale);
    app.style.width = "1920px";
    app.style.height = scaledH + "px";
    app.style.zoom = scale;

    /* success page-canvas 높이는 CSS(1080px 고정)가 담당 — JS 개입 없음 */
  }

  applyDesktopScale();
  window.addEventListener("resize", applyDesktopScale);

})();
