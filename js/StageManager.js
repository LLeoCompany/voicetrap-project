/* ==========================================================================
   StageManager.js — 보이스피싱크홀 캠페인
   스테이지 전환 엔진 (핵심 오케스트레이터)
   전체 게임 state 관리 및 화면 전환 제어
   ========================================================================== */

class StageManager {
  constructor() {
    /* ── 게임 상태 ─────────────────────────────────────────────────────── */
    this._state = {
      currentStageIndex: 0,   // STAGES 배열 인덱스 (0-based)
      history:           [],  // ScoreTracker와 동기화
      score:             0,   // safe 선택 누적 수
      isProcessing:      false, // 중복 클릭 방지 플래그
      audioPlayed:       false, // 현 스테이지 음성 재생 여부
    };

    /* ── DOM 캐시 ──────────────────────────────────────────────────────── */
    this._els = {};

    /* ── 파형 바 참조 ──────────────────────────────────────────────────── */
    this._waveformBars = [];
  }

  /* ════════════════════════════════════════════════════════════════════════
     init — 초기화 (DOMContentLoaded 후 호출)
  ════════════════════════════════════════════════════════════════════════ */
  init() {
    this._cacheEls();
    this._bindEvents();

    // 다음 스테이지 오디오 사전 로드
    const srcs = window.STAGES.map(s => s.audioSrc);
    window.AudioEngine.preload(srcs);

    console.log('[StageManager] 초기화 완료. 스테이지 수:', window.STAGES.length);
  }

  /* ── _cacheEls ─────────────────────────────────────────────────────────
     자주 쓰는 DOM 요소를 한 번만 조회해서 캐시
  ─────────────────────────────────────────────────────────────────────── */
  _cacheEls() {
    const $ = id => document.getElementById(id);
    this._els = {
      // 화면들
      screenIntro:   document.getElementById('screen-intro'),
      screenStart:   document.getElementById('screen-start'),
      screenStage:   document.getElementById('screen-stage'),
      screenResult:  document.getElementById('screen-result'),

      // 인트로
      btnIntroTap:   $('btn-intro-tap'),

      // 시작
      btnStart:      $('btn-start'),

      // 스테이지 헤더
      stageType:     $('stage-type'),
      stageNumber:   $('stage-number'),
      progressBar:   $('progress-bar'),

      // 도트 인디케이터
      dotsStart:     document.querySelectorAll('#stage-dots-start .dot'),
      dotsStage:     document.querySelectorAll('#stage-dots-stage .dot'),

      // 오디오 플레이어
      btnAudioPlay:  $('btn-audio-play'),
      iconPlay:      $('icon-play'),
      iconPause:     $('icon-pause'),
      audioLabel:    $('audio-label'),
      waveformPlayer: $('waveform-player'),

      // 상황 카드
      keywordsGrid:  $('keywords-grid'),
      situationText: $('situation-text'),

      // 선택 버튼
      btnA:          $('btn-a'),
      btnB:          $('btn-b'),
      choiceAText:   $('choice-a-text'),
      choiceBText:   $('choice-b-text'),

      // 결과 오버레이
      resultOverlay:     $('result-overlay'),
      resultIcon:        $('result-icon'),
      resultFeedback:    $('result-feedback-text'),
      resultEduText:     $('result-edu-text'),

      // 최종 리포트
      resultMsgText: $('result-msg-text'),
      btnRetry:      $('btn-retry'),

      // 스테이지 body (싱크홀 애니메이션 대상)
      stageBody:     document.querySelector('.stage-body'),
    };
  }

  /* ── _bindEvents ───────────────────────────────────────────────────────
     버튼 이벤트 바인딩 (단 한 번만)
  ─────────────────────────────────────────────────────────────────────── */
  _bindEvents() {
    const { btnStart, btnAudioPlay, btnA, btnB, btnRetry } = this._els;

    // 시작 버튼
    if (btnStart) {
      Utils.onTap(btnStart, () => this._onStartTap());
    }

    // 오디오 플레이 버튼
    if (btnAudioPlay) {
      Utils.onTap(btnAudioPlay, () => this._onAudioPlayTap());
    }

    // A 선택
    if (btnA) {
      Utils.onTap(btnA, () => this.handleChoice('A'));
    }

    // B 선택
    if (btnB) {
      Utils.onTap(btnB, () => this.handleChoice('B'));
    }

    // 재도전
    if (btnRetry) {
      Utils.onTap(btnRetry, () => this.reset());
    }
  }

