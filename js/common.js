/* =============================================
   common.js — 유틸리티, 상수, Mock 데이터
   ============================================= */
'use strict';

/* --- 상수 --- */
const APP_NAME = '하천·계곡 불법시설 정비 지원시스템';

const FACILITY_TYPES = {
  building: '무허가 건축물',
  occupation: '불법 점용 시설',
  waste: '폐기물 투기',
  camping: '불법 야영 시설',
  sign: '불법 광고물',
  structure: '임시 구조물',
};

/* --- 지역별 지도 바운드 (남서, 북동 좌표) --- */
const REGION_BOUNDS = {
  seoul: [[37.42, 126.76], [37.70, 127.18]],
  busan: [[35.04, 128.74], [35.40, 129.29]],
  daegu: [[35.70, 128.44], [36.00, 128.83]],
  incheon: [[37.24, 126.30], [37.75, 126.84]],
  gwangju: [[35.05, 126.68], [35.29, 127.00]],
  daejeon: [[36.20, 127.24], [36.55, 127.57]],
  ulsan: [[35.43, 129.09], [35.72, 129.48]],
  sejong: [[36.40, 127.19], [36.65, 127.45]],
  gyeonggi: [[36.95, 126.40], [38.30, 127.80]],
  gangwon: [[37.07, 127.08], [38.62, 129.39]],
  chungbuk: [[36.14, 127.36], [37.22, 128.52]],
  chungnam: [[35.90, 126.00], [37.00, 127.48]],
  jeonbuk: [[35.40, 126.36], [36.10, 127.88]],
  jeonnam: [[33.96, 125.58], [35.44, 127.85]],
  gyeongbuk: [[35.52, 128.00], [37.22, 129.62]],
  gyeongnam: [[34.62, 127.71], [35.72, 129.29]],
  jeju: [[33.11, 126.15], [33.59, 126.98]],
};

const REGIONS = {
  seoul: '서울특별시',
  busan: '부산광역시',
  daegu: '대구광역시',
  incheon: '인천광역시',
  gwangju: '광주광역시',
  daejeon: '대전광역시',
  ulsan: '울산광역시',
  sejong: '세종특별자치시',
  gyeonggi: '경기도',
  gangwon: '강원도',
  chungbuk: '충청북도',
  chungnam: '충청남도',
  jeonbuk: '전라북도',
  jeonnam: '전라남도',
  gyeongbuk: '경상북도',
  gyeongnam: '경상남도',
  jeju: '제주특별자치도',
};

const STATUS = {
  unresolved: '미정비',
  inprogress: '정비중',
  completed: '정비완료',
};

const STATUS_BADGE = {
  unresolved: 'badge-danger',
  inprogress: 'badge-warning',
  completed: 'badge-success',
};

const STATUS_COLOR = {
  unresolved: '#d32f2f',
  inprogress: '#e65100',
  completed: '#2e7d32',
};

/* --- Mock 사용자 계정 --- */
const MOCK_USERS = [
  { id: 'admin', pw: 'admin123', name: '홍길동', org: 'LX 시스템 관리팀', role: 'admin', roleLabel: '관리자' },
  { id: 'field', pw: 'field123', name: '이현장', org: '경기도 하천관리팀', role: 'field', roleLabel: '현장요원' },
  { id: 'officer', pw: 'officer1', name: '박담당', org: '강원도 환경부서', role: 'officer', roleLabel: '지자체 담당자' },
];

