/* =============================================
   map.js — Leaflet.js 지도 초기화 및 마커 관리
   ============================================= */
'use strict';

const MapModule = {
  map: null,
  markerGroup: null,
  satelliteLayer: null,
  streetLayer: null,

  /** 지도 초기화 */
  init(containerId, options = {}) {
    const defaults = { center: [36.5, 127.8], zoom: 7, minZoom: 6, maxZoom: 18 };
    const cfg = Object.assign(defaults, options);

    this.map = L.map(containerId, {
      center: cfg.center,
      zoom: cfg.zoom,
      minZoom: cfg.minZoom,
      maxZoom: cfg.maxZoom,
      zoomControl: false,   // 커스텀 줌 버튼 사용
    });

    /* 위성 레이어 (기본) */
    this.satelliteLayer = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      { attribution: '© Esri, Maxar, Earthstar Geographics', maxZoom: 19 }
    );
    /* 일반 레이어 */
    this.streetLayer = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      { attribution: '© OpenStreetMap contributors', maxZoom: 19 }
    );

    /* 기본: 위성 */
    this.satelliteLayer.addTo(this.map);
    this._currentBase = 'satellite';

    /* 마커 클러스터 그룹 — 걸침/구역내 카테고리 기반 색상 */
    this.markerGroup = L.markerClusterGroup({
      maxClusterRadius: 60,
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true,
      iconCreateFunction(cluster) {
        const children = cluster.getAllChildMarkers();
        const hasCrossing = children.some(m => m.options.category === 'crossing');
        const cls  = hasCrossing ? 'cluster-crossing' : 'cluster-inside';
        return L.divIcon({
          html: `<div class="cluster-badge ${cls}">${cluster.getChildCount()}</div>`,
          className: '',
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        });
      },
    });
    this.markerGroup.addTo(this.map);

    /* 지역 요약 파이 차트 그룹 */
    this.regionSummaryGroup = L.layerGroup().addTo(this.map);

    return this.map;
  },

  /** 지역별 요약 파이 차트 렌더링 */
  renderRegionSummaries(stats) {
    this.markerGroup.clearLayers();
    this.regionSummaryGroup.clearLayers();

    stats.forEach(stat => {
      const bounds = REGION_BOUNDS[stat.code];
      if (!bounds) return;
      const lat = (bounds[0][0] + bounds[1][0]) / 2;
      const lng = (bounds[0][1] + bounds[1][1]) / 2;
      
      const total = stat.crossing + stat.inside;
      const crossPct = total > 0 ? (stat.crossing / total) * 100 : 0;
      
      const grad = `conic-gradient(#ffab40 0% ${crossPct}%, #ff5252 ${crossPct}% 100%)`;
      
      const html = `
        <div class="region-pie-marker">
          <div class="region-pie-chart" style="background: ${grad}"></div>
          <div class="region-pie-label">${stat.label}</div>
        </div>
      `;
      
      const icon = L.divIcon({
        html: html,
        className: '',
        iconSize: [40, 50],
        iconAnchor: [20, 25]
      });

      const marker = L.marker([lat, lng], { icon: icon });
      marker.on('click', () => {
        // 지역 클릭 시 해당 지역을 사이드바에서 선택한 것과 동일한 효과
        if (window.handleRegionClick) {
          window.handleRegionClick(stat.code, stat.label);
        }
      });
      this.regionSummaryGroup.addLayer(marker);
    });
  },

  /** 배경지도 토글 */
  toggleBasemap() {
    if (this._currentBase === 'satellite') {
      this.map.removeLayer(this.satelliteLayer);
      this.streetLayer.addTo(this.map);
      this.streetLayer.bringToBack();
      this._currentBase = 'street';
      return '일반 지도';
    } else {
      this.map.removeLayer(this.streetLayer);
      this.satelliteLayer.addTo(this.map);
      this.satelliteLayer.bringToBack();
      this._currentBase = 'satellite';
      return '위성 지도';
    }
  },

  /** 마커 아이콘 — category 기반 (crossing=주황, inside=빨강) */
  _createIcon(category) {
    const isCrossing = category === 'crossing';
    const fill   = isCrossing ? '#e65100' : '#c62828';
    const stroke = isCrossing ? '#bf360c' : '#8e0000';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="34" viewBox="0 0 26 34">
      <path d="M13 0C5.82 0 0 5.82 0 13c0 8.67 13 21 13 21S26 21.67 26 13C26 5.82 20.18 0 13 0z"
            fill="${fill}" stroke="${stroke}" stroke-width="1.2"/>
      <circle cx="13" cy="13" r="5.5" fill="rgba(255,255,255,0.88)"/>
    </svg>`;
    return L.divIcon({
      html: svg,
      className: '',
      iconSize: [26, 34],
      iconAnchor: [13, 34],
      popupAnchor: [0, -34],
    });
  },

  /** 팝업 HTML */
  _popupHtml(f) {
    const catColor = f.category === 'crossing' ? '#e65100' : '#c62828';
    const catLabel = f.category === 'crossing' ? '걸침' : '구역내';
    return `
      <div style="min-width:220px;font-family:inherit;">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
          <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${catColor};flex-shrink:0;"></span>
          <strong style="font-size:13px;color:#1a1a2e;">${f.name}</strong>
        </div>
        <div style="font-size:11px;color:#666;margin-bottom:7px;">${f.address}</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:7px;">
          <span style="background:${catColor}22;color:${catColor};padding:2px 8px;border-radius:100px;font-size:11px;font-weight:700;">${catLabel}</span>
          <span style="background:#eef1f5;padding:2px 8px;border-radius:100px;font-size:11px;font-weight:600;">${f.typeLabel}</span>
        </div>
        <div style="font-size:11px;color:#999;margin-bottom:9px;">면적: ${Utils.formatArea(f.area)} · 신고: ${Utils.formatDate(f.reportDate)}</div>
        <div style="display:flex;gap:6px;">
          <a href="report.html" style="flex:1;text-align:center;padding:5px 8px;background:#003478;color:#fff;border-radius:4px;font-size:11px;font-weight:600;text-decoration:none;">신고 등록</a>
          <a href="stats.html"  style="flex:1;text-align:center;padding:5px 8px;background:#eef1f5;color:#333;border-radius:4px;font-size:11px;font-weight:600;text-decoration:none;">통계 보기</a>
        </div>
      </div>`;
  },

  /** 마커 전체 렌더링 */
  renderMarkers(facilities) {
    if (this.regionSummaryGroup) this.regionSummaryGroup.clearLayers();
    this.markerGroup.clearLayers();
    facilities.forEach(f => {
      const marker = L.marker([f.lat, f.lng], { icon: this._createIcon(f.category), category: f.category });
      marker.bindPopup(this._popupHtml(f), { maxWidth: 270, className: 'custom-popup' });
      this.markerGroup.addLayer(marker);
    });
  },

  /** 마커 필터링 */
  filterMarkers(facilities) { this.renderMarkers(facilities); },

  /** 특정 지역 바운드로 지도 이동 */
  flyToBounds(regionCode) {
    const bounds = REGION_BOUNDS[regionCode];
    if (!bounds) return;
    this.map.flyToBounds(L.latLngBounds(bounds), { padding: [40, 40], duration: 0.8 });
  },

  /** 특정 시설물 강조 표시 (사이드바 클릭 시 호출) */
  highlightFacility(f) {
    if (!this.map) return;

    // 1. 기존 강조 레이어 제거
    this.clearHighlights();

    const lat = parseFloat(f.lat);
    const lng = parseFloat(f.lng);
    const isCrossing = f.type === 'crossing' || f.category === 'crossing';
    const color = isCrossing ? '#ffab40' : '#ff5252';

    // 2. 가상의 영역(폴리곤) 생성 (mock 데이터이므로 좌표 주변에 사각형 생성)
    const offset = 0.0005;
    const polygonPoints = [
      [lat + offset, lng - offset],
      [lat + offset, lng + offset],
      [lat - offset, lng + offset],
      [lat - offset, lng - offset]
    ];

    this.highlightLayer = L.polygon(polygonPoints, {
      color: color,
      fillColor: color,
      fillOpacity: 0.4,
      weight: 2,
      dashArray: isCrossing ? '5, 5' : ''
    }).addTo(this.map);

    // 3. 지도 이동 및 줌
    this.map.flyTo([lat, lng], 17, { duration: 1.0 });

    // 4. 프리미엄 다크 글래스 팝업 표시
    const popupContent = this._createFacilityPopup(f);
    this.highlightLayer.bindPopup(popupContent, {
      maxWidth: 320,
      className: 'dark-glass-popup',
      offset: [0, -10],
      closeButton: false
    }).openPopup();
  },

  /** 강조 레이어 제거 */
  clearHighlights() {
    if (this.highlightLayer) {
      this.map.removeLayer(this.highlightLayer);
      this.highlightLayer = null;
    }
  },

  /** 프리미엄 다크 글래스 팝업 HTML 생성 */
  _createFacilityPopup(f) {
    const isInside = f.type === 'inside' || f.category === 'inside';
    const typeLabel = isInside ? '구역내' : '걸침';
    const typeClass = isInside ? 'inside' : 'crossing';
    const pct = f.pct || (f.occRate ? f.occRate + '%' : '100%');

    return `
      <div class="dg-popup-container">
        <div class="dg-popup-header">
          <div class="dg-popup-title ${typeClass}">${typeLabel}(${pct})</div>
          <button class="dg-popup-close" onclick="if(MapModule.highlightLayer) MapModule.highlightLayer.closePopup()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="dg-popup-body">
          <div class="dg-info-row">
            <span class="dg-info-label">하천등급</span>
            <span class="dg-info-value">${f.cat || f.riverGrade || '지방하천'}</span>
          </div>
          <div class="dg-info-row">
            <span class="dg-info-label">하천명</span>
            <span class="dg-info-value">${f.riverName || '-'}</span>
          </div>
          <div class="dg-info-row">
            <span class="dg-info-label">주소</span>
            <span class="dg-info-value">${f.addr || f.address}</span>
          </div>
          <div class="dg-info-row">
            <span class="dg-info-label">건물면적</span>
            <span class="dg-info-value">${f.area || (f.buildingArea ? f.buildingArea + '㎡' : '-')}</span>
          </div>
          <div class="dg-info-row">
            <span class="dg-info-label">점유면적</span>
            <span class="dg-info-value">${f.occArea ? f.occArea + '㎡' : (f.area || '-')}</span>
          </div>
          <div class="dg-info-row">
            <span class="dg-info-label">점유율</span>
            <span class="dg-info-value">${pct}</span>
          </div>
        </div>
      </div>
    `;
  },

  /** 미니맵 (상세페이지용) */
  initMini(containerId, facility) {
    const miniMap = L.map(containerId, {
      center: [facility.lat, facility.lng],
      zoom: 14,
      zoomControl: false,
      dragging: false,
      scrollWheelZoom: false,
    });
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      { attribution: '© Esri', maxZoom: 19 }).addTo(miniMap);
    L.marker([facility.lat, facility.lng], { icon: this._createIcon(facility.category) })
      .addTo(miniMap).bindPopup(facility.name).openPopup();
    return miniMap;
  },
};

/* 클러스터 + 팝업 CSS 동적 삽입 */
(function injectStyles() {
  const style = document.createElement('style');
  style.textContent = `
    /* 클러스터 배지 — 건수별 4단계 색상 */
    .cluster-badge {
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; color: #fff;
      border: 2.5px solid rgba(255,255,255,0.85);
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      width: 100%; height: 100%;
      font-size: 12px;
    }
    .cluster-crossing { background: #e65100; font-size: 12px; }  /* 걸침 포함 : 주황 */
    .cluster-inside   { background: #c62828; font-size: 12px; }  /* 구역내만  : 빨강 */

    /* Leaflet 팝업 커스텀 */
    .custom-popup .leaflet-popup-content-wrapper {
      border-radius: 10px;
      box-shadow: 0 4px 18px rgba(0,0,0,0.18);
      padding: 0;
    }
    .custom-popup .leaflet-popup-content { margin: 14px 14px; }
    .custom-popup .leaflet-popup-tip-container { margin-top: -1px; }
  `;
  document.head.appendChild(style);
})();
