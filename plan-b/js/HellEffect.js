/* ==========================================================================
   HellEffect.js — 보이스피싱 헬스키친 B안
   A선택: 헬파이어 애니메이션 / B선택: 금색 파티클 승리 효과
   CSS @keyframes 전용 (Canvas/WebGL 금지)
   ========================================================================== */

class HellEffect {
  constructor() {
    this._flashEl    = document.getElementById('flash-overlay');
    this._particleEl = document.getElementById('particle-container');
    this._reduced    = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /* ── triggerHell ───────────────────────────────────────────────────────
     A 선택 (속은 경우) — 불꽃 헬파이어 시퀀스
     @param container   스테이지 body 요소
     @param spiceLevel  1~5 (단계별 강도 조절)
     시퀀스:
       ① 0.0~0.2s  .fx-burn    — 주황→빨강 색상 flash
       ② 0.2~0.6s  .fx-melt    — 아래로 녹아내림
       ③ 0.6~1.0s  파티클      — 불꽃 파티클 상승
       ④ 1.0~1.3s  flash-red   — 빨간 오버레이
  ─────────────────────────────────────────────────────────────────────── */
  triggerHell(container, spiceLevel = 1) {
    return new Promise(async resolve => {
      if (!container) { resolve(); return; }

      if (this._reduced) {
        await this._reducedHell(container); resolve(); return;
      }

      // 강도: 지옥맛(5)일수록 더 강하게
      const intensity = spiceLevel / 5;
      container.style.willChange = 'transform, filter, opacity';

      // ① burn
      container.classList.add('fx-burn');
      await this._wait(200);

      // ② melt
      container.classList.remove('fx-burn');
      container.classList.add('fx-melt');
      await this._wait(400);

      // ③ 파티클 (단계별 개수 조절)
      const count = Math.round(6 + intensity * 14);
      Utils.createFireParticles(this._particleEl, count);
      await this._wait(400);

      // ④ flash red (강도별 opacity 조절)
      container.classList.remove('fx-melt');
      this._particleEl.innerHTML = '';
      this._flashRed(300, 0.4 + intensity * 0.4);
      await this._wait(300);

      this._cleanup(container);
      resolve();
    });
  }

  /* ── triggerSurvived ───────────────────────────────────────────────────
     B 선택 (통과) — 금색 파티클 + 승리 상승
     @param container   스테이지 body 요소
     @param spiceLevel  1~5
  ─────────────────────────────────────────────────────────────────────── */
  triggerSurvived(container, spiceLevel = 1) {
    return new Promise(async resolve => {
      if (!container) { resolve(); return; }

      if (this._reduced) { await this._wait(300); resolve(); return; }

      container.style.willChange = 'transform, opacity';

      // 금색 파티클
      Utils.createGoldParticles(this._particleEl, 10 + spiceLevel * 2);
      container.classList.add('fx-rise');
      await this._wait(600);

      // 파티클 정리
      this._particleEl.innerHTML = '';
      this._flashGold(250);
      await this._wait(300);

      this._cleanup(container);
      resolve();
    });
  }

  /* ── _flashRed ────────────────────────────────────────────────────────── */
  _flashRed(duration = 300, maxOpacity = 0.7) {
    const el = this._flashEl;
    if (!el) return;
    el.style.backgroundColor = '#8B0000';
    el.style.willChange = 'opacity';
    el.style.transition = `opacity ${Math.floor(duration * 0.3)}ms ease-out`;
    el.style.opacity = String(maxOpacity);
    setTimeout(() => {
      el.style.transition = `opacity ${Math.floor(duration * 0.7)}ms ease-in`;
      el.style.opacity = '0';
      setTimeout(() => { el.style.willChange = 'auto'; }, Math.floor(duration * 0.7));
    }, Math.floor(duration * 0.3));
  }

  /* ── _flashGold ───────────────────────────────────────────────────────── */
  _flashGold(duration = 250) {
    const el = this._flashEl;
    if (!el) return;
    el.style.backgroundColor = '#F39C12';
    el.style.willChange = 'opacity';
    el.style.transition = `opacity ${Math.floor(duration * 0.3)}ms ease-out`;
    el.style.opacity = '0.35';
    setTimeout(() => {
      el.style.transition = `opacity ${Math.floor(duration * 0.7)}ms ease-in`;
      el.style.opacity = '0';
      setTimeout(() => { el.style.willChange = 'auto'; }, Math.floor(duration * 0.7));
    }, Math.floor(duration * 0.3));
  }

  /* ── _reducedHell ─────────────────────────────────────────────────────── */
  async _reducedHell(container) {
    container.style.transition = 'opacity 0.3s';
    container.style.opacity = '0.3';
    this._flashRed(100, 0.3);
    await this._wait(500);
    container.style.opacity = '1';
    container.style.transition = '';
  }

  /* ── _cleanup ─────────────────────────────────────────────────────────── */
  _cleanup(container) {
    ['fx-burn','fx-melt','fx-rise'].forEach(c => container.classList.remove(c));
    container.style.willChange = 'auto';
    container.style.transform = '';
    container.style.filter    = '';
    container.style.opacity   = '';
    if (this._particleEl) this._particleEl.innerHTML = '';
  }

  _wait(ms) { return new Promise(r => setTimeout(r, ms)); }
}

window.HellEffect = new HellEffect();
