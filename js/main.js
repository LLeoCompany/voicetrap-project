/* ==========================================================================
   main.js — 보이스피싱크홀 캠페인
   진입점: 초기화 + 인트로 시퀀스 + SNS 공유 + 토스트
   ========================================================================== */

(function () {
  'use strict';

  /* ════════════════════════════════════════════════════════════════════════
     DOMContentLoaded — 전체 초기화
  ════════════════════════════════════════════════════════════════════════ */
  document.addEventListener('DOMContentLoaded', async () => {

    /* ── StageManager 초기화 ───────────────────────────────────────────── */
    window.StageManager.init();

    /* ── 인트로 시퀀스 시작 ─────────────────────────────────────────────── */
    await initIntro();

    /* ── SNS 공유 버튼 바인딩 ───────────────────────────────────────────── */
    bindShareButtons();

    /* ── 경품 응모 버튼 ─────────────────────────────────────────────────── */
    bindApplyButton();
  });


  /* ════════════════════════════════════════════════════════════════════════
     initIntro — 인트로 화면 초기화
     1) 배경 음파 파형 SVG 생성
     2) 타이핑 효과 텍스트 시작
     3) 화면 탭 → AudioContext 언락 + 시작 화면 전환
  ════════════════════════════════════════════════════════════════════════ */
  async function initIntro() {
    /* ── 인트로 배경 음파 SVG 파형 생성 ────────────────────────────────── */
    const waveformSvg = document.getElementById('waveform-svg');
    if (waveformSvg) {
      Utils.createWaveform(waveformSvg, 36, 'svg');
    }

    /* ── 타이핑 효과 텍스트 ─────────────────────────────────────────────── */
    const typingEl = document.getElementById('intro-typing');
    if (typingEl) {
      // 잠깐 대기 후 타이핑 시작 (화면 렌더링 안정화)
      await Utils.delay(400);
      await Utils.typeWriter(
        typingEl,
        '"난 절대로\n보이스피싱 따위에\n속지않아!"',
        65
      );
    }

    /* ── 인트로 탭/클릭 → 시작 화면 전환 ──────────────────────────────── */
    const btnIntroTap = document.getElementById('btn-intro-tap');
    if (btnIntroTap) {
      let tapped = false;
      Utils.onTap(btnIntroTap, async () => {
        if (tapped) return;
        tapped = true;

        // AudioContext 언락 (사용자 제스처 내에서 반드시 호출)
        await window.AudioEngine.unlockAudio();

        // 시작 화면으로 전환
        await window.StageManager.goToScreen('screen-start');
      });
    }
  }


  /* ════════════════════════════════════════════════════════════════════════
     bindShareButtons — SNS 공유 버튼 이벤트
  ════════════════════════════════════════════════════════════════════════ */
  function bindShareButtons() {

    /* ── 카카오톡 공유 ─────────────────────────────────────────────────── */
    const btnKakao = document.getElementById('btn-share-kakao');
    if (btnKakao) {
      Utils.onTap(btnKakao, () => {
        const shareText = window.ScoreTracker.getShareText();
        const shareUrl  = window.ScoreTracker.getShareURL();

        // 카카오 SDK가 있으면 사용, 없으면 URL 복사로 폴백
        if (window.Kakao && window.Kakao.isInitialized && window.Kakao.isInitialized()) {
          window.Kakao.Link.sendDefault({
            objectType: 'feed',
            content: {
              title: '보이스피싱크홀 — 당신은 피할 수 있습니까?',
              description: shareText,
              imageUrl: `${window.location.origin}/assets/images/og_image.jpg`,
              link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
            },
            buttons: [{
              title: '나도 도전하기',
              link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
            }],
          });
        } else {
          // 카카오 SDK 미로드 시 클립보드 복사로 폴백
          fallbackShare(shareText);
        }
      });
    }

    /* ── URL 복사 ──────────────────────────────────────────────────────── */
    const btnUrl = document.getElementById('btn-share-url');
    if (btnUrl) {
      Utils.onTap(btnUrl, async () => {
        const shareText = window.ScoreTracker.getShareText();
        const ok = await Utils.copyToClipboard(shareText);
        Utils.showToast(ok ? '링크가 복사되었습니다!' : '복사에 실패했습니다. 직접 URL을 복사해 주세요.');
      });
    }

    /* ── Web Share API (지원 브라우저 우선) ────────────────────────────── */
    if (navigator.share) {
      [btnKakao, btnUrl].forEach(btn => {
        if (!btn) return;
        // 기존 이벤트는 유지, 추가로 네이티브 공유 시도 가능
      });
    }
  }

  /* ── fallbackShare ─────────────────────────────────────────────────────
     카카오 SDK 미사용 시 네이티브 공유 or 클립보드 복사
  ─────────────────────────────────────────────────────────────────────── */
  async function fallbackShare(text) {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '보이스피싱크홀 — 당신은 피할 수 있습니까?',
          text:  text,
          url:   window.ScoreTracker.getShareURL(),
        });
        return;
      } catch (e) {
        // 사용자가 공유 취소한 경우 무시
        if (e.name === 'AbortError') return;
      }
    }
    // Web Share API 미지원 → 클립보드
    const ok = await Utils.copyToClipboard(text);
    Utils.showToast(ok ? '결과가 복사되었습니다!' : '공유에 실패했습니다.');
  }


  /* ════════════════════════════════════════════════════════════════════════
     bindApplyButton — 경품 응모 버튼
     (실제 폼 URL은 광고주 확정 후 href에 반영)
  ════════════════════════════════════════════════════════════════════════ */
  function bindApplyButton() {
    const btnApply = document.getElementById('btn-apply');
    if (!btnApply) return;

    Utils.onTap(btnApply, () => {
      // TODO: 광고주 확정 후 실제 응모 폼 URL로 교체
      const applyUrl = btnApply.dataset.url || '#';

      if (applyUrl === '#') {
        Utils.showToast('경품 응모 기간을 확인해 주세요.');
        return;
      }
      window.open(applyUrl, '_blank', 'noopener,noreferrer');
    });
  }

})();
