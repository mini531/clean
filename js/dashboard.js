'use strict';

/* ── 참고 데이터 기반 17개 지역 (가나다 순) ── */
const REGION_STATS = [
  { code:'gangwon',   label:'강원',  rivers:18,  crossing:43268,  inside:15126 },
  { code:'gyeonggi',  label:'경기',  rivers:44,  crossing:100566, inside:33264 },
  { code:'gyeongnam', label:'경남',  rivers:22,  crossing:66778,  inside:19413 },
  { code:'gyeongbuk', label:'경북',  rivers:23,  crossing:100582, inside:36194 },
  { code:'gwangju',   label:'광주',  rivers:5,   crossing:3764,   inside:1797  },
  { code:'daegu',     label:'대구',  rivers:9,   crossing:19274,  inside:12545 },
  { code:'daejeon',   label:'대전',  rivers:5,   crossing:3176,   inside:1805  },
  { code:'busan',     label:'부산',  rivers:16,  crossing:10632,  inside:8384  },
  { code:'seoul',     label:'서울',  rivers:25,  crossing:11816,  inside:13953 },
  { code:'sejong',    label:'세종',  rivers:1,   crossing:2068,   inside:929   },
  { code:'ulsan',     label:'울산',  rivers:5,   crossing:7228,   inside:3161  },
  { code:'incheon',   label:'인천',  rivers:10,  crossing:1736,   inside:959   },
  { code:'jeonnam',   label:'전남',  rivers:22,  crossing:25668,  inside:12086 },
  { code:'jeonbuk',   label:'전북',  rivers:15,  crossing:20753,  inside:11965 },
  { code:'jeju',      label:'제주',  rivers:2,   crossing:3138,   inside:1083  },
  { code:'chungnam',  label:'충남',  rivers:16,  crossing:20435,  inside:12251 },
  { code:'chungbuk',  label:'충북',  rivers:14,  crossing:19982,  inside:12152 },
];

/* ── 세부 지역 데이터 (강원 예시) ── */
const SUB_REGION_STATS = {
  'gangwon': [
    { label:'강릉시', crossing:1794,  inside:677 },
    { label:'고성군', crossing:220,   inside:64 },
    { label:'동해시', crossing:466,   inside:143 },
    { label:'삼척시', crossing:2712,  inside:882 },
    { label:'속초시', crossing:298,   inside:48 },
    { label:'양구군', crossing:886,   inside:266 },
    { label:'양양군', crossing:1270,  inside:616 },
    { label:'영월군', crossing:3164,  inside:1186 },
    { label:'원주시', crossing:2936,  inside:1276 },
    { label:'인제군', crossing:1872,  inside:771 },
    { label:'정선군', crossing:2656,  inside:883 },
    { label:'철원군', crossing:626,   inside:147 },
    { label:'춘천시', crossing:10648, inside:2923 },
    { label:'태백시', crossing:1046,  inside:173 },
    { label:'평창군', crossing:2952,  inside:1356 },
    { label:'홍천군', crossing:5370,  inside:2234 },
    { label:'화천군', crossing:1834,  inside:664 },
    { label:'횡성군', crossing:2518,  inside:817 }
  ],
  'gyeonggi': [
    { label:'가평군', crossing:7732, inside:2787 },
    { label:'고양시 덕양구', crossing:2732, inside:1252 },
    { label:'고양시 일산동구', crossing:948, inside:304 },
    { label:'고양시 일산서구', crossing:262, inside:151 },
    { label:'과천시', crossing:580, inside:225 },
    { label:'광명시', crossing:1168, inside:754 },
    { label:'광주시', crossing:7380, inside:2303 },
    { label:'구리시', crossing:392, inside:420 },
    { label:'군포시', crossing:1042, inside:222 },
    { label:'김포시', crossing:988, inside:625 },
    { label:'남양주시', crossing:5142, inside:1403 },
    { label:'동두천시', crossing:1642, inside:270 },
    { label:'부천시 소사구', crossing:302, inside:199 },
    { label:'부천시 오정구', crossing:406, inside:166 },
    { label:'부천시 원미구', crossing:66, inside:27 },
    { label:'성남시 분당구', crossing:710, inside:216 },
    { label:'성남시 수정구', crossing:370, inside:95 },
    { label:'성남시 중원구', crossing:156, inside:47 },
    { label:'수원시 권선구', crossing:882, inside:261 },
    { label:'수원시 영통구', crossing:426, inside:122 },
    { label:'수원시 장안구', crossing:490, inside:105 },
    { label:'수원시 팔달구', crossing:148, inside:50 },
    { label:'시흥시', crossing:2058, inside:811 },
    { label:'안산시 단원구', crossing:364, inside:135 },
    { label:'안산시 상록구', crossing:766, inside:246 },
    { label:'안성시', crossing:4322, inside:1034 },
    { label:'안양시 동안구', crossing:484, inside:120 },
    { label:'안양시 만안구', crossing:864, inside:223 },
    { label:'양주시', crossing:6496, inside:1250 },
    { label:'양평군', crossing:7630, inside:2876 },
    { label:'여주시', crossing:3392, inside:1410 },
    { label:'연천군', crossing:636, inside:281 },
    { label:'오산시', crossing:494, inside:142 },
    { label:'용인시 기흥구', crossing:554, inside:118 },
    { label:'용인시 수지구', crossing:678, inside:198 },
    { label:'용인시 처인구', crossing:6366, inside:1910 },
    { label:'의왕시', crossing:864, inside:141 },
    { label:'의정부시', crossing:1638, inside:542 },
    { label:'이천시', crossing:3846, inside:954 },
    { label:'파주시', crossing:1852, inside:393 },
    { label:'평택시', crossing:1688, inside:631 },
    { label:'포천시', crossing:9382, inside:3365 },
    { label:'하남시', crossing:1580, inside:589 },
    { label:'화성시', crossing:8844, inside:1242 }
  ],
  'gyeongbuk': [
    { label:'경산시', crossing:5130, inside:1824 },
    { label:'경주시', crossing:7732, inside:2259 },
    { label:'고령군', crossing:13928, inside:5604 },
    { label:'구미시', crossing:3454, inside:1233 },
    { label:'김천시', crossing:5548, inside:1641 },
    { label:'문경시', crossing:5300, inside:1586 },
    { label:'봉화군', crossing:3748, inside:1400 },
    { label:'상주시', crossing:4678, inside:1718 },
    { label:'성주군', crossing:3760, inside:1477 },
    { label:'안동시', crossing:4558, inside:2583 },
    { label:'영덕군', crossing:2834, inside:1257 },
    { label:'영양군', crossing:1712, inside:691 },
    { label:'영주시', crossing:3414, inside:1005 },
    { label:'영천시', crossing:6290, inside:2519 },
    { label:'예천군', crossing:2234, inside:816 },
    { label:'울릉군', crossing:82, inside:25 },
    { label:'울진군', crossing:1472, inside:459 },
    { label:'의성군', crossing:4328, inside:1448 },
    { label:'청도군', crossing:5192, inside:1597 },
    { label:'청송군', crossing:4740, inside:1792 },
    { label:'칠곡군', crossing:3320, inside:1378 },
    { label:'포항시 남구', crossing:1682, inside:491 },
    { label:'포항시 북구', crossing:3446, inside:1391 }
  ],
  'daegu': [
    { label:'군위군', crossing:3280, inside:1070 },
    { label:'남구',   crossing:576,  inside:387 },
    { label:'달서구', crossing:910,  inside:504 },
    { label:'달성군', crossing:7942, inside:6172 },
    { label:'동구',   crossing:2522, inside:1755 },
    { label:'북구',   crossing:1552, inside:955 },
    { label:'서구',   crossing:122,  inside:134 },
    { label:'수성구', crossing:2038, inside:1423 },
    { label:'중구',   crossing:332,  inside:145 }
  ],
  'gyeongnam': [
    { label:'거제시', crossing:2118, inside:297 },
    { label:'거창군', crossing:2840, inside:586 },
    { label:'고성군', crossing:3534, inside:582 },
    { label:'김해시', crossing:8436, inside:2696 },
    { label:'남해군', crossing:1752, inside:202 },
    { label:'밀양시', crossing:5830, inside:2006 },
    { label:'사천시', crossing:2036, inside:820 },
    { label:'산청군', crossing:3848, inside:792 },
    { label:'양산시', crossing:3144, inside:1386 },
    { label:'의령군', crossing:2532, inside:562 },
    { label:'진주시', crossing:2496, inside:1196 },
    { label:'창녕군', crossing:2600, inside:1319 },
    { label:'창원시 마산합포구', crossing:1178, inside:241 },
    { label:'창원시 마산회원구', crossing:942, inside:157 },
    { label:'창원시 성산구', crossing:488, inside:68 },
    { label:'창원시 의창구', crossing:4748, inside:1153 },
    { label:'창원시 진해구', crossing:786, inside:121 },
    { label:'통영시', crossing:1460, inside:172 },
    { label:'하동군', crossing:2966, inside:1267 },
    { label:'함안군', crossing:4480, inside:1554 },
    { label:'함양군', crossing:2698, inside:499 },
    { label:'합천군', crossing:5866, inside:1737 }
  ]
};

