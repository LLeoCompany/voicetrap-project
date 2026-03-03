/* ==========================================================================
   SinkholeEffect.js — 보이스피싱크홀 캠페인
   싱크홀 / 안전 CSS 애니메이션 엔진
   Canvas / WebGL 없이 CSS @keyframes + will-change 만으로 구현
   ========================================================================== */

class SinkholeEffect {
  constructor() {
    this._flashEl = document.getElementById('flash-overlay');
    // prefers-reduced-motion 감지 → 경량 모드
    this._reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /* ── triggerSink ─────────────────────────────────────────────────────────
     A 선택(위험) 시 싱크홀 애니메이션 시퀀스
     @param container  애니메이션 적용 대상 DOM 요소 (stage-body 등)
     @returns Promise  전체 시퀀스 완료 후 resolve

     시퀀스:
       ① 0.0~0.3s  .fx-shake    — 화면 진동
       ② 0.3~0.8s  .fx-distort  — rotate + blur 왜곡
       ③ 0.8~1.2s  .fx-suck     — scale(0) 빨려 들어감
       ④ 1.2~1.5s  flash-red    — 빨간 플래시 오버레이
  ─────────────────────────────────────────────────────────────────────── */
  triggerSink(container) {
    return new Promise(async (resolve) => {
      if (!container) { resolve(); return; }

      // 경량 모드 (prefers-reduced-motion)
      if (this._reducedMotion) {
        await this._reducedSink(container);
        resolve();
        return;
      }

      // will-change 사전 설정 (GPU 레이어 준비)
      container.style.willChange = 'transform, filter, opacity';

      // ① shake (0~300ms)
      container.classList.add('fx-shake');
      await this._wait(300);

      // ② distort (300~800ms)
      container.classList.remove('fx-shake');
      container.classList.add('fx-distort');
      await this._wait(500);

      // ③ suck (800~1200ms)
      container.classList.remove('fx-distort');
      container.classList.add('fx-suck');
      await this._wait(400);

      // ④ flash-red (1200~1500ms)
      container.classList.remove('fx-suck');
      this._flashRed();
      await this._wait(300);

      // 클린업
      this._cleanupContainer(container);
      resolve();
    });
  }

  /* ── triggerSafe ─────────────────────────────────────────────────────────
     B 선택(안전) 시 안전 피드백 애니메이션
     @param container  애니메이션 적용 대상 DOM 요소
     @returns Promise

     시퀀스:
       ① 0.0~0.4s  .fx-safe-pulse  — 초록 빛 펄스
       ② 0.4~1.0s  .fx-slide-up    — 위로 슬라이드 아웃
  ─────────────────────────────────────────────────────────────────────── */
  triggerSafe(container) {
    return new Promise(async (resolve) => {
      if (!container) { resolve(); return; }

      if (this._reducedMotion) {
        await this._wait(300);
        resolve();
        return;
      }

      container.style.willChange = 'transform, opacity';

      // ① safe pulse
      container.classList.add('fx-safe-pulse');
      await this._wait(400);

      // ② slide up
      container.classList.remove('fx-safe-pulse');
      container.classList.add('fx-slide-up');
      await this._wait(600);

      this._cleanupContainer(container);
      resolve();
    });
  }

  /* ── _reducedSink ────────────────────────────────────────────────────────
     저모션 환경: 간단한 opacity 변화만 (0.5s)
  ─────────────────────────────────────────────────────────────────────── */
  async _reducedSink(container) {
    container.style.transition = 'opacity 0.3s';
    container.style.opacity = '0.3';
    this._flashRed(100);
    await this._wait(500);
    container.style.opacity = '1';
    container.style.transition = '';
  }

  /* ── _flashRed ───────────────────────────────────────────────────────────
     전체 화면 빨간 플래시 오버레이
     @param duration ms (기본 400ms)
  ─────────────────────────────────────────────────────────────────────── */
  _flashRed(duration = 400) {
    const el = this._flashEl;
    if (!el) return;

    el.style.backgroundColor = '#c0392b';
    el.style.willChange = 'opacity';
    el.style.transition = `opacity ${Math.floor(duration * 0.3)}ms ease-out`;
    el.style.opacity = '0.7';

    setTimeout(() => {
      el.style.transition = `opacity ${Math.floor(duration * 0.7)}ms ease-in`;
      el.style.opacity = '0';
      setTimeout(() => {
        el.style.willChange = 'auto';
      }, Math.floor(duration * 0.7));
    }, Math.floor(duration * 0.3));
  }

  /* ── flashGreen ──────────────────────────────────────────────────────────
     B 선택 시 초록 플래시 (외부에서도 호출 가능)
  ─────────────────────────────────────────────────────────────────────── */
  flashGreen(duration = 400) {
    const el = this._flashEl;
    if (!el) return;

    el.style.backgroundColor = '#27ae60';
    el.style.willChange = 'opacity';
    el.style.transition = `opacity ${Math.floor(duration * 0.3)}ms ease-out`;
    el.style.opacity = '0.4';

    setTimeout(() => {
      el.style.transition = `opacity ${Math.floor(duration * 0.7)}ms ease-in`;
      el.style.opacity = '0';
      setTimeout(() => {
        el.style.willChange = 'auto';
      }, Math.floor(duration * 0.7));
    }, Math.floor(duration * 0.3));
  }

  /* ── _cleanupContainer ───────────────────────────────────────────────────
     애니메이션 클래스 및 will-change 정리
  ─────────────────────────────────────────────────────────────────────── */
  _cleanupContainer(container) {
    const fxClasses = ['fx-shake', 'fx-distort', 'fx-suck', 'fx-safe-pulse', 'fx-slide-up'];
    fxClasses.forEach(cls => container.classList.remove(cls));
    container.style.willChange    = 'auto';
    container.style.transform     = '';
    container.style.filter        = '';
    container.style.opacity       = '';
    container.style.transition    = '';
  }

  /* ── _wait ───────────────────────────────────────────────────────────────
     내부용 지연 (ms)
  ─────────────────────────────────────────────────────────────────────── */
  _wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/* ── 전역 싱글톤 등록 ──────────────────────────────────────────────────── */
window.SinkholeEffect = new SinkholeEffect();
