/* =============================================
   auth.js — 인증 (로그인/로그아웃/세션)
   ============================================= */
'use strict';

const Auth = {
  SESSION_KEY: 'hcs_user',

  /** 로그인 처리. 성공 시 사용자 객체 반환, 실패 시 null */
  login(id, pw) {
    const user = MOCK_USERS.find(u => u.id === id && u.pw === pw);
    if (!user) return null;
    const session = { id: user.id, name: user.name, org: user.org, role: user.role, roleLabel: user.roleLabel };
    Storage.set(this.SESSION_KEY, session);
    return session;
  },

  /** 로그아웃 */
  logout() {
    sessionStorage.clear();
    localStorage.removeItem(this.SESSION_KEY);
    location.replace('login.html');
  },

  /** 현재 로그인 사용자 반환. 없으면 null */
  getCurrentUser() {
    return Storage.get(this.SESSION_KEY);
  },

  /** 로그인 필수 페이지 진입 시 사용. 미로그인이면 login으로 리다이렉트 */
  requireLogin() {
    const user = this.getCurrentUser();
    if (!user) {
      location.href = 'login.html';
      return null;
    }
    return user;
  },

  /** 로그인 페이지에서 이미 로그인 상태면 대시보드로 이동 */
  redirectIfLoggedIn() {
    if (this.getCurrentUser()) {
      location.href = 'dashboard.html';
    }
  },

  /** 관리자 여부 */
  isAdmin() {
    const u = this.getCurrentUser();
    return u && u.role === 'admin';
  },
};

/* --- 로그인 폼 로직 --- */
function initLoginForm() {
  Auth.redirectIfLoggedIn();

  const form    = document.getElementById('login-form');
  const idInput = document.getElementById('login-id');
  const pwInput = document.getElementById('login-pw');
  const errMsg  = document.getElementById('login-error');
  const btnText = document.getElementById('btn-login-text');

  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const id = idInput.value.trim();
    const pw = pwInput.value;

    errMsg.classList.remove('visible');

    if (!id || !pw) {
      errMsg.textContent = '아이디와 비밀번호를 입력하세요.';
      errMsg.classList.add('visible');
      return;
    }

    btnText.textContent = '로그인 중...';
    form.querySelector('button[type=submit]').disabled = true;

    setTimeout(() => {
      const user = Auth.login(id, pw);
      if (user) {
        location.href = 'dashboard.html';
      } else {
        errMsg.textContent = '아이디 또는 비밀번호가 올바르지 않습니다.';
        errMsg.classList.add('visible');
        btnText.textContent = '로그인';
        form.querySelector('button[type=submit]').disabled = false;
        idInput.focus();
      }
    }, 400);
  });
}