/* ── 시설물 세부 데이터 (가평군/조종면 예시) ── */
const MOCK_FACILITY_DETAILS = [
  { id: 'FD001', addr: '조종면 상판리 산 121', cat: '국가하천', riverName: '조종천', riverGrade: '지방하천', area: '12㎡', areaNum: 12, occArea: 10, occRate: 83.3, type: 'crossing', pct: '87%', pctVal: 87, lat: 37.892, lng: 127.355 },
  { id: 'FD002', addr: '조종면 상판리 41', cat: '국가하천', riverName: '조종천', riverGrade: '지방하천', area: '15㎡', areaNum: 15, occArea: 15, occRate: 100.0, type: 'inside', pct: '100%', pctVal: 100, lat: 37.894, lng: 127.358 },
  { id: 'FD003', addr: '조종면 상판리 산 121', cat: '국가하천', riverName: '조종천', riverGrade: '지방하천', area: '13㎡', areaNum: 13, occArea: 12, occRate: 92.3, type: 'crossing', pct: '92%', pctVal: 92, lat: 37.895, lng: 127.356 },
  { id: 'FD004', addr: '조종면 상판리 산 121', cat: '국가하천', riverName: '조종천', riverGrade: '지방하천', area: '6㎡', areaNum: 6, occArea: 6, occRate: 100.0, type: 'inside', pct: '100%', pctVal: 100, lat: 37.891, lng: 127.354 },
  { id: 'FD005', addr: '조종면 상판리 산 121', cat: '국가하천', riverName: '조종천', riverGrade: '지방하천', area: '22㎡', areaNum: 22, occArea: 12, occRate: 54.5, type: 'crossing', pct: '55%', pctVal: 55, lat: 37.893, lng: 127.357 },
  { id: 'FD006', addr: '조종면 상판리 603-2', cat: '국가하천', riverName: '조종천', riverGrade: '지방하천', area: '4㎡', areaNum: 4, occArea: 4, occRate: 100.0, type: 'inside', pct: '100%', pctVal: 100, lat: 37.890, lng: 127.352 },
  { id: 'FD007', addr: '조종면 상판리 산 146', cat: '국가하천', riverName: '조종천', riverGrade: '지방하천', area: '2㎡', areaNum: 2, occArea: 1.8, occRate: 90.0, type: 'crossing', pct: '88%', pctVal: 88, lat: 37.896, lng: 127.359 },
  { id: 'FD008', addr: '조종면 상판리 603-2', cat: '국가하천', riverName: '조종천', riverGrade: '지방하천', area: '20㎡', areaNum: 20, occArea: 20, occRate: 100.0, type: 'inside', pct: '100%', pctVal: 100, lat: 37.889, lng: 127.351 },
  { id: 'FD009', addr: '조종면 상판리 491-3', cat: '국가하천', riverName: '조종천', riverGrade: '지방하천', area: '9㎡', areaNum: 9, occArea: 7, occRate: 77.7, type: 'crossing', pct: '78%', pctVal: 78, lat: 37.888, lng: 127.350 },
  { id: 'FD010', addr: '조종면 상판리 491-3', cat: '국가하천', riverName: '조종천', riverGrade: '지방하천', area: '6㎡', areaNum: 6, occArea: 6, occRate: 100.0, type: 'inside', pct: '100%', pctVal: 100, lat: 37.887, lng: 127.349 },
];

/* ── 시설물 뷰 상태 ── */
let currentFacFilter = 'all'; // all, crossing, inside
let currentFacSort   = 'cross-desc'; // cross-desc, inside-desc, cross-asc, inside-asc, name-asc, name-desc

/* 숫자 천단위 포맷 */
function fmtNum(n) { return n.toLocaleString('ko-KR'); }

