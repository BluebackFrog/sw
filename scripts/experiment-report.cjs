// 원시 행 수가 아닌 동일 실험·기간·홍보 유입의 고유 쿠키 ID를 셉니다.
const ENDPOINT = 'https://script.google.com/macros/s/AKfycbwKyA5uqY8L8gRc1wyxK_ihrfXGmX7XHKsyJ4XN3nOsk0bEhiQt8Qr6vI5Jb1ASrNwYAA/exec';
const EXPERIMENT = 'email-signup-v1';
const SURVEY_EXPERIMENT = 'family-recommendation-v1';

function cohort(visits, { from, to, campaigns, experiment = EXPERIMENT }) {
  const start = Date.parse(from), end = Date.parse(to);
  if (!Number.isFinite(start) || !Number.isFinite(end) || start >= end) throw new Error('시작·종료 시각을 확인하세요.');
  if (!campaigns?.length || campaigns.some(value => !value.trim())) throw new Error('홍보 링크의 utm 값을 지정하세요.');
  const eligible = row => row.experiment_id === experiment &&
    [false, 'false', 'FALSE'].includes(row.is_test) &&
    Date.parse(row.time_stamp) >= start && Date.parse(row.time_stamp) < end && String(row.id || '').trim();
  const firstVisit = new Map();
  for (const row of visits) {
    if (!eligible(row) || !campaigns.includes(row.utm)) continue;
    const id = String(row.id), time = Date.parse(row.time_stamp);
    firstVisit.set(id, Math.min(firstVisit.get(id) ?? Infinity, time));
  }
  return { eligible, firstVisit };
}

function summarize(visits, signups, options) {
  const { eligible, firstVisit } = cohort(visits, options);
  const converted = new Set();
  for (const row of signups) {
    const id = String(row.id);
    if ((!row.response_type || row.response_type === 'email') && eligible(row) && firstVisit.has(id) && Date.parse(row.time_stamp) >= firstVisit.get(id) &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(row.email || '').trim())) converted.add(id);
  }
  return { visitors: firstVisit.size, signups: converted.size, rate: firstVisit.size ? converted.size / firstVisit.size : null };
}

function summarizeSurvey(visits, responses, options) {
  const { eligible, firstVisit } = cohort(visits, { ...options, experiment: SURVEY_EXPERIMENT });
  // 같은 ID의 첫 응답만 사용해 재전송과 서로 다른 답변의 중복 집계를 막습니다.
  const firstResponse = new Map();
  for (const row of responses) {
    const id = String(row.id), time = Date.parse(row.time_stamp);
    if (row.response_type !== 'survey' || !['yes', 'unsure', 'no'].includes(row.recommendation) ||
        !eligible(row) || !firstVisit.has(id) || time < firstVisit.get(id)) continue;
    if (!firstResponse.has(id) || time < Date.parse(firstResponse.get(id).time_stamp)) firstResponse.set(id, row);
  }
  const count = answer => [...firstResponse.values()].filter(row => row.recommendation === answer).length;
  const positive = count('yes');
  return { visitors: firstVisit.size, respondents: firstResponse.size, positive, unsure: count('unsure'),
    negative: count('no'), rate: firstVisit.size ? positive / firstVisit.size : null };
}

async function main() {
  const args = process.argv.slice(2);
  if (![6, 8].includes(args.length) || args[0] !== '--from' || args[2] !== '--to' || args[4] !== '--utm' ||
      (args.length === 8 && (args[6] !== '--experiment' || ![EXPERIMENT, SURVEY_EXPERIMENT].includes(args[7])))) {
    throw new Error('사용법: node scripts/experiment-report.cjs --from "시작 ISO 시각" --to "종료 ISO 시각" --utm "community1,community2" [--experiment family-recommendation-v1]');
  }
  const options = { from: args[1], to: args[3], campaigns: args[5].split(',').map(value => value.trim()), experiment: args[7] || EXPERIMENT };
  if (![options.from, options.to].every(value => /T.*(?:Z|[+-]\d{2}:\d{2})$/.test(value))) {
    throw new Error('시각에는 시간대를 포함하세요. 예: 2026-11-01T00:00:00+09:00');
  }
  summarize([], [], options); // 네트워크 요청 전에 입력을 검증합니다.
  async function read(table) {
    const response = await fetch(`${ENDPOINT}?action=read&table=${table}`, { signal: AbortSignal.timeout(30000) });
    if (!response.ok) throw new Error(`${table} 조회 실패`);
    const body = await response.json();
    if (body.success !== true || !Array.isArray(body.data)) throw new Error(`${table} 응답 확인 필요`);
    return body.data;
  }
  const [visits, signups] = await Promise.all([read('visitors'), read('tab_final')]);
  const result = summarize(visits, signups, options);
  console.log(`실험: ${options.experiment}\n기간: ${options.from} 이상 ~ ${options.to} 미만\n홍보 유입: ${options.campaigns.join(', ')}`);
  if (options.experiment === SURVEY_EXPERIMENT) {
    const survey = summarizeSurvey(visits, signups, options);
    console.log(`고유 방문자 N: ${survey.visitors}\n긍정 응답자 S: ${survey.positive}\n긍정 응답률 S/N: ${survey.rate === null ? '집계할 방문자 없음' : (100 * survey.rate).toFixed(2) + '%'}\n설문 응답자: ${survey.respondents} (잘 모르겠어요 ${survey.unsure}, 아니요 ${survey.negative})`);
    console.log('설문에 답하지 않은 방문자도 분모에 포함합니다. 수업 검정에는 위 설문 N과 S를 입력하세요.');
    console.log(`별도 이메일 신청자: ${result.signups}`);
    return;
  }
  console.log(`고유 방문자 N: ${result.visitors}\n신청 완료자 S: ${result.signups}\n신청률: ${result.rate === null ? '집계할 방문자 없음' : (100 * result.rate).toFixed(2) + '%'}`);
  console.log('중복 ID·테스트 접속 제외. 수업 검정 코드에 N과 S를 입력하세요.');
}
if (require.main === module) main().catch(error => { console.error(error.message); process.exitCode = 1; });
module.exports = { summarize, summarizeSurvey };
