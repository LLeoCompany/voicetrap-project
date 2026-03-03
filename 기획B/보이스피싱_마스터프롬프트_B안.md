# 보이스피싱 헬스키친 캠페인 — 마스터 프롬프트 【B안 전용】

> B안: 보이스피싱 헬스키친 (맛 단계 체험 구조)
> Claude에게 이 전체를 한 번에 붙여넣고 시작하세요.

---

## 🧠 마스터 프롬프트

```
너는 지금부터 내 프론트엔드 개발 파트너야.
우리는 금융감독원 의뢰를 받은 보이스피싱 예방 캠페인 랜딩 페이지 [B안]을 함께 만들 거야.

---

## 캠페인 컨셉 — B안: 보이스피싱 헬스키친

보이스피싱 수법을 "맛 단계"로 체험하는 구조.
순한맛 → 매운맛 → 불맛 → 지옥맛으로 단계가 올라갈수록 수법이 진화하며,
전통적인 수법부터 최신 복합 기술형 수법까지 점진적으로 경험.

캠페인명: 보이스피싱 헬스키친 (Voice Phishing: Hell's Kitchen)
핵심 메시지: 보이스피싱 수법들은 하나같이 다르지만, 공통점이 있다 — 다양한 방식으로 강도를 조절하며 사람을 압박한다
핵심 비주얼: 악마의 삼지창 (빨간 트라이던트) + 빨간 고추 맛 단계 아이콘
참여 구조: 맛에 넘어가지 않으면 → 더 강한 다음 맛으로. 속으면 → 피해 안내 후 다음 메뉴 합류

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

배경: #0d0000 (딥 다크 레드-블랙)
주배경: #0a0a0a
포인트: #C0392B (다크 레드)
보조: #E74C3C
텍스트: #FFFFFF
서브텍스트: #CCCCCC
카드 배경: #1a0a0a (약간 붉은 기운)
카드 테두리: #3a1a1a
안전 컬러: #27AE60
맛 단계 컬러:
  순한맛: #FF9800 (주황)
  매운맛: #E74C3C (빨강)
  불맛: #C0392B (다크 레드)
  지옥맛: #8B0000 (딥 레드) + 금색 그라데이션 accent

폰트: Noto Sans KR
레이아웃: max-width 480px, 단일 컬럼
무드: 고급 레스토랑 + 악마적 긴장감 (검정+빨간+금색)

---

## 전체 화면 플로우

인트로 → 메뉴판 → 메뉴1(순한맛) → 메뉴2(매운맛) → 메뉴3(불맛) → 메뉴4(지옥맛) → 최종 영수증

- 모든 화면은 .screen 클래스로 관리
- .screen.active 일 때만 보임 (opacity 전환, display:none 절대 금지)
- 속은 경우: 피해 안내 팝업(2초) → 다음 메뉴 합류 (탈락 없음)
- 안 속은 경우: 더 강한 맛으로 바로 진행

---

## 화면별 상세 스펙

### 인트로 화면 (#screen-intro)
- 딥 다크 배경 + 빨간 음파 파형 + 트라이던트 SVG 아이콘
- 타이핑 효과: "보이스피싱 수법들은\n지금 이 순간도 진화하고 있습니다."
- 하단 서브: "당신은 이 맛을 견뎌낼 수 있습니까?"
- 화면 탭 → 오디오 언락 + 메뉴판 전환

### 메뉴판 화면 (#screen-menu)
- 레스토랑 메뉴판 스타일 (고급 액자 프레임 비주얼)
- 제목: "보이스피싱 헬스키친 메뉴"
- 맛 단계 4개 미리보기 (잠금 상태로 표시):
  🌶️ 순한맛 - 은행·대출 사칭 (잠금 해제됨)
  🌶️🌶️ 매운맛 - 기관사칭형 (잠금)
  🌶️🌶️🌶️ 불맛 - 가족·지인 사칭 (잠금)
  🌶️🌶️🌶️🌶️🌶️ 지옥맛 - 다중 결합형 (잠금)
- "주문하기" 버튼 → 메뉴1 시작

### 메뉴 화면 (#screen-menu-stage) — 메뉴1~4 공통 재사용
- 상단: 현재 맛 단계 배지 (🌶️ × n) + 메뉴 이름 + 진행 바
- 맛 단계 비주얼: 단계별 컬러 테마 자동 적용
- 음성 플레이어: 재생 버튼 + 음파 파형
- 상황 카드: "오늘의 요리" 레스토랑 메뉴판 스타일 텍스트 카드
  - 재료(키워드) 배지
  - 상황 설명 (메뉴 설명문 스타일)
- 선택 버튼 2개:
  - A 버튼: "이 맛에 넘어간다" (위험 선택)
  - B 버튼: "이 맛을 거부한다" (안전 선택)
- A 선택 결과 (속은 경우):
  → 불꽃 애니메이션 (hellEffect)
  → "이 맛에 속으셨습니다" 오버레이
  → 실제 피해 위험성 + 올바른 대응 안내
  → 2초 후 다음 메뉴 합류
- B 선택 결과 (안 속은 경우):
  → 승리 파티클 효과
  → "이 맛을 꿰뚫어 보셨습니다!" 오버레이
  → 교육 내용
  → 1.5초 후 더 강한 다음 맛 진행

### 최종 영수증 화면 (#screen-receipt)
- 레스토랑 영수증 스타일 레이아웃
- 제목: "보이스피싱 헬스키친 영수증"
- 메뉴별 결과 항목 (통과 ✅ / 속음 ❌)
- 총 "면역력 점수" 게이지
- 맞춤 피드백 메시지
- 교육 카드 (속은 메뉴 강조)
- "경품 응모" + "SNS 공유" + "재도전" 버튼

---

## 메뉴 데이터 (4개)

### 메뉴1 — 🌶️ 순한맛: 은행·대출 사칭
음성: assets/audio/menu1_voice.mp3
재료 키워드: 발신자 "○○은행 대출팀", 내용 "연 2.9% 특별 대출 승인", 요구 "선입금 후 대출 실행"
오늘의 요리: "저금리 대출을 미끼로 먼저 돈을 요구하는 '선입금 유인형'. 전화 한 통으로 수백만 원을 날릴 수 있는 기본 레시피입니다."

A 선택: "조건이 좋으니 선입금을 먼저 송금한다" / hell (속은 경우)
  피드백: "이 맛에 속으셨습니다. 입 안이 얼얼하시죠?"
  피해 안내: "'선입금 후대출'은 대출 사기의 기본 수법입니다. 금융기관은 대출 전 수수료나 보증금을 절대 요구하지 않습니다."
  대응: "신청한 적 없는 대출 권유 전화는 즉시 끊고, 해당 금융사 공식 번호로 확인하세요."
B 선택: "이상하다 싶어 공식 앱에서 직접 확인한다" / survived
  피드백: "이 맛을 꿰뚫어 보셨습니다! 🏆"
  교육: "은행은 전화로 먼저 대출을 권유하지 않습니다. 금리가 좋을수록 더 의심하세요."

### 메뉴2 — 🌶️🌶️ 매운맛: 기관사칭형
음성: assets/audio/menu2_voice.mp3
재료 키워드: 발신자 "중앙지검 수사관", 내용 "명의 도용 범죄 연루", 요구 "현금 보관 및 전달"
오늘의 요리: "공권력의 이름을 빌려 공포감을 조성하는 '기관사칭 압박형'. 권위와 두려움을 재료로 판단력을 마비시키는 한 단계 매운 레시피입니다."

A 선택: "수사에 협조하기 위해 현금을 인출해 보관한다" / hell
  피드백: "이 맛에 속으셨습니다. 매운 맛이 독했죠?"
  피해 안내: "검찰·경찰·금감원 등 어떤 기관도 전화로 현금 인출이나 보관을 요구하지 않습니다. 이 수법의 평균 피해액은 약 5,290만 원입니다."
  대응: "기관 사칭 전화는 즉시 끊고 해당 기관 공식 번호(검찰청 1301, 경찰 112)로 직접 확인하세요."
B 선택: "전화를 끊고 검찰청 1301에 직접 신고한다" / survived
  피드백: "매운맛을 이겨내셨습니다! 🌶️"
  교육: "진짜 수사관은 절대 전화를 끊지 말라고 하지 않습니다. 전화를 끊으면 안 된다는 말 자체가 수법의 핵심입니다."

### 메뉴3 — 🌶️🌶️🌶️ 불맛: 가족·지인 사칭형
음성: assets/audio/menu3_voice.mp3
재료 키워드: 발신자 "울먹이는 자녀 목소리", 내용 "사고 발생, 합의금 필요", 요구 "즉시 계좌 이체"
오늘의 요리: "사랑하는 가족의 위기 상황을 연출해 감정을 자극하는 '감정 폭탄형'. 이성보다 감정이 먼저 반응하게 만드는 진짜 매운 레시피입니다."

A 선택: "자녀 목소리를 들었으니 바로 합의금을 송금한다" / hell
  피드백: "이 맛에 속으셨습니다. 가슴이 먼저 반응하셨군요."
  피해 안내: "가족을 사칭한 긴급 요청은 판단력을 마비시키도록 설계된 수법입니다. 목소리는 AI로도 합성할 수 있습니다."
  대응: "반드시 가족에게 다른 번호로 직접 전화해 확인하세요. 진짜 응급상황이면 119에 신고하면 됩니다."
B 선택: "일단 끊고 자녀에게 직접 다른 번호로 연락한다" / survived
  피드백: "불맛도 이겨내셨습니다! 🔥"
  교육: "감정적으로 흥분된 상황일수록 잠깐 멈추는 것이 최고의 방어입니다. 송금 전 30초만 직접 확인하세요."

### 메뉴4 — 🌶️🌶️🌶️🌶️🌶️ 지옥맛: 다중 결합형 (Hybrid)
음성: assets/audio/menu4_voice.mp3
재료 키워드: 발신자 "검사 + 은행 + 자녀", 내용 "범죄 연루 + 자녀 위기", 요구 "현금 인출 + 직접 전달"
오늘의 요리: "기관 사칭 + 가족 위기 + 현금 전달 요구를 동시에 조합한 '지옥 퓨전 코스'. 가장 진화된 형태로, 2025년 피해 건당 평균 5,290만 원의 주범입니다."

A 선택: "두 군데서 압박이 오니 어쩔 수 없이 현금을 인출해 전달한다" / hell
  피드백: "지옥맛에 속으셨습니다. 최강의 수법이었습니다."
  피해 안내: "다중 결합형은 여러 가지 심리적 압박을 동시에 가해 판단 능력을 완전히 마비시키는 최고 난도 수법입니다."
  대응: "현금을 직접 전달받는 기관은 세상에 없습니다. 어떤 상황에서도 직접 전달 요구는 112 신고 대상입니다."
B 선택: "어떤 상황에서도 현금 직접 전달은 없다고 판단해 112에 신고한다" / survived
  피드백: "지옥맛을 이겨냈습니다! 🏆 당신은 보이스피싱 면역자입니다!"
  교육: "현금 직접 전달 = 무조건 사기. 이 공식만 기억하면 지옥맛도 피할 수 있습니다."

---

## 헬파이어 애니메이션 상세 (B안 핵심 시각 효과)

A 선택 시 triggerHell(container):
- 0.0~0.2s: .burn → 주황→빨강 색상 flash
- 0.2~0.6s: .melt → 아래로 녹아내리는 효과 (translateY + blur)
- 0.6~1.0s: 화염 파티클 (CSS @keyframes, 작은 원 요소들이 위로 떠오름)
- 1.0~1.3s: 빨간 플래시 오버레이 + "🔥" 이모지 대형 표시
→ 1.3초 후 결과 오버레이 표시, Promise resolve

B 선택 시 triggerSurvived(container):
- 금색 파티클 샤워 0.6s
- 위로 상승 효과 + 승리 이모지 "🏆" 표시
→ Promise resolve

CSS @keyframes만 사용 (Canvas/WebGL 금지)

---

## 최종 영수증 점수 메시지

4/4 통과: "완벽한 면역력! 지옥맛도 이겨낸 보이스피싱 면역자! 주변에 이 맛을 알려주세요."
2~3/4: "상당한 내성! 일부 수법은 꿰뚫었지만 아직 취약한 메뉴가 있습니다."
1/4: "면역력 부족! 대부분의 맛에 반응했습니다. 교육 내용을 반드시 확인하세요."
0/4: "면역력 제로! 모든 맛에 속으셨습니다. 지금 바로 가족과 공유해주세요."

---

## JS 모듈 구조

menus.js → utils.js → AudioEngine.js → HellEffect.js → ScoreTracker.js → MenuManager.js → main.js
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
voicephishing-hellskitchen-B/
├── index.html
├── css/ (reset, variables, layout, animations, components)
├── js/ (menus, utils, AudioEngine, HellEffect, ScoreTracker, MenuManager, main)
└── assets/audio/ assets/images/

variables.css 주요값:
--color-bg: #0a0a0a
--color-bg-card: #1a0a0a
--color-primary: #C0392B
--color-hell: #8B0000
--color-mild: #FF9800
--color-hot: #E74C3C
--color-survived: #27AE60
--color-gold: #F39C12
--color-text: #FFFFFF
--color-border: #3a1a1a
--max-width: 480px
--dur-hell: 1.3s
```