/* --- Mock 시설 데이터 (30건) — category: 'crossing'(걸침) | 'inside'(구역내) --- */
const MOCK_FACILITIES = [
  { id: 'F001', name: '북한강 불법 캠핑장', region: 'gyeonggi', regionLabel: '경기도', address: '경기도 가평군 청평면 북한강로 123', type: 'camping', typeLabel: '불법 야영 시설', area: 320, status: 'unresolved', category: 'crossing', reportDate: '2025-03-15', assignee: '이현장', lat: 37.7241, lng: 127.4876, photos: 3, desc: '강변에 무단 설치된 대형 캠핑장. 약 20개 텐트 자리 조성.' },
  { id: 'F002', name: '한강 점용 매점', region: 'seoul', regionLabel: '서울특별시', address: '서울특별시 광진구 강변북로 200', type: 'occupation', typeLabel: '불법 점용 시설', area: 85, status: 'inprogress', category: 'inside', reportDate: '2025-02-20', assignee: '박담당', lat: 37.5406, lng: 127.0727, photos: 2, desc: '허가 없이 강변 부지에 설치된 이동식 매점.' },
  { id: 'F003', name: '낙동강 폐기물', region: 'gyeongnam', regionLabel: '경상남도', address: '경상남도 창녕군 이방면 낙동강로 55', type: 'waste', typeLabel: '폐기물 투기', area: 50, status: 'completed', category: 'inside', reportDate: '2025-01-10', assignee: '김관리', lat: 35.5384, lng: 128.4284, photos: 1, desc: '생활쓰레기 및 건축폐자재 대량 투기.' },
  { id: 'F004', name: '섬진강 무허가 창고', region: 'jeonnam', regionLabel: '전라남도', address: '전라남도 곡성군 고달면 섬진강대로 88', type: 'building', typeLabel: '무허가 건축물', area: 150, status: 'unresolved', category: 'crossing', reportDate: '2025-04-01', assignee: '이현장', lat: 35.2617, lng: 127.4200, photos: 4, desc: '하천 경계 안쪽에 축조된 무허가 창고 2동.' },
  { id: 'F005', name: '금강 광고 현수막', region: 'chungnam', regionLabel: '충청남도', address: '충청남도 부여군 백마강로 33', type: 'sign', typeLabel: '불법 광고물', area: 10, status: 'completed', category: 'crossing', reportDate: '2025-01-25', assignee: '박담당', lat: 36.2757, lng: 126.9100, photos: 1, desc: '하천변 조망권 침해 대형 현수막 5개.' },
  { id: 'F006', name: '한탄강 임시 구조물', region: 'gangwon', regionLabel: '강원도', address: '강원도 철원군 동송읍 한탄강로 12', type: 'structure', typeLabel: '임시 구조물', area: 60, status: 'inprogress', category: 'inside', reportDate: '2025-03-05', assignee: '이현장', lat: 38.1231, lng: 127.1800, photos: 2, desc: '급류 체험업체가 무단 설치한 안전시설물.' },
  { id: 'F007', name: '영산강 불법 건물', region: 'jeonnam', regionLabel: '전라남도', address: '전라남도 나주시 영산강로 200', type: 'building', typeLabel: '무허가 건축물', area: 200, status: 'unresolved', category: 'inside', reportDate: '2025-04-10', assignee: '김관리', lat: 35.0160, lng: 126.7100, photos: 3, desc: '하천 보호 구역 내 2층 규모 무허가 건물.' },
  { id: 'F008', name: '대청호 야영 시설', region: 'chungbuk', regionLabel: '충청북도', address: '충청북도 청주시 상당구 문의면 호수로 50', type: 'camping', typeLabel: '불법 야영 시설', area: 180, status: 'completed', category: 'crossing', reportDate: '2024-12-01', assignee: '박담당', lat: 36.4600, lng: 127.4700, photos: 2, desc: '수변구역 내 무단 야영장 운영.' },
  { id: 'F009', name: '형산강 폐차 투기', region: 'gyeongbuk', regionLabel: '경상북도', address: '경상북도 경주시 형산강로 77', type: 'waste', typeLabel: '폐기물 투기', area: 40, status: 'unresolved', category: 'inside', reportDate: '2025-03-28', assignee: '이현장', lat: 35.8513, lng: 129.2100, photos: 2, desc: '폐차 2대 및 고철 다량 하천 근처 투기.' },
  { id: 'F010', name: '안양천 점용 주차장', region: 'gyeonggi', regionLabel: '경기도', address: '경기도 안양시 동안구 안양천로 100', type: 'occupation', typeLabel: '불법 점용 시설', area: 300, status: 'inprogress', category: 'crossing', reportDate: '2025-02-14', assignee: '박담당', lat: 37.3939, lng: 126.9410, photos: 3, desc: '천변 녹지를 무단으로 주차장으로 사용.' },
  { id: 'F011', name: '청계천 광고 간판', region: 'seoul', regionLabel: '서울특별시', address: '서울특별시 종로구 청계천로 50', type: 'sign', typeLabel: '불법 광고물', area: 8, status: 'completed', category: 'crossing', reportDate: '2025-01-05', assignee: '김관리', lat: 37.5694, lng: 126.9936, photos: 1, desc: '하천변 펜스에 부착된 불법 광고 간판 12개.' },
  { id: 'F012', name: '수인천 구조물', region: 'incheon', regionLabel: '인천광역시', address: '인천광역시 남동구 수인로 88', type: 'structure', typeLabel: '임시 구조물', area: 30, status: 'unresolved', category: 'inside', reportDate: '2025-04-15', assignee: '이현장', lat: 37.4220, lng: 126.7400, photos: 1, desc: '낚시터 무단 운영을 위한 임시 데크.' },
  { id: 'F013', name: '태화강 창고 2동', region: 'ulsan', regionLabel: '울산광역시', address: '울산광역시 중구 태화강변길 20', type: 'building', typeLabel: '무허가 건축물', area: 120, status: 'inprogress', category: 'inside', reportDate: '2025-02-28', assignee: '박담당', lat: 35.5550, lng: 129.3140, photos: 3, desc: '하천 부지 내 컨테이너 창고 불법 설치.' },
  { id: 'F014', name: '갑천 야영 캠프', region: 'daejeon', regionLabel: '대전광역시', address: '대전광역시 유성구 갑천로 55', type: 'camping', typeLabel: '불법 야영 시설', area: 220, status: 'unresolved', category: 'crossing', reportDate: '2025-03-20', assignee: '김관리', lat: 36.3740, lng: 127.3450, photos: 2, desc: '상습적 불법 야영으로 화재 위험 높음.' },
  { id: 'F015', name: '황강 폐수 투기', region: 'gyeongnam', regionLabel: '경상남도', address: '경상남도 합천군 황강로 30', type: 'waste', typeLabel: '폐기물 투기', area: 25, status: 'completed', category: 'inside', reportDate: '2024-11-15', assignee: '이현장', lat: 35.5700, lng: 128.1660, photos: 1, desc: '소규모 공장 폐수 하천 직방류 적발.' },
  { id: 'F016', name: '공릉천 점용 시설', region: 'gyeonggi', regionLabel: '경기도', address: '경기도 파주시 탄현면 공릉천로 44', type: 'occupation', typeLabel: '불법 점용 시설', area: 75, status: 'inprogress', category: 'crossing', reportDate: '2025-01-30', assignee: '박담당', lat: 37.8150, lng: 126.7590, photos: 2, desc: '농업 관개 목적 무단 취수시설.' },
  { id: 'F017', name: '봉래천 불법 간판', region: 'busan', regionLabel: '부산광역시', address: '부산광역시 동구 봉래천로 18', type: 'sign', typeLabel: '불법 광고물', area: 5, status: 'completed', category: 'crossing', reportDate: '2025-01-08', assignee: '김관리', lat: 35.1100, lng: 129.0440, photos: 1, desc: '하천 교량 난간 불법 현수막.' },
  { id: 'F018', name: '왕숙천 임시 창고', region: 'gyeonggi', regionLabel: '경기도', address: '경기도 남양주시 와부읍 왕숙천로 60', type: 'structure', typeLabel: '임시 구조물', area: 95, status: 'unresolved', category: 'inside', reportDate: '2025-04-02', assignee: '이현장', lat: 37.5960, lng: 127.1720, photos: 3, desc: '이사짐 보관 목적 불법 컨테이너 3개.' },
  { id: 'F019', name: '미호천 무허가 건물', region: 'chungbuk', regionLabel: '충청북도', address: '충청북도 청주시 흥덕구 미호천로 90', type: 'building', typeLabel: '무허가 건축물', area: 180, status: 'inprogress', category: 'inside', reportDate: '2025-02-10', assignee: '박담당', lat: 36.6410, lng: 127.3780, photos: 4, desc: '하천 점용 허가 없이 신축된 단층 건물.' },
  { id: 'F020', name: '탐진강 야영장', region: 'jeonnam', regionLabel: '전라남도', address: '전라남도 장흥군 장흥읍 탐진강로 15', type: 'camping', typeLabel: '불법 야영 시설', area: 150, status: 'completed', category: 'crossing', reportDate: '2024-10-22', assignee: '김관리', lat: 34.6800, lng: 126.9080, photos: 2, desc: '수질 오염 유발 불법 캠핑장 8개 텐트.' },
  { id: 'F021', name: '진위천 폐기물 집적', region: 'gyeonggi', regionLabel: '경기도', address: '경기도 평택시 진위면 진위천로 25', type: 'waste', typeLabel: '폐기물 투기', area: 80, status: 'unresolved', category: 'inside', reportDate: '2025-03-31', assignee: '이현장', lat: 37.0990, lng: 127.0780, photos: 2, desc: '건설 폐자재 대량 투기.' },
  { id: 'F022', name: '한강 마포 점용', region: 'seoul', regionLabel: '서울특별시', address: '서울특별시 마포구 강변북로 300', type: 'occupation', typeLabel: '불법 점용 시설', area: 60, status: 'inprogress', category: 'inside', reportDate: '2025-03-01', assignee: '박담당', lat: 37.5416, lng: 126.9010, photos: 2, desc: '공공자전거 보관시설 무단 설치.' },
  { id: 'F023', name: '섬진강 캠핑', region: 'jeonbuk', regionLabel: '전라북도', address: '전라북도 남원시 금지면 섬진강대로 5', type: 'camping', typeLabel: '불법 야영 시설', area: 260, status: 'unresolved', category: 'crossing', reportDate: '2025-04-05', assignee: '김관리', lat: 35.4320, lng: 127.4600, photos: 3, desc: '하천 보호구역 대형 불법 캠핑장.' },
  { id: 'F024', name: '낙동강 광고물', region: 'gyeongbuk', regionLabel: '경상북도', address: '경상북도 구미시 낙동강로 100', type: 'sign', typeLabel: '불법 광고물', area: 12, status: 'completed', category: 'crossing', reportDate: '2024-12-20', assignee: '이현장', lat: 36.1200, lng: 128.3440, photos: 1, desc: '현수막 및 판넬 광고물 8개 일괄 철거.' },
  { id: 'F025', name: '남강 구조물', region: 'gyeongnam', regionLabel: '경상남도', address: '경상남도 진주시 남강로 44', type: 'structure', typeLabel: '임시 구조물', area: 40, status: 'unresolved', category: 'inside', reportDate: '2025-04-08', assignee: '박담당', lat: 35.1900, lng: 128.0800, photos: 1, desc: '수상 레저 업체 무단 부잔교 설치.' },
  { id: 'F026', name: '금호강 창고', region: 'daegu', regionLabel: '대구광역시', address: '대구광역시 북구 금호강로 70', type: 'building', typeLabel: '무허가 건축물', area: 95, status: 'inprogress', category: 'crossing', reportDate: '2025-02-05', assignee: '김관리', lat: 35.9050, lng: 128.6030, photos: 2, desc: '하천 부지 내 농기구 보관 창고 무허가 신축.' },
  { id: 'F027', name: '안동호 폐기물', region: 'gyeongbuk', regionLabel: '경상북도', address: '경상북도 안동시 호수로 22', type: 'waste', typeLabel: '폐기물 투기', area: 35, status: 'unresolved', category: 'inside', reportDate: '2025-03-25', assignee: '이현장', lat: 36.6000, lng: 128.7500, photos: 2, desc: '유해 화학물질 포함 드럼통 5개 불법 투기.' },
  { id: 'F028', name: '만경강 점용 시설', region: 'jeonbuk', regionLabel: '전라북도', address: '전라북도 김제시 만경강로 88', type: 'occupation', typeLabel: '불법 점용 시설', area: 100, status: 'completed', category: 'inside', reportDate: '2024-11-01', assignee: '박담당', lat: 35.8650, lng: 126.9800, photos: 1, desc: '하천 구역 내 농지 무단 조성.' },
  { id: 'F029', name: '서낙동강 야영', region: 'busan', regionLabel: '부산광역시', address: '부산광역시 강서구 서낙동강로 15', type: 'camping', typeLabel: '불법 야영 시설', area: 130, status: 'inprogress', category: 'crossing', reportDate: '2025-01-20', assignee: '김관리', lat: 35.1530, lng: 128.8800, photos: 2, desc: '상수원 보호 구역 인근 불법 야영.' },
  { id: 'F030', name: '제주 천미천 구조물', region: 'jeju', regionLabel: '제주특별자치도', address: '제주특별자치도 서귀포시 천미로 33', type: 'structure', typeLabel: '임시 구조물', area: 45, status: 'unresolved', category: 'inside', reportDate: '2025-04-12', assignee: '이현장', lat: 33.3170, lng: 126.7500, photos: 1, desc: '계곡 내 불법 물놀이 시설 설치.' },
];

