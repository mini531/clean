const pptxgen = require("pptxgenjs");
const path = require("path");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "UI Review Team";
pres.title = "Land-XI 프로토타입 UI 구성 검토 의견서";

// ── 테마 색상 (네이비 + 라이트 그레이) ──
const C = {
  navy: "3D4F6F",
  navyDark: "2C3E5A",
  navyDeep: "1E2D42",
  text: "2D3748",
  sub: "5A6577",
  muted: "8E99A4",
  bg: "EDF1F5",
  card: "FFFFFF",
  border: "D1D9E0",
  white: "FFFFFF",
  warn: "8B4513",
  ok: "2E5A3E",
};
const FONT = "맑은 고딕";
const IMG = path.resolve("assets/img/report") + "/";

// ── 이미지 비율 계산 ──
const DIMS = {
  "admin_dashboard.png": [1774, 1552],
  "bench_felt_interface.png": [1500, 853],
  "bench_flypix.png": [1380, 705],
  "bench_roboflow_detail.png": [1600, 856],
  "local_dashboard.png": [1774, 1552],
  "lx_dashboard.png": [1774, 1552],
  "map_analysis.png": [1774, 1552],
  "map_layer.png": [1774, 1552],
};

function addImg(slide, file, x, y, maxW, maxH) {
  const d = DIMS[file] || [16, 9];
  const r = d[0] / d[1];
  let w = maxW, h = w / r;
  if (h > maxH) { h = maxH; w = h * r; }
  slide.addImage({ path: IMG + file, x, y, w, h });
}

// ── 공통 요소 ──
function addNavyBar(slide) {
  // 좌측 네이비 세로 바
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.08, h: 5.625, fill: { color: C.navy } });
}

function addCircleDecor(slide, x, y, size) {
  slide.addShape(pres.shapes.OVAL, { x, y, w: size, h: size, fill: { color: C.navy, transparency: 90 } });
}

function addSlideTitle(slide, title, subtitle) {
  addNavyBar(slide);
  slide.addText(title, { x: 0.5, y: 0.3, w: 9, h: 0.5, fontSize: 18, fontFace: FONT, color: C.navyDark, bold: true, margin: 0, italic: true });
  if (subtitle) {
    slide.addText(subtitle, { x: 0.5, y: 0.8, w: 9, h: 0.3, fontSize: 10, fontFace: FONT, color: C.muted, margin: 0 });
  }
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.1, w: 9.0, h: 0.01, fill: { color: C.border } });
}

// ════════════════════════════════════════
// Slide 1: 타이틀 (네이비 배경 + 큰 원)
// ════════════════════════════════════════
let s1 = pres.addSlide();
s1.background = { color: C.bg };
// 좌측 네이비 영역
s1.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 4.5, h: 5.625, fill: { color: C.navyDeep } });
// 큰 장식 원
s1.addShape(pres.shapes.OVAL, { x: 2.8, y: 1.2, w: 3.2, h: 3.2, fill: { color: C.navy } });

s1.addText("Land-XI\n프로토타입", {
  x: 0.6, y: 1.5, w: 3.2, h: 1.6,
  fontSize: 30, fontFace: FONT, color: C.white, bold: true, lineSpacingMultiple: 1.1,
});
s1.addText("UI 구성 검토\n의견서", {
  x: 0.6, y: 3.2, w: 3.2, h: 1.0,
  fontSize: 22, fontFace: FONT, color: "B0BEC5",
});

s1.addText("UX 구조 분석 및 설계 방향 제안", {
  x: 5.2, y: 2.0, w: 4.2, h: 0.4,
  fontSize: 14, fontFace: FONT, color: C.text, bold: true,
});
s1.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 2.5, w: 1.5, h: 0.02, fill: { color: C.navy } });
s1.addText("2026.04", {
  x: 5.2, y: 2.7, w: 4.2, h: 0.3,
  fontSize: 11, fontFace: FONT, color: C.muted,
});

// ════════════════════════════════════════
// Slide 2: UI 트렌드 (4개 원형 카드)
// ════════════════════════════════════════
let s2 = pres.addSlide();
s2.background = { color: C.bg };
addSlideTitle(s2, "AI 공간정보 플랫폼 UI 트렌드");