### 요청 2 — index.html + layout.css
```
index.html과 layout.css를 만들어줘.

마크업:
- #screen-intro: .waveform / .trident-icon(SVG 삼지창) / .intro-text / .intro-sub
- #screen-menu: .menu-board(액자 스타일) / .menu-title / .spice-levels(맛 단계 4개 미리보기) / #btn-order
- #screen-menu-stage: .stage-header(.spice-badge + .menu-name + .progress-bar) / .audio-player / .menu-card(.ingredients-grid + .menu-desc) / .choices(#btn-a + #btn-b) / .result-overlay
- #screen-receipt: .receipt-container / .receipt-title / .menu-results / .immunity-gauge(SVG) / .result-feedback / .edu-cards / .action-grid / #btn-retry

layout.css: .screen display none → active opacity 전환 구조
```

### 요청 3 — menus.js
```
js/menus.js를 완성해줘.
마스터 프롬프트의 메뉴1~4 데이터를 MENUS 배열로 구현.
스키마: { id, title, spiceLevel(1~5), spiceLabel('순한맛'~'지옥맛'), spiceColor, audioSrc, keywords:[{label,value}], situation, choices:{A:{label,result:'hell'|'survived',feedback,damage,response,sfx}, B:{...}} }
window.MENUS = MENUS 전역 등록.
```

