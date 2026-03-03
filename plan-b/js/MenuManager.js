/* ==========================================================================
   MenuManager.js — 보이스피싱 헬스키친 B안
   메뉴 전환 엔진 (A안 StageManager에 대응)
   ========================================================================== */

class MenuManager {
  constructor() {
    this._state = {
      currentIndex: 0,
      isProcessing: false,
      audioPlayed:  false,
    };
    this._els = {};
    this._waveformBars = [];
  }

  /* ── init ────────────────────────────────────────────────────────────── */
  init() {
    this._cacheEls();
    this._bindEvents();
    window.AudioEngine.preload(window.MENUS.map(m => m.audioSrc));
    // 영수증 날짜 세팅
    const dateEl = document.getElementById('receipt-date');
    if (dateEl) {
      dateEl.textContent = new Date().toLocaleDateString('ko-KR', {
        year: 'numeric', month: 'long', day: 'numeric'
      });
    }
  }

  _cacheEls() {
    const $ = id => document.getElementById(id);
    this._els = {
      screenIntro:    document.getElementById('screen-intro'),
      screenMenu:     document.getElementById('screen-menu'),
      screenStage:    document.getElementById('screen-menu-stage'),
      screenReceipt:  document.getElementById('screen-receipt'),

      btnIntroTap:    $('btn-intro-tap'),
      btnOrder:       $('btn-order'),
      btnAudioPlay:   $('btn-audio-play'),
      btnA:           $('btn-a'),
      btnB:           $('btn-b'),
      btnRetry:       $('btn-retry'),

      spiceBadge:     $('spice-badge'),
      menuNumber:     $('menu-number'),
      menuName:       $('menu-name'),
      progressBar:    $('progress-bar'),

      ingredientsGrid: $('ingredients-grid'),
      menuDesc:       $('menu-desc'),
      choiceAText:    $('choice-a-text'),
      choiceBText:    $('choice-b-text'),

      audioLabel:     $('audio-label'),
      waveformPlayer: $('waveform-player'),

      resultOverlay:  $('result-overlay'),
      resultIcon:     $('result-icon'),
      resultFeedback: $('result-feedback-text'),
      eduLabel:       $('edu-label'),
      resultEduMain:  $('result-edu-main'),
      resultEduResp:  $('result-edu-response'),
      resultNextHint: $('result-next-hint'),

      receiptMsgText: $('receipt-msg-text'),
      stageBody:      document.querySelector('.stage-body'),
    };
  }

  _bindEvents() {
    const { btnOrder, btnAudioPlay, btnA, btnB, btnRetry } = this._els;
    if (btnOrder)     Utils.onTap(btnOrder,     () => this._onOrderTap());
    if (btnAudioPlay) Utils.onTap(btnAudioPlay, () => this._onAudioPlayTap());
    if (btnA)         Utils.onTap(btnA,         () => this.handleChoice('A'));
    if (btnB)         Utils.onTap(btnB,         () => this.handleChoice('B'));
    if (btnRetry)     Utils.onTap(btnRetry,     () => this.reset());
  }

