# 보이스피싱크홀 캠페인 — 마스터 프롬프트 【A안 전용】

> A안: 보이스피싱크홀 (싱크홀 콘셉트)
> Claude에게 이 전체를 한 번에 붙여넣고 시작하세요.

---

## 🧠 마스터 프롬프트

```
너는 지금부터 내 프론트엔드 개발 파트너야.
우리는 금융감독원 의뢰를 받은 보이스피싱 예방 캠페인 랜딩 페이지 [A안]을 함께 만들 거야.

---

## 캠페인 컨셉 — A안: 보이스피싱크홀

보이스피싱범의 다양한 유도 문장(말)들이 모여 거대한 회오리(싱크홀) 형태가 되어,
부지불식간에 사람들을 빨아들이는 '보이스피싱 싱크홀'을 시각화한 참여형 캠페인.

핵심 메시지: "난 절대로 보이스피싱 따위에 속지않아!" — 과연 그럴까요?
핵심 비주얼: 보이스피싱범의 말들이 모여 하나의 싱크홀 구조를 이루고, 그 구조가 사람을 빨아들임
참여자 포지션: 단순히 듣는 사람이 아닌, 단계별 수법을 직접 체험하고 판단하는 당사자

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
포인트: #C0392B (다크 레드)
보조: #E74C3C (브라이트 레드)
텍스트: #FFFFFF
서브텍스트: #AAAAAA
카드 배경: #161616
테두리: #2a2a2a
안전 컬러: #27AE60

폰트: Noto Sans KR
레이아웃: max-width 480px, 단일 컬럼, 중앙 정렬
무드: 어둡고 긴장감 있는 스릴러 느낌 (블랙+레드)

---

## 전체 화면 플로우

인트로 → 시작 → Stage 1 → Stage 2 → Stage 3 → Stage 4 → Stage 5 → Stage 6 → 최종 리포트

- 모든 화면은 .screen 클래스로 관리
- .screen.active 일 때만 보임 (opacity 전환, display:none 절대 금지)
- 어떤 선택을 해도 탈락 없이 다음 스테이지 진행 (완주 유도 구조)

---

## 화면별 상세 스펙

### 인트로 화면 (#screen-intro)
- 딥 블랙 배경 + 빨간 음파 파형 SVG 애니메이션
- 타이핑 효과 텍스트: "보이스피싱 상습범의\n바로 이 목소리를 공개합니다."
- 하단 서브: "화면을 터치하면 시작됩니다"
- 화면 탭/클릭 → 오디오 언락 + 시작 화면 전환

### 시작 화면 (#screen-start)
- 싱크홀 배경 이미지 + 어두운 오버레이
- 로고타입: "보이스피싱크홀" (굵은 폰트, 흰색+"싱크홀" 부분 빨간색)
- 서브헤드: "당신은 피할 수 있습니까?"
- 상단 스테이지 도트 6개
- "지금 도전하기" 빨간 맥동 버튼

### 스테이지 화면 (#screen-stage) — Stage 1~6 공통 재사용
- 스테이지 번호 + 진행 바 (Progress Bar, 상단 고정)
- 음성 플레이어: 재생 버튼 + 음파 파형 비주얼라이저
- 상황 카드: 키워드 배지(발신자/내용/요구) + 상황 설명
- 선택 버튼 2개:
  - A 버튼: 위험 선택 (빨간 테두리)
  - B 버튼: 안전 선택 (회색 테두리)
- 선택 직후 결과 오버레이:
  - A 선택(sink): 싱크홀 애니메이션 → "당신은 빠졌습니다" → 교육 내용
  - B 선택(safe): 안전 피드백 → "당신은 피했습니다" → 교육 내용
- 2초 후 자동으로 다음 스테이지 진행

### 최종 리포트 화면 (#screen-result)
- 원형 SVG 게이지 (6개 중 N개 통과)
- 점수 기반 맞춤 피드백
- 수법별 교육 카드 (틀린 항목 빨간 강조)
- 경품 응모 + SNS 공유 + 카드뉴스/영상 아이콘
- "다시 도전하기" 버튼

---

## 스테이지 데이터 (6개 전체)

### Stage 1 — 은행 사칭 싱크홀
음성: assets/audio/stage1_voice.mp3
키워드: 발신자 "○○은행 보안팀", 내용 "계좌 이상 거래 탐지", 요구 "본인 확인용 OTP 입력"
상황: "은행 보안팀이라는 사람이 전화해 내 계좌에서 이상 거래가 발생했다며, 본인 확인을 위해 지금 바로 OTP 번호를 알려달라고 합니다."

A 선택: "빨리 해결해야 하니 OTP를 알려준다" / sink
  피드백: "당신은 보이스피싱크홀에 빠졌습니다."
  교육: "은행은 절대 전화로 OTP나 비밀번호를 요구하지 않습니다. 전화를 끊고 은행 공식 번호로 직접 확인하세요."
B 선택: "전화를 끊고 은행 공식 번호로 직접 확인한다" / safe
  피드백: "정확한 판단! 싱크홀을 피했습니다."
  교육: "은행의 공식 고객센터 번호는 앱이나 카드 뒷면에서 확인하세요. 전화가 왔을 때 알려준 번호는 절대 믿지 마세요."

### Stage 2 — 대출 전환 싱크홀
음성: assets/audio/stage2_voice.mp3
키워드: 발신자 "저금리 대출 상담사", 내용 "기존 대출 → 연 3% 전환 가능", 요구 "선상환 후 재대출"
상황: "저금리 대출로 전환해준다는 사람이 전화해 기존 대출을 먼저 갚으면 연 3%로 새로 대출해준다고 합니다. 지금 바로 계좌로 송금하면 당일 처리된다고 합니다."

A 선택: "조건이 좋으니 먼저 기존 대출을 상환한다" / sink
  피드백: "당신은 보이스피싱크홀에 빠졌습니다."
  교육: "'선상환 후대출' 요구는 100% 사기입니다. 금융기관은 절대 이런 방식으로 대출을 운영하지 않습니다."
B 선택: "직접 해당 금융기관 앱이나 지점을 방문해 확인한다" / safe
  피드백: "훌륭합니다! 의심이 최고의 방패입니다."
  교육: "대출 전환은 반드시 공식 앱, 홈페이지, 직접 방문으로만 진행하세요. 전화로 먼저 연락 오는 금융 혜택은 없습니다."

### Stage 3 — 검사 사칭 싱크홀
음성: assets/audio/stage3_voice.mp3
키워드: 발신자 "중앙지검 ○○○ 수사관", 내용 "내 명의 대포통장 발생", 요구 "즉시 격리 조사"
상황: "검사라고 밝힌 사람이 전화해 내 명의로 대포통장이 만들어졌다며, 수사를 위해 지금 당장 아무도 없는 장소로 이동하고 핸드폰을 감청해야 한다고 합니다."

A 선택: "수사에 협조하기 위해 지시에 따라 이동한다" / sink
  피드백: "당신은 보이스피싱크홀에 빠졌습니다."
  교육: "검찰·경찰은 절대 전화로 장소 이동이나 현금 보관을 요구하지 않습니다. 이 수법의 평균 피해액은 약 5,290만 원입니다."
B 선택: "전화를 끊고 검찰청 1301에 직접 신고한다" / safe
  피드백: "냉정한 판단! 싱크홀을 피했습니다."
  교육: "검찰청 공식 대표번호는 1301입니다. 진짜 수사관은 전화를 끊는 것을 막지 않습니다."

### Stage 4 — 가족 사고 싱크홀
음성: assets/audio/stage4_voice.mp3
키워드: 발신자 "경찰 / 병원 응급실", 내용 "자녀 교통사고 발생", 요구 "즉시 치료비 송금"
상황: "경찰이라는 사람이 전화해 자녀가 교통사고를 당했고 지금 바로 치료비를 송금하지 않으면 수술을 시작할 수 없다고 합니다. 자녀 전화는 연결이 안 됩니다."

A 선택: "급하니까 일단 치료비를 먼저 송금한다" / sink
  피드백: "당신은 보이스피싱크홀에 빠졌습니다."
  교육: "긴급 상황을 가장해 판단력을 마비시키는 전형적인 수법입니다. 반드시 다른 번호로 가족에게 직접 연락하세요."
B 선택: "전화를 끊고 자녀에게 다른 번호로 직접 연락한다" / safe
  피드백: "정확한 판단! 가족이 안전합니다."
  교육: "어떤 긴급 상황이라도 가족에게 직접 확인이 최선입니다. 진짜 응급상황이라면 119에 신고하세요."

### Stage 5 — 택배/공공기관 사칭 싱크홀
음성: assets/audio/stage5_voice.mp3
키워드: 발신자 "금융감독원 / 경찰청", 내용 "개인정보 유출 피해 접수", 요구 "피해 보상 위해 계좌 인증"
상황: "금융감독원이라는 곳에서 문자가 왔습니다. 내 개인정보가 유출되어 보이스피싱 피해자로 등록됐으니 보상금을 받으려면 계좌 인증이 필요하다고 합니다."

A 선택: "보상금을 받기 위해 계좌 인증을 진행한다" / sink
  피드백: "당신은 보이스피싱크홀에 빠졌습니다."
  교육: "금융감독원은 문자로 계좌 인증을 요구하지 않습니다. '보상금' 명목의 계좌 인증 요구는 100% 사기입니다."
B 선택: "금융감독원 공식 사이트에서 직접 확인한다" / safe
  피드백: "훌륭합니다! 공식 채널로 확인하는 것이 정답입니다."
  교육: "금융감독원 공식 번호는 1332입니다. 문자나 카카오톡으로 계좌 인증을 요구하는 기관은 없습니다."

### Stage 6 — 다중 결합형 싱크홀 (Hybrid Crime Stage)
음성: assets/audio/stage6_voice.mp3
키워드: 발신자 "검사 + 은행 + 가족", 내용 "범죄 연루 + 자녀 인질", 요구 "현금 인출 + 직접 전달"
상황: "검사라는 사람이 전화해 내가 범죄 조직의 자금 세탁에 연루됐다고 합니다. 그리고 잠시 후 자녀라고 주장하는 사람이 울면서 전화를 받습니다. 현금을 인출해 전달 요원에게 건네지 않으면 둘 다 구속된다고 합니다."

A 선택: "자녀 목소리도 들었으니 일단 현금을 인출해 전달한다" / sink
  피드백: "당신은 보이스피싱크홀에 빠졌습니다."
  교육: "이것은 가장 진화된 다중 결합형 수법입니다. 어떤 상황에서도 현금을 직접 전달하는 경우는 없습니다. 즉시 112에 신고하세요."
B 선택: "일단 전화를 끊고 자녀와 가족에게 직접 확인 후 112에 신고한다" / safe
  피드백: "완벽한 판단! 최고 난이도의 싱크홀을 피했습니다."
  교육: "다중 결합형 수법은 심리적 압박이 극대화됩니다. 어떤 상황에서도 직접 확인 먼저, 신고는 112입니다."

---

## 최종 리포트 점수 메시지

6/6: "완벽합니다! 6단계 모두 피했습니다. 보이스피싱 근절 챔피언! 주변에 꼭 알려주세요."
4~5/6: "훌륭합니다! 대부분의 싱크홀을 피했습니다. 취약했던 수법을 다시 확인해 보세요."
2~3/6: "아슬아슬합니다. 절반 정도 빠졌습니다. 교육 내용을 반드시 확인하세요."
0~1/6: "위험합니다. 대부분의 싱크홀에 빠졌습니다. 지금 바로 가족에게 이 체험을 공유해주세요."

---

## 싱크홀 애니메이션 상세 (A안 핵심 시각 효과)

A 선택 시 triggerSink(container):
- 0.0~0.3s: .shake → 화면 진동
- 0.3~0.8s: .distort → rotate(14deg) + blur(12px) + scale(0.85)
- 0.8~1.2s: .suck → scale(0) + opacity(0) 빨려 들어가는 효과
- 1.2~1.5s: .flash-red → 빨간 플래시 오버레이
→ 1.5초 후 결과 오버레이 표시, Promise resolve

B 선택 시 triggerSafe(container):
- 초록 빛 pulse 0.4s
- 위로 슬라이드 아웃 0.6s
→ Promise resolve

CSS @keyframes만 사용 (Canvas/WebGL 금지)
will-change: transform, opacity 사전 설정 후 완료 시 해제

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
voicephishing-sinkhole-A/
├── index.html
├── css/ (reset, variables, layout, animations, components)
├── js/ (stages, utils, AudioEngine, SinkholeEffect, ScoreTracker, StageManager, main)
└── assets/audio/ assets/images/

variables.css 주요값:
--color-bg: #0a0a0a
--color-primary: #C0392B
--color-accent: #E74C3C
--color-safe: #27AE60
--color-text: #FFFFFF
--color-text-sub: #AAAAAA
--color-bg-card: #161616
--color-border: #2a2a2a
--max-width: 480px
--dur-sinkhole: 1.5s
```

