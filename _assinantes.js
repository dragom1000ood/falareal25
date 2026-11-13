// Falaut v14.0.0 — tabela "assinantes" no Supabase (quem pagou no Stripe).
// Só o servidor acessa (chave service_role). Ver SETUP-CONVERSA.md.
function base() {
  const url = (process.env.SUPABASE_URL || 'https://furrxamrtfzmmwhxbtdq.supabase.co').replace(/\/$/, '');
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error('Falta a variável SUPABASE_SERVICE_ROLE_KEY na Vercel');
  return { url, key };
}
function headers(key, extra) {
  return Object.assign({ apikey: key, Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' }, extra || {});
}
const norm = (e) => String(e || '').trim().toLowerCase();

async function upsert(row) {
  const { url, key } = base();
  const res = await fetch(url + '/rest/v1/assinantes?on_conflict=email', {
    method: 'POST',
    headers: headers(key, { Prefer: 'resolution=merge-duplicates,return=minimal' }),
    body: JSON.stringify(Object.assign({}, row, { email: norm(row.email), updated_at: new Date().toISOString() }))
  });
  if (!res.ok) throw new Error('Supabase ' + res.status + ': ' + (await res.text().catch(() => '')));
}

async function setStatusByCustomer(customerId, status) {
  const { url, key } = base();
  const res = await fetch(url + '/rest/v1/assinantes?stripe_customer=eq.' + encodeURIComponent(customerId), {
    method: 'PATCH', headers: headers(key, { Prefer: 'return=minimal' }),
    body: JSON.stringify({ status, updated_at: new Date().toISOString() })
  });
  if (!res.ok) throw new Error('Supabase ' + res.status);
}

async function getByEmail(email) {
  const { url, key } = base();
  const res = await fetch(url + '/rest/v1/assinantes?select=email,plano,status&email=eq.' + encodeURIComponent(norm(email)), { headers: headers(key) });
  if (!res.ok) throw new Error('Supabase ' + res.status);
  return ((await res.json()) || [])[0] || null;
}

// confere o login do usuário no Supabase e devolve o e-mail dele
async function emailFromToken(token) {
  const { url } = base();
  const anon = process.env.SUPABASE_ANON_KEY || 'sb_publishable_aM05KuKfvG-MEJiRJqdQQA_NPfsD--j';
  const res = await fetch(url + '/auth/v1/user', { headers: { apikey: anon, Authorization: 'Bearer ' + token } });
  if (!res.ok) return null;
  const u = await res.json().catch(() => null);
  return u && u.email ? norm(u.email) : null;
}

module.exports = { upsert, setStatusByCustomer, getByEmail, emailFromToken, norm };
