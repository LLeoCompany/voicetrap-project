# 보이스피싱 캠페인 — 마스터 프롬프트 【A+B 조합안】

> A안(싱크홀 비주얼) + B안(헬스키친 맛 단계) 결합 버전
> Claude에게 이 전체를 한 번에 붙여넣고 시작하세요.

---

## 🧠 마스터 프롬프트

```
너는 지금부터 내 프론트엔드 개발 파트너야.
우리는 금융감독원 의뢰를 받은 보이스피싱 예방 캠페인 랜딩 페이지 [A+B 조합안]을 함께 만들 거야.

---

## 캠페인 컨셉 — A+B 조합: 보이스피싱크홀 헬스키친

A안의 싱크홀 비주얼 + B안의 맛 단계 체험 구조를 결합한 하이브리드 버전.

- 외관/비주얼: A안의 싱크홀 세계관 (보이스피싱범의 말들이 소용돌이 형태로 사람을 빨아들임)
- 진행 구조: B안의 맛 단계 (순한맛 → 지옥맛, 점진적 난이도 상승)
- 선택 결과: A안의 싱크홀 애니메이션 (sink) + 맛 단계 스코어 누적

캠페인 이름: 보이스피싱크홀 — 당신의 내성 테스트
서브 카피: "순한맛부터 시작해서 지옥맛까지, 당신은 이 싱크홀에서 빠져나올 수 있습니까?"

A안에서 가져오는 것:
- 싱크홀 배경 비주얼 (회오리 이미지)
- 싱크홀 흡입 애니메이션 (shake→distort→suck)
- "당신은 빠졌습니다 vs 피했습니다" 결과 언어
- 어둡고 긴장감 있는 블랙+레드 무드

B안에서 가져오는 것:
- 맛 단계 구조 (🌶️ 순한맛 → 🌶️🌶️🌶️🌶️🌶️ 지옥맛)
- 단계별 컬러 테마 변화 (진행할수록 색이 더 붉어짐)
- "넘어가지 않으면 더 강한 단계" 진행 로직
- 영수증 스타일 최종 리포트

---

## 기술 조건

- 순수 HTML / CSS / Vanilla JS (ES6+) 만 사용
- React, Vue, jQuery 등 프레임워크·라이브러리 절대 금지
- 빌드 도구 없음 — 파일 그대로 브라우저 실행
- 한국어 폰트: Google Fonts Noto Sans KR (CDN)
- 모바일 우선 설계 (max-width 480px)
- iOS Safari 완전 대응 (오디오 자동재생 정책 포함)

---

## 디자인 시스템

배경: #0a0a0a (딥 블랙)
카드 배경: 단계별로 점점 붉어짐 (#161616 → #1a0808 → #1a0404 → #120000)
포인트: #C0392B → 단계별로 더 강렬해짐
텍스트: #FFFFFF
서브텍스트: #AAAAAA
안전: #27AE60

맛 단계별 컬러:
  순한맛: border #FF9800 / badge-bg #FF980020
  매운맛: border #E74C3C / badge-bg #E74C3C20
  불맛: border #C0392B / badge-bg #C0392B20
  지옥맛: border #8B0000 / badge-bg #8B000030 + gold accent

싱크홀 배경: 배경에 싱크홀 회오리 이미지 dim 처리 (단계가 올라갈수록 점점 더 강하게 노출)

폰트: Noto Sans KR
레이아웃: max-width 480px, 단일 컬럼

---

## 전체 화면 플로우

인트로 → 시작 → 싱크홀1(순한맛) → 싱크홀2(매운맛) → 싱크홀3(불맛) → 싱크홀4(지옥맛) → 최종 내성 리포트

- 모든 화면 .screen 클래스, opacity 전환 (display:none 금지)
- A 선택(sink): 싱크홀 흡입 애니메이션 → 피해 안내 → 2초 후 다음 단계
- B 선택(safe): 탈출 성공 → 교육 → 1.5초 후 더 강한 단계
- 어떤 선택이든 탈락 없이 끝까지 진행

---

## 화면별 상세 스펙

### 인트로 화면 (#screen-intro)
- 배경: 싱크홀 회오리 이미지 (어둡게 dim) + 빨간 음파 파형
- 타이핑 효과: "보이스피싱 상습범의\n이 목소리들이 하나의 싱크홀이 됩니다."
- 서브: "당신의 내성을 테스트합니다 — 순한맛부터 지옥맛까지"
- 탭 → 오디오 언락 + 시작 화면

### 시작 화면 (#screen-start)
- 배경: 싱크홀 이미지 full
- 로고: "보이스피싱크홀" (A안 타이포) + 작게 "내성 테스트"
- 맛 단계 프리뷰: 🌶️ ~ 🌶️🌶️🌶️🌶️🌶️ 4단계 아이콘 행
- 서브: "당신은 이 싱크홀에서 빠져나올 수 있습니까?"
- "내성 테스트 시작" 빨간 맥동 버튼

### 싱크홀 스테이지 화면 (#screen-stage) — 4단계 공통 재사용
- 상단: 맛 단계 배지 (🌶️ × n) + "SINKHOLE {n}" + 진행 바
  → 배경 서브 컬러: 단계별 변화 (점점 붉어짐)
- 싱크홀 강도 표시: 단계별 회오리 크기/투명도 변화 (CSS custom properties로 제어)
- 음성 플레이어
- 상황 카드 (A안 스타일 — 어두운 카드 + 빨간 왼쪽 라인 + 키워드 배지)
- 선택 버튼:
  - A버튼: "싱크홀에 빠진다" (위험)
  - B버튼: "싱크홀을 피한다" (안전)
- A 선택 결과 (sink):
  → 싱크홀 흡입 애니메이션 (A안 shake→distort→suck)
  → "SINKHOLE {n}에 빠졌습니다" + 맛 단계 라벨
  → 피해 안내 + 대응 방법
  → 2초 후 다음 단계
- B 선택 결과 (safe):
  → 탈출 성공 파티클 + 초록 플래시
  → "SINKHOLE {n}을 탈출했습니다!"
  → 교육 내용
  → 1.5초 후 더 강한 단계

### 최종 내성 리포트 (#screen-result)
- 상단: 싱크홀 배경 dim + "내성 테스트 완료"
- 내성 게이지: 원형 SVG (4단계 기준)
- 맛 단계별 결과 테이블:
  🌶️ 순한맛 SINKHOLE 1: ✅ 탈출 / ❌ 빠짐
  🌶️🌶️ 매운맛 SINKHOLE 2: ✅ / ❌
  🌶️🌶️🌶️ 불맛 SINKHOLE 3: ✅ / ❌
  🌶️🌶️🌶️🌶️🌶️ 지옥맛 SINKHOLE 4: ✅ / ❌
- 내성 점수 기반 피드백
- 교육 카드 (빠진 단계 강조)
- 경품 응모 + SNS 공유 버튼
- "다시 도전하기"

---

## 스테이지 데이터 (4개)

### SINKHOLE 1 — 🌶️ 순한맛: 은행·대출 사칭
음성: assets/audio/stage1_voice.mp3
키워드: 발신자 "○○은행 대출팀", 내용 "연 2.9% 특별 대출 승인", 요구 "선입금 후 대출 실행"
상황: "저금리 대출로 전환해준다는 사람이 전화해 먼저 기존 대출을 갚으면 당일 처리해준다고 합니다. 계좌번호를 알려주면 바로 입금된다고 합니다."

A 선택: "싱크홀에 빠진다 — 선입금을 먼저 송금한다"
  result: sink
  피드백: "SINKHOLE 1 (순한맛)에 빠졌습니다."
  피해: "'선입금 후대출'은 대출 사기의 기본입니다. 금융기관은 대출 전 어떠한 비용도 요구하지 않습니다."
  대응: "의심스러운 대출 권유는 즉시 끊고, 해당 금융사 공식 앱에서 확인하세요."
B 선택: "싱크홀을 피한다 — 공식 앱에서 직접 확인한다"
  result: safe
  교육: "은행은 전화로 먼저 대출을 권유하지 않습니다. 좋은 조건일수록 더 의심하세요."

### SINKHOLE 2 — 🌶️🌶️ 매운맛: 검사 사칭형
음성: assets/audio/stage2_voice.mp3
키워드: 발신자 "중앙지검 수사관", 내용 "명의 도용·대포통장", 요구 "자산 보호 목적 현금 인출"
상황: "검사라는 사람이 내 명의로 대포통장이 개설됐다며, 자산을 보호하려면 현금으로 인출해 특정 장소에 보관해야 한다고 합니다."

A 선택: "싱크홀에 빠진다 — 수사에 협조해 현금을 인출한다"
  result: sink
  피드백: "SINKHOLE 2 (매운맛)에 빠졌습니다."
  피해: "검찰·경찰은 절대 전화로 현금 인출이나 보관을 요구하지 않습니다. 평균 피해액 약 5,290만 원의 주요 수법입니다."
  대응: "검찰청 공식 번호 1301, 경찰청 112로 직접 확인하세요."
B 선택: "싱크홀을 피한다 — 전화 끊고 1301에 신고한다"
  result: safe
  교육: "진짜 수사관은 전화를 끊지 말라고 하지 않습니다. '끊으면 안 된다'는 말이 수법의 핵심입니다."

### SINKHOLE 3 — 🌶️🌶️🌶️ 불맛: 가족 사칭형
음성: assets/audio/stage3_voice.mp3
키워드: 발신자 "울먹이는 자녀 / 병원 응급실", 내용 "교통사고 발생", 요구 "즉시 합의금 송금"
상황: "경찰이라는 사람이 전화해 자녀가 사고를 냈고 지금 바로 합의금을 보내지 않으면 구속된다고 합니다. 이어서 자녀처럼 들리는 사람이 울면서 전화를 받습니다."

A 선택: "싱크홀에 빠진다 — 자녀를 위해 합의금을 송금한다"
  result: sink
  피드백: "SINKHOLE 3 (불맛)에 빠졌습니다."
  피해: "가족 위기 상황을 연출해 감정을 자극하는 수법입니다. 목소리는 AI로도 합성됩니다."
  대응: "반드시 다른 번호로 가족에게 직접 전화해 확인하세요. 진짜 응급상황이면 119에 신고하세요."
B 선택: "싱크홀을 피한다 — 끊고 자녀에게 직접 연락한다"
  result: safe
  교육: "감정적으로 흥분될수록 잠깐 멈추는 것이 최고의 방어입니다. 30초만 직접 확인하세요."

### SINKHOLE 4 — 🌶️🌶️🌶️🌶️🌶️ 지옥맛: 다중 결합형 (Hybrid)
음성: assets/audio/stage4_voice.mp3
키워드: 발신자 "검사 + 은행 + 자녀 동시", 내용 "범죄 연루 + 자녀 인질", 요구 "현금 인출 + 직접 전달"
상황: "검사라는 사람이 내가 범죄 조직 자금 세탁에 연루됐다고 합니다. 그리고 자녀라고 주장하는 사람이 울면서 전화를 받습니다. 현금을 인출해 전달 요원에게 건네지 않으면 둘 다 구속된다고 합니다."

A 선택: "싱크홀에 빠진다 — 어쩔 수 없이 현금을 인출해 전달한다"
  result: sink
  피드백: "SINKHOLE 4 (지옥맛)에 빠졌습니다. 최강의 싱크홀이었습니다."
  피해: "다중 결합형은 심리적 압박을 극대화해 판단력을 완전히 마비시키는 최고 난도 수법입니다."
  대응: "현금을 직접 전달받는 기관은 세상에 없습니다. 어떤 상황에서도 112에 즉시 신고하세요."
B 선택: "싱크홀을 피한다 — 현금 직접 전달은 없다고 판단, 112 신고"
  result: safe
  교육: "'현금 직접 전달 = 무조건 사기' 이 한 문장만 기억하면 지옥맛도 피할 수 있습니다."

---

## 애니메이션 상세 (A+B 결합)

A 선택 (sink) — 싱크홀 흡입 (A안 방식):
- 0.0~0.3s: .shake (화면 진동) — 맛 단계 낮을수록 강도 약하게
- 0.3~0.8s: .distort (rotate + blur + scale) — 단계별 max값 다르게
  순한맛: rotate 6deg, blur 4px
  매운맛: rotate 10deg, blur 8px
  불맛: rotate 14deg, blur 12px
  지옥맛: rotate 20deg, blur 18px
- 0.8~1.2s: .suck (scale 0, opacity 0)
- 1.2~1.5s: 플래시 + 결과 오버레이
→ 1.5s 후 Promise resolve

B 선택 (safe) — 탈출 성공 (단계별):
- 순한맛: 초록 flash
- 매운맛: 금색 flash
- 불맛: 금색 파티클
- 지옥맛: 금색+흰색 대폭발 파티클
→ 1.0s 후 Promise resolve

CSS @keyframes만 사용

---

## 최종 내성 리포트 점수 메시지

4/4 탈출: "완벽한 내성! 지옥맛 싱크홀까지 모두 탈출했습니다. 보이스피싱 면역자! 주변에 알려주세요."
2~3/4: "상당한 내성! 일부 싱크홀은 피했지만 아직 취약한 구간이 있습니다."
1/4: "내성 부족! 대부분의 싱크홀에 빠졌습니다. 교육 내용을 반드시 확인하세요."
0/4: "내성 제로! 모든 싱크홀에 빠졌습니다. 지금 바로 가족과 공유해주세요."

---

## JS 모듈 구조

stages.js → utils.js → AudioEngine.js → SinkholeEffect.js → ScoreTracker.js → StageManager.js → main.js
각 모듈 window.모듈명 전역 등록

---

이 내용을 모두 이해했으면 "이해했습니다. 어떤 파일부터 시작할까요?" 라고만 답해줘.
코드는 아직 짜지 말고, 내가 요청하는 순서대로 파일별로 작성해줘.
```