### 요청 2 — index.html + layout.css
```
index.html과 layout.css를 만들어줘.

마크업:
- #screen-intro: .waveform / .intro-text / .intro-sub
- #screen-start: .stage-dots(6개) / .start-logo / .start-headline / #btn-start
- #screen-stage: .stage-header(.stage-number + .progress-bar) / .audio-player / .situation-card(.keywords-grid + .situation-text) / .choices(#btn-a + #btn-b) / .result-overlay
- #screen-result: .score-gauge(SVG) / .result-feedback / .edu-cards / .action-grid / #btn-retry

layout.css:
- .screen: position fixed, inset 0, opacity 0, pointer-events none
- .screen.active: opacity 1, pointer-events auto
- transition: opacity 0.4s
- display:none 절대 금지
```

### 요청 3 — stages.js
```
js/stages.js를 완성해줘.
마스터 프롬프트의 Stage 1~6 데이터를 STAGES 배열로 구현.
스키마: { id, title, audioSrc, keywords:[{label,value}], situation, choices:{A:{label,result,feedback,education,sfx}, B:{...}} }
window.STAGES = STAGES 전역 등록.
```

### 요청 4 — utils.js
```
js/utils.js를 만들어줘.
onTap(el, cb) / typeWriter(el, text, speed) / fadeIn(el, duration) / fadeOut(el, duration) / delay(ms) / flashClass(el, className, duration) / createWaveform(svgEl, barCount)
window.Utils = {...} 전역 등록.
```

