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

    /* MarkerCluster 그룹 (전체 시설물 클러스터링) */
    this.clusterGroup = L.markerClusterGroup({
      maxClusterRadius: 55,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      disableClusteringAtZoom: 16,
      iconCreateFunction: (cluster) => {
        const markers = cluster.getAllChildMarkers();
        const count = markers.reduce((sum, m) => sum + (m.options._count || 1), 0);
        const hasCrossing = markers.some(m => m.options._type === 'crossing');
        const colorClass = hasCrossing ? '' : 'cluster-inside';
        const size = this._clusterSize(count);
        const sizeMap = { sm: 34, md: 42, lg: 50, xl: 58 };
        const px = sizeMap[size];
        return L.divIcon({
          html: `<div class="cluster-marker cluster-marker-${size} ${colorClass}">${count.toLocaleString()}</div>`,
          className: '',
          iconSize: [px, px],
          iconAnchor: [px / 2, px / 2]
        });
      }
    });

    /* 지도 이동 시 고줌 폴리곤 갱신 */
    this.map.on('moveend', () => {
      if (this.map.getZoom() >= 15 && this._clusterLevel >= 2) {
        this._renderViewportPolygons();
      }
    });

    /* 줌 변경 시 레벨 자동 전환 */
    this.map.on('zoomend', () => {
      const zoom = this.map.getZoom();
      if (zoom <= 7 && this._clusterLevel > 1) {
        // 전국 뷰로 줌아웃 → 파이차트 복귀, 클러스터 숨김 (데이터 유지)
        if (this.clusterGroup && this.map.hasLayer(this.clusterGroup)) this.map.removeLayer(this.clusterGroup);
        if (window.REGION_STATS) {
          this._clusterLevel = 1;
          this.regionSummaryGroup.clearLayers();
          this.clearFacilityLayers();
          // 파이차트 다시 그리기 (renderRegionSummaries 호출 시 clusterGroup 안 비움)
          this._drawPieCharts(window.REGION_STATS);
        }
      } else if (zoom > 7 && this._clusterLevel === 1) {
        // 줌인 시 자동으로 클러스터 표시
        this._clusterLevel = 2;
        this.regionSummaryGroup.clearLayers();
        if (!this._clustersLoaded) this.initAllClusters();
        if (!this.map.hasLayer(this.clusterGroup)) this.clusterGroup.addTo(this.map);
      }
      // 고줌 레벨에서 현재 화면에 가상 폴리곤 동적 생성
      if (zoom >= 15 && this._clusterLevel >= 2) {
        this._renderViewportPolygons();
      } else {
        this.clearFacilityLayers();
      }
    });

    return this.map;
  },

  /** 클러스터 레벨 상태 */
  _clusterLevel: 1,  // 1: 시·도, 2: 시·군·구, 3: 시설물
  _currentRegion: null,

  /** 클러스터 마커 크기 계산 */
  _clusterSize(count) {
    if (count >= 1000) return 'xl';
    if (count >= 100) return 'lg';
    if (count >= 10) return 'md';
    return 'sm';
  },

  /** 건수 포맷 (천 단위 콤마) */
  _formatCount(n) {
    return n.toLocaleString();
  },

  /** 클러스터 DivIcon 생성
   *  type: 'crossing' (오렌지) | 'inside' (빨강) */
  _createClusterIcon(count, label, type) {
    const size = this._clusterSize(count);
    const sizeMap = { sm: 34, md: 42, lg: 50, xl: 58 };
    const px = sizeMap[size];
    const colorClass = type === 'inside' ? 'cluster-inside' : '';
    const html = `<div class="cluster-marker cluster-marker-${size} ${colorClass}">${this._formatCount(count)}</div>`;
    return L.divIcon({
      html: html,
      className: '',
      iconSize: [px, px],
      iconAnchor: [px / 2, px / 2]
    });
  },

  /** 가까운 클러스터 병합 (거리 기준) */
  _mergeNearbyClusters(items, minDistDeg) {
    const merged = [];
    const used = new Set();
    for (let i = 0; i < items.length; i++) {
      if (used.has(i)) continue;
      let group = { ...items[i], labels: [items[i].label] };
      for (let j = i + 1; j < items.length; j++) {
        if (used.has(j)) continue;
        const dLat = Math.abs(items[i].lat - items[j].lat);
        const dLng = Math.abs(items[i].lng - items[j].lng);
        if (dLat < minDistDeg && dLng < minDistDeg) {
          // 병합: 건수 합산, 좌표 가중평균
          const totalA = group.crossing + group.inside;
          const totalB = items[j].crossing + items[j].inside;
          const totalAll = totalA + totalB;
          group.lat = (group.lat * totalA + items[j].lat * totalB) / totalAll;
          group.lng = (group.lng * totalA + items[j].lng * totalB) / totalAll;
          group.crossing += items[j].crossing;
          group.inside += items[j].inside;
          group.labels.push(items[j].label);
          used.add(j);
        }
      }
      merged.push(group);
    }
    return merged;
  },

  /** 1단계: 시·도별 파이차트 렌더링 (기본 뷰) */
  renderRegionSummaries(stats) {
    this._clusterLevel = 1;
    this._currentRegion = null;
    if (this.markerGroup) this.markerGroup.clearLayers();
    this.regionSummaryGroup.clearLayers();
    this.clearFacilityLayers();
    // 클러스터는 숨기기만 (데이터 유지)
    if (this.clusterGroup && this.map.hasLayer(this.clusterGroup)) {
      this.map.removeLayer(this.clusterGroup);
    }
    this._drawPieCharts(stats);
  },

  /** 파이차트 마커 그리기 */
  _drawPieCharts(stats) {
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
        if (window.handleRegionClick) {
          window.handleRegionClick(stat.code, stat.label);
        }
        // 2단계로 전환
        this.renderSigunguClusters(stat.code);
      });
      this.regionSummaryGroup.addLayer(marker);
    });
  },

  /** 전체 시설물 포인트를 MarkerCluster에 로드 (초기화 시 1회) */
  initAllClusters() {
    if (!this.clusterGroup) return;
    this.clusterGroup.clearLayers();

    // 모든 시·도의 SUB_REGION_STATS에서 포인트 생성
    if (typeof SUB_REGION_STATS === 'undefined') return;

    Object.keys(SUB_REGION_STATS).forEach(regionCode => {
      const subs = SUB_REGION_STATS[regionCode];
      const bounds = REGION_BOUNDS[regionCode];
      if (!bounds || !subs) return;
      const latRange = bounds[1][0] - bounds[0][0];
      const lngRange = bounds[1][1] - bounds[0][1];

      const validSubs = subs.filter(s => s.crossing + s.inside > 0);
      const cols = Math.ceil(Math.sqrt(validSubs.length * Math.max(lngRange / latRange, 0.5)));
      const rows = Math.ceil(validSubs.length / Math.max(cols, 1));

      validSubs.forEach((sub, idx) => {
        const row = Math.floor(idx / Math.max(cols, 1));
        const col = idx % Math.max(cols, 1);
        const cLat = bounds[0][0] + latRange * 0.1 + (latRange * 0.8 * (row + 0.5) / Math.max(rows, 1));
        const cLng = bounds[0][1] + lngRange * 0.1 + (lngRange * 0.8 * (col + 0.5) / Math.max(cols, 1));
        const spread = Math.min(latRange, lngRange) * 0.05;

        // 걸침 (샘플링)
        const cN = Math.max(1, Math.min(sub.crossing, 30));
        const cW = Math.round(sub.crossing / cN);
        for (let i = 0; i < cN; i++) {
          this.clusterGroup.addLayer(L.marker(
            [cLat + (Math.random() - 0.5) * spread * 2, cLng + (Math.random() - 0.5) * spread * 2],
            { icon: L.divIcon({ html: '', className: '', iconSize: [1, 1] }), _count: cW, _type: 'crossing' }
          ));
        }

        // 구역내 (샘플링)
        const iN = Math.max(1, Math.min(sub.inside, 20));
        const iW = Math.round(sub.inside / iN);
        for (let i = 0; i < iN; i++) {
          this.clusterGroup.addLayer(L.marker(
            [cLat + (Math.random() - 0.5) * spread * 2, cLng + (Math.random() - 0.5) * spread * 2],
            { icon: L.divIcon({ html: '', className: '', iconSize: [1, 1] }), _count: iW, _type: 'inside' }
          ));
        }
      });
    });

    this.clusterGroup.addTo(this.map);
    this._clustersLoaded = true;
  },

  /** 시·도 선택 시 해당 영역으로 줌인 (클러스터는 자동 분산) */
  renderSigunguClusters(regionCode) {
    this._clusterLevel = 2;
    this._currentRegion = regionCode;
    this.regionSummaryGroup.clearLayers(); // 파이차트 제거

    // 클러스터 미로드 시 초기화
    if (!this._clustersLoaded) this.initAllClusters();

    // 클러스터 그룹이 맵에 없으면 추가
    if (!this.map.hasLayer(this.clusterGroup)) this.clusterGroup.addTo(this.map);

    const bounds = REGION_BOUNDS[regionCode];
    if (bounds) {
      this.map.flyToBounds(bounds, { padding: [60, 60], duration: 0.8 });
    }
  },

  /** 현재 화면 영역에 가상 폴리곤 동적 생성 (고줌 시) */
  _renderViewportPolygons() {
    // 하이라이트/팝업이 열려있으면 갱신 스킵
    if (this.highlightLayer && this.map.hasLayer(this.highlightLayer)) return;
    this.facilityLayerGroup.clearLayers();

    const bounds = this.map.getBounds();
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();
    const latRange = ne.lat - sw.lat;
    const lngRange = ne.lng - sw.lng;

    // 현재 영역에 들어가는 MOCK_FACILITIES 먼저 표시
    const realFacilities = MOCK_FACILITIES.filter(f => {
      const lat = parseFloat(f.lat);
      const lng = parseFloat(f.lng);
      return lat >= sw.lat && lat <= ne.lat && lng >= sw.lng && lng <= ne.lng;
    });

    realFacilities.forEach(f => {
      const polygonPoints = this._createFacilityPolygon(parseFloat(f.lat), parseFloat(f.lng));
      const isCrossing = f.category === 'crossing';
      const color = isCrossing ? '#ffab40' : '#ff5252';
      const polygon = L.polygon(polygonPoints, {
        color, fillColor: color, fillOpacity: 0.5, weight: 1.5,
        dashArray: isCrossing ? '3, 3' : ''
      });
      polygon.on('click', (e) => { L.DomEvent.stopPropagation(e); this.highlightFacility(f, false); });
      this.facilityLayerGroup.addLayer(polygon);
    });

    // 추가 가상 폴리곤 생성 (화면 내 랜덤 배치, 최대 30개)
    const virtualCount = Math.min(30, Math.floor(latRange * lngRange * 50000));
    for (let i = 0; i < virtualCount; i++) {
      const lat = sw.lat + Math.random() * latRange;
      const lng = sw.lng + Math.random() * lngRange;
      const isCrossing = Math.random() > 0.4;
      const color = isCrossing ? '#ffab40' : '#ff5252';
      const polygonPoints = this._createFacilityPolygon(lat, lng);
      const polygon = L.polygon(polygonPoints, {
        color, fillColor: color, fillOpacity: 0.5, weight: 1.5,
        dashArray: isCrossing ? '3, 3' : ''
      });
      // 가상 시설물 클릭 시 임의 팝업
      polygon.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        const mockF = {
          category: isCrossing ? 'crossing' : 'inside',
          occRate: Math.floor(Math.random() * 50 + 50),
          riverGrade: Math.random() > 0.5 ? '국가하천' : '지방하천',
          riverName: ['한강','낙동강','금강','섬진강','영산강'][Math.floor(Math.random()*5)],
          address: `가상 시설물 #${i+1}`,
          area: Math.floor(Math.random() * 300 + 10),
          occArea: Math.floor(Math.random() * 200 + 5),
          lat, lng
        };
        mockF.occRate = Math.round(mockF.occArea / mockF.area * 100);
        this.highlightFacility(mockF, false);
      });
      this.facilityLayerGroup.addLayer(polygon);
    }
  },

  /** 현재 레벨로 복귀 (뒤로가기) */
  goBackLevel(stats) {
    if (this._clusterLevel === 3) {
      // 3단계 → 2단계
      if (this._currentRegion) {
        this.renderSigunguClusters(this._currentRegion);
      }
    } else if (this._clusterLevel === 2) {
      // 2단계 → 1단계
      this.renderRegionClusters(stats);
    }
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
