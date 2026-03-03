/* ==========================================================================
   ScoreTracker.js — 보이스피싱크홀 캠페인
   선택 이력 누적 및 최종 리포트 데이터 생성
   ========================================================================== */

class ScoreTracker {
  constructor() {
    this._history = [];   // [{ stageId, choice, result, stage }]
    this._total   = 6;    // 전체 스테이지 수
  }

  /* ── record ───────────────────────────────────────────────────────────────
     스테이지 선택 결과 기록
     @param stageId  스테이지 번호 (1~6)
     @param choice   'A' | 'B'
     @param result   'sink' | 'safe'
     @param stage    STAGES[n] 전체 데이터 (교육 카드 렌더링용)
  ─────────────────────────────────────────────────────────────────────── */
  record(stageId, choice, result, stage) {
    // 중복 기록 방지 (재시작 없이 중복 호출 방어)
    const exists = this._history.find(h => h.stageId === stageId);
    if (exists) return;

    this._history.push({ stageId, choice, result, stage });
  }

  /* ── getHistory ────────────────────────────────────────────────────────────
     전체 선택 이력 반환
  ─────────────────────────────────────────────────────────────────────── */
  getHistory() {
    return [...this._history];
  }

  /* ── getSafeCount ──────────────────────────────────────────────────────────
     통과(safe) 스테이지 수 반환
  ─────────────────────────────────────────────────────────────────────── */
  getSafeCount() {
    return this._history.filter(h => h.result === 'safe').length;
  }

  /* ── getSinkCount ──────────────────────────────────────────────────────────
     실패(sink) 스테이지 수 반환
  ─────────────────────────────────────────────────────────────────────── */
  getSinkCount() {
    return this._history.filter(h => h.result === 'sink').length;
  }

  /* ── getSummary ────────────────────────────────────────────────────────────
     최종 요약 객체 반환
     { safeCount, sinkCount, total, ratio, history }
  ─────────────────────────────────────────────────────────────────────── */
  getSummary() {
    const safeCount = this.getSafeCount();
    const sinkCount = this.getSinkCount();
    return {
      safeCount,
      sinkCount,
      total:   this._total,
      ratio:   safeCount / this._total,   // 0.0 ~ 1.0
      history: this.getHistory(),
    };
  }

  /* ── getResultMessage ──────────────────────────────────────────────────────
     점수 구간에 따른 결과 메시지 객체 반환
     RESULT_MESSAGES (stages.js) 참조
  ─────────────────────────────────────────────────────────────────────── */
  getResultMessage() {
    const safe  = this.getSafeCount();
    const msgs  = window.RESULT_MESSAGES;

    if (!msgs) {
      return { title: '', text: '', emoji: '' };
    }

    if (safe >= msgs.perfect.range[0] && safe <= msgs.perfect.range[1]) return msgs.perfect;
    if (safe >= msgs.good.range[0]    && safe <= msgs.good.range[1])    return msgs.good;
    if (safe >= msgs.warning.range[0] && safe <= msgs.warning.range[1]) return msgs.warning;
    return msgs.danger;
  }

  /* ── getShareURL ───────────────────────────────────────────────────────────
     SNS 공유용 결과 URL 생성
     예: https://example.com/?score=5&total=6
  ─────────────────────────────────────────────────────────────────────── */
  getShareURL() {
    const safe  = this.getSafeCount();
    const base  = `${window.location.origin}${window.location.pathname}`;
    return `${base}?score=${safe}&total=${this._total}`;
  }

  /* ── getShareText ──────────────────────────────────────────────────────────
     SNS 공유 텍스트 생성
  ─────────────────────────────────────────────────────────────────────── */
  getShareText() {
    const safe = this.getSafeCount();
    const msg  = this.getResultMessage();
    return (
      `[보이스피싱크홀] 나는 ${this._total}단계 중 ${safe}개를 피했습니다!\n` +
      `${msg.emoji} ${msg.title}\n` +
      `금융감독원 보이스피싱 예방 캠페인에 참여해 보세요.\n` +
      this.getShareURL()
    );
  }

  /* ── renderScoreGauge ──────────────────────────────────────────────────────
     최종 리포트 원형 SVG 게이지 애니메이션 적용
     둘레: 2 × π × 64 ≈ 402.12
  ─────────────────────────────────────────────────────────────────────── */
  renderScoreGauge() {
    const summary     = this.getSummary();
    const gaugeEl     = document.getElementById('gauge-progress');
    const scoreNumEl  = document.getElementById('score-num');
    const circumference = 402.12;

    if (!gaugeEl || !scoreNumEl) return;

    const offset = circumference * (1 - summary.ratio);

    // 색상: 5~6 = 초록, 3~4 = 주황(accent), 0~2 = 빨간
    gaugeEl.classList.remove('high', 'mid');
    if (summary.safeCount >= 5)      gaugeEl.classList.add('high');
    else if (summary.safeCount >= 3) gaugeEl.classList.add('mid');

    // 애니메이션: 초기값에서 실제값으로
    gaugeEl.style.strokeDashoffset = circumference;

    // 다음 프레임에서 트랜지션 시작
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        gaugeEl.style.strokeDashoffset = offset;
      });
    });

    // 숫자 카운트업
    this._countUp(scoreNumEl, 0, summary.safeCount, 1000);
  }

  /* ── renderEduCards ────────────────────────────────────────────────────────
     수법별 교육 카드 렌더링
     틀린(sink) 스테이지 → 빨간 강조 / 맞은(safe) 스테이지 → 일반 표시
  ─────────────────────────────────────────────────────────────────────── */
  renderEduCards() {
    const container = document.getElementById('edu-cards');
    if (!container) return;

    container.innerHTML = '';
    const history = this.getHistory();

    history.forEach(({ stageId, choice, result, stage }) => {
      const choiceData = stage.choices[choice];
      const isSink     = result === 'sink';

      const card = document.createElement('div');
      card.className = `edu-card ${isSink ? 'edu-card--sink' : 'edu-card--safe'}`;
      card.innerHTML = `
        <div class="edu-card-header">
          <span class="edu-card-stage">STAGE ${stageId}</span>
          <span class="edu-card-title">${stage.title}</span>
          <span class="edu-card-badge ${isSink ? 'badge-sink' : 'badge-safe'}">
            ${isSink ? '빠졌습니다' : '피했습니다'}
          </span>
        </div>
        <p class="edu-card-choice">
          <span class="choice-tag">${choice}</span>
          ${choiceData.label}
        </p>
        <p class="edu-card-edu">${choiceData.education}</p>
      `;

      container.appendChild(card);
    });
  }

  /* ── _countUp ──────────────────────────────────────────────────────────────
     숫자 카운트업 애니메이션
  ─────────────────────────────────────────────────────────────────────── */
  _countUp(el, from, to, duration) {
    const start  = performance.now();
    const diff   = to - from;

    function step(now) {
      const elapsed = Math.min(now - start, duration);
      const value   = Math.round(from + diff * (elapsed / duration));
      el.textContent = value;
      if (elapsed < duration) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  /* ── reset ─────────────────────────────────────────────────────────────────
     다시 도전 시 상태 초기화
  ─────────────────────────────────────────────────────────────────────── */
  reset() {
    this._history = [];
  }
}

/* ── 전역 싱글톤 등록 ──────────────────────────────────────────────────── */
window.ScoreTracker = new ScoreTracker();
