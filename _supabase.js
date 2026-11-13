// Falaut v13.2.0 — acesso à tabela push_subscriptions pelo REST do Supabase,
// com a chave service_role (só existe no servidor, nunca vai pro navegador).
const TABLE = 'push_subscriptions';

function cfg() {
  const url = process.env.SUPABASE_URL || 'https://furrxamrtfzmmwhxbtdq.supabase.co';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error('Falta a variável SUPABASE_SERVICE_ROLE_KEY na Vercel');
  return { url: url.replace(/\/$/, '') + '/rest/v1/' + TABLE, key };
}

async function rest(method, query, body, prefer) {
  const { url, key } = cfg();
  const res = await fetch(url + (query ? '?' + query : ''), {
    method,
    headers: {
      apikey: key,
      Authorization: 'Bearer ' + key,
      'Content-Type': 'application/json',
      Prefer: prefer || 'return=minimal'
    },
    body: body ? JSON.stringify(body) : undefined
  });
  if (!res.ok) throw new Error('Supabase ' + res.status + ': ' + (await res.text().catch(() => '')));
  return res.status === 204 || method !== 'GET' ? null : res.json();
}

const eqEndpoint = (ep) => 'endpoint=eq.' + encodeURIComponent(ep);

module.exports = {
  upsert: (row) => rest('POST', 'on_conflict=endpoint', row, 'resolution=merge-duplicates,return=minimal'),
  update: (endpoint, fields) => rest('PATCH', eqEndpoint(endpoint), fields),
  remove: (endpoint) => rest('DELETE', eqEndpoint(endpoint)),
  get: async (endpoint) => ((await rest('GET', 'select=*&' + eqEndpoint(endpoint))) || [])[0] || null,
  all: () => rest('GET', 'select=endpoint,subscription,tz,lang,last_trained,last_sent,streak&limit=10000')
};
