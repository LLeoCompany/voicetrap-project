/* ==========================================================================
   utils.js — 보이스피싱크홀 캠페인
   공통 유틸리티 함수 모음
   ========================================================================== */

const Utils = (() => {

  /* ── delay ──────────────────────────────────────────────────────────────
     Promise 기반 지연 함수
     사용: await Utils.delay(1500)
  ─────────────────────────────────────────────────────────────────────── */
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /* ── onTap ──────────────────────────────────────────────────────────────
     터치/클릭 통합 이벤트 (iOS 300ms 딜레이 없이 즉각 반응)
     passive:true로 스크롤 성능 보호
  ─────────────────────────────────────────────────────────────────────── */
  function onTap(el, cb, options = {}) {
    if (!el) return;
    let touchStartY = 0;

    el.addEventListener('touchstart', (e) => {
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    el.addEventListener('touchend', (e) => {
      const dy = Math.abs(e.changedTouches[0].clientY - touchStartY);
      if (dy < 10) {         // 스크롤이 아닌 탭으로 판단
        e.preventDefault();
        cb(e);
      }
    }, { passive: false });

    // 데스크톱 폴백
    el.addEventListener('click', cb);
  }

  /* ── typeWriter ──────────────────────────────────────────────────────────
     타이핑 효과 텍스트 출력
     @param el      - 텍스트를 출력할 DOM 요소
     @param text    - 출력할 문자열 (\n 지원)
     @param speed   - 글자 당 ms (기본 60)
     @returns Promise (완료 시 resolve)
  ─────────────────────────────────────────────────────────────────────── */
  function typeWriter(el, text, speed = 60) {
    return new Promise(resolve => {
      el.textContent = '';
      const chars = Array.from(text);   // 이모지·한글 조합 자모 안전 처리
      let i = 0;

      function next() {
        if (i >= chars.length) {
          resolve();
          return;
        }
        const ch = chars[i++];
        if (ch === '\n') {
          el.appendChild(document.createElement('br'));
        } else {
          el.appendChild(document.createTextNode(ch));
        }
        setTimeout(next, speed);
      }

      next();
    });
  }

  /* ── fadeIn / fadeOut ────────────────────────────────────────────────────
     요소 opacity 전환 (display:none 없이)
     @returns Promise
  ─────────────────────────────────────────────────────────────────────── */
  function fadeIn(el, duration = 400) {
    return new Promise(resolve => {
      if (!el) { resolve(); return; }
      el.style.transition = `opacity ${duration}ms`;
      el.style.opacity = '0';
      // 다음 프레임에 변경해야 트랜지션 적용됨
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.opacity = '1';
          el.addEventListener('transitionend', function handler() {
            el.removeEventListener('transitionend', handler);
            resolve();
          });
        });
      });
    });
  }

  function fadeOut(el, duration = 400) {
    return new Promise(resolve => {
      if (!el) { resolve(); return; }
      el.style.transition = `opacity ${duration}ms`;
      el.style.opacity = '1';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.opacity = '0';
          el.addEventListener('transitionend', function handler() {
            el.removeEventListener('transitionend', handler);
            resolve();
          });
        });
      });
    });
  }

  /* ── flashClass ──────────────────────────────────────────────────────────
     요소에 CSS 클래스를 일시적으로 추가 후 제거
     @returns Promise (클래스 제거 완료 시 resolve)
  ─────────────────────────────────────────────────────────────────────── */
  function flashClass(el, className, duration = 600) {
    return new Promise(resolve => {
      if (!el) { resolve(); return; }
      el.classList.add(className);
      setTimeout(() => {
        el.classList.remove(className);
        resolve();
      }, duration);
    });
  }

  /* ── createWaveform ──────────────────────────────────────────────────────
     음파 파형 바 생성 (SVG 또는 div 컨테이너)
     @param container   - 파형 바를 넣을 DOM 요소
     @param barCount    - 바 개수 (기본 28)
     @param type        - 'svg' | 'div'
  ─────────────────────────────────────────────────────────────────────── */
  function createWaveform(container, barCount = 28, type = 'div') {
    if (!container) return [];
    container.innerHTML = '';
    const bars = [];

    for (let i = 0; i < barCount; i++) {
      if (type === 'svg') {
        // SVG rect 바 (인트로 전용)
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        const baseH = 8 + Math.random() * 40;
        rect.setAttribute('x', (i * (360 / barCount)).toFixed(1));
        rect.setAttribute('y', ((120 - baseH) / 2).toFixed(1));
        rect.setAttribute('width', ((360 / barCount) * 0.6).toFixed(1));
        rect.setAttribute('height', baseH.toFixed(1));
        rect.setAttribute('rx', '2');
        rect.classList.add('waveform-bar');
        rect.style.animationDelay = `${(i * 0.05).toFixed(2)}s`;
        container.appendChild(rect);
        bars.push(rect);
      } else {
        // div 바 (오디오 플레이어 파형)
        const bar = document.createElement('div');
        bar.classList.add('waveform-bar-div');
        bar.style.animationDelay = `${(i * 0.04).toFixed(2)}s`;
        container.appendChild(bar);
        bars.push(bar);
      }
    }
    return bars;
  }

  /* ── animateWaveform ─────────────────────────────────────────────────────
     파형 바 애니메이션 시작 / 정지
  ─────────────────────────────────────────────────────────────────────── */
  function animateWaveform(bars, isPlaying) {
    bars.forEach(bar => {
      if (isPlaying) {
        bar.classList.add('playing');
      } else {
        bar.classList.remove('playing');
      }
    });
  }

  /* ── showToast ───────────────────────────────────────────────────────────
     하단 토스트 메시지 표시
  ─────────────────────────────────────────────────────────────────────── */
  function showToast(message, duration = 2000) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }

  /* ── copyToClipboard ──────────────────────────────────────────────────────
     클립보드 복사 (navigator.clipboard 우선, 폴백 execCommand)
  ─────────────────────────────────────────────────────────────────────── */
  async function copyToClipboard(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      return true;
    } catch (e) {
      console.warn('[Utils] 클립보드 복사 실패:', e);
      return false;
    }
  }

  /* ── encodeResult ─────────────────────────────────────────────────────────
     점수/이력을 URL 파라미터로 인코딩 (SNS 공유용)
  ─────────────────────────────────────────────────────────────────────── */
  function encodeResult(score, total = 6) {
    const base = `${window.location.origin}${window.location.pathname}`;
    return `${base}?score=${score}&total=${total}`;
  }

  /* ── qs / qsa ─────────────────────────────────────────────────────────────
     querySelector 단축
  ─────────────────────────────────────────────────────────────────────── */
  function qs(selector, scope = document) {
    return scope.querySelector(selector);
  }

  function qsa(selector, scope = document) {
    return Array.from(scope.querySelectorAll(selector));
  }

  /* ── clamp ────────────────────────────────────────────────────────────────
     숫자 범위 제한
  ─────────────────────────────────────────────────────────────────────── */
  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  /* ── 전역 등록 ──────────────────────────────────────────────────────────── */
  return {
    delay,
    onTap,
    typeWriter,
    fadeIn,
    fadeOut,
    flashClass,
    createWaveform,
    animateWaveform,
    showToast,
    copyToClipboard,
    encodeResult,
    qs,
    qsa,
    clamp,
  };

})();

window.Utils = Utils;