const trends = [
  ["지도 퍼스트", "대시보드가 아닌 지도가\n기본 진입점"],
  ["레이어 상시 노출", "레이어 패널은 항상\n접근 가능한 구조"],
  ["프로그레시브\n디스클로저", "사용자 행동에 따라\n점진적으로 정보 표출"],
  ["역할 기반 UI", "분석가·관리자·열람자별\n메뉴와 기능 분리"],
];
trends.forEach((t, i) => {
  const x = 0.7 + i * 2.35;
  const cy = 2.4;
  // 네이비 원
  s2.addShape(pres.shapes.OVAL, { x: x + 0.35, y: cy, w: 1.5, h: 1.5, fill: { color: C.navy } });
  s2.addText(t[0], { x: x + 0.35, y: cy + 0.2, w: 1.5, h: 1.1, fontSize: 11, fontFace: FONT, color: C.white, bold: true, align: "center", valign: "middle" });
  // 설명
  s2.addText(t[1], { x: x, y: 4.1, w: 2.2, h: 0.8, fontSize: 10, fontFace: FONT, color: C.sub, align: "center" });
});

// ════════════════════════════════════════
// Slide 3: 벤치마킹 - FlyPix AI
// ════════════════════════════════════════
let s3 = pres.addSlide();
s3.background = { color: C.bg };
addSlideTitle(s3, "벤치마킹 — FlyPix AI", "위성/드론 영상 AI 분석 플랫폼");

addImg(s3, "bench_flypix.png", 0.5, 1.3, 5.5, 3.0);

s3.addShape(pres.shapes.RECTANGLE, { x: 6.3, y: 1.3, w: 3.3, h: 3.0, fill: { color: C.card } });
s3.addShape(pres.shapes.RECTANGLE, { x: 6.3, y: 1.3, w: 0.06, h: 3.0, fill: { color: C.navy } });
s3.addText([
  { text: "지도가 기본 화면\n", options: { bold: true, breakLine: true } },
  { text: "\n", options: { fontSize: 4, breakLine: true } },
  { text: "좌측에 AI 탐지 결과 상시 표시\n", options: { breakLine: true } },
  { text: "\n", options: { fontSize: 4, breakLine: true } },
  { text: "상단 바 최소화\n(프로젝트명 + 모드 전환만)\n", options: { breakLine: true } },
  { text: "\n", options: { fontSize: 4, breakLine: true } },
  { text: "영상 업로드 → 모델 선택 → 분석\n단일 워크스페이스 내 완결", options: {} },
], { x: 6.6, y: 1.5, w: 2.8, h: 2.6, fontSize: 10, fontFace: FONT, color: C.text, valign: "top" });

s3.addText("flypix.ai/platform", { x: 0.5, y: 5.1, w: 4, h: 0.2, fontSize: 8, fontFace: FONT, color: C.muted });

// ════════════════════════════════════════
// Slide 4: 벤치마킹 - Roboflow
// ════════════════════════════════════════
let s4 = pres.addSlide();
s4.background = { color: C.bg };
addSlideTitle(s4, "벤치마킹 — Roboflow", "컴퓨터 비전 모델 관리·배포 플랫폼");

addImg(s4, "bench_roboflow_detail.png", 0.5, 1.3, 5.5, 3.0);

s4.addShape(pres.shapes.RECTANGLE, { x: 6.3, y: 1.3, w: 3.3, h: 3.0, fill: { color: C.card } });
s4.addShape(pres.shapes.RECTANGLE, { x: 6.3, y: 1.3, w: 0.06, h: 3.0, fill: { color: C.navy } });
s4.addText([
  { text: "KPI 카드 제공\n", options: { bold: true, breakLine: true } },
  { text: "요청 수, 평균 신뢰도, 추론 시간\n", options: { breakLine: true } },
  { text: "\n", options: { fontSize: 4, breakLine: true } },
  { text: "상단 탭 4개만 배치\n", options: { bold: true, breakLine: true } },
  { text: "Projects / Workflows /\nMonitoring / Devices\n", options: { breakLine: true } },
  { text: "\n", options: { fontSize: 4, breakLine: true } },
  { text: "전체 파이프라인을\n하나의 플랫폼에서 관리", options: { bold: true } },
], { x: 6.6, y: 1.5, w: 2.8, h: 2.6, fontSize: 10, fontFace: FONT, color: C.text, valign: "top" });

