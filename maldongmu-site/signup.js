/* 수업의 쿠키 ID + Apps Script insert 방식을 이메일 신청률 실험에 맞춰 연결합니다. */
(() => {
  'use strict';
  const endpoint = 'https://script.google.com/macros/s/AKfycbwKyA5uqY8L8gRc1wyxK_ihrfXGmX7XHKsyJ4XN3nOsk0bEhiQt8Qr6vI5Jb1ASrNwYAA/exec';
  const experimentId = 'email-signup-v1';
  const params = new URLSearchParams(location.search);
  function readStorage(store, key) {
    try { return window[store].getItem(key); } catch { return null; }
  }
  function writeStorage(store, key, value) {
    try { window[store].setItem(key, value); } catch { /* 저장 차단 시 현재 페이지에서는 계속 동작합니다. */ }
  }
  function readCookie(name) {
    try {
      const item = document.cookie.split('; ').find(part => part.startsWith(name + '='));
      return item ? decodeURIComponent(item.slice(name.length + 1)) : null;
    } catch { return null; }
  }
  const visitorId = readCookie('user') || readStorage('localStorage', 'maldongmu:visitor') ||
    (crypto.randomUUID ? crypto.randomUUID() : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`);
  try {
    document.cookie = `user=${encodeURIComponent(visitorId)}; Max-Age=15552000; Path=/; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`;
  } catch { /* 쿠키가 차단되어도 방문과 신청은 동일한 메모리 ID를 사용합니다. */ }
  writeStorage('localStorage', 'maldongmu:visitor', visitorId);

  const testKey = `maldongmu:${experimentId}:test`;
  if (['0', '1'].includes(params.get('test'))) writeStorage('sessionStorage', testKey, params.get('test'));
  const isLocal = location.protocol === 'file:' || ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);
  const isTest = isLocal || params.get('test') === '1' ||
    (params.get('test') !== '0' && readStorage('sessionStorage', testKey) === '1');
  const storageKey = `maldongmu:${experimentId}:${visitorId}:${isTest ? 'test' : 'live'}`;
  // 첫 홍보 링크를 기억합니다. 이후 직접 재방문하여 신청해도 최초 유입으로 집계합니다.
  const campaign = readStorage('localStorage', `${storageKey}:utm`) || (params.get('utm') || '').trim();
  if (campaign) writeStorage('localStorage', `${storageKey}:utm`, campaign);
  const common = { id: visitorId, experiment_id: experimentId, utm: campaign, is_test: isTest };
  const form = document.querySelector('#signup-form');
  const email = document.querySelector('#submit-email');
  const advice = document.querySelector('#submit-advice');
  const button = document.querySelector('#submit');
  const status = document.querySelector('#signup-status');
  let submitted = !isTest && readStorage('localStorage', `${storageKey}:submitted`) === '1';
  let sending = false;
  let visitSaved = false;
  let visitPending;

  async function request(url, timeoutMs = 20000) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, { signal: controller.signal, cache: 'no-store', credentials: 'omit' });
      if (!response.ok) throw new Error('Request failed');
      return await response.json();
    } finally { clearTimeout(timeout); }
  }
  async function insert(table, data) {
    const query = new URLSearchParams({ action: 'insert', table, data: JSON.stringify(data) });
    const result = await request(`${endpoint}?${query}`);
    if (result.success !== true) throw new Error('Save not confirmed');
  }
  // IP 조회 실패는 신청을 막지 않습니다. 값 자체는 기존 저장 방식처럼 유지합니다.
  const ipReady = request('https://jsonip.com', 3000).then(data => data.ip || 'unknown').catch(() => 'unknown');
  function saveVisit() {
    if (visitSaved) return Promise.resolve();
    if (visitPending) return visitPending;
    visitPending = ipReady.then(ip => insert('visitors', {
      ...common, time_stamp: new Date().toISOString(), landingUrl: location.href,
      referer: document.referrer, device: /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) ? 'mobile' : 'desktop', ip
    })).then(() => { visitSaved = true; }).finally(() => { visitPending = null; });
    return visitPending;
  }
  function showSuccess() {
    button.disabled = true;
    button.textContent = '신청 완료';
    status.dataset.state = 'success';
    status.textContent = '신청해 주셔서 고맙습니다. 출시 소식을 이메일로 알려드릴게요.';
  }
  if (isTest) document.querySelector('#signup-test-note').hidden = false;
  if (submitted) showSuccess();
  saveVisit().catch(() => { /* 제출 시 재시도하여 방문 기록과 신청 기록을 연결합니다. */ });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (sending || submitted) return;
    email.value = email.value.trim();
    if (!form.reportValidity()) return;
    sending = true;
    button.disabled = true;
    button.textContent = '신청하는 중…';
    form.setAttribute('aria-busy', 'true');
    status.dataset.state = '';
    status.textContent = '';
    try {
      await saveVisit();
      await insert('tab_final', { ...common, time_stamp: new Date().toISOString(), email: email.value, advice: advice.value.trim() });
      submitted = true;
      if (!isTest) writeStorage('localStorage', `${storageKey}:submitted`, '1');
      form.reset();
      showSuccess();
    } catch {
      status.dataset.state = 'error';
      status.textContent = '신청 완료를 확인하지 못했어요. 입력한 내용은 그대로 있으니 잠시 후 다시 눌러 주세요.';
      button.disabled = false;
      button.textContent = '출시 소식 신청하기';
    } finally {
      sending = false;
      form.removeAttribute('aria-busy');
    }
  });
})();
