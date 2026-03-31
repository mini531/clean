/* =============================================
   ui.js — 공통 UI (사이드바, 모달, 토스트)
   ============================================= */
'use strict';

const UI = {
  /* --- 토스트 알림 --- */
  toast(message, type = 'info', duration = 3000) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };
    toast.innerHTML = `<span>${icons[type] || 'ℹ'}</span><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity .3s';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  /* --- 모달 열기/닫기 --- */
  openModal(id) {
    const overlay = document.getElementById(id);
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  },
  closeModal(id) {
    const overlay = document.getElementById(id);
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  },

  /* --- 사이드바 토글 (모바일) --- */
  initSidebar() {
    const hamburger = document.getElementById('btn-hamburger');
    const sidebar   = document.querySelector('.app-sidebar');
    let overlay     = document.querySelector('.sidebar-overlay');

    if (!hamburger || !sidebar) return;

    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'sidebar-overlay';
      document.querySelector('.app-body')?.prepend(overlay);
    }

    const open = () => {
      sidebar.classList.add('open');
      overlay.classList.add('active');
    };
    const close = () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('active');
    };

    hamburger.addEventListener('click', () => {
      sidebar.classList.contains('open') ? close() : open();
    });
    overlay.addEventListener('click', close);
  },

  /* --- 모달 오버레이 클릭으로 닫기 --- */
  initModals() {
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', e => {
        if (e.target === overlay) this.closeModal(overlay.id);
      });
    });
    document.querySelectorAll('.modal-close, [data-close-modal]').forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = btn.closest('.modal-overlay');
        if (modal) this.closeModal(modal.id);
      });
    });
  },

  /* --- 탭 전환 --- */
  initTabs(tabBarSelector, contentSelector) {
    const tabs     = document.querySelectorAll(`${tabBarSelector} .tab-item`);
    const contents = document.querySelectorAll(contentSelector);
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.add('hidden'));
        tab.classList.add('active');
        const target = document.getElementById(tab.dataset.target);
        if (target) target.classList.remove('hidden');
      });
    });
  },

  /* --- 페이지네이션 렌더링 --- */
  renderPagination(containerId, total, page, perPage, onPageChange) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const totalPages = Math.ceil(total / perPage);
    let html = '';
    html += `<button class="page-btn" ${page <= 1 ? 'disabled' : ''} data-page="${page - 1}">&#8249;</button>`;
    for (let i = 1; i <= totalPages; i++) {
      html += `<button class="page-btn ${i === page ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }
    html += `<button class="page-btn" ${page >= totalPages ? 'disabled' : ''} data-page="${page + 1}">&#8250;</button>`;
    container.innerHTML = html;
    container.querySelectorAll('.page-btn:not(:disabled)').forEach(btn => {
      btn.addEventListener('click', () => onPageChange(+btn.dataset.page));
    });
  },

  /* --- 뷰 전환 (테이블/카드) --- */
  initViewToggle(tableEl, cardEl, btnTable, btnCard) {
    const table = document.getElementById(tableEl);
    const cards = document.getElementById(cardEl);
    const bT    = document.getElementById(btnTable);
    const bC    = document.getElementById(btnCard);
    if (!table || !cards || !bT || !bC) return;

    bT.addEventListener('click', () => {
      table.classList.remove('hidden');
      cards.classList.add('hidden');
      bT.classList.add('btn-primary'); bT.classList.remove('btn-secondary');
      bC.classList.add('btn-secondary'); bC.classList.remove('btn-primary');
    });
    bC.addEventListener('click', () => {
      cards.classList.remove('hidden');
      table.classList.add('hidden');
      bC.classList.add('btn-primary'); bC.classList.remove('btn-secondary');
      bT.classList.add('btn-secondary'); bT.classList.remove('btn-primary');
    });
  },

  /* --- 뱃지 HTML 생성 --- */
  badgeHtml(code) {
    return `<span class="badge ${Utils.statusBadge(code)}">${Utils.statusLabel(code)}</span>`;
  },

  /* --- 로딩 스피너 --- */
  showLoading(el) {
    if (!el) return;
    el.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-muted);">불러오는 중…</div>';
  },
};

/* 페이지 로드 후 공통 초기화 */
document.addEventListener('DOMContentLoaded', () => {
  UI.initSidebar();
  UI.initModals();
});
