'use strict';

let reportMarker = null;

/* ── 신고 지도 초기화 ── */
function initReportMap() {
  const map = L.map('report-map', { center: [36.5, 127.8], zoom: 7, zoomControl: true });

  /* 위성 타일 */
  L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    { attribution: '© Esri', maxZoom: 19 }
  ).addTo(map);

  const pinIcon = L.divIcon({
    html: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
      <path d="M14 0C6.27 0 0 6.27 0 14c0 9.33 14 22 14 22S28 23.33 28 14C28 6.27 21.73 0 14 0z" fill="#003478" stroke="white" stroke-width="1.5"/>
      <circle cx="14" cy="14" r="5.5" fill="rgba(255,255,255,0.9)"/>
    </svg>`,
    className: '', iconSize: [28, 36], iconAnchor: [14, 36],
  });

  map.on('click', e => {
    const { lat, lng } = e.latlng;
    if (reportMarker) map.removeLayer(reportMarker);
    reportMarker = L.marker([lat, lng], { icon: pinIcon }).addTo(map)
      .bindPopup(`선택된 위치<br><small>${lat.toFixed(5)}, ${lng.toFixed(5)}</small>`).openPopup();
    document.getElementById('report-lat').value = lat.toFixed(6);
    document.getElementById('report-lng').value = lng.toFixed(6);
    document.getElementById('coord-display').textContent =
      `선택된 좌표: 위도 ${lat.toFixed(5)}, 경도 ${lng.toFixed(5)}`;
    goStep(2);
  });
}

/* ── 단계 이동 ── */
function goStep(n) {
  [1,2,3].forEach(i => {
    const el = document.getElementById('step' + i);
    if (!el) return;
    if (i < n)  { el.className = 'step done'; el.querySelector('.step-num').textContent = '✓'; }
    else if (i === n) el.className = 'step active';
    else el.className = 'step';
  });
  [1,2].forEach(i => {
    const line = document.getElementById('line' + i);
    if (!line) return;
    line.className = i < n ? 'step-line done' : 'step-line';
  });
}

/* ── 파일 미리보기 ── */
function previewFiles(input) {
  const preview = document.getElementById('file-preview');
  preview.innerHTML = '';
  Array.from(input.files).slice(0, 5).forEach(file => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = document.createElement('img');
      img.src = e.target.result;
      img.style.cssText = 'width:60px;height:60px;object-fit:cover;border-radius:6px;border:1px solid var(--border-color);';
      preview.appendChild(img);
    };
    reader.readAsDataURL(file);
  });
}

/* ── 지역 옵션 채우기 ── */
function initRegionOptions() {
  const sel = document.getElementById('rep-region');
  if (!sel) return;
  Object.entries(REGIONS).forEach(([code, label]) => {
    sel.innerHTML += `<option value="${code}">${label}</option>`;
  });
}

/* ── 폼 제출 ── */
function initForm() {
  const form = document.getElementById('report-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;
    const fields = [
      { id:'rep-name',     msg:'시설명을 입력하세요.' },
      { id:'rep-type',     msg:'시설 유형을 선택하세요.' },
      { id:'rep-category', msg:'구분을 선택하세요.' },
      { id:'rep-address',  msg:'주소를 입력하세요.' },
      { id:'rep-region',   msg:'지역을 선택하세요.' },
    ];

    // 초기화
    fields.forEach(({ id }) => {
      const el  = document.getElementById(id);
      if (!el) return;
      const err = el.closest('.form-group')?.querySelector('.form-error');
      el.classList.remove('error');
      if (err) err.classList.remove('visible');
    });

    // 좌표 확인
    if (!document.getElementById('report-lat').value) {
      UI.toast('지도에서 위치를 먼저 선택해 주세요.', 'warning');
      valid = false;
    }

    fields.forEach(({ id, msg }) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (!el.value.trim()) {
        el.classList.add('error');
        const err = el.closest('.form-group')?.querySelector('.form-error');
        if (err) { err.textContent = msg; err.classList.add('visible'); }
        valid = false;
      }
    });

    if (!valid) return;

    const btn = document.getElementById('btn-submit');
    btn.disabled = true;
    btn.textContent = '제출 중…';

    setTimeout(() => {
      document.getElementById('report-form').classList.add('hidden');
      document.getElementById('complete-section').classList.remove('hidden');
      goStep(3);
      document.querySelector('.step-indicator').scrollIntoView({ behavior: 'smooth' });
    }, 800);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const user = Auth.requireLogin();
  if (!user) return;
  document.getElementById('user-name').textContent  = user.name;
  const avatar = document.getElementById('user-avatar');
  if (avatar) avatar.textContent = user.name[0];
  UI.initSidebar();
  document.querySelectorAll('.sidebar-link').forEach(el => {
    if (el.getAttribute('href') === 'report.html') el.classList.add('active');
  });
  initReportMap();
  initRegionOptions();
  initForm();
});