---

## 💬 이후 대화 순서

### 요청 1 — 뼈대 + CSS 변수
```
프로젝트 폴더 구조와 reset.css, variables.css를 만들어줘.

폴더:
voicephishing-combined-AB/
├── index.html
├── css/ (reset, variables, layout, animations, components)
├── js/ (stages, utils, AudioEngine, SinkholeEffect, ScoreTracker, StageManager, main)
└── assets/audio/ assets/images/

variables.css — 단계별 변수도 포함:
--color-bg: #0a0a0a
--color-primary: #C0392B
--color-safe: #27AE60
--color-text: #FFFFFF
--color-text-sub: #AAAAAA
--color-border: #2a2a2a
--max-width: 480px

--spice-1-color: #FF9800
--spice-1-bg: #FF980015
--spice-2-color: #E74C3C
--spice-2-bg: #E74C3C15
--spice-3-color: #C0392B
--spice-3-bg: #C0392B15
--spice-4-color: #8B0000
--spice-4-bg: #8B000020
--spice-4-gold: #F39C12
```

### 요청 2 — index.html + layout.css
```
index.html과 layout.css를 만들어줘.

마크업:
- #screen-intro: .waveform / .intro-text / .intro-sub
- #screen-start: .spice-preview(🌶️ 4단계 아이콘) / .start-logo / .start-sub / #btn-start
- #screen-stage: 
  .stage-header(.spice-badge + .stage-label + .progress-bar) /
  .audio-player /
  .situation-card(.keywords-grid + .situation-text) /
  .choices(#btn-a "싱크홀에 빠진다" + #btn-b "싱크홀을 피한다") /
  .result-overlay(.result-icon + .result-type + .result-message + .result-detail)
- #screen-result:
  .result-header /
  .immunity-gauge(SVG) /
  .stage-results-table /
  .result-feedback /
  .edu-cards /
  .action-grid /
  #btn-retry

layout.css: .screen opacity 전환, display:none 금지
```