/* ── 사이드바 뷰 전환 ── */
function switchSidebarView(viewId) {
  document.querySelectorAll('.db-sidebar-view').forEach(v => v.classList.remove('active'));
  const target = document.getElementById(viewId);
  if (target) target.classList.add('active');
  
  // 뷰 전환 시 필터/정렬 상태 초기화 (항상 기본값으로 시작)
  if (viewId === 'sidebar-detail-view' || viewId === 'sidebar-main-view') {
    currentFacFilter = 'all';
    currentFacSort   = 'cross-desc';
    
    // UI 초기화
    document.querySelectorAll('.detail-mode .rbl').forEach(el => el.classList.remove('active'));
    const lblSort = document.getElementById('fac-sort-label');
    if (lblSort) lblSort.textContent = '걸침 많은 순';
    
    const ddown = document.getElementById('fac-sort-dropdown');
    if (ddown) {
      ddown.querySelectorAll('.dsd-item').forEach(i => {
        i.classList.remove('active');
        if (i.dataset.sort === 'cross-desc') i.classList.add('active');
      });
    }

    // 레이어 설정창 토글
    const layerBox = document.getElementById('db-layer-settings');
    if (layerBox) {
      if (viewId === 'sidebar-detail-view') {
        layerBox.classList.remove('hidden');
        document.body.classList.add('detail-mode-active');
      } else {
        layerBox.classList.add('hidden');
        document.body.classList.remove('detail-mode-active');
      }
    }
  }
}

/* ── 시설물 목록 렌더링 ── */
function renderFacilityList(subName, forceQuery = '') {
  const container = document.getElementById('facility-list');
  const titleEl   = document.getElementById('side-detail-title');
  if (titleEl) titleEl.textContent = `${subName} 시설물 목록`;

  // 1. 검색어 필터 (기존 input 값 사용)
  const q = forceQuery || document.getElementById('facility-search-input').value.trim();
  
  let result = MOCK_FACILITY_DETAILS;
  
  if (q) {
    result = result.filter(f => f.addr.includes(q));
  }

  // 2. 상태 필터 (걸침/구역내)
  if (currentFacFilter !== 'all') {
    result = result.filter(f => f.type === currentFacFilter);
  }

  // 3. 정렬 (전체 목록과 동일한 기준)
  result = [...result].sort((a, b) => {
    if (currentFacSort === 'cross-desc') {
      if (a.type !== b.type) return (a.type === 'crossing') ? -1 : 1;
      if (b.pctVal !== a.pctVal) return b.pctVal - a.pctVal; // 퍼센트 우선
      return b.areaNum - a.areaNum;
    }
    if (currentFacSort === 'inside-desc') {
      if (a.type !== b.type) return (a.type === 'inside') ? -1 : 1;
      if (b.pctVal !== a.pctVal) return b.pctVal - a.pctVal; // 퍼센트 우선
      return b.areaNum - a.areaNum;
    }
    if (currentFacSort === 'cross-asc') {
      if (a.type !== b.type) return (a.type === 'inside') ? -1 : 1;
      if (b.pctVal !== a.pctVal) return a.pctVal - b.pctVal; // 퍼센트 낮은 순
      return a.areaNum - b.areaNum;
    }
    if (currentFacSort === 'inside-asc') {
      if (a.type !== b.type) return (a.type === 'crossing') ? -1 : 1;
      if (b.pctVal !== a.pctVal) return a.pctVal - b.pctVal; // 퍼센트 낮은 순
      return a.areaNum - b.areaNum;
    }
    if (currentFacSort === 'name-asc')  return a.addr.localeCompare(b.addr, 'ko');
    if (currentFacSort === 'name-desc') return b.addr.localeCompare(a.addr, 'ko');
    return 0;
  });

  container.innerHTML = result.map(f => {
    const statusClass = f.type === 'crossing' ? 'crossing' : 'inside';
    return `
      <div class="facility-item ${statusClass}" role="listitem" data-id="${f.id}">
        <div class="fi-status ${statusClass}"></div>
        <div class="fi-content">
          <div class="fi-addr">${f.addr}</div>
          <div class="fi-meta">${f.cat} · ${f.area}</div>
        </div>
        <div class="fi-badge">${f.pct}</div>
      </div>
    `;
  }).join('');

  // 클릭 이벤트 바인딩
  container.querySelectorAll('.facility-item').forEach(item => {
    item.addEventListener('click', () => {
      const fid = item.dataset.id;
      const facility = result.find(f => f.id === fid);
      
      // 1. 활성 상태 표시
      container.querySelectorAll('.facility-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      // 2. 지도 강조 및 이동
      if (facility) {
        MapModule.highlightFacility(facility);
      }
    });
  });

  if (result.length === 0) {
    container.innerHTML = '<div class="sub-region-empty">조건에 맞는 시설물이 없습니다.</div>';
  }
}

/* ── KPI 업데이트 (단일 지역 또는 전체 배열) ── */
function updateKPI(data) {
  let title = '전국 현황';
  let cross = 0;
  let inside = 0;

  if (Array.isArray(data)) {
    // 전국 합계
    cross = data.reduce((s, r) => s + r.crossing, 0);
    inside = data.reduce((s, r) => s + r.inside, 0);
  } else if (data) {
    // 단일 지역
    title = `${data.label} 현황`;
    cross = data.crossing;
    inside = data.inside;
  }

  const total = (cross + inside) || 1;
  const crossPct = (cross / total * 100).toFixed(1);
  const insidePct = (inside / total * 100).toFixed(1);

  // UI 업데이트 (Consolidated Map Summary Card)
  const titleEl  = document.getElementById('summary-title');
  const crossEl  = document.getElementById('sum-crossing');
  const insideEl = document.getElementById('sum-inside');

  if (titleEl)  titleEl.textContent = title;
  if (crossEl)  crossEl.textContent = fmtNum(cross);
  if (insideEl) insideEl.textContent = fmtNum(inside);

  // 미니 차트 업데이트
  const barCross  = document.getElementById('sum-bar-crossing');
  const barInside = document.getElementById('sum-bar-inside');
  if (barCross && barInside) {
    barCross.style.width = crossPct + '%';
    barInside.style.width = insidePct + '%';
  }

  // 모바일 리본 업데이트 (걸침, 구역내)
  const mKpiCross = document.getElementById('m-kpi-cross');
  const mKpiInside = document.getElementById('m-kpi-inside');
  if (mKpiCross) {
    mKpiCross.textContent = cross >= 10000 ? (cross / 10000).toFixed(1) + '만' : cross.toLocaleString();
  }
  if (mKpiInside) {
    mKpiInside.textContent = inside >= 10000 ? (inside / 10000).toFixed(1) + '만' : inside.toLocaleString();
  }
}

/* ── 세부 지역 렌더링 (Compact Style) ── */
function renderSubRegions(regionCode, container) {
  const subs = SUB_REGION_STATS[regionCode] || [];
  if (subs.length === 0) {
    container.innerHTML = '<div class="sub-region-empty">세부 데이터가 없습니다.</div>';
    return;
  }

  container.innerHTML = subs.map(s => {
    const total = (s.crossing + s.inside) || 1;
    const crossPct = (s.crossing / total * 100).toFixed(1);
    const insidePct = (s.inside / total * 100).toFixed(1);
    return `
      <div class="sub-region-item" data-sub-name="${s.label}">
        <div class="sri-name">${s.label}</div>
        <div class="sri-nums">
          <span class="n-cross">${fmtNum(s.crossing)}</span>
          <span class="sep">/</span>
          <span class="n-in">${fmtNum(s.inside)}</span>
        </div>
        <div class="sri-visual">
          <div class="sri-bar-track">
            <div class="bar-seg crossing" style="width:${crossPct}%"></div>
            <div class="bar-seg inside"   style="width:${insidePct}%"></div>
          </div>
        </div>
      </div>`;
  }).join('');

  // 하위 지역 클릭 -> 시설물 목록으로 전환 + 요약 카드 업데이트
  container.querySelectorAll('.sub-region-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const subName = item.dataset.subName;
      const subData = subs.find(s => s.label === subName);
      
      // 1. 시설물 데이터 준비 (목록은 바텀시트에서 보여줄 예정)
      renderFacilityList(subName);
      
      // 2. 지도 시설물 레이어 표시
      MapModule.renderFacilityLayer(MOCK_FACILITY_DETAILS);
      
      // 3. 하단 요약 카드 및 모바일 리본 업데이트
      if (subData) updateKPI(subData);
      
      const mCurrRegion = document.getElementById('m-curr-region');
      if (mCurrRegion) mCurrRegion.textContent = subName;

      // 4. 모바일인 경우 사이드바 닫고 목록 보기 버튼 노출 + 바텀 시트 즉시 열기
      if (window.innerWidth <= 768) {
        document.getElementById('db-left-panel').classList.remove('open');
        document.getElementById('sidebar-backdrop').classList.remove('active');
        
        toggleMobileFloatingButtons(false); 
        
        const detailSheet = document.getElementById('sidebar-detail-view');
        if (detailSheet) detailSheet.classList.add('active');
        
        // 상세 모드 활성화 플래그 추가 (버튼 노출 제어용)
        document.body.classList.add('detail-mode-active');
      } else {
        // 데스크탑은 기존처럼 사이드바 뷰 전환
        switchSidebarView('sidebar-detail-view');
      }
      
      UI.toast(`${subName} 시설물 목록을 불러왔습니다.`, 'info', 1500);
    });
  });
}

