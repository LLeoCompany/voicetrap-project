/* ==========================================================================
   stages.js — 보이스피싱크홀 캠페인
   스테이지 시나리오 데이터 (6단계 전체)
   수정 시 이 파일의 데이터만 교체하면 됩니다.
   ========================================================================== */

const STAGES = [

  /* ── Stage 1 ── 은행 사칭 싱크홀 ────────────────────────────────────── */
  {
    id: 1,
    title: "은행 사칭형",
    subtitle: "Stage 1 — 은행 사칭 싱크홀",
    audioSrc: "assets/audio/stage1_voice.mp3",

    keywords: [
      { label: "발신자", value: "○○은행 보안팀" },
      { label: "내용",   value: "계좌 이상 거래 탐지" },
      { label: "요구",   value: "본인 확인용 OTP 입력" },
    ],

    situation:
      "은행 보안팀이라는 사람이 전화해 내 계좌에서 이상 거래가 발생했다며, " +
      "본인 확인을 위해 지금 바로 OTP 번호를 알려달라고 합니다.",

    choices: {
      A: {
        label:     "빨리 해결해야 하니 OTP를 알려준다",
        result:    "sink",
        feedback:  "당신은 보이스피싱크홀에 빠졌습니다.",
        education:
          "은행은 절대 전화로 OTP나 비밀번호를 요구하지 않습니다. " +
          "전화를 끊고 은행 공식 번호로 직접 확인하세요.",
        sfx: "assets/audio/sfx_sinkhole.mp3",
      },
      B: {
        label:     "전화를 끊고 은행 공식 번호로 직접 확인한다",
        result:    "safe",
        feedback:  "정확한 판단! 싱크홀을 피했습니다.",
        education:
          "은행의 공식 고객센터 번호는 앱이나 카드 뒷면에서 확인하세요. " +
          "전화가 왔을 때 알려준 번호는 절대 믿지 마세요.",
        sfx: null,
      },
    },
  },

  /* ── Stage 2 ── 대출 전환 싱크홀 ────────────────────────────────────── */
  {
    id: 2,
    title: "대출 사칭형",
    subtitle: "Stage 2 — 대출 전환 싱크홀",
    audioSrc: "assets/audio/stage2_voice.mp3",

    keywords: [
      { label: "발신자", value: "저금리 대출 상담사" },
      { label: "내용",   value: "기존 대출 → 연 3% 전환 가능" },
      { label: "요구",   value: "선상환 후 재대출" },
    ],

    situation:
      "저금리 대출로 전환해준다는 사람이 전화해 기존 대출을 먼저 갚으면 " +
      "연 3%로 새로 대출해준다고 합니다. " +
      "지금 바로 계좌로 송금하면 당일 처리된다고 합니다.",

    choices: {
      A: {
        label:     "조건이 좋으니 먼저 기존 대출을 상환한다",
        result:    "sink",
        feedback:  "당신은 보이스피싱크홀에 빠졌습니다.",
        education:
          "'선상환 후대출' 요구는 100% 사기입니다. " +
          "금융기관은 절대 이런 방식으로 대출을 운영하지 않습니다.",
        sfx: "assets/audio/sfx_sinkhole.mp3",
      },
      B: {
        label:     "직접 해당 금융기관 앱이나 지점을 방문해 확인한다",
        result:    "safe",
        feedback:  "훌륭합니다! 의심이 최고의 방패입니다.",
        education:
          "대출 전환은 반드시 공식 앱·홈페이지·직접 방문으로만 진행하세요. " +
          "전화로 먼저 연락 오는 금융 혜택은 없습니다.",
        sfx: null,
      },
    },
  },

  /* ── Stage 3 ── 검사 사칭 싱크홀 ────────────────────────────────────── */
  {
    id: 3,
    title: "검사 사칭형",
    subtitle: "Stage 3 — 검사 사칭 싱크홀",
    audioSrc: "assets/audio/stage3_voice.mp3",

    keywords: [
      { label: "발신자", value: "중앙지검 ○○○ 수사관" },
      { label: "내용",   value: "내 명의 대포통장 발생" },
      { label: "요구",   value: "즉시 격리 조사" },
    ],

    situation:
      "검사라고 밝힌 사람이 전화해 내 명의로 대포통장이 만들어졌다며, " +
      "수사를 위해 지금 당장 아무도 없는 장소로 이동하고 " +
      "핸드폰을 감청해야 한다고 합니다.",

    choices: {
      A: {
        label:     "수사에 협조하기 위해 지시에 따라 이동한다",
        result:    "sink",
        feedback:  "당신은 보이스피싱크홀에 빠졌습니다.",
        education:
          "검찰·경찰은 절대 전화로 장소 이동이나 현금 보관을 요구하지 않습니다. " +
          "이 수법의 평균 피해액은 약 5,290만 원입니다.",
        sfx: "assets/audio/sfx_sinkhole.mp3",
      },
      B: {
        label:     "전화를 끊고 검찰청 1301에 직접 신고한다",
        result:    "safe",
        feedback:  "냉정한 판단! 싱크홀을 피했습니다.",
        education:
          "검찰청 공식 대표번호는 1301입니다. " +
          "진짜 수사관은 전화를 끊는 것을 막지 않습니다.",
        sfx: null,
      },
    },
  },

  /* ── Stage 4 ── 가족 사고 싱크홀 ────────────────────────────────────── */
  {
    id: 4,
    title: "가족 사고 사칭형",
    subtitle: "Stage 4 — 가족 사고 싱크홀",
    audioSrc: "assets/audio/stage4_voice.mp3",

    keywords: [
      { label: "발신자", value: "경찰 / 병원 응급실" },
      { label: "내용",   value: "자녀 교통사고 발생" },
      { label: "요구",   value: "즉시 치료비 송금" },
    ],

    situation:
      "경찰이라는 사람이 전화해 자녀가 교통사고를 당했고 " +
      "지금 바로 치료비를 송금하지 않으면 수술을 시작할 수 없다고 합니다. " +
      "자녀 전화는 연결이 안 됩니다.",

    choices: {
      A: {
        label:     "급하니까 일단 치료비를 먼저 송금한다",
        result:    "sink",
        feedback:  "당신은 보이스피싱크홀에 빠졌습니다.",
        education:
          "긴급 상황을 가장해 판단력을 마비시키는 전형적인 수법입니다. " +
          "반드시 다른 번호로 가족에게 직접 연락하세요.",
        sfx: "assets/audio/sfx_sinkhole.mp3",
      },
      B: {
        label:     "전화를 끊고 자녀에게 다른 번호로 직접 연락한다",
        result:    "safe",
        feedback:  "정확한 판단! 가족이 안전합니다.",
        education:
          "어떤 긴급 상황이라도 가족에게 직접 확인이 최선입니다. " +
          "진짜 응급상황이라면 119에 신고하세요.",
        sfx: null,
      },
    },
  },

  /* ── Stage 5 ── 공공기관 사칭 싱크홀 ────────────────────────────────── */
  {
    id: 5,
    title: "공공기관 사칭형",
    subtitle: "Stage 5 — 공공기관 사칭 싱크홀",
    audioSrc: "assets/audio/stage5_voice.mp3",

    keywords: [
      { label: "발신자", value: "금융감독원 / 경찰청" },
      { label: "내용",   value: "개인정보 유출 피해 접수" },
      { label: "요구",   value: "피해 보상 위해 계좌 인증" },
    ],

    situation:
      "금융감독원이라는 곳에서 문자가 왔습니다. " +
      "내 개인정보가 유출되어 보이스피싱 피해자로 등록됐으니 " +
      "보상금을 받으려면 계좌 인증이 필요하다고 합니다.",

    choices: {
      A: {
        label:     "보상금을 받기 위해 계좌 인증을 진행한다",
        result:    "sink",
        feedback:  "당신은 보이스피싱크홀에 빠졌습니다.",
        education:
          "금융감독원은 문자로 계좌 인증을 요구하지 않습니다. " +
          "'보상금' 명목의 계좌 인증 요구는 100% 사기입니다.",
        sfx: "assets/audio/sfx_sinkhole.mp3",
      },
      B: {
        label:     "금융감독원 공식 사이트에서 직접 확인한다",
        result:    "safe",
        feedback:  "훌륭합니다! 공식 채널로 확인하는 것이 정답입니다.",
        education:
          "금융감독원 공식 번호는 1332입니다. " +
          "문자나 카카오톡으로 계좌 인증을 요구하는 기관은 없습니다.",
        sfx: null,
      },
    },
  },

  /* ── Stage 6 ── 다중 결합형 싱크홀 (Hybrid Crime Stage) ─────────────── */
  {
    id: 6,
    title: "다중 결합형",
    subtitle: "Stage 6 — 다중 결합형 싱크홀",
    audioSrc: "assets/audio/stage6_voice.mp3",

    keywords: [
      { label: "발신자", value: "검사 + 은행 + 가족" },
      { label: "내용",   value: "범죄 연루 + 자녀 인질" },
      { label: "요구",   value: "현금 인출 + 직접 전달" },
    ],

    situation:
      "검사라는 사람이 전화해 내가 범죄 조직의 자금 세탁에 연루됐다고 합니다. " +
      "그리고 잠시 후 자녀라고 주장하는 사람이 울면서 전화를 받습니다. " +
      "현금을 인출해 전달 요원에게 건네지 않으면 둘 다 구속된다고 합니다.",

    choices: {
      A: {
        label:     "자녀 목소리도 들었으니 일단 현금을 인출해 전달한다",
        result:    "sink",
        feedback:  "당신은 보이스피싱크홀에 빠졌습니다.",
        education:
          "이것은 가장 진화된 다중 결합형 수법입니다. " +
          "어떤 상황에서도 현금을 직접 전달하는 경우는 없습니다. " +
          "즉시 112에 신고하세요.",
        sfx: "assets/audio/sfx_sinkhole.mp3",
      },
      B: {
        label:     "전화를 끊고 가족에게 직접 확인 후 112에 신고한다",
        result:    "safe",
        feedback:  "완벽한 판단! 최고 난이도의 싱크홀을 피했습니다.",
        education:
          "다중 결합형 수법은 심리적 압박이 극대화됩니다. " +
          "어떤 상황에서도 직접 확인 먼저, 신고는 112입니다.",
        sfx: null,
      },
    },
  },

];

/* ── 최종 리포트 점수별 메시지 ─────────────────────────────────────────── */
const RESULT_MESSAGES = {
  perfect: {
    range:   [6, 6],
    title:   "완벽합니다!",
    text:    "6단계 모두 피했습니다. 보이스피싱 근절 챔피언!\n주변에 꼭 알려주세요.",
    emoji:   "🏆",
  },
  good: {
    range:   [4, 5],
    title:   "훌륭합니다!",
    text:    "대부분의 싱크홀을 피했습니다.\n취약했던 수법을 다시 확인해 보세요.",
    emoji:   "👍",
  },
  warning: {
    range:   [2, 3],
    title:   "아슬아슬합니다.",
    text:    "절반 정도 빠졌습니다.\n교육 내용을 반드시 확인하세요.",
    emoji:   "⚠️",
  },
  danger: {
    range:   [0, 1],
    title:   "위험합니다!",
    text:    "대부분의 싱크홀에 빠졌습니다.\n지금 바로 가족에게 이 체험을 공유해 주세요.",
    emoji:   "🚨",
  },
};

/* ── 전역 등록 ─────────────────────────────────────────────────────────── */
window.STAGES          = STAGES;
window.RESULT_MESSAGES = RESULT_MESSAGES;