### 요청 3 — stages.js
```
js/stages.js를 완성해줘.
마스터 프롬프트의 SINKHOLE 1~4 데이터를 STAGES 배열로 구현.
스키마: { id, spiceLevel(1~4), spiceLabel, spiceColor, audioSrc, keywords, situation, choices:{A:{...sink...}, B:{...safe...}} }
A 선택 필드: label, result:'sink', feedback, damage, response, sfx
B 선택 필드: label, result:'safe', feedback, education, sfx:null
window.STAGES = STAGES 전역 등록.
```

### 요청 4 — utils.js + AudioEngine.js
```
utils.js: onTap / typeWriter / fadeIn / fadeOut / delay / flashClass / createWaveform
AudioEngine.js: iOS 자동재생 완전 대응 / unlockAudio / playVoice / playSFX / stop / isPlaying
각 window 전역 등록.
```

### 요청 5 — SinkholeEffect.js
```
js/SinkholeEffect.js를 만들어줘.
triggerSink(container, spiceLevel):
  - 맛 단계(1~4)에 따라 애니메이션 강도를 다르게 적용
  - level 1: shake + 약한 distort(rotate 6deg, blur 4px)
  - level 2: shake + distort(rotate 10deg, blur 8px)
  - level 3: 강한 shake + distort(rotate 14deg, blur 12px)
  - level 4: 최강 shake + distort(rotate 20deg, blur 18px) + 더 긴 suck
  - 공통: 단계별 플래시 컬러 (spice 컬러 사용)
  → Promise resolve (1.5s)

triggerSafe(container, spiceLevel):
  - level 1: 초록 flash
  - level 2: 금색 flash
  - level 3: 금색 파티클
  - level 4: 대폭발 파티클 (금색+흰색, 더 많은 요소)
  → Promise resolve (1.0s)

window.SinkholeEffect = new SinkholeEffect() 전역 등록.
```

