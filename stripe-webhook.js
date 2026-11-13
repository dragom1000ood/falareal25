// Falaut v14.0.0 — POST /api/stripe-webhook
// O Stripe avisa aqui quando alguém paga ou cancela. A gente guarda o e-mail
// na tabela "assinantes"; quando a pessoa entra no site com esse e-mail,
// o plano é liberado sozinho (ver /api/plano).
// Precisa: STRIPE_WEBHOOK_SECRET (whsec_...) e SUPABASE_SERVICE_ROLE_KEY na Vercel.
const crypto = require('crypto');
const db = require('./_assinantes');

function readRaw(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function verify(raw, header, secret) {
  if (!header || !secret) return false;
  const parts = Object.fromEntries(header.split(',').map((p) => p.split('=')).filter((p) => p.length === 2).map(([k, v]) => [k.trim(), v.trim()]));
  const sigs = header.split(',').filter((p) => p.trim().startsWith('v1=')).map((p) => p.trim().slice(3));
  const ts = Number(parts.t);
  if (!ts || !sigs.length) return false;
  if (Math.abs(Date.now() / 1000 - ts) > 600) return false; // no máx. 10 min de diferença
  const expected = crypto.createHmac('sha256', secret).update(ts + '.' + raw, 'utf8').digest('hex');
  return sigs.some((s) => s.length === expected.length && crypto.timingSafeEqual(Buffer.from(s), Buffer.from(expected)));
}

// valor pago (em centavos) → nome do plano
function planFromAmount(cents, mode) {
  if (mode === 'payment') return cents >= 4500 && cents <= 5500 ? 'aovivo' : 'avulso';
  if (cents >= 13000) return 'anual';
  if (cents >= 3000) return 'premium';
  if (cents >= 1700) return 'basico';
  return 'fundador'; // €15 ou com cupom
}

async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).end(); }
  const raw = await readRaw(req);
  if (!verify(raw, req.headers['stripe-signature'], process.env.STRIPE_WEBHOOK_SECRET)) {
    return res.status(400).json({ error: 'assinatura inválida' });
  }
  let ev;
  try { ev = JSON.parse(raw); } catch (e) { return res.status(400).end(); }
  const obj = (ev.data && ev.data.object) || {};

  try {
    if (ev.type === 'checkout.session.completed') {
      const email = (obj.customer_details && obj.customer_details.email) || obj.customer_email;
      if (email) {
        const plano = planFromAmount(obj.amount_subtotal || obj.amount_total || 0, obj.mode);
        // conversa ao vivo avulsa não libera o app
        if (plano !== 'aovivo' && plano !== 'avulso') {
          await db.upsert({ email, plano, status: 'active', stripe_customer: obj.customer || null, ref: obj.client_reference_id || null });
        }
      }
    } else if (ev.type === 'customer.subscription.deleted') {
      if (obj.customer) await db.setStatusByCustomer(obj.customer, 'canceled');
    } else if (ev.type === 'customer.subscription.updated') {
      if (obj.customer) {
        const ok = ['active', 'trialing', 'past_due'].includes(obj.status);
        await db.setStatusByCustomer(obj.customer, ok ? 'active' : obj.status);
      }
    }
  } catch (e) {
    console.error('stripe-webhook', e.message);
    return res.status(500).json({ error: 'db' }); // Stripe tenta de novo sozinho
  }
  return res.status(200).json({ received: true });
}

module.exports = handler;
module.exports.config = { api: { bodyParser: false } };
module.exports._internal = { verify, planFromAmount };