// ════════════════════════════════════════
// Slide 5: 벤치마킹 - Felt
// ════════════════════════════════════════
let s5 = pres.addSlide();
s5.background = { color: C.bg };
addSlideTitle(s5, "벤치마킹 — Felt", "UI 구조 참고 (지도 기반 협업 플랫폼)");

addImg(s5, "bench_felt_interface.png", 0.5, 1.3, 5.5, 3.2);

s5.addShape(pres.shapes.RECTANGLE, { x: 6.3, y: 1.3, w: 3.3, h: 3.2, fill: { color: C.card } });
s5.addShape(pres.shapes.RECTANGLE, { x: 6.3, y: 1.3, w: 0.06, h: 3.2, fill: { color: C.navy } });
s5.addText([
  { text: "레이어(Legend)\n좌측 상시 노출\n", options: { bold: true, breakLine: true } },
  { text: "\n", options: { fontSize: 4, breakLine: true } },
  { text: "상세 패널은\n클릭 시에만 우측 표시\n", options: { breakLine: true } },
  { text: "\n", options: { fontSize: 4, breakLine: true } },
  { text: "탭 전환 없이\n여러 패널 동시 참조 가능\n", options: { breakLine: true } },
  { text: "\n", options: { fontSize: 4, breakLine: true } },
  { text: "Toolbar 상단 5개 이내", options: { bold: true } },
], { x: 6.6, y: 1.5, w: 2.8, h: 2.8, fontSize: 10, fontFace: FONT, color: C.text, valign: "top" });

// ════════════════════════════════════════
// Slide 6: 비교표 (네이비 헤더 테이블)
// ════════════════════════════════════════
let s6 = pres.addSlide();
s6.background = { color: C.bg };
addSlideTitle(s6, "벤치마킹 비교");

const hd = { fill: { color: C.navyDark }, color: C.white, bold: true, fontSize: 10, fontFace: FONT, align: "center", valign: "middle" };
const ce = { fill: { color: C.card }, fontSize: 10, fontFace: FONT, color: C.text, align: "center", valign: "middle" };
const cw = { fill: { color: C.card }, fontSize: 10, fontFace: FONT, color: C.warn, bold: true, align: "center", valign: "middle" };
const cg = { fill: { color: C.card }, fontSize: 10, fontFace: FONT, color: C.ok, bold: true, align: "center", valign: "middle" };

s6.addTable([
  [{ text: "항목", options: hd }, { text: "FlyPix AI", options: hd }, { text: "Roboflow", options: hd }, { text: "Felt", options: hd }, { text: "Land-XI", options: hd }],
  [{ text: "서비스 성격", options: ce }, { text: "영상 AI 분석", options: ce }, { text: "모델 관리·배포", options: ce }, { text: "지도 협업", options: ce }, { text: "AI 분석 + 지도", options: ce }],
  [{ text: "기본 진입", options: ce }, { text: "지도", options: ce }, { text: "프로젝트 목록", options: ce }, { text: "지도", options: ce }, { text: "대시보드", options: cw }],
  [{ text: "탑 메뉴 수", options: ce }, { text: "3~4개", options: ce }, { text: "4개", options: ce }, { text: "5개", options: ce }, { text: "9개", options: cw }],
  [{ text: "지도 레이어", options: ce }, { text: "좌측 상시", options: ce }, { text: "N/A", options: ce }, { text: "좌측 상시", options: ce }, { text: "탭 전환", options: cw }],
  [{ text: "권한 분기", options: ce }, { text: "역할 기반", options: ce }, { text: "팀/개인", options: ce }, { text: "편집/뷰어", options: ce }, { text: "3단계", options: cg }],
], { x: 0.5, y: 1.3, w: 9.0, colW: [1.4, 1.9, 1.9, 1.9, 1.9], border: { pt: 0.5, color: C.border }, rowH: [0.4, 0.4, 0.4, 0.4, 0.4, 0.4] });

// 하단 시사점 (네이비 배경)
s6.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 4.2, w: 9.0, h: 0.9, fill: { color: C.navyDeep } });
s6.addText("AI 분석 플랫폼들은 탑 메뉴 4~5개, 레이어 상시 노출이 표준\nLand-XI의 권한별 3단계 UI 분기는 벤치마킹 대비 강점", {
  x: 0.8, y: 4.3, w: 8.4, h: 0.7, fontSize: 11, fontFace: FONT, color: "B0BEC5", margin: 0,
});