### 요청 6 — ScoreTracker.js
```
js/ScoreTracker.js를 만들어줘.
record(stageId, choice, result) / getHistory() / getSummary() / getResultMessage() / getShareURL() / getStageResults() / reset()
getStageResults(): [{id, spiceLabel, spiceLevel, result:'sink'|'safe'}] 배열 (결과 테이블용)
점수 메시지: 4/4, 2~3/4, 1/4, 0/4 기준.
window.ScoreTracker = new ScoreTracker() 전역 등록.
```

### 요청 7 — StageManager.js
```
js/StageManager.js를 만들어줘.
init() / goToScreen(id) / showStage(index) / handleChoice(choice) / showResult() / reset()

showStage(index):
  - STAGES[index] 주입
  - 맛 단계 컬러 CSS 변수 동적 업데이트:
    document.documentElement.style.setProperty('--color-current', spiceColor)
    document.documentElement.style.setProperty('--color-current-bg', spiceBg)
  - 배지, 상황카드 border, 버튼 A color → var(--color-current) 적용
  - 버튼 비활성화 → 음성 재생 → 완료 시 활성화

handleChoice(choice):
  - isProcessing 플래그
  - sink: SinkholeEffect.triggerSink(el, spiceLevel) await
    → 오버레이: damage + response 표시
  - safe: SinkholeEffect.triggerSafe(el, spiceLevel) await
    → 오버레이: education 표시
  - sink는 2초, safe는 1.5초 후 다음 단계

showResult():
  - renderImmunityGauge(passed, 4)
  - getStageResults()로 테이블 렌더링
  - 교육 카드: sink 항목만 생성

window.StageManager = new StageManager() 전역 등록.
```