### 요청 4 — utils.js + AudioEngine.js
```
utils.js: onTap / typeWriter / fadeIn / fadeOut / delay / flashClass / createWaveform / createTrident(SVG 삼지창 생성)
AudioEngine.js: unlockAudio / playVoice / playSFX / stop / isPlaying — iOS 완전 대응
각 window 전역 등록.
```

### 요청 5 — HellEffect.js
```
js/HellEffect.js를 만들어줘.
triggerHell(container, spiceLevel): 맛 단계별 강도 조절 (level 1~4로 애니메이션 강도 다르게)
triggerSurvived(container, spiceLevel): 금색 파티클 + 승리 이모지
CSS @keyframes: burn, melt, hellParticle, goldShower, rise
window.HellEffect = new HellEffect() 전역 등록.
```

### 요청 6 — ScoreTracker.js
```
js/ScoreTracker.js를 만들어줘.
record(menuId, choice, result) / getHistory() / getSummary() / getResultMessage() / getShareURL() / reset()
점수 메시지: 4/4, 2~3/4, 1/4, 0/4 기준.
getReceiptItems(): 메뉴별 결과 배열 반환 (영수증 렌더용).
window.ScoreTracker = new ScoreTracker() 전역 등록.
```

### 요청 7 — MenuManager.js
```
js/MenuManager.js를 만들어줘.
init() / goToScreen(id) / showMenu(index) / handleChoice(choice) / showReceipt() / reset()
- showMenu: MENUS[index] 데이터 DOM 주입 + 맛 단계 컬러 테마 자동 적용
- handleChoice A(hell): HellEffect.triggerHell → 피해안내 오버레이 → 2초 후 다음 메뉴
- handleChoice B(survived): HellEffect.triggerSurvived → 교육 오버레이 → 1.5초 후 다음 메뉴
- showReceipt: 영수증 스타일 렌더링 + 면역력 게이지 (renderImmunityGauge)
window.MenuManager = new MenuManager() 전역 등록.
```

