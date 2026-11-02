const { test } = require('node:test');
const assert = require('node:assert/strict');
const { summarize, summarizeSurvey } = require('./experiment-report.cjs');
const options = { from: '2026-11-01T00:00:00+09:00', to: '2026-11-08T00:00:00+09:00', campaigns: ['class'] };
const row = (id, extra = {}) => ({ id, experiment_id: 'email-signup-v1', time_stamp: '2026-11-02T00:00:00+09:00', utm: 'class', is_test: false, ...extra });
const signup = (id, extra = {}) => row(id, { email: 'qa@example.invalid', ...extra });
test('재방문·반복 제출은 한 번만 세며 테스트와 다른 유입은 제외한다', () => {
  const visits = [row('a'), row('a'), row('b'), row('test', { is_test: true }), row('string-test', { is_test: 'TRUE' }), row('direct', { utm: '' }), row('other', { utm: 'other' }), row('old', { experiment_id: 'old' })];
  const signups = ['a', 'a', 'test', 'string-test', 'direct', 'other', 'old', 'orphan'].map(id => signup(id));
  assert.deepEqual(summarize(visits, signups, options), { visitors: 2, signups: 1, rate: 0.5 });
});
test('직접 재방문 신청을 연결하고 기간 밖·방문 전·빈 이메일 신청은 제외한다', () => {
  const visits = [row('a'), row('b'), row('c'), row('d'), row('e', { time_stamp: options.to })];
  const signups = [signup('a', { utm: '' }), signup('b', { time_stamp: options.to }), signup('c', { time_stamp: options.from }), signup('d', { email: '' }), signup('e')];
  assert.deepEqual(summarize(visits, signups, options), { visitors: 4, signups: 1, rate: 0.25 });
});
test('시작 시각은 포함하고 종료 시각은 제외한다', () => {
  assert.deepEqual(summarize([row('a', { time_stamp: options.from })], [signup('a', { time_stamp: options.from })], options), { visitors: 1, signups: 1, rate: 1 });
  assert.deepEqual(summarize([], [], options), { visitors: 0, signups: 0, rate: null });
});
test('잘못된 기간과 홍보 유입 없는 집계를 거절한다', () => {
  assert.throws(() => summarize([], [], { ...options, to: options.from }));
  assert.throws(() => summarize([], [], { ...options, campaigns: [] }));
});

const surveyVisit = (id, extra = {}) => row(id, { experiment_id: 'family-recommendation-v1', ...extra });
const answer = (id, recommendation, extra = {}) => surveyVisit(id, { response_type: 'survey', recommendation, email: '', ...extra });
test('설문은 미응답자를 포함한 방문자를 분모로 쓰고 이메일과 독립 집계한다', () => {
  const visits = ['yes', 'no', 'unsure', 'silent'].map(id => surveyVisit(id));
  const responses = [answer('yes', 'yes'), answer('no', 'no'), answer('unsure', 'unsure'),
    surveyVisit('silent', { response_type: 'email', email: 'qa@example.invalid' })];
  assert.deepEqual(summarizeSurvey(visits, responses, options), { visitors: 4, respondents: 3, positive: 1, unsure: 1, negative: 1, rate: 0.25 });
  assert.deepEqual(summarize(visits, responses, { ...options, experiment: 'family-recommendation-v1' }), { visitors: 4, signups: 1, rate: 0.25 });
});
test('설문 재전송은 최초 응답만 세며 다른 실험·유입·테스트·기간 밖·방문 전 응답을 제외한다', () => {
  const visits = [surveyVisit('a'), surveyVisit('a'), surveyVisit('b'), surveyVisit('c'),
    surveyVisit('test', { is_test: true }), surveyVisit('other', { utm: 'other' }), row('old')];
  const responses = [answer('a', 'yes', { time_stamp: '2026-11-03T00:00:00+09:00' }), answer('a', 'no'), answer('a', 'no'),
    answer('b', 'yes', { time_stamp: options.from }), answer('b', 'yes', { time_stamp: options.to }), answer('c', 'invalid'),
    answer('test', 'yes', { is_test: 'TRUE' }), answer('other', 'yes'), answer('old', 'yes'), answer('orphan', 'yes')];
  assert.deepEqual(summarizeSurvey(visits, responses, options), { visitors: 3, respondents: 1, positive: 0, unsure: 0, negative: 1, rate: 0 });
});
test('설문 시작은 포함하고 종료는 제외하며 분모 0은 비율 없음으로 표시한다', () => {
  assert.deepEqual(summarizeSurvey([surveyVisit('a', { time_stamp: options.from }), surveyVisit('b', { time_stamp: options.to })],
    [answer('a', 'yes', { time_stamp: options.from }), answer('b', 'yes', { time_stamp: options.to })], options),
    { visitors: 1, respondents: 1, positive: 1, unsure: 0, negative: 0, rate: 1 });
  assert.deepEqual(summarizeSurvey([], [], options), { visitors: 0, respondents: 0, positive: 0, unsure: 0, negative: 0, rate: null });
});
