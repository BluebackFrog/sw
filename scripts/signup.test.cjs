const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../maldongmu-site/signup.js'), 'utf8');

function setup({ failResponse = false, storage = new Map(), blockedStorage = false } = {}) {
  function element() {
    return { dataset: {}, attrs: {}, disabled: false, value: '', textContent: '', handlers: {},
      setAttribute(key, value) { this.attrs[key] = value; }, removeAttribute(key) { delete this.attrs[key]; },
      addEventListener(event, handler) { this.handlers[event] = handler; } };
  }
  const ids = ['signup-form', 'submit-email', 'submit-advice', 'submit', 'signup-status', 'signup-test-note', 'survey-options', 'survey-status'];
  const nodes = Object.fromEntries(ids.map(id => [`#${id}`, element()]));
  const buttons = ['yes', 'unsure', 'no'].map(answer => Object.assign(element(), { dataset: { answer }, closest() { return this; } }));
  const survey = nodes['#survey-options'];
  survey.querySelectorAll = () => buttons;
  survey.contains = option => buttons.includes(option);
  nodes['#signup-form'].reportValidity = () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nodes['#submit-email'].value);
  nodes['#signup-form'].reset = () => { nodes['#submit-email'].value = ''; nodes['#submit-advice'].value = ''; };
  const entries = [], attempts = [];
  const store = { getItem(key) { if (blockedStorage) throw Error('blocked'); return storage.get(key) ?? null; },
    setItem(key, value) { if (blockedStorage) throw Error('blocked'); storage.set(key, value); } };
  const context = { URLSearchParams, AbortController, setTimeout, clearTimeout, crypto: { randomUUID: () => 'qa-visitor' },
    location: { search: '?utm=class', protocol: 'https:', hostname: 'example.test', href: 'https://example.test/?utm=class' },
    navigator: { userAgent: 'Desktop' }, window: { localStorage: store, sessionStorage: store },
    document: { cookie: '', referrer: '', querySelector: selector => nodes[selector] },
    fetch: async url => {
      if (url === 'https://jsonip.com') return { ok: true, json: async () => ({ ip: 'unknown' }) };
      const params = new URL(url).searchParams, table = params.get('table'), data = JSON.parse(params.get('data'));
      attempts.push({ table, data });
      const failed = failResponse && table === 'tab_final';
      if (failed) failResponse = false;
      else entries.push({ table, data });
      return { ok: true, json: async () => ({ success: !failed }) };
    }
  };
  vm.runInNewContext(source, context);
  return { nodes, buttons, entries, attempts, storage,
    vote: answer => survey.handlers.click({ target: buttons.find(b => b.dataset.answer === answer) }),
    signup: () => nodes['#signup-form'].handlers.submit({ preventDefault() {} }) };
}

test('이메일 없이 설문이 저장되며 빠른 중복 클릭을 막고 이후 이메일도 독립 저장한다', async () => {
  const ui = setup();
  await Promise.all([ui.vote('yes'), ui.vote('yes')]);
  assert.equal(ui.entries.filter(e => e.table === 'tab_final').length, 1);
  const survey = ui.entries.find(e => e.table === 'tab_final').data;
  assert.equal(survey.email, '');
  assert.equal(survey.recommendation, 'yes');
  assert.equal(survey.response_type, 'survey');
  assert.equal(survey.id, ui.entries.find(e => e.table === 'visitors').data.id);
  assert.ok(ui.buttons.every(b => b.disabled));
  await ui.signup();
  assert.equal(ui.entries.filter(e => e.table === 'tab_final').length, 1);
  ui.nodes['#submit-email'].value = ' qa@example.invalid ';
  await ui.signup();
  const email = ui.entries.at(-1).data;
  assert.equal(email.response_type, 'email');
  assert.equal(email.email, 'qa@example.invalid');
  assert.equal(email.recommendation, '');
  assert.equal(ui.nodes['#signup-status'].dataset.state, 'success');
  const reload = setup({ storage: ui.storage });
  assert.ok(reload.buttons.every(b => b.disabled));
  assert.equal(reload.buttons[0].attrs['aria-pressed'], 'true');
  await reload.vote('no');
  assert.equal(reload.attempts.filter(e => e.table === 'tab_final').length, 0);
});

test('저장 실패 때 완료로 표시하지 않고 같은 답변을 재시도할 수 있다', async () => {
  const ui = setup({ failResponse: true });
  await ui.vote('unsure');
  assert.equal(ui.nodes['#survey-status'].dataset.state, 'error');
  assert.ok(ui.buttons.every(b => !b.disabled));
  assert.ok(![...ui.storage.keys()].some(key => key.endsWith(':survey')));
  await ui.vote('unsure');
  assert.equal(ui.entries.filter(e => e.table === 'tab_final').length, 1);
  assert.equal(ui.entries.at(-1).data.recommendation, 'unsure');
  assert.equal(ui.nodes['#survey-status'].dataset.state, 'success');
});

test('저장소가 차단되어도 아니요 응답이 같은 방문 ID로 저장된다', async () => {
  const ui = setup({ blockedStorage: true });
  await ui.vote('no');
  assert.equal(ui.entries.at(-1).data.recommendation, 'no');
  assert.equal(ui.entries.at(-1).data.id, ui.entries[0].data.id);
});
