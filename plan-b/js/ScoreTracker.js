/* ==========================================================================
   ScoreTracker.js — 보이스피싱 헬스키친 B안
   4메뉴 기준 면역력 점수 및 영수증 데이터 생성
   ========================================================================== */

class ScoreTracker {
  constructor() {
    this._history = [];
    this._total   = 4;
  }

  record(menuId, choice, result, menu) {
    if (this._history.find(h => h.menuId === menuId)) return;
    this._history.push({ menuId, choice, result, menu });
  }

  getHistory()      { return [...this._history]; }
  getSurvivedCount(){ return this._history.filter(h => h.result === 'survived').length; }
  getHellCount()    { return this._history.filter(h => h.result === 'hell').length; }

  getSummary() {
    const survived = this.getSurvivedCount();
    return {
      survived, hell: this.getHellCount(),
      total: this._total,
      ratio: survived / this._total,
      history: this.getHistory(),
    };
  }

  getResultMessage() {
    const s    = this.getSurvivedCount();
    const msgs = window.RECEIPT_MESSAGES;
    if (!msgs) return { title:'', text:'', emoji:'' };
    if (s === 4) return msgs.perfect;
    if (s >= 2)  return msgs.high;
    if (s === 1) return msgs.low;
    return msgs.zero;
  }

  getShareURL() {
    const s = this.getSurvivedCount();
    return `${location.origin}${location.pathname}?score=${s}&total=${this._total}`;
  }

  getShareText() {
    const s   = this.getSurvivedCount();
    const msg = this.getResultMessage();
    return (
      `[보이스피싱 헬스키친] 나는 ${this._total}개 메뉴 중 ${s}개를 버텼습니다!\n` +
      `${msg.emoji} ${msg.title}\n` +
      `금융감독원 보이스피싱 예방 캠페인에 참여해 보세요.\n` +
      this.getShareURL()
    );
  }

  /* ── 영수증 항목 렌더링 ──────────────────────────────────────────────── */
  renderReceiptItems() {
    const container = document.getElementById('menu-results');
    if (!container) return;
    container.innerHTML = '';

    this.getHistory().forEach(({ menuId, result, menu }) => {
      const survived = result === 'survived';
      const row = document.createElement('div');
      row.className = `menu-result-item ${survived ? 'item-survived' : 'item-hell'}`;
      row.innerHTML = `
        <span class="item-spice">${menu.spiceLabel}</span>
        <span class="item-name">${menu.title}</span>
        <span class="item-result">${survived ? '✅' : '❌'}</span>
      `;
      container.appendChild(row);
    });

    // 합계 행
    const total = document.createElement('div');
    total.className = 'menu-result-total';
    total.innerHTML = `
      <span class="total-label">면역력 점수</span>
      <span class="total-score">${this.getSurvivedCount()} / ${this._total}</span>
    `;
    container.appendChild(total);
  }

  /* ── 교육 카드 렌더링 ───────────────────────────────────────────────── */
  renderEduCards() {
    const container = document.getElementById('edu-cards');
    if (!container) return;
    container.innerHTML = '';

    this.getHistory().forEach(({ menuId, choice, result, menu }) => {
      const cd   = menu.choices[choice];
      const isHell = result === 'hell';
      const card = document.createElement('div');
      card.className = `edu-card ${isHell ? 'edu-card--hell' : 'edu-card--survived'}`;
      card.innerHTML = `
        <div class="edu-card-header">
          <span class="edu-card-spice">${menu.spiceLabel}</span>
          <span class="edu-card-badge ${isHell ? 'badge-hell' : 'badge-survived'}">
            ${isHell ? '속으셨습니다' : '통과'}
          </span>
        </div>
        <p class="edu-card-choice"><span class="choice-tag">${choice}</span> ${cd.label}</p>
        <p class="edu-card-edu">${cd.damage}</p>
        ${cd.response ? `<p class="edu-card-response">💡 ${cd.response}</p>` : ''}
      `;
      container.appendChild(card);
    });
  }

  /* ── 면역력 게이지 렌더링 ────────────────────────────────────────────── */
  renderImmunityGauge() {
    const { ratio, survived } = this.getSummary();
    const gaugeEl   = document.getElementById('gauge-progress');
    const scoreEl   = document.getElementById('score-num');
    const circumference = 402.12;

    if (!gaugeEl || !scoreEl) return;

    const offset = circumference * (1 - ratio);
    gaugeEl.classList.remove('full','high','mid');
    if (survived === 4)      gaugeEl.classList.add('full');
    else if (survived >= 2)  gaugeEl.classList.add('high');
    else                     gaugeEl.classList.add('mid');

    gaugeEl.style.strokeDashoffset = circumference;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      gaugeEl.style.strokeDashoffset = offset;
    }));

    this._countUp(scoreEl, 0, survived, 1000);
  }

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