/* ── 지역 목록 렌더링 ── */
function renderRegionList() {
  const list     = document.getElementById('region-list');
  const maxTotal = Math.max(...REGION_STATS.map(r => r.crossing + r.inside), 1);

  list.innerHTML = REGION_STATS.map(r => {
    const total    = r.crossing + r.inside;
    const crossPct = (r.crossing / maxTotal * 100).toFixed(1);
    const insidePct= (r.inside   / maxTotal * 100).toFixed(1);
    return `
      <div class="region-card" role="listitem" data-region="${r.code}" tabindex="0">
        <div class="region-card-master">
          <div class="region-row1">
            <div class="region-name-txt">
              ${r.label}
              <span class="region-rivers">${r.rivers}개</span>
            </div>
            <div class="region-nums">
              <span class="n-cross">${fmtNum(r.crossing)}</span>
              <span class="n-in">${fmtNum(r.inside)}</span>
            </div>
          </div>
          <div class="region-bar-track">
            <div class="bar-seg crossing" style="width:${crossPct}%"></div>
            <div class="bar-seg inside"   style="width:${insidePct}%"></div>
          </div>
        </div>
        <div class="sub-region-list" id="sub-list-${r.code}"></div>
      </div>`;
  }).join('');

  list.querySelectorAll('.region-card').forEach(card => {
    const master = card.querySelector('.region-card-master');
    const handler = (e) => {
      e.stopPropagation();
      const code = card.dataset.region;
      const isActive = card.classList.contains('active');
      const subList = card.querySelector('.sub-region-list');

      // 다른 카드 닫기
      list.querySelectorAll('.region-card').forEach(c => {
        if (c !== card) c.classList.remove('active');
      });

      if (!isActive) {
        card.classList.add('active');
        renderSubRegions(code, subList);
        
        const regionObj = REGION_STATS.find(r => r.code === code);
        updateKPI(regionObj);
        
        // 모바일 리본 지역명 업데이트
        const mCurrRegion = document.getElementById('m-curr-region');
        if (mCurrRegion && regionObj) mCurrRegion.textContent = regionObj.label;

        MapModule.flyToBounds(code);
      } else {
        card.classList.remove('active');
        updateKPI(REGION_STATS);
        
        // 모바일 리본 지역명 리셋
        const mCurrRegion = document.getElementById('m-curr-region');
        if (mCurrRegion) mCurrRegion.textContent = '전국';

        MapModule.map.flyTo([36.5, 127.8], 7, { duration: 0.8 });
      }
    };
    master.addEventListener('click', handler);
  });
}