// ════════════════════════════════════════
// Slide 7: 탑 네비게이션 (반반 레이아웃)
// ════════════════════════════════════════
let s7 = pres.addSlide();
s7.background = { color: C.bg };
addSlideTitle(s7, "탑 네비게이션 구조 분석");

addImg(s7, "admin_dashboard.png", 0.5, 1.3, 4.0, 3.5);

// 우측 분석
s7.addShape(pres.shapes.RECTANGLE, { x: 5.0, y: 1.3, w: 4.6, h: 1.6, fill: { color: C.card } });
s7.addShape(pres.shapes.RECTANGLE, { x: 5.0, y: 1.3, w: 0.06, h: 1.6, fill: { color: C.navy } });

s7.addTable([
  [{ text: "메뉴 수", options: hd }, { text: "필요 너비", options: hd }, { text: "최소 해상도", options: hd }],
  [{ text: "5개", options: ce }, { text: "~480px", options: ce }, { text: "태블릿 이상", options: ce }],
  [{ text: "7개", options: ce }, { text: "~672px", options: ce }, { text: "1024px+", options: ce }],
  [{ text: "9개", options: { ...ce, bold: true } }, { text: "~864px", options: { ...ce, bold: true } }, { text: "1440px+ 필수", options: { ...ce, bold: true } }],
], { x: 5.2, y: 1.4, w: 4.2, colW: [1.2, 1.4, 1.6], border: { pt: 0.5, color: C.border }, rowH: [0.3, 0.3, 0.3, 0.3] });

// 하단 의견
s7.addShape(pres.shapes.RECTANGLE, { x: 5.0, y: 3.1, w: 4.6, h: 1.8, fill: { color: C.card } });
s7.addShape(pres.shapes.RECTANGLE, { x: 5.0, y: 3.1, w: 0.06, h: 1.8, fill: { color: C.warn } });
s7.addText([
  { text: "우려\n", options: { bold: true } },
  { text: "9개 수평 나열 시 1280px 미만에서 잘림\nNNG 기준 권장 메뉴 수: 5~7개\n\n" },
  { text: "대안\n", options: { bold: true } },
  { text: "핵심(대시보드·지도·보고서)과\n관리(영상·학습·모델) 2단 그룹핑" },
], { x: 5.3, y: 3.2, w: 4.1, h: 1.6, fontSize: 10, fontFace: FONT, color: C.text, margin: 0 });

// ════════════════════════════════════════
// Slide 8: 사이드바 탭
// ════════════════════════════════════════
let s8 = pres.addSlide();
s8.background = { color: C.bg };
addSlideTitle(s8, "사이드바 탭 구조 분석");

addImg(s8, "map_layer.png", 0.5, 1.25, 3.0, 2.6);
addImg(s8, "map_analysis.png", 3.7, 1.25, 3.0, 2.6);
s8.addText("레이어 탭", { x: 0.5, y: 3.95, w: 3.0, h: 0.2, fontSize: 9, fontFace: FONT, color: C.muted, align: "center" });
s8.addText("분석 탭 (레이어 사라짐)", { x: 3.7, y: 3.95, w: 3.0, h: 0.2, fontSize: 9, fontFace: FONT, color: C.muted, align: "center" });

// 우측 의견
s8.addShape(pres.shapes.RECTANGLE, { x: 7.0, y: 1.25, w: 2.6, h: 2.8, fill: { color: C.card } });
s8.addShape(pres.shapes.RECTANGLE, { x: 7.0, y: 1.25, w: 0.06, h: 2.8, fill: { color: C.navy } });
s8.addText([
  { text: "컨텍스트 유실\n", options: { bold: true } },
  { text: "탭 전환 시 이전 상태 소멸\n\n" },
  { text: "성격 혼재\n", options: { bold: true } },
  { text: "레이어(상시)와 라벨링(전문)\n동일 레벨 배치\n\n" },
  { text: "대안\n", options: { bold: true } },
  { text: "레이어 상시 노출 +\n분석 독립 플로팅 패널" },
], { x: 7.25, y: 1.35, w: 2.2, h: 2.6, fontSize: 9.5, fontFace: FONT, color: C.text, margin: 0 });