  /* ════════════════════════════════════════════════════════════════════════
     goToScreen — 화면 전환 (opacity 방식, display:none 금지)
     @param screenId  전환할 화면 element id
  ════════════════════════════════════════════════════════════════════════ */
  goToScreen(screenId) {
    return new Promise(resolve => {
      const screens = ['screen-intro', 'screen-start', 'screen-stage', 'screen-result'];

      screens.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;

        if (id === screenId) {
          el.classList.add('active');
          el.scrollTop = 0;   // 스크롤 상단으로 리셋
        } else {
          el.classList.remove('active');
        }
      });

      // 전환 트랜지션 대기 (CSS --dur-screen: 0.4s)
      setTimeout(resolve, 400);
    });
  }

  /* ════════════════════════════════════════════════════════════════════════
     _onStartTap — 시작 버튼 탭 처리
  ════════════════════════════════════════════════════════════════════════ */
  async _onStartTap() {
    // AudioContext 언락 (사용자 제스처 안에서 반드시 호출)
    await window.AudioEngine.unlockAudio();
    await this.goToScreen('screen-stage');
    this.showStage(0);
  }

  /* ════════════════════════════════════════════════════════════════════════
     showStage — 스테이지 데이터를 DOM에 렌더링
     @param index  STAGES 배열 인덱스 (0-based)
  ════════════════════════════════════════════════════════════════════════ */
  showStage(index) {
    const stages = window.STAGES;
    if (index >= stages.length) {
      this.showResult();
      return;
    }

    this._state.currentStageIndex = index;
    this._state.isProcessing      = false;
    this._state.audioPlayed       = false;

    const stage = stages[index];
    const stageNum = index + 1;

    /* ── 헤더 업데이트 ─────────────────────────────────────────────────── */
    if (this._els.stageType)   this._els.stageType.textContent = stage.title;
    if (this._els.stageNumber) {
      this._els.stageNumber.innerHTML = `STAGE <strong>${stageNum}</strong> / ${stages.length}`;
    }

    // 진행 바 (현재 스테이지 / 전체)
    if (this._els.progressBar) {
      this._els.progressBar.style.width = `${(stageNum / stages.length) * 100}%`;
    }

    /* ── 도트 인디케이터 업데이트 ──────────────────────────────────────── */
    this._updateDots(index);

    /* ── 키워드 배지 렌더링 ─────────────────────────────────────────────── */
    if (this._els.keywordsGrid) {
      this._els.keywordsGrid.innerHTML = stage.keywords.map(kw =>
        `<div class="keyword-item">
          <span class="keyword-label">${kw.label}</span>
          <span class="keyword-value">${kw.value}</span>
        </div>`
      ).join('');
    }

    /* ── 상황 텍스트 ────────────────────────────────────────────────────── */
    if (this._els.situationText) {
      this._els.situationText.textContent = stage.situation;
    }

    /* ── 선택 버튼 텍스트 설정 & 비활성화 ──────────────────────────────── */
    if (this._els.choiceAText) this._els.choiceAText.textContent = stage.choices.A.label;
    if (this._els.choiceBText) this._els.choiceBText.textContent = stage.choices.B.label;
    this._setChoicesEnabled(false);

    /* ── 결과 오버레이 숨기기 ───────────────────────────────────────────── */
    this._hideResultOverlay();

    /* ── 오디오 플레이어 초기화 ─────────────────────────────────────────── */
    this._resetAudioPlayer();
    this._buildWaveform();

    /* ── 파형 바 생성 후 자동 음성 재생 시도 ───────────────────────────── */
    this._playStageAudio(stage);

    /* ── 스테이지 body 스크롤 상단 리셋 ────────────────────────────────── */
    if (this._els.screenStage) this._els.screenStage.scrollTop = 0;
  }

  /* ── _playStageAudio ─────────────────────────────────────────────────────
     스테이지 음성 재생 → 완료 시 선택 버튼 활성화
  ─────────────────────────────────────────────────────────────────────── */
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
      onProgress: (ratio) => {
        // 파형 바 진행률 시각화 (재생된 부분 강조)
        this._updateWaveformProgress(ratio);
      },
      onError: () => {
        // 오디오 로드 실패 → 버튼 바로 활성화
        this._state.audioPlayed = true;
        this._setAudioIcon(false);
        Utils.animateWaveform(this._waveformBars, false);
        if (this._els.audioLabel) this._els.audioLabel.textContent = '선택해 주세요';
        this._setChoicesEnabled(true);
      },
    });
  }

  /* ── _onAudioPlayTap ─────────────────────────────────────────────────────
     오디오 플레이 버튼 탭 처리 (재생 / 일시정지 토글)
  ─────────────────────────────────────────────────────────────────────── */
  async _onAudioPlayTap() {
    await window.AudioEngine.unlockAudio();

    if (window.AudioEngine.isPlaying) {
      window.AudioEngine.pauseVoice();
      this._setAudioIcon(false);
      Utils.animateWaveform(this._waveformBars, false);
    } else {
      // 이미 재생했던 경우 재시작
      if (this._state.audioPlayed) {
        const stage = window.STAGES[this._state.currentStageIndex];
        this._playStageAudio(stage);
      } else {
        // 자동재생 차단으로 대기 중이었던 경우 resume 시도
        window.AudioEngine.toggleVoice();
        this._setAudioIcon(true);
        Utils.animateWaveform(this._waveformBars, true);
      }
    }
  }

  /* ════════════════════════════════════════════════════════════════════════
     handleChoice — A / B 선택 처리 (핵심 로직)
     @param choice  'A' | 'B'
  ════════════════════════════════════════════════════════════════════════ */
  async handleChoice(choice) {
    // 중복 클릭 방지
    if (this._state.isProcessing) return;
    this._state.isProcessing = true;

    // 선택 버튼 즉시 비활성화
    this._setChoicesEnabled(false);

    // 음성 중단
    window.AudioEngine.stop();
    Utils.animateWaveform(this._waveformBars, false);

    const index    = this._state.currentStageIndex;
    const stage    = window.STAGES[index];
    const chosen   = stage.choices[choice];
    const isSink   = chosen.result === 'sink';

    /* ── ScoreTracker 기록 ─────────────────────────────────────────────── */
    window.ScoreTracker.record(stage.id, choice, chosen.result, stage);
    if (!isSink) this._state.score++;

    /* ── 싱크홀 / 안전 애니메이션 ─────────────────────────────────────── */
    if (isSink) {
      // 효과음 재생 + 싱크홀 애니메이션 동시 시작
      if (chosen.sfx) window.AudioEngine.playSFX(chosen.sfx);
      await window.SinkholeEffect.triggerSink(this._els.stageBody);
    } else {
      window.SinkholeEffect.flashGreen(400);
      await window.SinkholeEffect.triggerSafe(this._els.stageBody);
    }

    /* ── 결과 오버레이 표시 ────────────────────────────────────────────── */
    this._showResultOverlay(chosen, isSink);

    /* ── 도트 업데이트 (선택 결과 반영) ───────────────────────────────── */
    this._updateDots(index, choice, chosen.result);

    /* ── 2초 후 자동 다음 스테이지 진행 ───────────────────────────────── */
    await Utils.delay(2000);

    this._hideResultOverlay();
    await Utils.delay(300); // 오버레이 fade-out 대기

    const nextIndex = index + 1;
    if (nextIndex < window.STAGES.length) {
      this.showStage(nextIndex);
    } else {
      await this.goToScreen('screen-result');
      this.showResult();
    }
  }

  /* ════════════════════════════════════════════════════════════════════════
     showResult — 최종 리포트 화면 렌더링
  ════════════════════════════════════════════════════════════════════════ */
  showResult() {
    // 결과 메시지
    const msg = window.ScoreTracker.getResultMessage();
    if (this._els.resultMsgText) {
      this._els.resultMsgText.textContent = `${msg.emoji} ${msg.title}\n${msg.text}`;
      this._els.resultMsgText.style.whiteSpace = 'pre-line';
    }

    // 원형 게이지 + 카운트업 애니메이션
    window.ScoreTracker.renderScoreGauge();

    // 교육 카드 렌더링
    window.ScoreTracker.renderEduCards();
  }

  /* ════════════════════════════════════════════════════════════════════════
     reset — 재도전 시 전체 초기화
  ════════════════════════════════════════════════════════════════════════ */
  async reset() {
    // 상태 초기화
    this._state = {
      currentStageIndex: 0,
      history:           [],
      score:             0,
      isProcessing:      false,
      audioPlayed:       false,
    };

    // ScoreTracker 초기화
    window.ScoreTracker.reset();

    // 오디오 중단
    window.AudioEngine.stop();
    window.AudioEngine.stopAllSFX();

    // 도트 초기화
    this._resetDots();

    // 화면 전환 → 시작 화면
    await this.goToScreen('screen-start');
  }

  /* ════════════════════════════════════════════════════════════════════════
     _showResultOverlay — 선택 직후 결과 오버레이 표시
  ════════════════════════════════════════════════════════════════════════ */
  _showResultOverlay(choiceData, isSink) {
    const { resultOverlay, resultIcon, resultFeedback, resultEduText } = this._els;
    if (!resultOverlay) return;

    // 아이콘
    if (resultIcon) {
      resultIcon.textContent = isSink ? '🌀' : '✅';
    }

    // 피드백 텍스트
    if (resultFeedback) {
      resultFeedback.textContent = choiceData.feedback;
      resultFeedback.className = `result-feedback-text ${isSink ? 'sink' : 'safe'}`;
    }

    // 교육 텍스트
    if (resultEduText) {
      resultEduText.textContent = choiceData.education;
    }

    // 오버레이 표시
    resultOverlay.classList.add('show');
  }

  /* ── _hideResultOverlay ──────────────────────────────────────────────── */
  _hideResultOverlay() {
    if (this._els.resultOverlay) {
      this._els.resultOverlay.classList.remove('show');
    }
  }

  /* ── _setChoicesEnabled ──────────────────────────────────────────────────
     선택 버튼 활성/비활성
  ─────────────────────────────────────────────────────────────────────── */
  _setChoicesEnabled(enabled) {
    const { btnA, btnB } = this._els;
    if (btnA) {
      btnA.disabled = !enabled;
      btnA.classList.toggle('disabled', !enabled);
    }
    if (btnB) {
      btnB.disabled = !enabled;
      btnB.classList.toggle('disabled', !enabled);
    }
  }

  /* ── _setAudioIcon ───────────────────────────────────────────────────────
     오디오 플레이어 아이콘 전환 (재생 / 일시정지)
  ─────────────────────────────────────────────────────────────────────── */
  _setAudioIcon(isPlaying) {
    const { btnAudioPlay } = this._els;
    if (!btnAudioPlay) return;
    btnAudioPlay.classList.toggle('playing', isPlaying);
  }

  /* ── _resetAudioPlayer ───────────────────────────────────────────────────
     오디오 플레이어 UI 초기 상태로 리셋
  ─────────────────────────────────────────────────────────────────────── */
  _resetAudioPlayer() {
    this._setAudioIcon(false);
    if (this._els.audioLabel) {
      this._els.audioLabel.textContent = '음성 재생 후 선택 가능합니다';
    }
  }

  /* ── _buildWaveform ──────────────────────────────────────────────────────
     오디오 플레이어 파형 바 생성
  ─────────────────────────────────────────────────────────────────────── */
  _buildWaveform() {
    if (!this._els.waveformPlayer) return;
    this._waveformBars = Utils.createWaveform(this._els.waveformPlayer, 30, 'div');
  }

  /* ── _updateWaveformProgress ──────────────────────────────────────────────
     재생 진행률에 따라 파형 바 색상 업데이트
     @param ratio  0.0 ~ 1.0
  ─────────────────────────────────────────────────────────────────────── */
  _updateWaveformProgress(ratio) {
    const bars = this._waveformBars;
    if (!bars.length) return;
    const playedCount = Math.floor(ratio * bars.length);
    bars.forEach((bar, i) => {
      bar.classList.toggle('played', i < playedCount);
    });
  }

  /* ── _updateDots ─────────────────────────────────────────────────────────
     도트 인디케이터 상태 업데이트
     @param currentIndex  현재 스테이지 인덱스 (0-based)
     @param choice        선택 결과 ('A' | 'B' | undefined)
     @param result        'sink' | 'safe' | undefined
  ─────────────────────────────────────────────────────────────────────── */
  _updateDots(currentIndex, choice, result) {
    const history = window.ScoreTracker.getHistory();

    [this._els.dotsStart, this._els.dotsStage].forEach(dots => {
      if (!dots) return;
      dots.forEach((dot, i) => {
        dot.classList.remove('active', 'done', 'safe', 'sink');

        const record = history.find(h => h.stageId === i + 1);
        if (record) {
          dot.classList.add('done', record.result);
        } else if (i === currentIndex) {
          dot.classList.add('active');
        }
      });
    });
  }

  /* ── _resetDots ──────────────────────────────────────────────────────────
     도트 인디케이터 전체 초기화
  ─────────────────────────────────────────────────────────────────────── */
  _resetDots() {
    [this._els.dotsStart, this._els.dotsStage].forEach(dots => {
      if (!dots) return;
      dots.forEach(dot => dot.classList.remove('active', 'done', 'safe', 'sink'));
    });
  }
}

/* ── 전역 싱글톤 등록 ──────────────────────────────────────────────────── */
window.StageManager = new StageManager();
