/* ==========================================================================
   AudioEngine.js — 보이스피싱크홀 A+B 조합안
   AudioEngine.js — 보이스피싱크홀 캠페인
   Web Audio API 기반 오디오 엔진
   iOS Safari 자동재생 정책 완전 대응
   ========================================================================== */

class AudioEngine {
  constructor() {
    this._ctx        = null;    // AudioContext
    this._audio      = null;    // 현재 재생 중인 HTMLAudioElement (voice)
    this._sfxAudios  = [];      // 효과음 풀
    this._isPlaying  = false;
    this._isUnlocked = false;   // AudioContext resume 완료 여부
    this._progressTimer = null;

    // 오디오 언락은 사용자 제스처 시점에 수행
    this._bindUnlock();
  }

  /* ── 공개 getter ─────────────────────────────────────────────────────── */
  get isPlaying() { return this._isPlaying; }
  get isUnlocked() { return this._isUnlocked; }

  /* ── _bindUnlock ─────────────────────────────────────────────────────────
     최초 사용자 제스처(touchend / click / keydown) 시 AudioContext 초기화
     단 한 번만 실행되면 이후 제거
  ─────────────────────────────────────────────────────────────────────── */
  _bindUnlock() {
    const events = ['touchend', 'click', 'keydown'];
    const handler = () => {
      this.unlockAudio();
      events.forEach(ev => document.removeEventListener(ev, handler));
    };
    events.forEach(ev => document.addEventListener(ev, handler, { once: false, passive: true }));
  }

  /* ── unlockAudio ─────────────────────────────────────────────────────────
     사용자 제스처 내에서 반드시 호출 (iOS Safari 요구사항)
     AudioContext를 생성하고 resume 상태로 전환
  ─────────────────────────────────────────────────────────────────────── */
  async unlockAudio() {
    if (this._isUnlocked) return;

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) {
        console.warn('[AudioEngine] Web Audio API 미지원 브라우저');
        this._isUnlocked = true;
        return;
      }

      if (!this._ctx) {
        this._ctx = new AudioCtx();
      }

      if (this._ctx.state === 'suspended') {
        await this._ctx.resume();
      }

      // iOS Safari: 무음 버퍼를 한 번 재생해 컨텍스트 완전 활성화
      const silentBuf = this._ctx.createBuffer(1, 1, 22050);
      const src = this._ctx.createBufferSource();
      src.buffer = silentBuf;
      src.connect(this._ctx.destination);
      src.start(0);