// ════════════════════════════════════════
// Slide 9: 개선 레이아웃 — 네비게이션
// ════════════════════════════════════════
let sNav = pres.addSlide();
sNav.background = { color: C.bg };
addSlideTitle(sNav, "개선 제안 — 네비게이션 구조", "현행 9개 수평 나열 → 핵심/관리 2단 그룹핑");

// 현행 (Before)
sNav.addText("현행", { x: 0.5, y: 1.3, w: 1.0, h: 0.3, fontSize: 11, fontFace: FONT, color: C.muted, bold: true });
// 탑 바
sNav.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.7, w: 9.0, h: 0.55, fill: { color: C.navyDark } });
// 9개 메뉴 (빽빽함)
const menusCurrent = ["대시보드","지도서비스","영상관리","분석설정","학습데이터","모델학습","모델발제","보고서","통계"];
menusCurrent.forEach((m, i) => {
  sNav.addText(m, { x: 0.6 + i * 0.98, y: 1.72, w: 0.92, h: 0.5, fontSize: 7.5, fontFace: FONT, color: C.white, align: "center", valign: "middle" });
  if (i < 8) sNav.addShape(pres.shapes.RECTANGLE, { x: 0.6 + (i+1) * 0.98 - 0.01, y: 1.85, w: 0.01, h: 0.25, fill: { color: "5A6B80" } });
});
sNav.addText("← 1440px 이상 필수, 메뉴 간 여백 부족", { x: 0.5, y: 2.35, w: 9.0, h: 0.25, fontSize: 9, fontFace: FONT, color: C.warn });

// 개선 (After)
sNav.addText("개선안", { x: 0.5, y: 2.85, w: 1.0, h: 0.3, fontSize: 11, fontFace: FONT, color: C.ok, bold: true });
// 탑 바
sNav.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 3.25, w: 9.0, h: 0.55, fill: { color: C.navyDark } });
// 핵심 메뉴 5개 (여유 있게)
const menusNew = ["대시보드","지도서비스","보고서","통계"];
menusNew.forEach((m, i) => {
  sNav.addText(m, { x: 0.7 + i * 1.3, y: 3.27, w: 1.2, h: 0.5, fontSize: 9, fontFace: FONT, color: C.white, align: "center", valign: "middle" });
});
// 관리 드롭다운
sNav.addShape(pres.shapes.RECTANGLE, { x: 5.9, y: 3.33, w: 1.4, h: 0.4, fill: { color: "4A6080" } });
sNav.addText("관리 ▾", { x: 5.9, y: 3.33, w: 1.4, h: 0.4, fontSize: 9, fontFace: FONT, color: C.white, align: "center", valign: "middle" });
// 드롭다운 표시
sNav.addShape(pres.shapes.RECTANGLE, { x: 5.9, y: 3.75, w: 1.4, h: 1.3, fill: { color: C.card } });
sNav.addShape(pres.shapes.RECTANGLE, { x: 5.9, y: 3.75, w: 1.4, h: 0.01, fill: { color: C.border } });
const subMenus = ["영상관리","분석설정","학습데이터","모델학습","모델발제"];
subMenus.forEach((m, i) => {
  sNav.addText(m, { x: 6.0, y: 3.8 + i * 0.24, w: 1.2, h: 0.24, fontSize: 8, fontFace: FONT, color: C.text });
});

sNav.addText("탑 바 5개 + 관리 드롭다운 → 1024px에서도 안정 대응", { x: 0.5, y: 5.15, w: 9.0, h: 0.25, fontSize: 9, fontFace: FONT, color: C.ok });

// ════════════════════════════════════════
// Slide 10: 개선 레이아웃 — 지도서비스
// ════════════════════════════════════════
let sMap = pres.addSlide();
sMap.background = { color: C.bg };
addSlideTitle(sMap, "개선 제안 — 지도서비스 레이아웃", "탭 전환 방식 → 레이어 상시 + 분석 독립 패널");

// ── 현행 와이어프레임 ──
sMap.addText("현행", { x: 0.5, y: 1.3, w: 1.0, h: 0.3, fontSize: 11, fontFace: FONT, color: C.muted, bold: true });

