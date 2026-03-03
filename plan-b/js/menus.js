/* ==========================================================================
   menus.js — 보이스피싱 헬스키친 B안
   메뉴 시나리오 데이터 4종
   ========================================================================== */

const MENUS = [

  /* ── 메뉴1 — 🌶️ 순한맛 ──────────────────────────────────────────── */
  {
    id: 1,
    title:      "은행·대출 사칭",
    spiceLevel: 1,
    spiceLabel: "🌶️ 순한맛",
    spiceKey:   "mild",
    spiceColor: "#FF9800",
    audioSrc:   "assets/audio/menu1_voice.mp3",

    keywords: [
      { label: "발신자", value: "○○은행 대출팀" },
      { label: "내용",   value: "연 2.9% 특별 대출 승인" },
      { label: "요구",   value: "선입금 후 대출 실행" },
    ],

    situation:
      "저금리 대출을 미끼로 먼저 돈을 요구하는 '선입금 유인형'. " +
      "전화 한 통으로 수백만 원을 날릴 수 있는 기본 레시피입니다.",

    choices: {
      A: {
        label:    "조건이 좋으니 선입금을 먼저 송금한다",
        result:   "hell",
        feedback: "이 맛에 속으셨습니다. 입 안이 얼얼하시죠?",
        damage:   "'선입금 후대출'은 대출 사기의 기본 수법입니다. 금융기관은 대출 전 수수료나 보증금을 절대 요구하지 않습니다.",
        response: "신청한 적 없는 대출 권유 전화는 즉시 끊고, 해당 금융사 공식 번호로 확인하세요.",
        sfx:      "assets/audio/sfx_hell.mp3",
      },
      B: {
        label:    "이상하다 싶어 공식 앱에서 직접 확인한다",
        result:   "survived",
        feedback: "이 맛을 꿰뚫어 보셨습니다! 🏆",
        damage:   "은행은 전화로 먼저 대출을 권유하지 않습니다. 금리가 좋을수록 더 의심하세요.",
        response: null,
        sfx:      null,
      },
    },
  },

  /* ── 메뉴2 — 🌶️🌶️ 매운맛 ──────────────────────────────────────── */
  {
    id: 2,
    title:      "기관사칭형",
    spiceLevel: 2,
    spiceLabel: "🌶️🌶️ 매운맛",
    spiceKey:   "hot",
    spiceColor: "#E74C3C",
    audioSrc:   "assets/audio/menu2_voice.mp3",

    keywords: [
      { label: "발신자", value: "중앙지검 수사관" },
      { label: "내용",   value: "명의 도용 범죄 연루" },
      { label: "요구",   value: "현금 보관 및 전달" },
    ],

    situation:
      "공권력의 이름을 빌려 공포감을 조성하는 '기관사칭 압박형'. " +
      "권위와 두려움을 재료로 판단력을 마비시키는 한 단계 매운 레시피입니다.",

    choices: {
      A: {
        label:    "수사에 협조하기 위해 현금을 인출해 보관한다",
        result:   "hell",
        feedback: "이 맛에 속으셨습니다. 매운 맛이 독했죠?",
        damage:   "검찰·경찰·금감원 등 어떤 기관도 전화로 현금 인출이나 보관을 요구하지 않습니다. 이 수법의 평균 피해액은 약 5,290만 원입니다.",
        response: "기관 사칭 전화는 즉시 끊고 해당 기관 공식 번호(검찰청 1301, 경찰 112)로 직접 확인하세요.",
        sfx:      "assets/audio/sfx_hell.mp3",
      },
      B: {
        label:    "전화를 끊고 검찰청 1301에 직접 신고한다",
        result:   "survived",
        feedback: "매운맛을 이겨내셨습니다! 🌶️",
        damage:   "진짜 수사관은 절대 전화를 끊지 말라고 하지 않습니다. 전화를 끊으면 안 된다는 말 자체가 수법의 핵심입니다.",
        response: null,
        sfx:      null,
      },
    },
  },

  /* ── 메뉴3 — 🌶️🌶️🌶️ 불맛 ──────────────────────────────────────── */
  {
    id: 3,
    title:      "가족·지인 사칭형",
    spiceLevel: 3,
    spiceLabel: "🌶️🌶️🌶️ 불맛",
    spiceKey:   "fire",
    spiceColor: "#C0392B",
    audioSrc:   "assets/audio/menu3_voice.mp3",

    keywords: [
      { label: "발신자", value: "울먹이는 자녀 목소리" },
      { label: "내용",   value: "사고 발생, 합의금 필요" },
      { label: "요구",   value: "즉시 계좌 이체" },
    ],

    situation:
      "사랑하는 가족의 위기 상황을 연출해 감정을 자극하는 '감정 폭탄형'. " +
      "이성보다 감정이 먼저 반응하게 만드는 진짜 매운 레시피입니다.",

    choices: {
      A: {
        label:    "자녀 목소리를 들었으니 바로 합의금을 송금한다",
        result:   "hell",
        feedback: "이 맛에 속으셨습니다. 가슴이 먼저 반응하셨군요.",
        damage:   "가족을 사칭한 긴급 요청은 판단력을 마비시키도록 설계된 수법입니다. 목소리는 AI로도 합성할 수 있습니다.",
        response: "반드시 가족에게 다른 번호로 직접 전화해 확인하세요. 진짜 응급상황이면 119에 신고하면 됩니다.",
        sfx:      "assets/audio/sfx_hell.mp3",
      },
      B: {
        label:    "일단 끊고 자녀에게 직접 다른 번호로 연락한다",
        result:   "survived",
        feedback: "불맛도 이겨내셨습니다! 🔥",
        damage:   "감정적으로 흥분된 상황일수록 잠깐 멈추는 것이 최고의 방어입니다. 송금 전 30초만 직접 확인하세요.",
        response: null,
        sfx:      null,
      },
    },
  },

  /* ── 메뉴4 — 🌶️🌶️🌶️🌶️🌶️ 지옥맛 ─────────────────────────────── */
  {
    id: 4,
    title:      "다중 결합형 (Hybrid)",
    spiceLevel: 5,
    spiceLabel: "🌶️🌶️🌶️🌶️🌶️ 지옥맛",
    spiceKey:   "hell",
    spiceColor: "#8B0000",
    audioSrc:   "assets/audio/menu4_voice.mp3",

    keywords: [
      { label: "발신자", value: "검사 + 은행 + 자녀" },
      { label: "내용",   value: "범죄 연루 + 자녀 위기" },
      { label: "요구",   value: "현금 인출 + 직접 전달" },
    ],

    situation:
      "기관 사칭 + 가족 위기 + 현금 전달 요구를 동시에 조합한 '지옥 퓨전 코스'. " +
      "가장 진화된 형태로, 2025년 피해 건당 평균 5,290만 원의 주범입니다.",

    choices: {
      A: {
        label:    "두 군데서 압박이 오니 어쩔 수 없이 현금을 인출해 전달한다",
        result:   "hell",
        feedback: "지옥맛에 속으셨습니다. 최강의 수법이었습니다.",
        damage:   "다중 결합형은 여러 가지 심리적 압박을 동시에 가해 판단 능력을 완전히 마비시키는 최고 난도 수법입니다.",
        response: "현금을 직접 전달받는 기관은 세상에 없습니다. 어떤 상황에서도 직접 전달 요구는 112 신고 대상입니다.",
        sfx:      "assets/audio/sfx_hell.mp3",
      },
      B: {
        label:    "어떤 상황에서도 현금 직접 전달은 없다고 판단해 112에 신고한다",
        result:   "survived",
        feedback: "지옥맛을 이겨냈습니다! 🏆 당신은 보이스피싱 면역자입니다!",
        damage:   "현금 직접 전달 = 무조건 사기. 이 공식만 기억하면 지옥맛도 피할 수 있습니다.",
        response: null,
        sfx:      null,
      },
    },
  },
];

/* ── 영수증 결과 메시지 ─────────────────────────────────────────────── */
const RECEIPT_MESSAGES = {
  perfect: {
    range: [4, 4],
    title: "완벽한 면역력!",
    text:  "지옥맛도 이겨낸 보이스피싱 면역자!\n주변에 이 맛을 알려주세요.",
    emoji: "🏆",
  },
  high: {
    range: [2, 3],
    title: "상당한 내성!",
    text:  "일부 수법은 꿰뚫었지만\n아직 취약한 메뉴가 있습니다.",
    emoji: "💪",
  },
  low: {
    range: [1, 1],
    title: "면역력 부족!",
    text:  "대부분의 맛에 반응했습니다.\n교육 내용을 반드시 확인하세요.",
    emoji: "⚠️",
  },
  zero: {
    range: [0, 0],
    title: "면역력 제로!",
    text:  "모든 맛에 속으셨습니다.\n지금 바로 가족과 공유해주세요.",
    emoji: "🚨",
  },
};

window.MENUS           = MENUS;
window.RECEIPT_MESSAGES = RECEIPT_MESSAGES;
