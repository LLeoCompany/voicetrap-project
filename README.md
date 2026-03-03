# 보이스피싱크홀 캠페인 랜딩 페이지

금융감독원 × (주) 에이치앤씨플래닝
보이스피싱 예방 참여형 이벤트 랜딩 페이지 — A안

## 실행 방법

빌드 도구 없음. `index.html`을 브라우저에서 직접 열거나 로컬 서버로 실행.

```bash
# Python 로컬 서버 (선택)
python3 -m http.server 3000
```

## 구조

```
/
├── index.html
├── css/
│   ├── reset.css
│   ├── variables.css
│   ├── layout.css
│   ├── animations.css
│   └── components.css
├── js/
│   ├── stages.js
│   ├── utils.js
│   ├── AudioEngine.js
│   ├── SinkholeEffect.js
│   ├── ScoreTracker.js
│   ├── StageManager.js
│   └── main.js
└── assets/
    ├── audio/   ← MP3 파일 납품 후 배치
    └── images/  ← 에셋 납품 후 배치
```

## 에셋 요청 (Day 3 이전 필요)

- `assets/audio/stage1_voice.mp3` ~ `stage6_voice.mp3`
- `assets/audio/sfx_sinkhole.mp3`
- `assets/images/bg_sinkhole.jpg` (1920×1080+)
- `assets/images/logo_fss.png`