### 요청 8 — main.js + CSS 마무리
```
main.js, components.css, animations.css를 만들어줘.

main.js: 타이핑효과 / createWaveform / createTrident / 인트로 언락 / 버튼 이벤트 / SNS공유 / 토스트

components.css:
- .btn-order(금색 테두리 + 호버 glow)
- .btn-hell(A, 빨간 배경 불꽃 hover)
- .btn-survived(B, 회색 테두리)
- .menu-card(가죽 메뉴판 스타일 — 짙은 배경 + 금색 테두리)
- .spice-badge(맛 단계별 컬러 배지)
- .receipt-container(영수증 폰트 스타일, 점선 테두리)
- .menu-result-item(✅/❌ 표시)
- .result-overlay

animations.css:
- @keyframes burn, melt, hellParticle, goldShower, rise, fadeIn, waveBar, tridentGlow
- 맛 단계별 border-color 변수 오버라이드
```

### 요청 9 — 최종 점검
```
전체 코드를 점검하고 아래를 확인/수정해줘.
- [ ] 인트로 → 메뉴판 → 메뉴1~4 순서 진행
- [ ] A 선택: 헬파이어 애니메이션 → 피해안내 → 2초 후 다음 메뉴
- [ ] B 선택: 파티클 → 교육 → 1.5초 후 다음 메뉴
- [ ] 맛 단계별 컬러 테마 자동 전환 확인
- [ ] 메뉴4 완료 → 영수증 화면
- [ ] 영수증 레이아웃 (메뉴별 통과/실패 항목)
- [ ] 면역력 게이지 4단계 기준 계산
- [ ] iOS Safari 대응 (viewport, playsinline, safe-area)
- [ ] display:none 없는지 확인
```

---

## 🔧 디버깅 프롬프트

### 맛 단계 컬러 테마가 안 바뀔 때
```
showMenu()에서 맛 단계별 컬러 테마가 적용이 안 돼.
- :root 변수를 JS에서 document.documentElement.style.setProperty로 동적으로 교체하는 방식으로 수정
- spiceColor값을 --color-current-spice에 매핑
- .stage-header, .menu-card, .btn-hell의 border-color를 var(--color-current-spice) 사용하도록 수정
수정된 MenuManager.js + components.css 출력.
```

### 영수증 레이아웃이 이상할 때
```
#screen-receipt의 영수증 스타일이 깨져.
- .receipt-container: 흰 배경 + 검정 텍스트 + 점선 border (영수증 느낌)
- 폰트: monospace 계열
- 각 메뉴 항목: 왼쪽 메뉴명 + 오른쪽 ✅/❌
- 하단 합계: "면역력 점수: N/4"
수정된 components.css + showReceipt() 함수 출력.
```