  /* ── goToScreen ──────────────────────────────────────────────────────── */
  goToScreen(screenId) {
    return new Promise(resolve => {
      ['screen-intro','screen-menu','screen-menu-stage','screen-receipt'].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        if (id === screenId) { el.classList.add('active'); el.scrollTop = 0; }
        else                 { el.classList.remove('active'); }
      });
      setTimeout(resolve, 400);
    });
  }

  async _onOrderTap() {
    await window.AudioEngine.unlockAudio();
    await this.goToScreen('screen-menu-stage');
    this.showMenu(0);
  }

  /* ── showMenu ────────────────────────────────────────────────────────── */
  showMenu(index) {
    const menus = window.MENUS;
    if (index >= menus.length) { this.showReceipt(); return; }

    this._state.currentIndex = index;
    this._state.isProcessing = false;
    this._state.audioPlayed  = false;

    const menu    = menus[index];
    const menuNum = index + 1;

    /* ── 맛 단계 컬러 테마 적용 (CSS 변수 동적 교체) ── */
    Utils.applySpiceTheme(menu.spiceColor);

    /* ── 헤더 ── */
    if (this._els.spiceBadge) {
      this._els.spiceBadge.textContent = menu.spiceLabel;
      this._els.spiceBadge.className = `spice-badge-sm spice-${menu.spiceKey}`;
    }
    if (this._els.menuNumber) {
      this._els.menuNumber.innerHTML = `MENU <strong>${menuNum}</strong> / ${menus.length}`;
    }
    if (this._els.menuName)    this._els.menuName.textContent = menu.title;
    if (this._els.progressBar) this._els.progressBar.style.width = `${(menuNum / menus.length) * 100}%`;

    /* ── 재료 배지 ── */
    if (this._els.ingredientsGrid) {
      this._els.ingredientsGrid.innerHTML = menu.keywords.map(kw =>
        `<div class="ingredient-item">
          <span class="ingredient-label">${kw.label}</span>
          <span class="ingredient-value">${kw.value}</span>
        </div>`
      ).join('');
    }

    /* ── 메뉴 설명 ── */
    if (this._els.menuDesc) this._els.menuDesc.textContent = menu.situation;

    /* ── 선택 버튼 ── */
    if (this._els.choiceAText) this._els.choiceAText.textContent = menu.choices.A.label;
    if (this._els.choiceBText) this._els.choiceBText.textContent = menu.choices.B.label;
    this._setChoicesEnabled(false);

    /* ── 오버레이/플레이어 초기화 ── */
    this._hideOverlay();
    this._resetAudioPlayer();
    this._buildWaveform();

    /* ── 음성 재생 ── */
    this._playMenuAudio(menu);

    if (this._els.screenStage) this._els.screenStage.scrollTop = 0;
  }

  _playMenuAudio(menu) {
    window.AudioEngine.playVoice(menu.audioSrc, {
      onPlay: () => {
        this._setAudioIcon(true);
        Utils.animateWaveform(this._waveformBars, true);
        if (this._els.audioLabel) this._els.audioLabel.textContent = '재생 중...';
      },
      onEnd: () => {
        this._state.audioPlayed = true;
        this._setAudioIcon(false);
        Utils.animateWaveform(this._waveformBars, false);
        if (this._els.audioLabel) this._els.audioLabel.textContent = '선택해 주세요';
        this._setChoicesEnabled(true);
      },
      onProgress: ratio => this._updateWaveformProgress(ratio),
      onError: () => {
        this._state.audioPlayed = true;
        this._setAudioIcon(false);
        Utils.animateWaveform(this._waveformBars, false);
        if (this._els.audioLabel) this._els.audioLabel.textContent = '선택해 주세요';
        this._setChoicesEnabled(true);
      },
    });
  }

  async _onAudioPlayTap() {
    await window.AudioEngine.unlockAudio();
    if (window.AudioEngine.isPlaying) {
      window.AudioEngine.pauseVoice();
      this._setAudioIcon(false);
      Utils.animateWaveform(this._waveformBars, false);
    } else {
      if (this._state.audioPlayed) {
        this._playMenuAudio(window.MENUS[this._state.currentIndex]);
      } else {
        window.AudioEngine.toggleVoice();
        this._setAudioIcon(true);
        Utils.animateWaveform(this._waveformBars, true);
      }
    }
  }

  /* ── handleChoice ────────────────────────────────────────────────────── */
  async handleChoice(choice) {
    if (this._state.isProcessing) return;
    this._state.isProcessing = true;
    this._setChoicesEnabled(false);

    window.AudioEngine.stop();
    Utils.animateWaveform(this._waveformBars, false);

    const index  = this._state.currentIndex;
    const menu   = window.MENUS[index];
    const chosen = menu.choices[choice];
    const isHell = chosen.result === 'hell';

    /* ── 기록 ── */
    window.ScoreTracker.record(menu.id, choice, chosen.result, menu);

    /* ── 애니메이션 ── */
    if (isHell) {
      if (chosen.sfx) window.AudioEngine.playSFX(chosen.sfx);
      await window.HellEffect.triggerHell(this._els.stageBody, menu.spiceLevel);
    } else {
      await window.HellEffect.triggerSurvived(this._els.stageBody, menu.spiceLevel);
    }

    /* ── 결과 오버레이 ── */
    this._showOverlay(chosen, isHell);

    /* ── 다음 메뉴 대기 시간: hell=2초, survived=1.5초 ── */
    await Utils.delay(isHell ? 2000 : 1500);
    this._hideOverlay();
    await Utils.delay(300);

    const nextIndex = index + 1;
    if (nextIndex < window.MENUS.length) {
      this.showMenu(nextIndex);
    } else {
      await this.goToScreen('screen-receipt');
      this.showReceipt();
    }
  }

  /* ── showReceipt ─────────────────────────────────────────────────────── */
  showReceipt() {
    const msg = window.ScoreTracker.getResultMessage();
    if (this._els.receiptMsgText) {
      this._els.receiptMsgText.textContent = `${msg.emoji} ${msg.title}\n${msg.text}`;
    }
    window.ScoreTracker.renderImmunityGauge();
    window.ScoreTracker.renderReceiptItems();
    window.ScoreTracker.renderEduCards();
  }

  /* ── reset ───────────────────────────────────────────────────────────── */
  async reset() {
    this._state = { currentIndex: 0, isProcessing: false, audioPlayed: false };
    window.ScoreTracker.reset();
    window.AudioEngine.stop();
    window.AudioEngine.stopAllSFX();
    Utils.applySpiceTheme('#FF9800'); // 순한맛 컬러로 초기화
    await this.goToScreen('screen-menu');
  }

  /* ── 오버레이 제어 ────────────────────────────────────────────────────── */
  _showOverlay(choiceData, isHell) {
    const { resultOverlay, resultIcon, resultFeedback, eduLabel, resultEduMain, resultEduResp, resultNextHint } = this._els;
    if (!resultOverlay) return;

    if (resultIcon)     resultIcon.textContent  = isHell ? '🔥' : '🏆';
    if (resultFeedback) {
      resultFeedback.textContent = choiceData.feedback;
      resultFeedback.className   = `result-feedback-text ${isHell ? 'hell' : 'survived'}`;
    }
    if (eduLabel)      eduLabel.textContent     = isHell ? '🚨 피해 안내' : '✅ 올바른 대응';
    if (resultEduMain) resultEduMain.textContent = choiceData.damage;
    if (resultEduResp) {
      resultEduResp.textContent = choiceData.response || '';
      resultEduResp.style.opacity = choiceData.response ? '1' : '0';
    }
    if (resultNextHint) {
      const delay = isHell ? 2 : 1.5;
      resultNextHint.textContent = `${delay}초 후 다음 메뉴로 이동합니다...`;
    }

    resultOverlay.classList.add('show');
  }
  _hideOverlay() {
    if (this._els.resultOverlay) this._els.resultOverlay.classList.remove('show');
  }

  /* ── 유틸 ────────────────────────────────────────────────────────────── */
  _setChoicesEnabled(enabled) {
    [this._els.btnA, this._els.btnB].forEach(btn => {
      if (!btn) return;
      btn.disabled = !enabled;
      btn.classList.toggle('disabled', !enabled);
    });
  }
  _setAudioIcon(isPlaying) {
    if (this._els.btnAudioPlay)
      this._els.btnAudioPlay.classList.toggle('playing', isPlaying);
  }
  _resetAudioPlayer() {
    this._setAudioIcon(false);
    if (this._els.audioLabel) this._els.audioLabel.textContent = '음성 재생 후 선택 가능합니다';
  }
  _buildWaveform() {
    if (!this._els.waveformPlayer) return;
    this._waveformBars = Utils.createWaveform(this._els.waveformPlayer, 30, 'div');
  }
  _updateWaveformProgress(ratio) {
    const bars  = this._waveformBars;
    const count = Math.floor(ratio * bars.length);
    bars.forEach((b, i) => b.classList.toggle('played', i < count));
  }
}

window.MenuManager = new MenuManager();
