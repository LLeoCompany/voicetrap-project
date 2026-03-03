/* main.js — 보이스피싱 헬스키친 B안 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', async () => {
    window.MenuManager.init();
    await initIntro();
    bindShareButtons();
    bindApplyButton();
  });

  async function initIntro() {
    // 배경 음파 SVG 파형
    const wsvg = document.getElementById('waveform-svg');
    if (wsvg) Utils.createWaveform(wsvg, 36, 'svg');

    // 삼지창 글로우 애니메이션 클래스
    const trident = document.getElementById('trident-icon');
    if (trident) trident.classList.add('trident-glow');

    // 타이핑 효과
    const typingEl = document.getElementById('intro-typing');
    if (typingEl) {
      await Utils.delay(400);
      await Utils.typeWriter(typingEl, '보이스피싱 수법들은\n지금 이 순간도\n진화하고 있습니다.', 65);
    }

    // 인트로 탭 → 메뉴판 전환
    const btn = document.getElementById('btn-intro-tap');
    if (btn) {
      let tapped = false;
      Utils.onTap(btn, async () => {
        if (tapped) return;
        tapped = true;
        await window.AudioEngine.unlockAudio();
        await window.MenuManager.goToScreen('screen-menu');
      });
    }
  }

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
              title: '보이스피싱 헬스키친 — 당신은 이 맛을 견뎌낼 수 있습니까?',
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
        await navigator.share({
          title: '보이스피싱 헬스키친',
          text, url,
        });
        return;
      } catch(e) { if (e.name === 'AbortError') return; }
    }
    const ok = await Utils.copyToClipboard(text);
    Utils.showToast(ok ? '결과가 복사되었습니다!' : '공유에 실패했습니다.');
  }

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
