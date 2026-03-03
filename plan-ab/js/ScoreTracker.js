/* ==========================================================================
   ScoreTracker.js — 보이스피싱크홀 A+B 조합안
   4단계 기준 내성 점수 및 결과 데이터 관리
   ========================================================================== */

class ScoreTracker {
  constructor() {
    this._history = [];
    this._total   = 4;
  }

  /* ── 기록 ────────────────────────────────────────────────────────────── */
  record(stageId, choice, result, stage) {
    if (this._history.find(h => h.stageId === stageId)) return;
    this._history.push({ stageId, choice, result, stage });
  }

  /* ── 조회 ────────────────────────────────────────────────────────────── */
  getHistory()   { return [...this._history]; }
  getSafeCount() { return this._history.filter(h => h.result === 'safe').length; }
  getSinkCount() { return this._history.filter(h => h.result === 'sink').length; }

  getSummary() {
    const safe = this.getSafeCount();
    return {
      safe, sink: this.getSinkCount(),
      total: this._total,
      ratio: safe / this._total,
      history: this.getHistory(),
    };
  }

  /* ── 결과 테이블 데이터 ─────────────────────────────────────────────── */
  getStageResults() {
    return this.getHistory().map(({ stageId, result, stage }) => ({
      id:         stageId,
      spiceLabel: stage.spiceLabel,
      spiceLevel: stage.spiceLevel,
      stageNum:   stage.spiceLevel,
      result,     // 'sink' | 'safe'
    }));
  }

  /* ── 점수 메시지 ────────────────────────────────────────────────────── */
  getResultMessage() {
    const s    = this.getSafeCount();
    const msgs = window.RESULT_MESSAGES;
    if (!msgs) return { title: '', text: '', emoji: '' };
    if (s === 4) return msgs.perfect;
    if (s >= 2)  return msgs.high;
    if (s === 1) return msgs.low;
    return msgs.zero;
  }

  /* ── 공유 ────────────────────────────────────────────────────────────── */
  getShareURL() {
    const s = this.getSafeCount();
    return `${location.origin}${location.pathname}?score=${s}&total=${this._total}`;
  }

  getShareText() {
    const s   = this.getSafeCount();
    const msg = this.getResultMessage();
    return (
      `[보이스피싱크홀] 나는 ${this._total}개 싱크홀 중 ${s}개를 탈출했습니다!\n` +
      `${msg.emoji} ${msg.title}\n` +
      `금융감독원 보이스피싱 예방 캠페인에 참여해 보세요.\n` +
      this.getShareURL()
    );
  }

  /* ── 면역력 게이지 렌더링 ────────────────────────────────────────────── */
  renderImmunityGauge() {
    const { ratio, safe } = this.getSummary();
    const gaugeEl   = document.getElementById('gauge-progress');
    const scoreEl   = document.getElementById('score-num');
    const circumference = 402.12; // 2π × 64

    if (!gaugeEl || !scoreEl) return;

    const offset = circumference * (1 - ratio);
    gaugeEl.classList.remove('full', 'high', 'mid');
    if (safe === 4)     gaugeEl.classList.add('full');
    else if (safe >= 2) gaugeEl.classList.add('high');
    else                gaugeEl.classList.add('mid');

    // CSS 트랜지션 트리거 (double rAF)
    gaugeEl.style.strokeDashoffset = circumference;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      gaugeEl.style.strokeDashoffset = offset;
    }));

    this._countUp(scoreEl, 0, safe, 1000);
  }

  /* ── 단계별 결과 테이블 렌더링 ──────────────────────────────────────── */
  renderResultsTable() {
    const container = document.getElementById('stage-results-table');
    if (!container) return;
    container.innerHTML = '';

    this.getStageResults().forEach(({ spiceLabel, stageNum, result }) => {
      const isSafe = result === 'safe';
      const row = document.createElement('div');
      row.className = `stage-result-row ${isSafe ? 'row-safe' : 'row-sink'}`;
      row.innerHTML = `
        <span class="row-spice">${spiceLabel}</span>
        <span class="row-label ${isSafe ? 'safe-label' : 'sink-label'}">
          SINKHOLE ${stageNum}
        </span>
        <span class="row-icon">${isSafe ? '✅' : '❌'}</span>
      `;
      container.appendChild(row);
    });
  }

  /* ── 교육 카드 렌더링 (sink 항목만) ─────────────────────────────────── */
  renderEduCards() {
    const container = document.getElementById('edu-cards');
    if (!container) return;
    container.innerHTML = '';

    const sinkItems = this.getHistory().filter(h => h.result === 'sink');

    if (sinkItems.length === 0) {
      const msg = document.createElement('p');
      msg.style.cssText = 'font-size: var(--fs-sm); color: var(--color-safe); text-align: center; padding: var(--space-md) 0;';
      msg.textContent = '🎉 모든 싱크홀을 탈출했습니다!';
      container.appendChild(msg);
      return;
    }

    sinkItems.forEach(({ choice, stage }) => {
      const cd   = stage.choices[choice];
      const card = document.createElement('div');
      card.className = 'edu-card edu-card--sink';
      card.innerHTML = `
        <div class="edu-card-header">
          <span class="edu-card-spice">${stage.spiceLabel}</span>
          <span class="edu-card-badge">SINKHOLE ${stage.spiceLevel}</span>
        </div>
        <p class="edu-card-choice">
          <span class="choice-tag">${choice}</span> ${cd.label}
        </p>
        <p class="edu-card-damage">${cd.damage}</p>
        ${cd.response ? `<p class="edu-card-response">💡 ${cd.response}</p>` : ''}
      `;
      container.appendChild(card);
    });
  }

  /* ── 결과 메시지 렌더링 ─────────────────────────────────────────────── */
  renderResultMsg() {
    const el  = document.getElementById('result-msg-text');
    const msg = this.getResultMessage();
    if (!el) return;
    el.textContent = `${msg.emoji} ${msg.title}\n${msg.text}`;
  }

  /* ── countUp 애니메이션 ─────────────────────────────────────────────── */
  _countUp(el, from, to, duration) {
    const start = performance.now();
    const diff  = to - from;
    function step(now) {
      const t = Math.min(now - start, duration);
      el.textContent = Math.round(from + diff * (t / duration));
      if (t < duration) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  reset() { this._history = []; }
}

window.ScoreTracker = new ScoreTracker();