      this._isUnlocked = true;
      console.log('[AudioEngine] AudioContext 언락 완료. state:', this._ctx.state);
    } catch (e) {
      console.warn('[AudioEngine] unlockAudio 실패:', e);
      this._isUnlocked = true; // 실패해도 게임 진행 허용
    }
  }

  /* ── playVoice ───────────────────────────────────────────────────────────
     보이스피싱 음성 재생
     @param src        오디오 파일 경로
     @param callbacks  { onPlay, onEnd, onProgress, onError }
     @returns HTMLAudioElement
  ─────────────────────────────────────────────────────────────────────── */
  async playVoice(src, { onPlay, onEnd, onProgress, onError } = {}) {
    // 기존 재생 중단
    this.stop();

    // AudioContext 언락 보장
    await this.unlockAudio();

    const audio = new Audio();
    audio.preload      = 'auto';
    audio.playsinline  = true;          // iOS: 인라인 재생
    audio.setAttribute('playsinline', '');
    audio.setAttribute('webkit-playsinline', '');
    audio.crossOrigin  = 'anonymous';

    this._audio = audio;

    // ── 이벤트 핸들러 ────────────────────────────────────────────────────
    audio.addEventListener('play', () => {
      this._isPlaying = true;
      onPlay && onPlay();
      this._startProgressTimer(audio, onProgress);
    });

    audio.addEventListener('ended', () => {
      this._isPlaying = false;
      this._stopProgressTimer();
      onEnd && onEnd();
    });

    audio.addEventListener('pause', () => {
      this._isPlaying = false;
      this._stopProgressTimer();
    });

    audio.addEventListener('error', (e) => {
      console.warn('[AudioEngine] 음성 로드 실패:', src, e);
      this._isPlaying = false;
      this._stopProgressTimer();
      // 오류 시에도 onEnd 호출 → 게임 진행 중단 없음
      onError && onError(e);
      onEnd && onEnd();
    });

    // ── 재생 시작 ────────────────────────────────────────────────────────
    audio.src = src;

    try {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        await playPromise;
      }
    } catch (e) {
      // NotAllowedError: 자동재생 차단 → 사용자가 플레이 버튼을 눌러야 함
      if (e.name === 'NotAllowedError') {
        console.warn('[AudioEngine] 자동재생 차단. 수동 재생 대기');
        this._isPlaying = false;
        // onEnd를 즉시 호출하지 않음 → 버튼 클릭 시 재시도 가능
      } else {
        console.warn('[AudioEngine] play() 실패:', e);
        this._isPlaying = false;
        onEnd && onEnd();
      }
    }

    return audio;
  }

  /* ── resumeVoice ─────────────────────────────────────────────────────────
     일시정지된 음성 재개 (플레이 버튼 재클릭 시)
  ─────────────────────────────────────────────────────────────────────── */
  async resumeVoice({ onPlay, onEnd, onProgress } = {}) {
    if (!this._audio) return;

    if (this._audio.paused) {
      try {
        // 이벤트는 이미 등록되어 있으므로 play()만 호출
        await this._audio.play();
      } catch (e) {
        console.warn('[AudioEngine] resumeVoice 실패:', e);
        onEnd && onEnd();
      }
    }
  }

  /* ── pauseVoice ──────────────────────────────────────────────────────────
     음성 일시정지
  ─────────────────────────────────────────────────────────────────────── */
  pauseVoice() {
    if (this._audio && !this._audio.paused) {
      this._audio.pause();
    }
  }

  /* ── toggleVoice ─────────────────────────────────────────────────────────
     재생 / 일시정지 토글
  ─────────────────────────────────────────────────────────────────────── */
  toggleVoice() {
    if (!this._audio) return;
    if (this._audio.paused) {
      this._audio.play().catch(e => console.warn('[AudioEngine] toggle play 실패:', e));
    } else {
      this._audio.pause();
    }
  }

  /* ── playSFX ─────────────────────────────────────────────────────────────
     효과음 즉시 재생 (voice와 동시 재생 가능, 겹침 허용)
     @param src  효과음 파일 경로
  ─────────────────────────────────────────────────────────────────────── */
  async playSFX(src) {
    if (!src) return;

    await this.unlockAudio();

    const sfx = new Audio(src);
    sfx.playsinline = true;
    sfx.setAttribute('playsinline', '');
    sfx.volume = 0.8;

    // 재생 풀 정리 (메모리 누수 방지)
    this._sfxAudios = this._sfxAudios.filter(a => !a.ended);
    this._sfxAudios.push(sfx);

    sfx.addEventListener('error', () => {
      console.warn('[AudioEngine] SFX 로드 실패:', src);
    });

    try {
      await sfx.play();
    } catch (e) {
      console.warn('[AudioEngine] SFX play 실패:', e);
    }
  }

  /* ── stop ────────────────────────────────────────────────────────────────
     현재 재생 중인 음성 중단 및 리소스 해제
  ─────────────────────────────────────────────────────────────────────── */
  stop() {
    this._stopProgressTimer();
    if (this._audio) {
      this._audio.pause();
      this._audio.src = '';
      this._audio = null;
    }
    this._isPlaying = false;
  }

  /* ── stopAllSFX ──────────────────────────────────────────────────────────
     모든 효과음 중단
  ─────────────────────────────────────────────────────────────────────── */
  stopAllSFX() {
    this._sfxAudios.forEach(sfx => {
      sfx.pause();
      sfx.src = '';
    });
    this._sfxAudios = [];
  }

  /* ── _startProgressTimer ─────────────────────────────────────────────────
     100ms 간격으로 재생 진행률 콜백 호출
     @param audio        HTMLAudioElement
     @param onProgress   (ratio: 0~1) => void
  ─────────────────────────────────────────────────────────────────────── */
  _startProgressTimer(audio, onProgress) {
    if (!onProgress) return;
    this._stopProgressTimer();
    this._progressTimer = setInterval(() => {
      if (!audio || audio.paused || audio.ended) return;
      const duration = audio.duration;
      if (!duration || isNaN(duration)) return;
      onProgress(audio.currentTime / duration);
    }, 100);
  }

  /* ── _stopProgressTimer ──────────────────────────────────────────────────
     진행률 타이머 중단
  ─────────────────────────────────────────────────────────────────────── */
  _stopProgressTimer() {
    if (this._progressTimer) {
      clearInterval(this._progressTimer);
      this._progressTimer = null;
    }
  }

  /* ── preload ─────────────────────────────────────────────────────────────
     다음 스테이지 오디오 사전 로드 (metadata만, 데이터 절약)
     @param srcList  오디오 경로 배열
  ─────────────────────────────────────────────────────────────────────── */
  preload(srcList = []) {
    srcList.forEach(src => {
      const a = new Audio();
      a.preload = 'metadata';
      a.src = src;
    });
  }
}

/* ── 전역 싱글톤 등록 ──────────────────────────────────────────────────── */
window.AudioEngine = new AudioEngine();