// 현행 프레임
sMap.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.7, w: 4.0, h: 2.8, fill: { color: C.card } });
// 현행 사이드바
sMap.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.7, w: 1.2, h: 2.8, fill: { color: "E0E5EC" } });
// 현행 탭
sMap.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.7, w: 1.2, h: 0.3, fill: { color: C.navyDark } });
const tabs = ["레이어","분석","라벨링","검색"];
tabs.forEach((t, i) => {
  sMap.addText(t, { x: 0.5 + i * 0.3, y: 1.7, w: 0.3, h: 0.3, fontSize: 5.5, fontFace: FONT, color: C.white, align: "center", valign: "middle" });
});
// 현행 사이드바 내용 (한 번에 하나만)
sMap.addText("레이어 목록\n또는\n분석 카드\n(택 1)", { x: 0.55, y: 2.2, w: 1.1, h: 1.8, fontSize: 8, fontFace: FONT, color: C.sub, align: "center", valign: "middle" });
// 현행 지도
sMap.addText("지도 영역", { x: 1.8, y: 2.8, w: 2.6, h: 0.5, fontSize: 10, fontFace: FONT, color: C.muted, align: "center" });
// X 표시 (문제)
sMap.addText("탭 전환 시\n컨텍스트 유실", { x: 0.5, y: 4.55, w: 4.0, h: 0.3, fontSize: 8, fontFace: FONT, color: C.warn, align: "center" });

// ── 개선안 와이어프레임 ──
sMap.addText("개선안", { x: 5.5, y: 1.3, w: 1.0, h: 0.3, fontSize: 11, fontFace: FONT, color: C.ok, bold: true });

// 개선 프레임
sMap.addShape(pres.shapes.RECTANGLE, { x: 5.5, y: 1.7, w: 4.2, h: 2.8, fill: { color: C.card } });
// 레이어 패널 (좌측 상시)
sMap.addShape(pres.shapes.RECTANGLE, { x: 5.5, y: 1.7, w: 1.1, h: 2.8, fill: { color: "D4DDE8" } });
sMap.addShape(pres.shapes.RECTANGLE, { x: 5.5, y: 1.7, w: 1.1, h: 0.25, fill: { color: C.navy } });
sMap.addText("레이어", { x: 5.5, y: 1.7, w: 1.1, h: 0.25, fontSize: 7, fontFace: FONT, color: C.white, align: "center", valign: "middle" });
sMap.addText("국가하천  ●\n지방하천  ●\n소하천    ●\n인허가    ●\n걸침      ●\n구역내    ●", { x: 5.55, y: 2.05, w: 1.0, h: 1.6, fontSize: 6.5, fontFace: FONT, color: C.text });
sMap.addText("항상 표시", { x: 5.5, y: 3.7, w: 1.1, h: 0.3, fontSize: 7, fontFace: FONT, color: C.ok, align: "center", bold: true });

// 지도
sMap.addText("지도 영역", { x: 7.0, y: 2.8, w: 1.8, h: 0.5, fontSize: 10, fontFace: FONT, color: C.muted, align: "center" });

// 플로팅 분석 패널 (독립)
sMap.addShape(pres.shapes.RECTANGLE, { x: 7.8, y: 1.9, w: 1.6, h: 1.8, fill: { color: C.card } });
sMap.addShape(pres.shapes.RECTANGLE, { x: 7.8, y: 1.9, w: 1.6, h: 0.01, fill: { color: C.navy } });
sMap.addShape(pres.shapes.RECTANGLE, { x: 7.8, y: 1.9, w: 1.6, h: 1.8, line: { color: C.navy, width: 1 } });
sMap.addText("분석 패널\n(독립 플로팅)", { x: 7.85, y: 1.95, w: 1.5, h: 0.35, fontSize: 7, fontFace: FONT, color: C.navy, bold: true });
sMap.addText("카드 선택\n범위 설정\n분석 실행", { x: 7.85, y: 2.35, w: 1.5, h: 1.0, fontSize: 7, fontFace: FONT, color: C.sub });

sMap.addText("레이어를 보면서 동시에 분석 실행 가능", { x: 5.5, y: 4.55, w: 4.2, h: 0.3, fontSize: 8, fontFace: FONT, color: C.ok, align: "center" });

// ════════════════════════════════════════
// Slide 11: 진입점 + 권한 분기
// ════════════════════════════════════════
let s9 = pres.addSlide();
s9.background = { color: C.bg };
addSlideTitle(s9, "진입점 & 권한별 UI 분기");