### 요청 5 — AudioEngine.js
```
js/AudioEngine.js를 만들어줘.
unlockAudio() / playVoice(src, {onPlay, onEnd, onProgress}) / playSFX(src) / stop() / get isPlaying()
iOS Safari 자동재생 정책 완전 대응.
오류 시 console.warn 후 onEnd 즉시 호출.
window.AudioEngine = new AudioEngine() 전역 등록.
```

### 요청 6 — SinkholeEffect.js
```
js/SinkholeEffect.js를 만들어줘.
triggerSink(container): 4단계 시퀀스 (shake→distort→suck→flash-red), Promise 반환
triggerSafe(container): 초록 pulse → 슬라이드 아웃, Promise 반환
CSS 클래스 토글 방식, will-change 사전설정/해제.
window.SinkholeEffect = new SinkholeEffect() 전역 등록.
```

### 요청 7 — ScoreTracker.js
```
js/ScoreTracker.js를 만들어줘.
record(stageId, choice, result) / getHistory() / getSummary() / getResultMessage() / getShareURL() / reset()
점수 메시지: 6/6, 4~5/6, 2~3/6, 0~1/6 기준으로.
window.ScoreTracker = new ScoreTracker() 전역 등록.
```

### 요청 8 — StageManager.js
```
js/StageManager.js를 만들어줘.
init() / goToScreen(id) / showStage(index) / handleChoice(choice) / showResult() / reset()
- showStage: STAGES[index] 데이터 DOM 주입, 버튼 비활성화, 음성 재생 후 버튼 활성화
- handleChoice: isProcessing 플래그, SinkholeEffect await, 결과 오버레이 표시, 2초 후 자동 진행
- showResult: 원형 게이지(renderScoreGauge) + 교육 카드 생성
window.StageManager = new StageManager() 전역 등록.
```

