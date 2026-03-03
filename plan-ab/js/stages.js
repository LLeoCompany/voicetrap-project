/* ==========================================================================
   stages.js — 보이스피싱크홀 A+B 조합안
   SINKHOLE 1~4 스테이지 데이터
   ========================================================================== */

const STAGES = [
  /* ── SINKHOLE 1 — 🌶️ 순한맛: 은행·대출 사칭 ── */
  {
    id: 'sinkhole-1',
    spiceLevel: 1,
    spiceLabel: '🌶️ 순한맛',
    spiceKey:   'mild',
    spiceColor: '#FF9800',
    spiceBg:    'rgba(255,152,0,0.10)',
    cardBg:     '#161616',
    audioSrc:   'assets/audio/stage1_voice.mp3',
    keywords: [
      { label: '발신자', value: '○○은행 대출팀' },
      { label: '내용',   value: '연 2.9% 특별 대출 승인' },
      { label: '요구',   value: '선입금 후 대출 실행' },
    ],
    situation: '저금리 대출로 전환해준다는 사람이 전화해 먼저 기존 대출을 갚으면 당일 처리해준다고 합니다. 계좌번호를 알려주면 바로 입금된다고 합니다.',
    choices: {
      A: {
        label:    '싱크홀에 빠진다 — 선입금을 먼저 송금한다',
        result:   'sink',
        feedback: 'SINKHOLE 1 (순한맛)에 빠졌습니다.',
        damage:   "'선입금 후 대출'은 대출 사기의 기본입니다. 금융기관은 대출 전 어떠한 비용도 요구하지 않습니다.",
        response: '의심스러운 대출 권유는 즉시 끊고, 해당 금융사 공식 앱에서 확인하세요.',
        sfx:      null,
      },
      B: {
        label:     '싱크홀을 피한다 — 공식 앱에서 직접 확인한다',
        result:    'safe',
        feedback:  'SINKHOLE 1 탈출 성공!',
        education: '은행은 전화로 먼저 대출을 권유하지 않습니다. 좋은 조건일수록 더 의심하세요.',
        sfx:       null,
      },
    },
  },

  /* ── SINKHOLE 2 — 🌶️🌶️ 매운맛: 검사 사칭형 ── */
  {
    id: 'sinkhole-2',
    spiceLevel: 2,
    spiceLabel: '🌶️🌶️ 매운맛',
    spiceKey:   'hot',
    spiceColor: '#E74C3C',
    spiceBg:    'rgba(231,76,60,0.10)',
    cardBg:     '#1a0808',
    audioSrc:   'assets/audio/stage2_voice.mp3',
    keywords: [
      { label: '발신자', value: '중앙지검 수사관' },
      { label: '내용',   value: '명의 도용·대포통장' },
      { label: '요구',   value: '자산 보호 목적 현금 인출' },
    ],
    situation: '검사라는 사람이 내 명의로 대포통장이 개설됐다며, 자산을 보호하려면 현금으로 인출해 특정 장소에 보관해야 한다고 합니다.',
    choices: {
      A: {
        label:    '싱크홀에 빠진다 — 수사에 협조해 현금을 인출한다',
        result:   'sink',
        feedback: 'SINKHOLE 2 (매운맛)에 빠졌습니다.',
        damage:   '검찰·경찰은 절대 전화로 현금 인출이나 보관을 요구하지 않습니다. 평균 피해액 약 5,290만 원의 주요 수법입니다.',
        response: '검찰청 공식 번호 1301, 경찰청 112로 직접 확인하세요.',
        sfx:      null,
      },
      B: {
        label:     '싱크홀을 피한다 — 전화 끊고 1301에 신고한다',
        result:    'safe',
        feedback:  'SINKHOLE 2 탈출 성공!',
        education: "진짜 수사관은 전화를 끊지 말라고 하지 않습니다. '끊으면 안 된다'는 말이 수법의 핵심입니다.",
        sfx:       null,
      },
    },
  },

  /* ── SINKHOLE 3 — 🌶️🌶️🌶️ 불맛: 가족 사칭형 ── */
  {
    id: 'sinkhole-3',
    spiceLevel: 3,
    spiceLabel: '🌶️🌶️🌶️ 불맛',
    spiceKey:   'fire',
    spiceColor: '#C0392B',
    spiceBg:    'rgba(192,57,43,0.10)',
    cardBg:     '#1a0404',
    audioSrc:   'assets/audio/stage3_voice.mp3',
    keywords: [
      { label: '발신자', value: '울먹이는 자녀 / 병원' },
      { label: '내용',   value: '교통사고 발생' },
      { label: '요구',   value: '즉시 합의금 송금' },
    ],
    situation: '경찰이라는 사람이 전화해 자녀가 사고를 냈고 지금 바로 합의금을 보내지 않으면 구속된다고 합니다. 이어서 자녀처럼 들리는 사람이 울면서 전화를 받습니다.',
    choices: {
      A: {
        label:    '싱크홀에 빠진다 — 자녀를 위해 합의금을 송금한다',
        result:   'sink',
        feedback: 'SINKHOLE 3 (불맛)에 빠졌습니다.',
        damage:   '가족 위기 상황을 연출해 감정을 자극하는 수법입니다. 목소리는 AI로도 합성됩니다.',
        response: '반드시 다른 번호로 가족에게 직접 전화해 확인하세요. 진짜 응급상황이면 119에 신고하세요.',
        sfx:      null,
      },
      B: {
        label:     '싱크홀을 피한다 — 끊고 자녀에게 직접 연락한다',
        result:    'safe',
        feedback:  'SINKHOLE 3 탈출 성공!',
        education: '감정적으로 흥분될수록 잠깐 멈추는 것이 최고의 방어입니다. 30초만 직접 확인하세요.',
        sfx:       null,
      },
    },
  },

  /* ── SINKHOLE 4 — 🌶️🌶️🌶️🌶️ 지옥맛: 다중 결합형 ── */
  {
    id: 'sinkhole-4',
    spiceLevel: 4,
    spiceLabel: '🌶️🌶️🌶️🌶️ 지옥맛',
    spiceKey:   'hell',
    spiceColor: '#8B0000',
    spiceBg:    'rgba(139,0,0,0.15)',
    cardBg:     '#120000',
    audioSrc:   'assets/audio/stage4_voice.mp3',
    keywords: [
      { label: '발신자', value: '검사 + 은행 + 자녀 동시' },
      { label: '내용',   value: '범죄 연루 + 자녀 인질' },
      { label: '요구',   value: '현금 인출 + 직접 전달' },
    ],
    situation: '검사라는 사람이 내가 범죄 조직 자금 세탁에 연루됐다고 합니다. 그리고 자녀라고 주장하는 사람이 울면서 전화를 받습니다. 현금을 인출해 전달 요원에게 건네지 않으면 둘 다 구속된다고 합니다.',
    choices: {
      A: {
        label:    '싱크홀에 빠진다 — 어쩔 수 없이 현금을 인출해 전달한다',
        result:   'sink',
        feedback: 'SINKHOLE 4 (지옥맛)에 빠졌습니다. 최강의 싱크홀이었습니다.',
        damage:   '다중 결합형은 심리적 압박을 극대화해 판단력을 완전히 마비시키는 최고 난도 수법입니다.',
        response: '현금을 직접 전달받는 기관은 세상에 없습니다. 어떤 상황에서도 112에 즉시 신고하세요.',
        sfx:      null,
      },
      B: {
        label:     '싱크홀을 피한다 — 현금 직접 전달은 없다고 판단, 112 신고',
        result:    'safe',
        feedback:  'SINKHOLE 4 탈출 성공! 완벽합니다!',
        education: "'현금 직접 전달 = 무조건 사기' 이 한 문장만 기억하면 지옥맛도 피할 수 있습니다.",
        sfx:       null,
      },
    },
  },
];

const RESULT_MESSAGES = {
  perfect: {
    emoji: '🏆',
    title: '완벽한 내성!',
    text:  '지옥맛 싱크홀까지 모두 탈출했습니다. 보이스피싱 면역자! 주변에 알려주세요.',
  },
  high: {
    emoji: '💪',
    title: '상당한 내성!',
    text:  '일부 싱크홀은 피했지만 아직 취약한 구간이 있습니다.',
  },
  low: {
    emoji: '⚠️',
    title: '내성 부족!',
    text:  '대부분의 싱크홀에 빠졌습니다. 교육 내용을 반드시 확인하세요.',
  },
  zero: {
    emoji: '🆘',
    title: '내성 제로!',
    text:  '모든 싱크홀에 빠졌습니다. 지금 바로 가족과 공유해주세요.',
  },
};

window.STAGES = STAGES;
window.RESULT_MESSAGES = RESULT_MESSAGES;