/* --- Mock 정비 이력 데이터 --- */
const MOCK_HISTORIES = {
  F001: [
    { date: '2025-03-15', type: '신고접수', status: 'unresolved', actor: '박민준', desc: '주민 신고 접수. 현장 사진 3매 첨부.' },
    { date: '2025-03-18', type: '현장조사', status: 'inprogress', actor: '이현장', desc: '담당자 현장 방문 및 실측 완료. 면적 320㎡ 확인.' },
  ],
  F002: [
    { date: '2025-02-20', type: '신고접수', status: 'unresolved', actor: '시스템', desc: '온라인 민원 신고 접수.' },
    { date: '2025-02-25', type: '현장조사', status: 'inprogress', actor: '박담당', desc: '현장 확인 및 시정명령 발부.' },
    { date: '2025-03-10', type: '정비착수', status: 'inprogress', actor: '박담당', desc: '자진 이전 협의 진행 중.' },
  ],
  F003: [
    { date: '2025-01-10', type: '신고접수', status: 'unresolved', actor: '주민신고', desc: '낚시객 민원 신고.' },
    { date: '2025-01-15', type: '현장조사', status: 'inprogress', actor: '김관리', desc: '폐기물 종류 및 양 조사 완료.' },
    { date: '2025-01-22', type: '수거완료', status: 'completed', actor: '수거업체', desc: '폐기물 전량 수거 및 처리 완료.' },
    { date: '2025-01-25', type: '정비완료', status: 'completed', actor: '김관리', desc: '원상복구 확인 완료. 종결 처리.' },
  ],
};

