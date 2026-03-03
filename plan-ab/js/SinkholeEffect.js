/* ==========================================================================
   SinkholeEffect.js — 보이스피싱크홀 A+B 조합안
   A안 싱크홀 + B안 단계별 강도 결합
   ========================================================================== */

class SinkholeEffect {
  constructor() {
    this._reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /* ── 단계별 애니메이션 설정 ────────────────────────────────────────── */
  _getLevelConfig(spiceLevel) {
    const configs = {
      1: { shakeClass: 'fx-shake-mild', distortClass: 'fx-distort-mild', shakeDur: 300, distortDur: 500, suckDur: 350, flashColor: 'flash-red' },
      2: { shakeClass: 'fx-shake-hot',  distortClass: 'fx-distort-hot',  shakeDur: 300, distortDur: 500, suckDur: 380, flashColor: 'flash-red' },
      3: { shakeClass: 'fx-shake-fire', distortClass: 'fx-distort-fire', shakeDur: 320, distortDur: 520, suckDur: 400, flashColor: 'flash-red' },
      4: { shakeClass: 'fx-shake-hell', distortClass: 'fx-distort-hell', shakeDur: 350, distortDur: 600, suckDur: 420, flashColor: 'flash-red' },
    };
    return configs[spiceLevel] || configs[1];
  }

  /* ── triggerSink ──────────────────────────────────────────────────────
     A 선택 (싱크홀에 빠진다) — 단계별 강도 싱크홀 흡입 애니메이션
     shake(0~300ms) → distort(300~800ms) → suck(800~1200ms) → flash → resolve(1500ms)
  ────────────────────────────────────────────────────────────────────── */
  async triggerSink(container, spiceLevel = 1) {
    if (!container) return;

    // prefers-reduced-motion 경량 모드
    if (this._reduced) {
      await this._flashRed();
      return;
    }

    const cfg = this._getLevelConfig(spiceLevel);
    const { delay } = Utils;

    // ① SHAKE
    container.classList.add(cfg.shakeClass);
    await delay(cfg.shakeDur);
    container.classList.remove(cfg.shakeClass);

    // ② DISTORT
    container.classList.add(cfg.distortClass);
    await delay(cfg.distortDur);
    container.classList.remove(cfg.distortClass);

    // ③ SUCK
    container.classList.add('fx-suck');
    await delay(cfg.suckDur);
    container.classList.remove('fx-suck');

    // ④ 플래시 + resolve
    await Utils.flashOverlay(cfg.flashColor, 300);
  }

  /* ── triggerSafe ──────────────────────────────────────────────────────
     B 선택 (싱크홀을 피한다) — 단계별 다른 탈출 이펙트
     level 1: 초록 flash
     level 2: 금색 flash
     level 3: 금색 파티클
     level 4: 금색+흰색 대폭발 파티클
     → 1.0s 후 Promise resolve
  ────────────────────────────────────────────────────────────────────── */
  async triggerSafe(container, spiceLevel = 1) {
    if (!container) return;

    // prefers-reduced-motion 경량 모드
    if (this._reduced) {
      await Utils.flashOverlay('flash-green', 300);
      return;
    }

    const { delay } = Utils;

    // 컨테이너 상승 애니메이션
    container.classList.add('fx-safe-rise');
    await delay(200);
    container.classList.remove('fx-safe-rise');

    switch (spiceLevel) {
      case 1:
        // 초록 플래시
        await Utils.flashOverlay('flash-green', 500);
        break;

      case 2:
        // 금색 플래시
        await Utils.flashOverlay('flash-gold', 500);
        break;

      case 3:
        // 금색 파티클 + 플래시
        Utils.createGoldParticles(14, 800);
        await Utils.flashOverlay('flash-gold', 400);
        await delay(400);
        break;

      case 4:
        // 대폭발 파티클 + 흰색 플래시
        Utils.createMegaBurstParticles(1000);
        await Utils.flashOverlay('flash-white', 300);
        await Utils.flashOverlay('flash-gold', 300);
        await delay(400);
        break;

      default:
        await Utils.flashOverlay('flash-green', 400);
        break;
    }
  }
}

window.SinkholeEffect = new SinkholeEffect();
