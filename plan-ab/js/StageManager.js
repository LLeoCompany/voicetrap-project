/* ==========================================================================
   StageManager.js — 보이스피싱크홀 A+B 조합안
   화면 전환 + 스테이지 진행 엔진
   ========================================================================== */

class StageManager {
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
    window.AudioEngine.preload(window.STAGES.map(s => s.audioSrc));
  }

  /* ── _cacheEls ───────────────────────────────────────────────────────── */
  _cacheEls() {
    const $ = id => document.getElementById(id);
    this._els = {
      screenIntro:   $('screen-intro'),
      screenStart:   $('screen-start'),
      screenStage:   $('screen-stage'),
      screenResult:  $('screen-result'),

      btnStart:      $('btn-start'),
      btnAudioPlay:  $('btn-audio-play'),
      btnA:          $('btn-a'),
      btnB:          $('btn-b'),
      btnRetry:      $('btn-retry'),

      spiceBadge:    $('spice-badge'),
      stageLabel:    $('stage-label'),
      stageCounter:  $('stage-counter'),
      progressBar:   $('progress-bar'),

      keywordsGrid:  $('keywords-grid'),
      situationText: $('situation-text'),
      choiceAText:   $('choice-a-text'),
      choiceBText:   $('choice-b-text'),

      audioLabel:    $('audio-label'),
      waveformPlayer:$('waveform-player'),

      resultOverlay: $('result-overlay'),
      resultIcon:    $('result-icon'),
      resultType:    $('result-type'),
      resultMessage: $('result-message'),
      resultDetail:  $('result-detail'),
      resultResponse:$('result-response'),
      resultNextHint:$('result-next-hint'),

      stageBody:     document.querySelector('.stage-body'),
    };
  }

  /* ── _bindEvents ─────────────────────────────────────────────────────── */
  _bindEvents() {
    const { btnStart, btnAudioPlay, btnA, btnB, btnRetry } = this._els;
    if (btnStart)     Utils.onTap(btnStart,     () => this._onStartTap());
    if (btnAudioPlay) Utils.onTap(btnAudioPlay, () => this._onAudioPlayTap());
    if (btnA)         Utils.onTap(btnA,         () => this.handleChoice('A'));
    if (btnB)         Utils.onTap(btnB,         () => this.handleChoice('B'));
    if (btnRetry)     Utils.onTap(btnRetry,     () => this.reset());
  }

  /* ── goToScreen ──────────────────────────────────────────────────────── */
  goToScreen(screenId) {
    return new Promise(resolve => {
      ['screen-intro','screen-start','screen-stage','screen-result'].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        if (id === screenId) { el.classList.add('active');    el.scrollTop = 0; }
        else                  { el.classList.remove('active'); }
      });
      setTimeout(resolve, 400);
    });
  }

  /* ── _onStartTap ─────────────────────────────────────────────────────── */
  async _onStartTap() {
    await window.AudioEngine.unlockAudio();
    await this.goToScreen('screen-stage');
    this.showStage(0);
  }

  /* ── showStage ───────────────────────────────────────────────────────── */
  showStage(index) {
    const stages = window.STAGES;
    if (index >= stages.length) { this.showResult(); return; }

    this._state.currentIndex = index;
    this._state.isProcessing = false;
    this._state.audioPlayed  = false;

    const stage   = stages[index];
    const stageNum = index + 1;

    /* ── 맛 단계 컬러 테마 동적 적용 ── */
    Utils.applySpiceTheme(stage.spiceColor, stage.spiceBg);

    /* ── 카드 배경 색상 ── */
    const situationCard = document.querySelector('.situation-card');
    if (situationCard) {
      situationCard.style.backgroundColor = stage.cardBg;
    }

    /* ── 헤더 ── */
    if (this._els.spiceBadge) {
      this._els.spiceBadge.textContent = stage.spiceLabel;
    }
    if (this._els.stageLabel) {
      this._els.stageLabel.textContent = `SINKHOLE ${stageNum}`;
    }
    if (this._els.stageCounter) {
      this._els.stageCounter.textContent = `${stageNum} / ${stages.length}`;
    }
    if (this._els.progressBar) {
      this._els.progressBar.style.width = `${(stageNum / stages.length) * 100}%`;
    }

    /* ── 키워드 배지 ── */
    if (this._els.keywordsGrid) {
      this._els.keywordsGrid.innerHTML = stage.keywords.map(kw => `
        <div class="keyword-item">
          <span class="keyword-label">${kw.label}</span>
          <span class="keyword-value">${kw.value}</span>
        </div>
      `).join('');
    }

    /* ── 상황 텍스트 ── */
    if (this._els.situationText) {
      this._els.situationText.textContent = stage.situation;
    }

    /* ── 선택 버튼 텍스트 ── */
    if (this._els.choiceAText) this._els.choiceAText.textContent = stage.choices.A.label;
    if (this._els.choiceBText) this._els.choiceBText.textContent = stage.choices.B.label;
    this._setChoicesEnabled(false);

    /* ── 오버레이/플레이어 초기화 ── */
    this._hideOverlay();
    this._resetAudioPlayer();
    this._buildWaveform();

    /* ── 음성 재생 ── */
    this._playStageAudio(stage);

    if (this._els.screenStage) this._els.screenStage.scrollTop = 0;
  }

  /* ── _playStageAudio ─────────────────────────────────────────────────── */
  _playStageAudio(stage) {
    window.AudioEngine.playVoice(stage.audioSrc, {
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

  /* ── _onAudioPlayTap ─────────────────────────────────────────────────── */
  async _onAudioPlayTap() {
    await window.AudioEngine.unlockAudio();
    if (window.AudioEngine.isPlaying) {
      window.AudioEngine.pauseVoice();
      this._setAudioIcon(false);
      Utils.animateWaveform(this._waveformBars, false);
    } else {
      if (this._state.audioPlayed) {
        // 재생 완료 후 다시 재생 → 처음부터
        this._playStageAudio(window.STAGES[this._state.currentIndex]);
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
    const stage  = window.STAGES[index];
    const chosen = stage.choices[choice];
    const isSink = chosen.result === 'sink';

    /* ── 기록 ── */
    window.ScoreTracker.record(stage.id, choice, chosen.result, stage);

    /* ── 애니메이션 ── */
    if (isSink) {
      if (chosen.sfx) window.AudioEngine.playSFX(chosen.sfx);
      await window.SinkholeEffect.triggerSink(this._els.stageBody, stage.spiceLevel);
    } else {
      await window.SinkholeEffect.triggerSafe(this._els.stageBody, stage.spiceLevel);
    }

    /* ── 결과 오버레이 ── */
    this._showOverlay(chosen, isSink, stage);

    /* ── 대기: sink=2초, safe=1.5초 ── */
    await Utils.delay(isSink ? 2000 : 1500);
    this._hideOverlay();
    await Utils.delay(300);

    const nextIndex = index + 1;
    if (nextIndex < window.STAGES.length) {
      this.showStage(nextIndex);
    } else {
      await this.goToScreen('screen-result');
      this.showResult();
    }
  }

  /* ── showResult ──────────────────────────────────────────────────────── */
  showResult() {
    window.ScoreTracker.renderImmunityGauge();
    window.ScoreTracker.renderResultMsg();
    window.ScoreTracker.renderResultsTable();
    window.ScoreTracker.renderEduCards();
  }

  /* ── reset ───────────────────────────────────────────────────────────── */
  async reset() {
    this._state = { currentIndex: 0, isProcessing: false, audioPlayed: false };
    window.ScoreTracker.reset();
    window.AudioEngine.stop();
    window.AudioEngine.stopAllSFX();
    // 순한맛 컬러로 초기화
    Utils.applySpiceTheme('#FF9800', 'rgba(255,152,0,0.10)');
    await this.goToScreen('screen-start');
  }

  /* ── _showOverlay ────────────────────────────────────────────────────── */
  _showOverlay(choiceData, isSink, stage) {
    const { resultOverlay, resultIcon, resultType, resultMessage,
            resultDetail, resultResponse, resultNextHint } = this._els;
    if (!resultOverlay) return;

    if (resultIcon) {
      resultIcon.textContent = isSink ? '🌀' : '🏆';
    }
    if (resultType) {
      resultType.textContent = isSink
        ? `SINKHOLE ${stage.spiceLevel}`
        : `SINKHOLE ${stage.spiceLevel} 탈출`;
      resultType.className = `result-type ${isSink ? 'sink' : 'safe'}`;
    }
    if (resultMessage) {
      resultMessage.textContent = choiceData.feedback;
      resultMessage.className   = `result-message ${isSink ? 'sink' : 'safe'}`;
    }
    if (resultDetail) {
      resultDetail.textContent = isSink ? choiceData.damage : choiceData.education;
    }
    if (resultResponse) {
      resultResponse.textContent  = isSink && choiceData.response ? choiceData.response : '';
      resultResponse.style.opacity = isSink && choiceData.response ? '1' : '0';
    }
    if (resultNextHint) {
      const sec = isSink ? 2 : 1.5;
      const nextStageNum = this._state.currentIndex + 2;
      const isLast = this._state.currentIndex >= window.STAGES.length - 1;
      resultNextHint.textContent = isLast
        ? `${sec}초 후 최종 결과를 확인합니다...`
        : `${sec}초 후 SINKHOLE ${nextStageNum}로 이동합니다...`;
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
    if (this._els.audioLabel)
      this._els.audioLabel.textContent = '음성 재생 후 선택 가능합니다';
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

window.StageManager = new StageManager();