/* --- Storage 래퍼 --- */
const Storage = {
  get(key) {
    try { return JSON.parse(sessionStorage.getItem(key)); } catch { return null; }
  },
  set(key, value) {
    sessionStorage.setItem(key, JSON.stringify(value));
  },
  remove(key) {
    sessionStorage.removeItem(key);
  }
};

/* --- 유틸리티 --- */
const Utils = {
  /** 날짜 포맷 YYYY-MM-DD → YYYY. MM. DD */
  formatDate(dateStr) {
    if (!dateStr) return '-';
    const [y, m, d] = dateStr.split('-');
    return `${y}. ${m}. ${d}`;
  },
  /** 상태 코드 → 한글 */
  statusLabel(code) { return STATUS[code] || code; },
  /** 상태 코드 → 뱃지 클래스 */
  statusBadge(code) { return STATUS_BADGE[code] || 'badge-neutral'; },
  /** 상태 코드 → 색상 */
  statusColor(code) { return STATUS_COLOR[code] || '#777'; },
  /** 시설 유형 코드 → 한글 */
  typeLabel(code) { return FACILITY_TYPES[code] || code; },
  /** 지역 코드 → 한글 */
  regionLabel(code) { return REGIONS[code] || code; },
  /** 간단 ID → 상세 페이지 URL */
  detailUrl(id) { return `facility-detail.html?id=${id}`; },
  /** 현재 페이지 URL에서 파라미터 추출 */
  getParam(name) {
    return new URLSearchParams(window.location.search).get(name);
  },
  /** 면적 포맷 */
  formatArea(n) { return `${n.toLocaleString()}㎡`; },
  /** 총계 계산 */
  countByStatus(facilities, status) {
    return facilities.filter(f => f.status === status).length;
  },
};

/* --- 공통 헤더/푸터 세팅 (로그인 후 페이지) --- */
function initAppPage() {
  const user = Auth.requireLogin();
  // 헤더 사용자 이름
  const nameEl = document.querySelector('.user-name');
  if (nameEl) nameEl.textContent = user.name;
  const avatarEl = document.querySelector('.user-avatar');
  if (avatarEl) avatarEl.textContent = user.name[0];
  // 로그아웃
  const logoutBtn = document.getElementById('btn-logout');
  if (logoutBtn) logoutBtn.addEventListener('click', () => Auth.logout());
  // 사이드바 현재 메뉴 활성화
  const path = location.pathname.split('/').pop();
  document.querySelectorAll('.sidebar-link').forEach(el => {
    const href = el.getAttribute('href');
    if (href && href === path) el.classList.add('active');
  });
  return user;
}
