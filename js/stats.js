'use strict';

/* Chart.js 기본 폰트 */
Chart.defaults.font.family = "'Noto Sans KR', sans-serif";
Chart.defaults.font.size   = 11;
Chart.defaults.color       = '#555e6b';

const COLORS = {
  crossing : '#e65100',
  inside   : '#c62828',
  completed: '#2e7d32',
  inprog   : '#f57c00',
  unresolv : '#b71c1c',
  primary  : '#003478',
  regionBg : 'rgba(230,81,0,0.18)',
  insideBg : 'rgba(198,40,40,0.18)',
};

/* ── KPI 계산 ── */
function calcStats() {
  const facilities = MOCK_FACILITIES;
  if (!facilities) return { crossing: 0, inside: 0, completed: 0 };
  const crossing   = facilities.filter(f => f.category === 'crossing').length;
  const inside     = facilities.filter(f => f.category === 'inside').length;
  const completed  = facilities.filter(f => f.status === 'completed').length;
  const rate       = Math.round(completed / facilities.length * 100);

  document.getElementById('st-total').textContent    = facilities.length;
  document.getElementById('st-crossing').textContent = crossing;
  document.getElementById('st-inside').textContent   = inside;
  document.getElementById('st-rate').textContent     = rate + '%';
  return { crossing, inside, completed };
}

/* ── 걸침/구역내 도넛 ── */
function drawCategoryChart(crossing, inside) {
  const canvas = document.getElementById('chart-category');
  if (!canvas) return;
  new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: ['걸침', '구역내'],
      datasets: [{
        data: [crossing, inside],
        backgroundColor: [COLORS.crossing, COLORS.inside],
        borderColor: ['#fff','#fff'],
        borderWidth: 3,
        hoverOffset: 6,
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: true,
      plugins: {
        legend: { position: 'bottom' },
        tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.parsed}건` } },
      },
      cutout: '60%',
    },
  });
}

/* ── 시설 유형별 막대 ── */
function drawTypeChart() {
  const canvas = document.getElementById('chart-type');
  if (!canvas) return;
  const counts = {};
  MOCK_FACILITIES.forEach(f => { counts[f.typeLabel] = (counts[f.typeLabel] || 0) + 1; });
  const labels = Object.keys(counts);
  const data   = Object.values(counts);
  const bgColors = ['#1565C0','#00695C','#6A1B9A','#E65100','#2E7D32','#C62828'];

  new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [{ label: '건수', data, backgroundColor: bgColors, borderRadius: 4, borderSkipped: false }],
    },
    options: {
      responsive: true, maintainAspectRatio: true,
      indexAxis: 'y',
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: '#f0f3f8' }, ticks: { stepSize: 1 } },
        y: { grid: { display: false } },
      },
    },
  });
}

/* ── 지역별 걸침/구역내 막대 ── */
function drawRegionChart() {
  const canvas = document.getElementById('chart-region');
  if (!canvas) return;
  const regions = [...new Set(MOCK_FACILITIES.map(f => f.regionLabel))];
  const crossing = regions.map(r =>
    MOCK_FACILITIES.filter(f => f.regionLabel === r && f.category === 'crossing').length);
  const inside = regions.map(r =>
    MOCK_FACILITIES.filter(f => f.regionLabel === r && f.category === 'inside').length);

  new Chart(canvas, {
    type: 'bar',
    data: {
      labels: regions,
      datasets: [
        { label: '걸침',   data: crossing, backgroundColor: COLORS.crossing, borderRadius: 3 },
        { label: '구역내', data: inside,   backgroundColor: COLORS.inside,   borderRadius: 3 },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'top' } },
      scales: {
        x: { stacked: false, grid: { display: false } },
        y: { stacked: false, grid: { color: '#f0f3f8' }, ticks: { stepSize: 1 } },
      },
    },
  });
}

/* ── 월별 추이 ── */
function drawTrendChart() {
  const canvas = document.getElementById('chart-trend');
  if (!canvas) return;
  const labels = ['2024.10','2024.11','2024.12','2025.01','2025.02','2025.03','2025.04'];
  const reported  = [3, 4, 3, 5, 6, 7, 6];
  const completed = [1, 2, 3, 3, 2, 4, 3];

  new Chart(canvas, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: '신고 건수',
          data: reported,
          borderColor: COLORS.crossing,
          backgroundColor: 'rgba(230,81,0,0.08)',
          fill: true,
          tension: 0.35,
          pointRadius: 4,
          pointBackgroundColor: COLORS.crossing,
        },
        {
          label: '정비 완료',
          data: completed,
          borderColor: COLORS.completed,
          backgroundColor: 'rgba(46,125,50,0.08)',
          fill: true,
          tension: 0.35,
          pointRadius: 4,
          pointBackgroundColor: COLORS.completed,
        },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'top' } },
      scales: {
        x: { grid: { color: '#f0f3f8' } },
        y: { grid: { color: '#f0f3f8' }, ticks: { stepSize: 1 }, beginAtZero: true },
      },
    },
  });
}

/* ── 지역별 테이블 ── */
function drawSummaryTable() {
  const regionCodes = [...new Set(MOCK_FACILITIES.map(f => f.region))];
  const tbody = document.getElementById('summary-tbody');
  if (!tbody) return;

  tbody.innerHTML = regionCodes.map(code => {
    const items     = MOCK_FACILITIES.filter(f => f.region === code);
    if (!items || items.length === 0) return '';
    const label     = items[0].regionLabel;
    const crossing  = items.filter(f => f.category === 'crossing').length;
    const inside    = items.filter(f => f.category === 'inside').length;
    const unresolv  = items.filter(f => f.status === 'unresolved').length;
    const inprog    = items.filter(f => f.status === 'inprogress').length;
    const completed = items.filter(f => f.status === 'completed').length;
    const rate      = Math.round(completed / items.length * 100);
    const rateColor = rate >= 60 ? 'var(--success)' : rate >= 30 ? 'var(--warning)' : 'var(--danger)';
    return `<tr>
      <td><strong>${label}</strong></td>
      <td>${items.length}</td>
      <td style="color:var(--warning);font-weight:600;">${crossing}</td>
      <td style="color:var(--danger);font-weight:600;">${inside}</td>
      <td>${unresolv}</td>
      <td>${inprog}</td>
      <td>${completed}</td>
      <td style="font-weight:700;color:${rateColor};">${rate}%</td>
    </tr>`;
  }).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  const user = Auth.requireLogin();
  if (!user) return;
  document.getElementById('user-name').textContent   = user.name;
  const avatar = document.getElementById('user-avatar');
  if (avatar) avatar.textContent = user.name[0];
  UI.initSidebar();
  document.querySelectorAll('.sidebar-link').forEach(el => {
    if (el.getAttribute('href') === 'stats.html') el.classList.add('active');
  });

  const { crossing, inside } = calcStats();
  drawCategoryChart(crossing, inside);
  drawTypeChart();
  drawRegionChart();
  drawTrendChart();
  drawSummaryTable();
});
