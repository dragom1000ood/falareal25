// Falaut v13.2.0 — POST /api/push-subscribe
// actions: subscribe | unsubscribe | trained | resubscribe
const db = require('./_supabase');

const LANGS = ['pt', 'en', 'es', 'de'];
const isDate = (v) => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v);
function validTz(tz) {
  if (typeof tz !== 'string' || tz.length > 64) return null;
  try { new Intl.DateTimeFormat('en', { timeZone: tz }); return tz; } catch (e) { return null; }
}
function validEndpoint(ep) {
  if (typeof ep !== 'string' || ep.length > 1000) return false;
  try { return new URL(ep).protocol === 'https:'; } catch (e) { return false; }
}
function validSub(sub) {
  return sub && validEndpoint(sub.endpoint) && sub.keys &&
    typeof sub.keys.p256dh === 'string' && sub.keys.p256dh.length < 200 &&
    typeof sub.keys.auth === 'string' && sub.keys.auth.length < 100;
}
function clean(body) {
  const out = {};
  if (validTz(body.tz)) out.tz = body.tz;
  if (LANGS.includes(body.lang)) out.lang = body.lang;
  if (isDate(body.lastTrained)) out.last_trained = body.lastTrained;
  if (Number.isInteger(body.streak) && body.streak >= 0 && body.streak < 100000) out.streak = body.streak;
  return out;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ error: 'method' }); }
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = null; } }
  if (!body || typeof body !== 'object') return res.status(400).json({ error: 'body' });

  try {
    const now = new Date().toISOString();
    switch (body.action) {
      case 'subscribe': {
        if (!validSub(body.subscription)) return res.status(400).json({ error: 'subscription' });
        const { endpoint, keys } = body.subscription;
        await db.upsert(Object.assign({ tz: 'Europe/Berlin', lang: 'pt', streak: 0 }, clean(body), {
          endpoint, subscription: { endpoint, keys: { p256dh: keys.p256dh, auth: keys.auth } }, updated_at: now
        }));
        return res.status(200).json({ ok: true });
      }
      case 'trained': {
        if (!validEndpoint(body.endpoint)) return res.status(400).json({ error: 'endpoint' });
        await db.update(body.endpoint, Object.assign(clean(body), { updated_at: now }));
        return res.status(200).json({ ok: true });
      }
      case 'unsubscribe': {
        if (!validEndpoint(body.endpoint)) return res.status(400).json({ error: 'endpoint' });
        await db.remove(body.endpoint);
        return res.status(200).json({ ok: true });
      }
      case 'resubscribe': {
        if (!validSub(body.subscription)) return res.status(400).json({ error: 'subscription' });
        const old = validEndpoint(body.oldEndpoint) ? await db.get(body.oldEndpoint) : null;
        const { endpoint, keys } = body.subscription;
        await db.upsert({
          endpoint, subscription: { endpoint, keys: { p256dh: keys.p256dh, auth: keys.auth } },
          tz: (old && old.tz) || 'Europe/Berlin', lang: (old && old.lang) || 'pt',
          last_trained: (old && old.last_trained) || null, streak: (old && old.streak) || 0, updated_at: now
        });
        if (old && old.endpoint !== endpoint) await db.remove(old.endpoint);
        return res.status(200).json({ ok: true });
      }
      default:
        return res.status(400).json({ error: 'action' });
    }
  } catch (err) {
    console.error('[push-subscribe]', err);
    return res.status(500).json({ error: 'server' });
  }
};
