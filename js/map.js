/* =============================================
   map.js — Leaflet.js 지도 초기화 및 마커 관리
   ============================================= */
'use strict';

const MapModule = {
  map: null,
  markerGroup: null,
  satelliteLayer: null,
  basicLayer: null,
  grayLayer: null,
  nightLayer: null,
  _currentBase: 'satellite',

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

    /* 1. 위성 레이어 (기본) */
    this.satelliteLayer = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      { attribution: '© Esri', maxZoom: 19 }
    );
    /* 2. 기본 레이어 (OSM) */
    this.basicLayer = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      { attribution: '© OpenStreetMap', maxZoom: 19 }
    );
    /* 3. 흑백 레이어 (Esri) */
    this.grayLayer = L.tileLayer(
      'https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
      { attribution: '© Esri', maxZoom: 19 }
    );
    /* 4. 야간 레이어 (CartoDB) */
    this.nightLayer = L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      { attribution: '© CartoDB', maxZoom: 19 }
    );

    /* 초기 레이어 설정: 위성 */
    this.satelliteLayer.addTo(this.map);
    this._currentBase = 'satellite';

    /* 마커 클러스터 그룹 — 주석 처리 (사용자 요청으로 제거)
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
    */

    /* 지역 요약 파이 차트 그룹 (featureGroup으로 변경하여 getBounds 지원) */
    this.regionSummaryGroup = L.featureGroup().addTo(this.map);

    /* 개별 시설물 폴리곤 그룹 (featureGroup으로 변경하여 getBounds 지원) */
    this.facilityLayerGroup = L.featureGroup().addTo(this.map);

    return this.map;
  },

  /** 지역별 요약 파이 차트 렌더링 */
  renderRegionSummaries(stats) {
    if (this.markerGroup) this.markerGroup.clearLayers();
    this.regionSummaryGroup.clearLayers();
    this.clearFacilityLayers(); // 시설물 레이어 정리

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

  /** 개별 시설물 폴리곤 레이어 렌더링 */
  renderFacilityLayer(facilities) {
    this.regionSummaryGroup.clearLayers(); // 원형 차트 숨기기
    this.clearFacilityLayers();

    facilities.forEach(f => {
      const lat = parseFloat(f.lat);
      const lng = parseFloat(f.lng);
      const isCrossing = f.type === 'crossing' || f.category === 'crossing';
      const color = isCrossing ? '#ffab40' : '#ff5252';

      // 정교하고 작은 폴리곤 생성
      const polygonPoints = this._createFacilityPolygon(lat, lng);

      const polygon = L.polygon(polygonPoints, {
        color: color,
        fillColor: color,
        fillOpacity: 0.5,
        weight: 1.5,
        dashArray: isCrossing ? '3, 3' : '',
        id: f.id // 시설물 ID 저장
      });

      // 클릭 시 팝업 및 상세 정보 연동
      polygon.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        this.highlightFacility(f, false); // flyTo 없이 강조만
      });

      this.facilityLayerGroup.addLayer(polygon);
    });

    // 전체 시설물이 보이도록 바운드 조정 (옵션)
    if (facilities.length > 0) {
      const groupBounds = this.facilityLayerGroup.getBounds();
      this.map.flyToBounds(groupBounds, { padding: [100, 100], duration: 1.0 });
    }
  },

  /** 상세 시설물 폴리곤 좌표 생성 (작고 불규칙한 형태) */
  _createFacilityPolygon(lat, lng) {
    // 0.00015 도는 약 15m 내외
    const baseSize = 0.00018; 
    return [
      [lat + baseSize * 0.8, lng - baseSize * 0.6],
      [lat + baseSize * 0.9, lng + baseSize * 0.4],
      [lat - baseSize * 0.3, lng + baseSize * 0.9],
      [lat - baseSize * 0.8, lng - baseSize * 0.2],
      [lat - baseSize * 0.5, lng - baseSize * 0.7]
    ];
  },

  /** 시설물 레이어 정리 */
  clearFacilityLayers() {
    if (this.facilityLayerGroup) {
      this.facilityLayerGroup.clearLayers();
    }
    this.clearHighlights();
  },

  /** 특정 배경지도 레이어 설정 */
  setBasemap(type) {
    // 기존 모든 배경 레이어 제거
    [this.satelliteLayer, this.basicLayer, this.grayLayer, this.nightLayer].forEach(layer => {
      if (layer && this.map.hasLayer(layer)) {
        this.map.removeLayer(layer);
      }
    });

    let layer = null;
    let label = '비어있음';

    switch (type) {
      case 'satellite': layer = this.satelliteLayer; label = '위성 지도'; break;
      case 'basic':     layer = this.basicLayer;     label = '기본 지도'; break;
      case 'gray':      layer = this.grayLayer;      label = '흑백 지도'; break;
      case 'night':     layer = this.nightLayer;     label = '야간 지도'; break;
      case 'none':      layer = null;                label = '빈 화면';  break;
    }

    if (layer) {
      layer.addTo(this.map);
      layer.bringToBack();
    }
    this._currentBase = type;
    return label;
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
    const isCrossing = f.category === 'crossing';
    const catClass = isCrossing ? 'crossing' : 'inside';
    const catLabel = isCrossing ? '걸침' : '구역내';

    return `
      <div class="custom-popup-content">
        <header class="cp-header">
          <span class="cp-status-dot ${catClass}"></span>
          <strong class="cp-title">${f.name}</strong>
        </header>
        <div class="cp-address">${f.address}</div>
        <div class="cp-tags">
          <span class="cp-tag ${catClass}">${catLabel}</span>
          <span class="cp-tag secondary">${f.typeLabel}</span>
        </div>
        <div class="cp-meta">
          면적: ${Utils.formatArea(f.area)} · 신고: ${Utils.formatDate(f.reportDate)}
        </div>
        <footer class="cp-links">
          <a href="report.html" class="cp-link primary">신고 등록</a>
          <a href="stats.html"  class="cp-link secondary">통계 보기</a>
        </footer>
      </div>`;
  },

  /** 마커 전체 렌더링 (사용자 요청으로 기능 제거) */
  renderMarkers(facilities) {
    // if (this.regionSummaryGroup) this.regionSummaryGroup.clearLayers();
    if (this.markerGroup) this.markerGroup.clearLayers();
    // 개별 마커 렌더링 중단
    /*
    facilities.forEach(f => {
      const marker = L.marker([f.lat, f.lng], { icon: this._createIcon(f.category), category: f.category });
      marker.bindPopup(this._popupHtml(f), { maxWidth: 270, className: 'custom-popup' });
      this.markerGroup.addLayer(marker);
    });
    */
  },

  /** 마커 필터링 */
  filterMarkers(facilities) { 
    // 개별 마커 필터링 대신 무시하거나 필요한 처리를 수행
    this.renderMarkers(facilities); 
  },

  /** 특정 지역 바운드로 지도 이동 */
  flyToBounds(regionCode) {
    const bounds = REGION_BOUNDS[regionCode];
    if (!bounds) return;
    this.map.flyToBounds(L.latLngBounds(bounds), { padding: [40, 40], duration: 0.8 });
  },

  /** 특정 시설물 강조 표시 (사이드바 클릭 시 호출) */
  highlightFacility(f, shouldFly = true) {
    if (!this.map) return;

    // 1. 기존 강조 레이어 제거
    this.clearHighlights();

    const lat = parseFloat(f.lat);
    const lng = parseFloat(f.lng);
    const isCrossing = f.type === 'crossing' || f.category === 'crossing';
    const color = isCrossing ? '#ffab40' : '#ff5252';

    // 2. 가상의 영역(폴리곤) 생성 (상세 뷰 강조용)
    const polygonPoints = this._createFacilityPolygon(lat, lng);

    this.highlightLayer = L.polygon(polygonPoints, {
      color: '#fff',
      fillColor: color,
      fillOpacity: 0.7,
      weight: 3,
      dashArray: ''
    }).addTo(this.map);

    // 3. 지도 이동 및 줌 (필요한 경우에만)
    if (shouldFly) {
      this.map.flyTo([lat, lng], 18, { duration: 1.0 });
    }

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
        <header class="dg-popup-header">
          <div class="dg-popup-title ${typeClass}">${typeLabel}(${pct})</div>
          <button class="dg-popup-close" onclick="if(MapModule.highlightLayer) MapModule.highlightLayer.closePopup()" aria-label="닫기">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </header>
        <div class="dg-popup-body">
          <ul class="dg-popup-info-list">
            <li class="dg-info-row">
              <span class="dg-info-label">하천등급</span>
              <span class="dg-info-value">${f.cat || f.riverGrade || '지방하천'}</span>
            </li>
            <li class="dg-info-row">
              <span class="dg-info-label">하천명</span>
              <span class="dg-info-value">${f.riverName || '-'}</span>
            </li>
            <li class="dg-info-row">
              <span class="dg-info-label">주소</span>
              <span class="dg-info-value">${f.addr || f.address}</span>
            </li>
            <li class="dg-info-row">
              <span class="dg-info-label">건물면적</span>
              <span class="dg-info-value">${f.area || (f.buildingArea ? f.buildingArea + '㎡' : '-')}</span>
            </li>
            <li class="dg-info-row">
              <span class="dg-info-label">점유면적</span>
              <span class="dg-info-value">${f.occArea ? f.occArea + '㎡' : (f.area || '-')}</span>
            </li>
            <li class="dg-info-row">
              <span class="dg-info-label">점유율</span>
              <span class="dg-info-value">${pct}</span>
            </li>
          </ul>
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
