/* AudioEngine.js — 보이스피싱 헬스키친 B안 (A안과 동일 엔진) */
class AudioEngine {
  constructor() {
    this._ctx = null; this._audio = null;
    this._sfxAudios = []; this._isPlaying = false;
    this._isUnlocked = false; this._progressTimer = null;
    this._bindUnlock();
  }
  get isPlaying()  { return this._isPlaying; }
  get isUnlocked() { return this._isUnlocked; }

  _bindUnlock() {
    const evs = ['touchend','click','keydown'];
    const h = () => { this.unlockAudio(); evs.forEach(e => document.removeEventListener(e, h)); };
    evs.forEach(e => document.addEventListener(e, h, { passive: true }));
  }

  async unlockAudio() {
    if (this._isUnlocked) return;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) { this._isUnlocked = true; return; }
      if (!this._ctx) this._ctx = new Ctx();
      if (this._ctx.state === 'suspended') await this._ctx.resume();
      const buf = this._ctx.createBuffer(1,1,22050);
      const src = this._ctx.createBufferSource();
      src.buffer = buf; src.connect(this._ctx.destination); src.start(0);
      this._isUnlocked = true;
    } catch(e) { console.warn('[AudioEngine] unlock 실패:', e); this._isUnlocked = true; }
  }

  async playVoice(src, { onPlay, onEnd, onProgress, onError } = {}) {
    this.stop();
    await this.unlockAudio();
    const audio = new Audio();
    audio.preload = 'auto'; audio.playsinline = true;
    audio.setAttribute('playsinline',''); audio.setAttribute('webkit-playsinline','');
    this._audio = audio;

    audio.addEventListener('play', () => {
      this._isPlaying = true; onPlay && onPlay();
      this._startProgress(audio, onProgress);
    });
    audio.addEventListener('ended', () => {
      this._isPlaying = false; this._stopProgress(); onEnd && onEnd();
    });
    audio.addEventListener('pause', () => { this._isPlaying = false; this._stopProgress(); });
    audio.addEventListener('error', (e) => {
      console.warn('[AudioEngine] 로드 실패:', src);
      this._isPlaying = false; this._stopProgress();
      onError && onError(e); onEnd && onEnd();
    });

    audio.src = src;
    try {
      const p = audio.play();
      if (p !== undefined) await p;
    } catch(e) {
      if (e.name !== 'NotAllowedError') { this._isPlaying = false; onEnd && onEnd(); }
      else console.warn('[AudioEngine] 자동재생 차단. 수동 재생 대기');
    }
    return audio;
  }

  toggleVoice() {
    if (!this._audio) return;
    if (this._audio.paused) this._audio.play().catch(()=>{});
    else this._audio.pause();
  }
  pauseVoice() { if (this._audio && !this._audio.paused) this._audio.pause(); }

  async playSFX(src) {
    if (!src) return;
    await this.unlockAudio();
    const sfx = new Audio(src);
    sfx.playsinline = true; sfx.setAttribute('playsinline',''); sfx.volume = 0.8;
    this._sfxAudios = this._sfxAudios.filter(a => !a.ended);
    this._sfxAudios.push(sfx);
    try { await sfx.play(); } catch(e) { console.warn('[AudioEngine] SFX 실패:', e); }
  }

  stop() {
    this._stopProgress();
    if (this._audio) { this._audio.pause(); this._audio.src = ''; this._audio = null; }
    this._isPlaying = false;
  }

  stopAllSFX() {
    this._sfxAudios.forEach(s => { s.pause(); s.src = ''; });
    this._sfxAudios = [];
  }

  preload(srcList = []) {
    srcList.forEach(src => { const a = new Audio(); a.preload = 'metadata'; a.src = src; });
  }

  _startProgress(audio, cb) {
    if (!cb) return;
    this._stopProgress();
    this._progressTimer = setInterval(() => {
      if (!audio || audio.paused || audio.ended) return;
      const d = audio.duration;
      if (!d || isNaN(d)) return;
      cb(audio.currentTime / d);
    }, 100);
  }
  _stopProgress() {
    if (this._progressTimer) { clearInterval(this._progressTimer); this._progressTimer = null; }
  }
}

window.AudioEngine = new AudioEngine();