### 요청 8 — main.js + CSS 마무리
```
main.js, components.css, animations.css를 만들어줘.

main.js: 타이핑 효과 / createWaveform / 인트로 언락 / 버튼 이벤트 바인딩 / SNS공유 / 토스트

components.css:
- .btn-primary (시작 버튼, 맥동)
- .btn-sink (#btn-a: border var(--color-current), sink 선택 느낌)
- .btn-safe (#btn-b: 회색 테두리, 안전 선택)
- .situation-card (border-left: 3px solid var(--color-current))
- .spice-badge (맛 단계별 컬러 배지)
- .stage-results-table (결과 테이블: sink=❌빨강, safe=✅초록)
- .result-overlay (sink 타입: 어두운 배경 + 빨간 텍스트 / safe 타입: 어두운 배경 + 초록)
- .edu-card + .edu-card.highlight

animations.css:
- @keyframes shake (level별 강도 다르게: .shake-mild / .shake-hot / .shake-hell)
- @keyframes distort, suck
- @keyframes safeFlash, goldParticle, megaBurst
- @keyframes pulse, fadeIn, waveBar
- .flash-spice: background: var(--color-current) 사용
```

### 요청 9 — 최종 점검
```
전체 코드를 점검하고 아래를 확인/수정해줘.
- [ ] 인트로 → 시작 → SINKHOLE 1~4 순서 진행
- [ ] 맛 단계별 CSS 변수 동적 교체 확인 (border, badge, flash 모두)
- [ ] A 선택(sink): 단계별 강도 다른 싱크홀 애니메이션 → 피해안내 → 2초 후 다음
- [ ] B 선택(safe): 단계별 다른 파티클 → 교육 → 1.5초 후 다음
- [ ] SINKHOLE 4 완료 → 결과 화면
- [ ] 결과 테이블 4행 (단계별 ✅/❌)
- [ ] 면역력 게이지 4단계 기준
- [ ] isProcessing 중복 클릭 방지
- [ ] iOS Safari 대응 (viewport, playsinline, safe-area, 48px 터치타겟)
- [ ] display:none 없는지 전체 확인
```