### 요청 9 — main.js + CSS 마무리
```
main.js, components.css, animations.css를 만들어줘.

main.js: 타이핑효과 / createWaveform / 인트로 언락 / 버튼 이벤트 바인딩 / SNS공유 / 토스트 메시지

components.css: btn-primary(맥동) / btn-danger(A) / btn-safe(B) / situation-card / keyword-item / result-overlay / edu-card / action-grid / waveform-player / progress-bar / stage-dots(6개)

animations.css: @keyframes shake/distort/suck/pulse/fadeIn/flashRed/flashGreen/waveBar
```

### 요청 10 — 최종 점검
```
전체 코드를 점검하고 아래를 확인/수정해줘.
- [ ] 인트로 탭 → 시작 전환 정상
- [ ] Stage 1~6 순서 진행 (탈락 없음)
- [ ] A 선택 → 싱크홀 애니메이션 → 오버레이 → 2초 후 자동 다음
- [ ] B 선택 → 안전 피드백 → 2초 후 자동 다음
- [ ] Stage 6 완료 → 리포트 화면
- [ ] 원형 게이지 6단계 기준 계산
- [ ] iOS Safari 대응 체크리스트 (viewport, playsinline, safe-area, 48px 터치타겟)
- [ ] isProcessing 중복 클릭 방지
- [ ] display:none 사용 여부 (있으면 제거)
```

---

## 🔧 디버깅 프롬프트

### 싱크홀 애니메이션 버벅임
```
SinkholeEffect.triggerSink()가 저사양 기기에서 버벅여.
- will-change 설정 타이밍 최적화
- prefers-reduced-motion 감지 후 경량 모드 (blur 제거, 총 1.0s로 단축)
- requestAnimationFrame으로 클래스 추가 타이밍 정밀화
수정된 SinkholeEffect.js 전체 출력.
```

### 오디오 iOS 재생 안 될 때
```
iOS에서 음성이 재생 안 돼.
- AudioContext.state 콘솔 출력
- unlockAudio() 호출이 user gesture 안에 있는지 확인
- play() rejected Promise catch 로그 추가
- muted=true로 시작 후 unmute 패턴 시도
수정된 AudioEngine.js 전체 출력.
```
