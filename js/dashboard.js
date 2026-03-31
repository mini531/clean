'use strict';

/* ── 참고 데이터 기반 17개 지역 (가나다 순) ── */
const REGION_STATS = [
  { code:'gangwon',   label:'강원',  rivers:18,  crossing:43268,  inside:15126 },
  { code:'gyeonggi',  label:'경기',  rivers:44,  crossing:98762,  inside:30615 },
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

/* 숫자 천단위 포맷 */
function fmtNum(n) { return n.toLocaleString('ko-KR'); }

/* ── KPI 업데이트 (REGION_STATS 전체 합계) ── */
function updateKPI(stats) {
  const totalCross = stats.reduce((s, r) => s + r.crossing, 0);
  const totalIn    = stats.reduce((s, r) => s + r.inside, 0);
  const total      = totalCross + totalIn;
  /* 정비완료율은 MOCK 기준 유지 */
  const completed  = MOCK_FACILITIES.filter(f => f.status === 'completed').length;
  const rate       = Math.round(completed / MOCK_FACILITIES.length * 100);

  /* document.getElementById('kpi-total').textContent    = fmtNum(total); */
  document.getElementById('kpi-crossing').textContent = fmtNum(totalCross);
  document.getElementById('kpi-inside').textContent   = fmtNum(totalIn);
  /* document.getElementById('kpi-rate').textContent     = rate + '%'; */
  document.getElementById('leg-crossing').textContent = fmtNum(totalCross);
  document.getElementById('leg-inside').textContent   = fmtNum(totalIn);
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
      <div class="region-card" role="listitem" data-region="${r.code}" tabindex="0"
           aria-label="${r.label} 하천 ${r.rivers}개 걸침 ${fmtNum(r.crossing)} 구역내 ${fmtNum(r.inside)}">
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
        <div class="region-bar-track" title="걸침 ${fmtNum(r.crossing)} / 구역내 ${fmtNum(r.inside)}">
          <div class="bar-seg crossing" style="width:${crossPct}%"></div>
          <div class="bar-seg inside"   style="width:${insidePct}%"></div>
        </div>
      </div>`;
  }).join('');

  list.querySelectorAll('.region-card').forEach(card => {
    const handler = () => {
      const code = card.dataset.region;
      const isActive = card.classList.contains('active');
      list.querySelectorAll('.region-card').forEach(c => c.classList.remove('active'));

      if (!isActive) {
        card.classList.add('active');
        const filtered = MOCK_FACILITIES.filter(f => f.region === code);
        MapModule.filterMarkers(filtered);
        MapModule.flyToBounds(code);
      } else {
        MapModule.filterMarkers(MOCK_FACILITIES);
        MapModule.map.flyTo([36.5, 127.8], 7, { duration: 0.8 });
      }
    };
    card.addEventListener('click', handler);
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); }
    });
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

/* ── 초기화 ── */
document.addEventListener('DOMContentLoaded', () => {
  const user = Auth.requireLogin();
  if (!user) return;

  initUserDropdown(user);

  /* 지도 (위성 기본) */
  MapModule.init('map', { center: [36.5, 127.8], zoom: 7 });
  MapModule.renderMarkers(MOCK_FACILITIES);

  updateKPI(REGION_STATS);
  renderRegionList();
  initSearch();

  /* 줌 버튼 */
  document.getElementById('btn-zoom-in') .addEventListener('click', () => MapModule.map.zoomIn());
  document.getElementById('btn-zoom-out').addEventListener('click', () => MapModule.map.zoomOut());

  /* 배경지도 토글 */
  document.getElementById('btn-basemap').addEventListener('click', () => {
    const label = MapModule.toggleBasemap();
    UI.toast(`${label}로 전환했습니다.`, 'info', 1800);
  });
});