/* --- 회원가입 폼 로직 --- */
function initRegisterForm() {
  Auth.redirectIfLoggedIn();

  let currentStep = 1;

  // --- Step 1 요소 ---
  const step1 = document.getElementById('step-1');
  const btnNext1 = document.getElementById('btn-next-1');
  const checkAll = document.getElementById('check-all');
  const requiredChecks = document.querySelectorAll('.required-check');

  // --- Step 2 요소 ---
  const step2 = document.getElementById('step-2');
  const btnNext2 = document.getElementById('btn-next-2');
  const btnPrev2 = document.getElementById('btn-prev-2');
  const btnSendCode = document.getElementById('btn-send-code');
  const regName = document.getElementById('reg-name');
  const regEmail = document.getElementById('reg-email');
  const regEmailDomain = document.getElementById('reg-email-domain');
  const regVerify = document.getElementById('reg-verify');

  // --- Step 3 요소 ---
  const step3 = document.getElementById('step-3');
  const dispName = document.getElementById('disp-name');
  const dispEmail = document.getElementById('disp-email');
  const dispEmailDomain = document.getElementById('disp-email-domain');
  const btnSubmit = document.getElementById('btn-submit-reg');

  // --- 모달 요소 ---
  const modalConfirm = document.getElementById('modal-confirm');
  const modalSuccess = document.getElementById('modal-success');
  const btnModalConfirm = document.getElementById('btn-modal-confirm');
  const btnModalCancel = document.getElementById('btn-modal-cancel');
  const btnModalFinish = document.getElementById('btn-modal-finish');

  // =============================================
  // 단계 전환 함수
  // =============================================
  function goToStep(n) {
    document.querySelectorAll('.reg-step').forEach(s => s.classList.remove('active'));
    document.getElementById(`step-${n}`).classList.add('active');
    currentStep = n;

    // 단계별 부가 처리
    if (n === 3) {
      dispName.value = regName.value;
      dispEmail.value = regEmail.value;
      dispEmailDomain.value = regEmailDomain.value;
      document.getElementById('badge-verified').classList.add('visible');
      document.getElementById('login-link-wrap').style.display = 'none';
    } else {
      document.getElementById('login-link-wrap').style.display = 'block';
    }
  }

  // =============================================
  // 단계 1: 약관 동의 로직
  // =============================================
  function updateNext1() {
    const allRequired = Array.from(requiredChecks).every(c => c.checked);
    btnNext1.disabled = !allRequired;
  }

  checkAll.addEventListener('change', () => {
    requiredChecks.forEach(c => {
      c.checked = checkAll.checked;
    });
    updateNext1();
  });

  requiredChecks.forEach(c => {
    c.addEventListener('change', () => {
      updateNext1();
      if (!c.checked) checkAll.checked = false;
    });
  });

  btnNext1.addEventListener('click', () => goToStep(2));

  // =============================================
  // 단계 2: 기본정보 & 인증 로직
  // =============================================
  function validateStep2() {
    let valid = true;
    const fields = [
      { el: regName, err: 'err-name' },
      { el: regEmail, err: 'err-email' },
      { el: regVerify, err: 'err-verify' }
    ];

    fields.forEach(f => {
      const err = document.getElementById(f.err);
      if (!f.el.value.trim()) {
        err.classList.add('visible');
        f.el.classList.add('error');
        valid = false;
      } else {
        err.classList.remove('visible');
        f.el.classList.remove('error');
      }
    });
    return valid;
  }

  btnSendCode.addEventListener('click', () => {
    if (!regName.value || !regEmail.value) {
      UI.toast('이름과 이메일을 먼저 입력해 주세요.', 'info');
      return;
    }
    UI.toast('인증번호가 발송되었습니다.', 'success');
    btnNext2.disabled = false;
  });

  btnNext2.addEventListener('click', () => {
    if (validateStep2()) goToStep(3);
  });

  btnPrev2.addEventListener('click', () => goToStep(1));

  // =============================================
  // 단계 3: 가입 신청 & 모달 로직
  // =============================================
  btnSubmit.addEventListener('click', () => {
    // 필수 필드 유효성 검사
    var step3Fields = [
      { id: 'reg-pw', err: 'err-pw' },
      { id: 'reg-pw2', err: 'err-pw2' },
      { id: 'reg-phone', err: 'err-phone' },
      { id: 'reg-dept', err: 'err-dept' }
    ];

    // 에러 초기화
    document.querySelectorAll('#step-3 .form-group').forEach(function(g) {
      g.classList.remove('has-error');
    });

    var hasError = false;

    step3Fields.forEach(function(f) {
      var el = document.getElementById(f.id);
      if (!el) return;
      if (!el.value.trim()) {
        el.closest('.form-group').classList.add('has-error');
        hasError = true;
      }
    });

    // 비밀번호 일치 확인
    var pw = document.getElementById('reg-pw');
    var pw2 = document.getElementById('reg-pw2');
    if (pw && pw2 && pw.value && pw2.value && pw.value !== pw2.value) {
      pw2.closest('.form-group').classList.add('has-error');
      hasError = true;
    }

    if (hasError) return;

    modalConfirm.classList.add('active');
  });

  btnModalCancel.addEventListener('click', () => {
    modalConfirm.classList.remove('active');
  });

  btnModalConfirm.addEventListener('click', () => {
    modalConfirm.classList.remove('active');
    modalSuccess.classList.add('active');
  });

  btnModalFinish.addEventListener('click', () => {
    location.href = 'login.html';
  });
}
