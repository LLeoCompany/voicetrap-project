/* main.js — 보이스피싱크홀 A+B 조합안 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', async () => {
    window.StageManager.init();
    await initIntro();
    bindShareButtons();
    bindApplyButton();
  });

  /* ── 인트로 초기화 ────────────────────────────────────────────────────── */
  async function initIntro() {
    // 배경 SVG 음파 파형
    const wsvg = document.getElementById('waveform-svg');
    if (wsvg) Utils.createWaveform(wsvg, 36, 'svg');

    // 타이핑 효과
    const typingEl = document.getElementById('intro-typing');
    if (typingEl) {
      await Utils.delay(400);
      await Utils.typeWriter(
        typingEl,
        '보이스피싱 상습범의\n이 목소리들이 하나의 싱크홀이 됩니다.',
        65
      );
    }

    // 인트로 탭 → 시작 화면
    const btn = document.getElementById('btn-intro-tap');
    if (btn) {
      let tapped = false;
      Utils.onTap(btn, async () => {
        if (tapped) return;
        tapped = true;
        await window.AudioEngine.unlockAudio();
        await window.StageManager.goToScreen('screen-start');
      });
    }
  }

  /* ── SNS 공유 버튼 ────────────────────────────────────────────────────── */
  function bindShareButtons() {
    const btnKakao = document.getElementById('btn-share-kakao');
    if (btnKakao) {
      Utils.onTap(btnKakao, () => {
        const text = window.ScoreTracker.getShareText();
        const url  = window.ScoreTracker.getShareURL();
        if (window.Kakao && window.Kakao.isInitialized && window.Kakao.isInitialized()) {
          window.Kakao.Link.sendDefault({
            objectType: 'feed',
            content: {
              title:       '보이스피싱크홀 — 당신의 내성 테스트',
              description: text,
              link: { mobileWebUrl: url, webUrl: url },
            },
            buttons: [{ title: '나도 도전하기', link: { mobileWebUrl: url, webUrl: url } }],
          });
        } else {
          fallbackShare(text, url);
        }
      });
    }

    const btnUrl = document.getElementById('btn-share-url');
    if (btnUrl) {
      Utils.onTap(btnUrl, async () => {
        const ok = await Utils.copyToClipboard(window.ScoreTracker.getShareText());
        Utils.showToast(ok ? '링크가 복사되었습니다!' : '복사에 실패했습니다.');
      });
    }
  }

  async function fallbackShare(text, url) {
    if (navigator.share) {
      try {
        await navigator.share({ title: '보이스피싱크홀 — 당신의 내성 테스트', text, url });
        return;
      } catch(e) { if (e.name === 'AbortError') return; }
    }
    const ok = await Utils.copyToClipboard(text);
    Utils.showToast(ok ? '결과가 복사되었습니다!' : '공유에 실패했습니다.');
  }

  /* ── 경품 응모 버튼 ───────────────────────────────────────────────────── */
  function bindApplyButton() {
    const btn = document.getElementById('btn-apply');
    if (!btn) return;
    Utils.onTap(btn, () => {
      const url = btn.dataset.url || '#';
      if (url === '#') { Utils.showToast('경품 응모 기간을 확인해 주세요.'); return; }
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  }
})();
