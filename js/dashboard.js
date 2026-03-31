'use strict';

/* ── 참고 데이터 기반 17개 지역 (가나다 순) ── */
const REGION_STATS = [
  { code:'gangwon',   label:'강원',  rivers:18,  crossing:43268,  inside:15126 },
  { code:'gyeonggi',  label:'경기',  rivers:44,  crossing:100566, inside:33264 },
  { code:'gyeongnam', label:'경남',  rivers:22,  crossing:66778,  inside:19413 },
  { code:'gyeongbuk', label:'경북',  rivers:23,  crossing:98582,  inside:36194 },
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
  ]
};

/* ── 시설물 세부 데이터 (가평군/조종면 예시) ── */
const MOCK_FACILITY_DETAILS = [
  { addr: '조종면 상판리 산 121', cat: '국가하천', area: '12㎡', areaNum: 12, type: 'crossing', pct: '87%', pctVal: 87 },
  { addr: '조종면 상판리 41', cat: '국가하천', area: '15㎡', areaNum: 15, type: 'inside', pct: '100%', pctVal: 100 },
  { addr: '조종면 상판리 산 121', cat: '국가하천', area: '13㎡', areaNum: 13, type: 'crossing', pct: '92%', pctVal: 92 },
  { addr: '조종면 상판리 산 121', cat: '국가하천', area: '6㎡', areaNum: 6, type: 'inside', pct: '100%', pctVal: 100 },
  { addr: '조종면 상판리 산 121', cat: '국가하천', area: '22㎡', areaNum: 22, type: 'crossing', pct: '55%', pctVal: 55 },
  { addr: '조종면 상판리 603-2', cat: '국가하천', area: '4㎡', areaNum: 4, type: 'inside', pct: '100%', pctVal: 100 },
  { addr: '조종면 상판리 산 146', cat: '국가하천', area: '2㎡', areaNum: 2, type: 'crossing', pct: '88%', pctVal: 88 },
  { addr: '조종면 상판리 603-2', cat: '국가하천', area: '20㎡', areaNum: 20, type: 'inside', pct: '100%', pctVal: 100 },
  { addr: '조종면 상판리 491-3', cat: '국가하천', area: '9㎡', areaNum: 9, type: 'crossing', pct: '78%', pctVal: 78 },
  { addr: '조종면 상판리 491-3', cat: '국가하천', area: '6㎡', areaNum: 6, type: 'inside', pct: '100%', pctVal: 100 },
  { addr: '조종면 상판리 582', cat: '국가하천', area: '16㎡', areaNum: 16, type: 'crossing', pct: '99%', pctVal: 99 },
  { addr: '조종면 상판리 565', cat: '국가하천', area: '9㎡', areaNum: 9, type: 'inside', pct: '100%', pctVal: 100 },
  { addr: '조종면 상판리 565', cat: '국가하천', area: '6㎡', areaNum: 6, type: 'crossing', pct: '64%', pctVal: 64 },
  { addr: '조종면 상판리 655', cat: '국가하천', area: '4㎡', areaNum: 4, type: 'inside', pct: '100%', pctVal: 100 },
  { addr: '조종면 상판리 597', cat: '국가하천', area: '6㎡', areaNum: 6, type: 'crossing', pct: '67%', pctVal: 67 },
  { addr: '조종면 상판리 571', cat: '국가하천', area: '10㎡', areaNum: 10, type: 'inside', pct: '100%', pctVal: 100 },
  { addr: '조종면 상판리 571', cat: '국가하천', area: '2㎡', areaNum: 2, type: 'crossing', pct: '56%', pctVal: 56 },
  { addr: '조종면 상판리 571', cat: '국가하천', area: '6㎡', areaNum: 6, type: 'inside', pct: '100%', pctVal: 100 },
  { addr: '조종면 상판리 571', cat: '국가하천', area: '8㎡', areaNum: 8, type: 'crossing', pct: '81%', pctVal: 81 },
  { addr: '조종면 상판리 571-6', cat: '국가하천', area: '2㎡', areaNum: 2, type: 'inside', pct: '100%', pctVal: 100 },
  { addr: '조종면 상판리 603', cat: '국가하천', area: '18㎡', areaNum: 18, type: 'crossing', pct: '91%', pctVal: 91 },
  { addr: '조종면 상판리 603', cat: '국가하천', area: '5㎡', areaNum: 5, type: 'inside', pct: '100%', pctVal: 100 },
  { addr: '조종면 상판리 603', cat: '국가하천', area: '10㎡', areaNum: 10, type: 'crossing', pct: '76%', pctVal: 76 },
  { addr: '조종면 상판리 571', cat: '국가하천', area: '8㎡', areaNum: 8, type: 'inside', pct: '100%', pctVal: 100 },
  { addr: '조종면 상판리 603', cat: '국가하천', area: '11㎡', areaNum: 11, type: 'crossing', pct: '72%', pctVal: 72 }
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
      <div class="facility-item ${statusClass}" role="listitem">
        <div class="fi-status ${statusClass}"></div>
        <div class="fi-content">
          <div class="fi-addr">${f.addr}</div>
          <div class="fi-meta">${f.cat} · ${f.area}</div>
        </div>
        <div class="fi-badge">${f.pct}</div>
      </div>
    `;
  }).join('');

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
      
      // 1. 상세 목록 전환
      renderFacilityList(subName);
      switchSidebarView('sidebar-detail-view');
      
      // 2. 하단 요약 카드 업데이트 (세부 지역 데이터 반영)
      if (subData) updateKPI(subData);
      
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
        
        const filtered = MOCK_FACILITIES.filter(f => f.region === code);
        MapModule.filterMarkers(filtered);
        MapModule.flyToBounds(code);
      } else {
        card.classList.remove('active');
        updateKPI(REGION_STATS);
        MapModule.filterMarkers(MOCK_FACILITIES);
        MapModule.map.flyTo([36.5, 127.8], 7, { duration: 0.8 });
      }
    };
    master.addEventListener('click', handler);
  });
}

/* ── 검색 오버레이 ── */
function initSearch() {
  const toggleBtn = document.getElementById('btn-search-toggle');
  const overlay   = document.getElementById('db-search-overlay');
  const closeBtn  = document.getElementById('btn-search-close');
  const input     = document.getElementById('db-search-input');

  toggleBtn.addEventListener('click', e => {
    e.stopPropagation();
    const isOpen = overlay.classList.toggle('open');
    toggleBtn.classList.toggle('active', isOpen);
    if (isOpen) { setTimeout(() => input.focus(), 80); }
    else { input.value = ''; MapModule.filterMarkers(MOCK_FACILITIES); }
  });

  closeBtn.addEventListener('click', () => {
    overlay.classList.remove('open');
    toggleBtn.classList.remove('active');
    input.value = '';
    MapModule.filterMarkers(MOCK_FACILITIES);
    document.querySelectorAll('.region-card').forEach(c => c.classList.remove('active'));
  });

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    const result = q
      ? MOCK_FACILITIES.filter(f =>
          f.name.toLowerCase().includes(q) || f.address.toLowerCase().includes(q))
      : MOCK_FACILITIES;
    document.querySelectorAll('.region-card').forEach(c => c.classList.remove('active'));
    MapModule.filterMarkers(result);
  });

  /* Esc 로 닫기 */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) {
      closeBtn.click();
    }
  });
}

/* ── 사용자 드롭다운 ── */
function initUserDropdown(user) {
  const btn      = document.getElementById('btn-logout');
  const dropdown = document.getElementById('user-dropdown');
  /* document.getElementById('header-user-name').textContent = user.name + '님'; */
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

  /* 지도 (위성 기본) */
  MapModule.init('map', { center: [36.5, 127.8], zoom: 7 });
  MapModule.renderMarkers(MOCK_FACILITIES);

  updateKPI(REGION_STATS);
  applySort('cross-desc'); // 초기 정렬: 걸침 많은 순
  renderRegionList();
  initSearch();
  initSorting(); // 정렬 초기화 추가

  /* 줌 버튼 */
  document.getElementById('btn-zoom-in') .addEventListener('click', () => MapModule.map.zoomIn());
  document.getElementById('btn-zoom-out').addEventListener('click', () => MapModule.map.zoomOut());

  /* 배경지도 토글 */
  document.getElementById('btn-basemap').addEventListener('click', () => {
    const label = MapModule.toggleBasemap();
    UI.toast(`${label}로 전환했습니다.`, 'info', 1800);
  });

  /* 상세 뷰: 뒤로가기 */
  document.getElementById('btn-sidebar-back').addEventListener('click', () => {
    switchSidebarView('sidebar-main-view');
  });

  /* 상세 뷰: 시설물 검색 */
  const facSearch = document.getElementById('facility-search-input');
  facSearch.addEventListener('input', () => {
    const title = document.getElementById('side-detail-title').textContent.replace(' 시설물 목록', '');
    renderFacilityList(title, facSearch.value.trim());
  });

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
  btnSort.addEventListener('click', e => {
    e.stopPropagation();
    ddownSort.classList.toggle('active');
  });
  document.addEventListener('click', () => ddownSort.classList.remove('active'));

  // 3. 정렬 항목 클릭
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

/* ── 레이어 설정 컨트롤 ── */
function initLayerControls() {
  const layerBox = document.getElementById('db-layer-settings');
  const btnMin  = document.getElementById('btn-layer-minimize');
  if (!layerBox || !btnMin) return;

  // 헤더 전체를 클릭하면 최소화/최대화 토글
  btnMin.addEventListener('click', () => {
    layerBox.classList.toggle('minimized');
  });
}