---

## 🔧 디버깅 프롬프트

### 맛 단계별 컬러가 안 바뀔 때
```
showStage()에서 맛 단계 컬러 CSS 변수가 바뀌지 않아.
document.documentElement.style.setProperty 코드와
.situation-card, .spice-badge, .btn-sink에서 var(--color-current) 참조 부분을 확인하고 수정해줘.
수정된 StageManager.js + components.css 출력.
```

### 싱크홀 강도가 단계별로 다르게 안 느껴질 때
```
SinkholeEffect.triggerSink()에서 spiceLevel에 따라 강도 차이가 안 느껴져.
- CSS 변수 --shake-strength, --distort-angle, --blur-amount을 spiceLevel별로 다르게 주입
- 각 @keyframes에서 해당 변수를 참조하도록 수정
- level 4 지옥맛은 duration도 1.8s로 늘리기
수정된 SinkholeEffect.js + animations.css 출력.
```

### 결과 테이블이 이상하게 보일 때
```
#screen-result의 단계별 결과 테이블이 깨져보여.
.stage-results-table:
- 각 행: .spice-badge + 단계명 + 결과(✅/❌)
- sink 행: 배경 rgba(192,57,43,0.1), 텍스트 var(--color-primary)
- safe 행: 배경 rgba(39,174,96,0.1), 텍스트 #27AE60
- 세로 점선 구분선
수정된 CSS + showResult() 렌더링 코드 출력.
```