/** 지도 마커 클릭 -> 사이드바 동기화 */
window.handleRegionClick = function(code, label) {
  const card = document.querySelector(`.region-card[data-region="${code}"]`);
  if (card) {
    const master = card.querySelector('.region-card-master');
    // 이미 열려있지 않은 경우에만 클릭 실행
    if (!card.classList.contains('active')) {
      master.click();
    }
    // 해당 카드로 부드럽게 스크롤
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
};

/* ── 검색 오버레이 ── */
function initSearch() {
  const toggleBtn = document.getElementById('btn-search-toggle');
  const overlay   = document.getElementById('db-search-overlay');
  const resetBtn  = document.getElementById('btn-search-reset');
  const mCloseBtn = document.getElementById('btn-search-m-close');
  const input     = document.getElementById('db-search-input');
  const resPanel  = document.getElementById('db-search-results');

  if (toggleBtn && overlay) {
    const closeSearch = () => {
      overlay.classList.remove('open');
      toggleBtn.classList.remove('active');
      if (resPanel) resPanel.classList.remove('active');
    };

    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = overlay.classList.contains('open');
      if (!isOpen) {
        overlay.classList.add('open');
        toggleBtn.classList.add('active');
        if (input) input.focus();
      } else {
        closeSearch();
      }
    });

    if (mCloseBtn) {
      mCloseBtn.addEventListener('click', closeSearch);
    }
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (input) {
        input.value = '';
        input.focus();
      }
      if (resPanel) resPanel.classList.remove('active');
      resetBtn.classList.remove('active');
    });
  }

  if (input) {
    input.addEventListener('input', () => {
      if (input.value.trim().length > 0) {
        resetBtn.classList.add('active');
      } else {
        resetBtn.classList.remove('active');
        if (resPanel) resPanel.classList.remove('active');
      }
    });
  }

  /* ── 검색 결과 목업 데이터 확장 ── */
  const MOCK_SEARCH_RESULTS = {
    name: Array.from({length: 18}, (_, i) => ({ 
      title: `운봉읍_${i + 1}`, 
      sub: i % 2 === 0 ? "읍면동구역경계 > 읍" : "기타정보서비스업 > 국가가변전광표지판", 
      type: "lot", 
      addr: `전북특별자치도 남원시 운봉읍 동천리 ${642 + i}-${i % 5}` 
    })),
    road: Array.from({length: 15}, (_, i) => ({ 
      title: `운봉읍_도로_${i + 1}`, 
      sub: i % 3 === 0 ? "도로시설 > 주차장" : "도로명주소", 
      type: "road", 
      addr: `전북특별자치도 남원시 운봉읍 용은길 ${38 + i}-${i % 3}` 
    })),
    lot: Array.from({length: 22}, (_, i) => ({ 
      title: `운봉읍_지번_${i + 1}`, 
      sub: "지번주소", 
      type: "lot", 
      addr: `전북특별자치도 남원시 운봉읍 가산리 ${i + 1}` 
    }))
  };

  const ITEMS_PER_PAGE = 5;

  const renderPagination = (totalItems, currentPage, onPageChange) => {
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    if (totalPages <= 1) return "";

    let html = '<div class="res-pagination">';
    for (let i = 1; i <= totalPages; i++) {
      html += `<button class="pg-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }
    html += '</div>';

    // 이벤트 위임은 renderSearchResults를 호출한 곳에서 처리하거나 타이머 사용
    return html;
  };

  const renderSearchResults = (query, tab = 'all', pageNum = 1) => {
    const list = document.getElementById('res-content-list');
    const queryVal = document.getElementById('res-query-val');
    const totalVal = document.getElementById('res-total-val');
    
    if (!list) return;
    
    queryVal.textContent = query;
    list.innerHTML = '';
    
    const categories = {
      name: { label: "명칭", data: MOCK_SEARCH_RESULTS.name },
      road: { label: "도로명", data: MOCK_SEARCH_RESULTS.road },
      lot: { label: "지번", data: MOCK_SEARCH_RESULTS.lot }
    };

    const renderItem = (item) => `
      <div class="res-item">
        <div class="res-item-title">${item.title}</div>
        <div class="res-item-sub">${item.sub}</div>
        <div class="res-item-addr">
          <span class="addr-badge ${item.type}">${item.type === 'lot' ? '지번' : '도로명'}</span>
          ${item.addr}
        </div>
      </div>
    `;

    const renderSection = (key, cat, isAllTab) => {
      if (cat.data.length === 0) return '';
      
      let displayData = cat.data;
      let paginationHtml = "";

      if (isAllTab) {
        // 전체 탭인 경우 상위 2개만 노출 + 더보기 버튼
        displayData = cat.data.slice(0, 2);
      } else {
        // 특정 탭인 경우 페이지네이션 적용
        const start = (pageNum - 1) * ITEMS_PER_PAGE;
        displayData = cat.data.slice(start, start + ITEMS_PER_PAGE);
        paginationHtml = renderPagination(cat.data.length, pageNum, (p) => renderSearchResults(query, tab, p));
      }

      return `
        <div class="res-sec">
          <div class="res-sec-hd">
            <span>${cat.label} <span class="res-sec-count">${cat.data.length.toLocaleString()}</span> 건</span>
            ${isAllTab ? `
            <a href="javascript:void(0);" class="res-more" data-tab-target="${key}">
              ${cat.label} 더 보기
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </a>` : ""}
          </div>
          <div class="res-list">
            ${displayData.map(renderItem).join('')}
          </div>
          ${paginationHtml}
        </div>
      `;
    };

    let totalCount = 0;
    if (tab === 'all') {
      totalCount = Object.values(categories).reduce((acc, cat) => acc + cat.data.length, 0);
      list.innerHTML = Object.keys(categories).map(key => renderSection(key, categories[key], true)).join('');
    } else {
      totalCount = categories[tab].data.length;
      list.innerHTML = renderSection(tab, categories[tab], false);
    }

    totalVal.textContent = (totalCount).toLocaleString();

    // 페이지네이션 클릭 이벤트 바인딩
    list.querySelectorAll('.pg-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const p = parseInt(btn.dataset.page);
        renderSearchResults(query, tab, p);
      });
    });
  };

  const btnResClose = document.getElementById('btn-res-close');
  const btnSearchExec = document.getElementById('btn-search-exec');

  const executeSearch = () => {
    const q = input.value.trim();
    if (q.length > 0) {
      resPanel.classList.add('active');
      renderSearchResults(q, 'all');
    }
  };

  input.addEventListener('input', () => {
    if (input.value.trim().length === 0) {
      resPanel.classList.remove('active');
    }
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      executeSearch();
    }
  });

  if (btnSearchExec) {
    btnSearchExec.addEventListener('click', executeSearch);
  }

  // 탭 전환
  document.querySelectorAll('.res-tab').forEach(tabBtn => {
    tabBtn.addEventListener('click', () => {
      document.querySelectorAll('.res-tab').forEach(b => b.classList.remove('active'));
      tabBtn.classList.add('active');
      renderSearchResults(input.value.trim(), tabBtn.dataset.tab);
    });
  });

  if (resPanel) {
    resPanel.addEventListener('click', e => {
      const moreLink = e.target.closest('.res-more');
      if (moreLink) {
        const targetTab = moreLink.dataset.tabTarget;
        const tabBtn = document.querySelector(`.res-tab[data-tab="${targetTab}"]`);
        if (tabBtn) tabBtn.click();
      }
    });
  }

  if (btnResClose) {
    btnResClose.addEventListener('click', () => {
      if (resPanel) resPanel.classList.remove('active');
    });
  }

  /* Esc 로 닫기 */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) {
      overlay.classList.remove('open');
      if (resPanel) resPanel.classList.remove('active');
      toggleBtn.classList.remove('active');
    }
  });
}

/* ── 사용자 드롭다운 ── */
function initUserDropdown(user) {
  const btn      = document.getElementById('btn-logout');
  const dropdown = document.getElementById('user-dropdown');
  document.getElementById('header-user-name').textContent = user.name + '님';
  document.getElementById('dd-user-name').textContent  = user.name;
  document.getElementById('dd-user-org').textContent   = user.org;
  document.getElementById('dd-user-role').textContent  = user.roleLabel;

  btn.addEventListener('click', e => {
    e.stopPropagation();
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
  });
  document.addEventListener('click', () => { dropdown.style.display = 'none'; });
}

/* ── 리스트 정렬 초기화 ── */
function initSorting() {
  const toggleBtn = document.getElementById('btn-sort-toggle');
  const dropdown  = document.getElementById('sort-dropdown');
  const label     = document.getElementById('sort-label');

  if (!toggleBtn || !dropdown) return;

  toggleBtn.addEventListener('click', e => {
    e.stopPropagation();
    dropdown.classList.toggle('active');
  });

  document.addEventListener('click', () => dropdown.classList.remove('active'));

  dropdown.querySelectorAll('.dsd-item').forEach(item => {
    item.addEventListener('click', () => {
      const type = item.dataset.sort;
      const text = item.textContent;

      // 1. 레이블 변경
      label.textContent = text;
      
      // 2. 데이터 정렬
      applySort(type);

      // 3. 리스트 재렌더링
      renderRegionList();

      // 4. 활성 표시
      dropdown.querySelectorAll('.dsd-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      
      dropdown.classList.remove('active');
      UI.toast(`'${text}' 기준으로 정렬되었습니다.`, 'info', 1500);
    });
  });
}

function applySort(type) {
  switch (type) {
    case 'cross-desc':
      REGION_STATS.sort((a, b) => b.crossing - a.crossing);
      break;
    case 'inside-desc':
      REGION_STATS.sort((a, b) => b.inside - a.inside);
      break;
    case 'cross-asc':
      REGION_STATS.sort((a, b) => a.crossing - b.crossing);
      break;
    case 'inside-asc':
      REGION_STATS.sort((a, b) => a.inside - b.inside);
      break;
    case 'name-asc':
      REGION_STATS.sort((a, b) => a.label.localeCompare(b.label, 'ko'));
      break;
    case 'name-desc':
      REGION_STATS.sort((a, b) => b.label.localeCompare(a.label, 'ko'));
      break;
  }
}

/* ── 초기화 ── */
document.addEventListener('DOMContentLoaded', () => {
  const user = Auth.requireLogin();
  if (!user) return;

  initUserDropdown(user);

  // 관리자 권한 체크: 관리자가 아닌 경우 헤더의 관리 버튼 숨김
  const btnNavAdmin = document.getElementById('btn-nav-admin');
  if (btnNavAdmin && user.role !== 'admin') {
    btnNavAdmin.style.display = 'none';
  }

  /* 지도 (위성 기본) */
  MapModule.init('map', { center: [36.5, 127.8], zoom: 7 });
  MapModule.renderRegionSummaries(REGION_STATS);

  updateKPI(REGION_STATS);
  applySort('cross-desc'); // 초기 정렬: 걸침 많은 순
  renderRegionList();
  initSearch();
  initSorting(); // 정렬 초기화 추가

  /* 줌 버튼 */
  document.getElementById('btn-zoom-in') .addEventListener('click', () => MapModule.map.zoomIn());
  document.getElementById('btn-zoom-out').addEventListener('click', () => MapModule.map.zoomOut());

  /* 배경지도/측정/그리기 메뉴 토글 공통 로직 */
  const btnBasemap = document.getElementById('btn-basemap');
  const menuBasemap = document.getElementById('basemap-menu');
  const btnMeasure = document.getElementById('btn-measure');
  const menuMeasure = document.getElementById('measure-menu');
  const btnDraw = document.getElementById('btn-draw');
  const menuDraw = document.getElementById('draw-menu');
  
  const closeAllMenus = () => {
    [menuBasemap, menuMeasure, menuDraw].forEach(m => m?.classList.remove('open'));
    [btnBasemap, btnMeasure, btnDraw].forEach(b => b?.classList.remove('active'));
  };

  if (btnBasemap && menuBasemap) {
    btnBasemap.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = menuBasemap.classList.contains('open');
      closeAllMenus();
      if (!isOpen) {
        menuBasemap.classList.add('open');
        btnBasemap.classList.add('active');
      }
    });

    menuBasemap.querySelectorAll('.bm-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const type = item.dataset.type;
        const label = MapModule.setBasemap(type);
        menuBasemap.querySelectorAll('.bm-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        closeAllMenus();
        UI.toast(`${label}로 전환했습니다.`, 'info', 1800);
      });
    });
  }

  if (btnMeasure && menuMeasure) {
    btnMeasure.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = menuMeasure.classList.contains('open');
      closeAllMenus();
      if (!isOpen) {
        menuMeasure.classList.add('open');
        btnMeasure.classList.add('active');
      }
    });

    menuMeasure.querySelectorAll('.bm-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        menuMeasure.querySelectorAll('.bm-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        closeAllMenus();
      });
    });
  }

  if (btnDraw && menuDraw) {
    btnDraw.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = menuDraw.classList.contains('open');
      closeAllMenus();
      if (!isOpen) {
        menuDraw.classList.add('open');
        btnDraw.classList.add('active');
      }
    });

    menuDraw.querySelectorAll('.bm-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        menuDraw.querySelectorAll('.bm-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        closeAllMenus();
      });
    });
  }

  // 외부 클릭 시 모든 메뉴 닫기
  document.addEventListener('click', (e) => {
    if (menuBasemap && !btnBasemap.contains(e.target) && !menuBasemap.contains(e.target)) {
      menuBasemap.classList.remove('open');
      btnBasemap.classList.remove('active');
    }
    if (menuMeasure && !btnMeasure.contains(e.target) && !menuMeasure.contains(e.target)) {
      menuMeasure.classList.remove('open');
      btnMeasure.classList.remove('active');
    }
    if (menuDraw && !btnDraw.contains(e.target) && !menuDraw.contains(e.target)) {
      menuDraw.classList.remove('open');
      btnDraw.classList.remove('active');
    }
  });

  /* ── 보안 서약서 모달 제어 ── */
  const btnExport = document.getElementById('btn-export-tool');
  const modalPledge = document.getElementById('modal-pledge');
  const btnPledgeClose = document.getElementById('btn-pledge-close');
  const btnPledgeCancel = document.getElementById('btn-pledge-cancel');
  const btnPledgeExec = document.getElementById('btn-pledge-exec');

  if (btnExport && modalPledge) {
    btnExport.addEventListener('click', () => {
      modalPledge.classList.add('active');
    });
  }

  const closePledgeModal = () => {
    modalPledge.classList.remove('active');
  };

  if (btnPledgeClose) btnPledgeClose.addEventListener('click', closePledgeModal);
  if (btnPledgeCancel) btnPledgeCancel.addEventListener('click', closePledgeModal);

  if (btnPledgeExec) {
    btnPledgeExec.addEventListener('click', () => {
      const agreeCheck = document.getElementById('pledge-agree');
      const reqNameInput = document.getElementById('p-req-name');
      const startDateInput = document.getElementById('p-start-date');
      const endDateInput = document.getElementById('p-end-date');
      const purposeInput = document.getElementById('p-purpose');

      // 기존 에러 초기화
      document.querySelectorAll('.p-form-group').forEach(group => group.classList.remove('has-error'));

      let hasError = false;

      // 필수 항목 검증
      if (!reqNameInput.value.trim()) {
        reqNameInput.closest('.p-form-group').classList.add('has-error');
        hasError = true;
      }
      if (!startDateInput.value || !endDateInput.value) {
        startDateInput.closest('.p-form-group').classList.add('has-error');
        hasError = true;
      }
      if (!purposeInput.value.trim()) {
        purposeInput.closest('.p-form-group').classList.add('has-error');
        hasError = true;
      }

      if (hasError) {
        return;
      }

      if (!agreeCheck.checked) {
        agreeCheck.closest('.p-form-group').classList.add('has-error');
        return;
      }

      // 성공 -> 2단계로 전환
      UI.toast('보안 서약이 완료되었습니다.', 'success', 1500);
      
      const pledgeBox = document.querySelector('.modal-pledge-box');
      const saveMapBox = document.getElementById('modal-save-map');
      
      if (pledgeBox && saveMapBox) {
        pledgeBox.style.display = 'none';
        saveMapBox.style.display = 'block';
        
        // 미리보기 레이어 (예시설정 — 현재 베이스맵에 따라 이미지 다르게 가능)
        const previewImg = document.getElementById('img-map-preview');
        // 예: MapModule._currentBase 에 따라 분기 가능
      }
    });
  }

  /* ── 지도 저장 모달 제어 (2단계) ── */
  const btnSaveMapClose = document.getElementById('btn-save-map-close');
  const btnSaveMapCancel = document.getElementById('btn-save-map-cancel');
  const btnMapPrint = document.getElementById('btn-map-print');
  const memoInput = document.getElementById('memo-input');
  const currMemoLen = document.getElementById('curr-memo-len');

  const closeAllModals = () => {
    modalPledge.classList.remove('active');
    // 리셋 로직
    setTimeout(() => {
      document.querySelector('.modal-pledge-box').style.display = 'block';
      document.getElementById('modal-save-map').style.display = 'none';
      if (memoInput) memoInput.value = '';
      if (currMemoLen) currMemoLen.textContent = '0';
    }, 4000);
  };

  if (btnSaveMapClose) btnSaveMapClose.addEventListener('click', closeAllModals);
  if (btnSaveMapCancel) btnSaveMapCancel.addEventListener('click', closeAllModals);

  if (memoInput && currMemoLen) {
    memoInput.addEventListener('input', () => {
      currMemoLen.textContent = memoInput.value.length;
    });
  }

  if (btnMapPrint) {
    btnMapPrint.addEventListener('click', () => {
      UI.toast('지도가 출력(저장)되었습니다.', 'success');
      closeAllModals();
    });
  }

  /* 상세 뷰: 뒤로가기 */
  /* 상세 뷰: 뒤로가기 (전체 목록 버튼) */
  const btnSidebarBack = document.getElementById('btn-sidebar-back');
  if (btnSidebarBack) {
    btnSidebarBack.addEventListener('click', () => {
      // 데스크탑 전용: 지역 목록으로 복구 (모바일에서는 .btn-back이 숨김처리됨)
      if (window.innerWidth > 768) {
        switchSidebarView('sidebar-main-view');
        
        // 2. 데이터 및 UI 초기화
        updateKPI(REGION_STATS); 
        document.querySelectorAll('.region-card').forEach(c => c.classList.remove('active'));
        
        // 3. 지도 초기화
        MapModule.map.flyTo([36.5, 127.8], 7, { duration: 0.8 });
        MapModule.renderRegionSummaries(REGION_STATS);
        MapModule.clearFacilityLayers(); 

        // 4. 플래그 제거
        document.body.classList.remove('detail-mode-active');
      }
    });
  }

  /* 상세 뷰: 시설물 검색 */
  const facSearch = document.getElementById('facility-search-input');
  if (facSearch) {
    facSearch.addEventListener('input', () => {
      const title = document.getElementById('side-detail-title').textContent.replace(' 시설물 목록', '');
      renderFacilityList(title, facSearch.value.trim());
    });
  }

  initLayerControls();
  initFacilityControls(); // 시설물 상세 컨트롤 초기화
});

/* ── 시설물 상세 컨트롤 (필터/정렬) ── */
function initFacilityControls() {
  const crossingBtn = document.getElementById('fac-filter-crossing');
  const insideBtn   = document.getElementById('fac-filter-inside');

  const btnSort   = document.getElementById('btn-fac-sort');
  const ddownSort = document.getElementById('fac-sort-dropdown');
  const lblSort   = document.getElementById('fac-sort-label');

  if (!crossingBtn || !insideBtn) return;

  // 1. 필터링 (걸침)
  crossingBtn.addEventListener('click', () => {
    if (currentFacFilter === 'crossing') {
      currentFacFilter = 'all';
      crossingBtn.classList.remove('active');
    } else {
      currentFacFilter = 'crossing';
      crossingBtn.classList.add('active');
      insideBtn.classList.remove('active');
    }
    const title = document.getElementById('side-detail-title').textContent.replace(' 시설물 목록', '');
    renderFacilityList(title);
  });

  // 1. 필터링 (구역내)
  insideBtn.addEventListener('click', () => {
    if (currentFacFilter === 'inside') {
      currentFacFilter = 'all';
      insideBtn.classList.remove('active');
    } else {
      currentFacFilter = 'inside';
      insideBtn.classList.add('active');
      crossingBtn.classList.remove('active');
    }
    const title = document.getElementById('side-detail-title').textContent.replace(' 시설물 목록', '');
    renderFacilityList(title);
  });

  // 2. 정렬 토글
  if (btnSort) {
    btnSort.addEventListener('click', e => {
      e.stopPropagation();
      ddownSort.classList.toggle('active');
    });
    document.addEventListener('click', () => ddownSort.classList.remove('active'));
  }

  // 3. 정렬 항목 클릭
  if (ddownSort) {
    ddownSort.querySelectorAll('.dsd-item').forEach(item => {
      item.addEventListener('click', () => {
        const type = item.dataset.sort;
        const text = item.textContent;

        currentFacSort = type;
        lblSort.textContent = text;

        ddownSort.querySelectorAll('.dsd-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        const title = document.getElementById('side-detail-title').textContent.replace(' 시설물 목록', '');
        renderFacilityList(title);
        UI.toast(`시설물 목록이 '${text}' 기준으로 정렬되었습니다.`, 'info', 1200);
      });
    });
  }
}

/* ── 레이어 설정 및 모바일 인터랙션 ── */
function initLayerControls() {
  /* ── 모바일 상단 메인 버튼 인터랙션 ── */
  const btnMSidebar  = document.getElementById('btn-m-sidebar-toggle');
  const btnMSideClose = document.getElementById('btn-m-sidebar-close');
  const btnMTools    = document.getElementById('btn-m-tools-toggle');
  const btnMListOpen  = document.getElementById('btn-m-list-open');
  const btnMLayerOpen = document.getElementById('btn-m-layer-open');
  
  const backdrop     = document.getElementById('sidebar-backdrop');
  const leftPanel    = document.getElementById('db-left-panel');
  const detailSheet  = document.getElementById('sidebar-detail-view');
  const toolGroup    = document.getElementById('db-right-tools');

  const layerBox = document.getElementById('db-layer-settings');
  const btnMin  = document.getElementById('btn-layer-minimize');

  // 사이드바 열기
  if (btnMSidebar) {
    btnMSidebar.addEventListener('click', (e) => {
      e.stopPropagation();
      leftPanel.classList.add('open');
      if (backdrop) backdrop.classList.add('active');
      // 사이드바 열 때 목록/레이어 버튼 숨김
      toggleMobileFloatingButtons(false);
      if (detailSheet) detailSheet.classList.remove('active');
    });
  }

  // 레이어 설정 최소화 (데스크탑) / 클릭 시 숨김 (모바일)
  if (btnMin && layerBox) {
    btnMin.addEventListener('click', (e) => {
      e.stopPropagation();
      if (window.innerWidth <= 768) {
        // 모바일에서는 접지 않고 완전히 숨김
        layerBox.classList.add('hidden');
      } else {
        layerBox.classList.toggle('minimized');
      }
    });
  }

  // 사이드바 닫기 (X 버튼)
  if (btnMSideClose) {
    btnMSideClose.addEventListener('click', () => {
      leftPanel.classList.remove('open');
      if (backdrop) backdrop.classList.remove('active');
      
      // 사이드바가 닫힐 때 분석 중이라면 플로팅 버튼들 다시 표시
      if (document.body.classList.contains('detail-mode-active')) {
        toggleMobileFloatingButtons(true);
      }
    });
  }

  // 백드롭 클릭 시 상황에 맞춰 닫기
  if (backdrop) {
    backdrop.addEventListener('click', () => {
      if (leftPanel && leftPanel.classList.contains('open')) {
        // 1. 사이드바가 열려있으면 사이드바만 닫음
        leftPanel.classList.remove('open');
        backdrop.classList.remove('active');
        // 상세 분석 중이면 플로팅 버튼들 복구
        if (document.body.classList.contains('detail-mode-active')) {
          toggleMobileFloatingButtons(true);
        }
      } else if (detailSheet && detailSheet.classList.contains('active')) {
        // 2. 사이드바는 닫혀있고 상세 시트만 열려있으면 시트 닫음
        detailSheet.classList.remove('active');
        backdrop.classList.remove('active');
        toggleMobileFloatingButtons(true);
      }
    });
  }

  // 도구 버튼 토글
  if (btnMTools) {
    btnMTools.addEventListener('click', (e) => {
      e.stopPropagation();
      btnMTools.classList.toggle('active');
      if (toolGroup) toolGroup.classList.toggle('active');
    });
  }

  // ── [모바일 전용] 이벤트 위임 (목록 보기 / 레이어 설정) ──
  document.addEventListener('click', (e) => {
    // 1. 목록 보기 버튼 클릭
    const listBtn = e.target.closest('#btn-m-list-open');
    if (listBtn) {
      e.stopPropagation();
      console.log('Mobile: "Show List" button clicked.');
      if (detailSheet) {
        detailSheet.classList.add('active');
        if (backdrop) backdrop.classList.add('active');
        toggleMobileFloatingButtons(false); // 열릴 때 버튼들 숨김
      }
      return;
    }

    // 2. 레이어 설정 버튼 클릭 (플로팅 버튼)
    const layerBtn = e.target.closest('#btn-m-layer-open');
    if (layerBtn) {
      e.stopPropagation();
      console.log('Mobile: "Layer Settings" button clicked.');
      if (layerBox) {
        layerBox.classList.toggle('hidden');
      }
      return;
    }

    // 3. 레이어 설정 헤더 닫기 버튼 클릭 (헤더 내 X 버튼)
    const layerCloseBtn = e.target.closest('#btn-layer-m-close');
    if (layerCloseBtn) {
      e.stopPropagation();
      console.log('Mobile: "Layer Header X" button clicked.');
      if (layerBox) {
        layerBox.classList.add('hidden');
      }
      return;
    }
  });

  // 모바일 전용 닫기 버튼 (비파괴적 닫기)
  const btnMCloseTab = document.getElementById('btn-sidebar-m-close');
  if (btnMCloseTab) {
    btnMCloseTab.addEventListener('click', (e) => {
      e.stopPropagation();
      if (detailSheet) detailSheet.classList.remove('active');
      if (backdrop) backdrop.classList.remove('active');
      
      // 닫힐 때 버튼 다시 표시
      toggleMobileFloatingButtons(true);
      // 지도 초기화나 KPI 초기화 하지 않음 (사용자 요구사항)
    });
  }
}

/** 사이드바 뷰 전환 (지역목록 <-> 시설물 목록) — 데스크탑 용/공통 */
function switchSidebarView(viewId) {
  const allViews = document.querySelectorAll('.db-sidebar-view');
  const mainPanel = document.getElementById('db-left-panel');
  const detailView = document.getElementById('sidebar-detail-view');
  const layerSettings = document.getElementById('db-layer-settings');

  // 1. 모든 뷰의 active 클래스 제거
  allViews.forEach(v => v.classList.remove('active'));

  // 2. 타겟 뷰에 active 클래스 추가
  const target = document.getElementById(viewId);
  if (target) {
    target.classList.add('active');
  }

  // 3. 레이어 설정 패널 노출 제어 (상세 모드 전용)
  if (layerSettings) {
    if (viewId === 'sidebar-detail-view') {
      layerSettings.classList.remove('hidden');
      document.body.classList.add('detail-mode-active');
    } else {
      layerSettings.classList.add('hidden');
      document.body.classList.remove('detail-mode-active');
    }
  }

  // 4. 지점 상세 뷰가 독립 요소이므로, 해당 전환 시 메인 패널 가독성 제어 (데스크탑)
  if (window.innerWidth > 768) {
    if (viewId === 'sidebar-detail-view') {
      if (mainPanel) mainPanel.style.display = 'none';
      if (detailView) detailView.style.display = 'flex';
    } else {
      if (mainPanel) mainPanel.style.display = 'flex';
      if (detailView) detailView.style.display = 'none';
    }
  }
}

/** 모바일 플로팅 버튼들 제어 (목록보기/레이어설정 쌍으로 동작) */
function toggleMobileFloatingButtons(show) {
  const btnGroup = document.querySelector('.m-floating-btn-group');
  const layerPanel = document.getElementById('db-layer-settings');

  if (show) {
    // 상세 모드 진입 시 버튼 그룹 노출
    if (btnGroup) btnGroup.classList.add('visible');
  } else {
    // 사이드바/시트 열릴 때 버튼 그룹 숨김
    if (btnGroup) btnGroup.classList.remove('visible');
    
    // 버튼이 숨겨질 때 레이어 패널을 강제로 닫지는 않음
    // (사이드바가 화면을 덮으면 CSS z-index로 자연스럽게 가려지며, 
    // 사이드바를 닫았을 때 레이어 패널이 이전 상태를 유지하게 함)
  }
}