// 좌: 진입점
s9.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.25, w: 4.5, h: 1.2, fill: { color: C.card } });
s9.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.25, w: 0.06, h: 1.2, fill: { color: C.warn } });
s9.addText([
  { text: "대시보드 기본 진입 — 검토 필요\n", options: { bold: true } },
  { text: "지도 업무 사용자에게 불필요한 동선\n역할별 분기 권장 (관리자→대시보드, 열람자→지도)" },
], { x: 0.8, y: 1.3, w: 4.0, h: 1.0, fontSize: 10, fontFace: FONT, color: C.text, margin: 0 });

// 우: 권한
s9.addShape(pres.shapes.RECTANGLE, { x: 5.3, y: 1.25, w: 4.3, h: 1.2, fill: { color: C.card } });
s9.addShape(pres.shapes.RECTANGLE, { x: 5.3, y: 1.25, w: 0.06, h: 1.2, fill: { color: C.ok } });
s9.addText([
  { text: "권한별 3단계 분기 — 강점\n", options: { bold: true } },
  { text: "관리자 9개 / LX 7개 / 지자체 6개\n메뉴와 버튼이 권한별로 다르게 구성" },
], { x: 5.6, y: 1.3, w: 3.8, h: 1.0, fontSize: 10, fontFace: FONT, color: C.text, margin: 0 });

addImg(s9, "local_dashboard.png", 0.5, 2.7, 4.5, 2.6);
addImg(s9, "lx_dashboard.png", 5.3, 2.7, 4.3, 2.6);
s9.addText("지자체 뷰 — 6개 메뉴", { x: 0.5, y: 5.1, w: 4.5, h: 0.2, fontSize: 9, fontFace: FONT, color: C.muted, align: "center" });
s9.addText("LX 뷰 — 7개 메뉴", { x: 5.3, y: 5.1, w: 4.3, h: 0.2, fontSize: 9, fontFace: FONT, color: C.muted, align: "center" });

// ════════════════════════════════════════
// Slide 10: 종합 (네이비 배경)
// ════════════════════════════════════════
let s10 = pres.addSlide();
s10.background = { color: C.navyDeep };
// 장식 원
s10.addShape(pres.shapes.OVAL, { x: 7.5, y: -1.0, w: 4.5, h: 4.5, fill: { color: C.navy, transparency: 50 } });

s10.addText("종합 판정", {
  x: 0.6, y: 0.35, w: 9, h: 0.5, fontSize: 22, fontFace: FONT, color: C.white, bold: true, italic: true, margin: 0,
});
s10.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 0.9, w: 1.5, h: 0.02, fill: { color: C.muted } });

const items = [
  ["탑 네비게이션 9개", "개선 권장", "5~7개 그룹핑 또는 2단 분리 필요"],
  ["사이드바 탭 전환", "개선 권장", "레이어 상시 노출 + 분석 독립 패널"],
  ["대시보드 기본 진입", "선택적", "역할별 분기 권장"],
  ["권한별 UI 분기", "우수", "3단계 분기 이미 구현"],
  ["분석 워크플로우", "우수", "카드→범위→실행 구조 직관적"],
  ["디자인 시스템", "양호", "컴포넌트 일관성 확보, 아이콘 교체 필요"],
];

items.forEach((item, i) => {
  const y = 1.2 + i * 0.7;
  // 판정 원
  const isWarn = item[1] === "개선 권장";
  const dotColor = isWarn ? "9E6B5A" : item[1] === "선택적" ? C.muted : "5A8E6B";
  s10.addShape(pres.shapes.OVAL, { x: 0.6, y: y + 0.07, w: 0.38, h: 0.38, fill: { color: dotColor } });

  s10.addText(item[0], { x: 1.15, y, w: 2.6, h: 0.5, fontSize: 13, fontFace: FONT, color: C.white, bold: true, valign: "middle", margin: 0 });
  s10.addText(item[1], { x: 3.9, y, w: 1.3, h: 0.5, fontSize: 11, fontFace: FONT, color: dotColor, bold: true, valign: "middle", margin: 0 });
  s10.addText(item[2], { x: 5.3, y, w: 4.3, h: 0.5, fontSize: 11, fontFace: FONT, color: "8E99A4", valign: "middle", margin: 0 });
});

// ── 출력 ──
const outPath = path.resolve("C:/project/clean/new_landxi_report_v1.pptx");
pres.writeFile({ fileName: outPath }).then(() => {
  console.log("Created: " + outPath);
}).catch(err => {
  console.error("Error:", err);
});
