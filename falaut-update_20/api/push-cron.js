// Falaut v13.2.0 — GET /api/push-cron  (chamado pela Vercel 1x por dia, ver vercel.json)
// Manda o lembrete só pra quem ainda NÃO treinou hoje (no fuso da pessoa)
// e ainda não recebeu lembrete hoje. Inscrições mortas (404/410) são apagadas.
const db = require('./_supabase');
const { sendPush } = require('./_webpush');

const TEXTS = {
  pt: { title: 'Falaut 🔥', withStreak: 'Sua sequência de {n} dias acaba hoje! Treina 1 minutinho e mantém o fogo aceso.', noStreak: 'Ainda dá tempo de treinar hoje! 1 palavra já conta pra sua sequência.' },
  en: { title: 'Falaut 🔥', withStreak: 'Your {n}-day streak ends today! Practice for a minute and keep it alive.', noStreak: "There's still time to practice today! One word already counts for your streak." },
  es: { title: 'Falaut 🔥', withStreak: '¡Tu racha de {n} días termina hoy! Entrena un minutito y mantenla viva.', noStreak: '¡Todavía hay tiempo de entrenar hoy! Una palabra ya cuenta para tu racha.' },
  de: { title: 'Falaut 🔥', withStreak: 'Deine {n}-Tage-Serie endet heute! Übe kurz eine Minute und halte sie am Leben.', noStreak: 'Du kannst heute noch trainieren! Schon ein Wort zählt für deine Serie.' }
};

function localDate(tz) {
  try { return new Intl.DateTimeFormat('en-CA', { timeZone: tz || 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()); }
  catch (e) { return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()); }
}
function yesterdayOf(dateStr) {
  const d = new Date(dateStr + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

module.exports = async (req, res) => {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.authorization !== 'Bearer ' + secret) return res.status(401).json({ error: 'unauthorized' });

  const vapid = {
    publicKey: process.env.VAPID_PUBLIC_KEY,
    privateKey: process.env.VAPID_PRIVATE_KEY,
    subject: process.env.VAPID_SUBJECT || 'https://falareal-site31.vercel.app'
  };
  if (!vapid.publicKey || !vapid.privateKey) return res.status(500).json({ error: 'Faltam VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY' });

  const stats = { total: 0, sent: 0, skipped: 0, removed: 0, failed: 0 };
  try {
    const rows = (await db.all()) || [];
    stats.total = rows.length;
    const queue = rows.slice();
    async function worker() {
      while (queue.length) {
        const row = queue.shift();
        const today = localDate(row.tz);
        if (row.last_trained === today || row.last_sent === today) { stats.skipped++; continue; }
        const L = TEXTS[row.lang] || TEXTS.pt;
        // a sequência só está "em risco" se o último treino foi ontem
        const alive = row.streak > 1 && row.last_trained === yesterdayOf(today);
        const body = alive ? L.withStreak.replace('{n}', row.streak) : L.noStreak;
        try {
          const r = await sendPush(row.subscription, { title: L.title, body, url: '/#experimente', tag: 'falaut-daily' }, vapid);
          if (r.ok) { stats.sent++; await db.update(row.endpoint, { last_sent: today }); }
          else if (r.status === 404 || r.status === 410) { stats.removed++; await db.remove(row.endpoint); }
          else { stats.failed++; console.error('[push-cron]', r.status, r.text.slice(0, 200)); }
        } catch (e) { stats.failed++; console.error('[push-cron]', e); }
      }
    }
    await Promise.all(Array.from({ length: 10 }, worker));
    return res.status(200).json(stats);
  } catch (err) {
    console.error('[push-cron]', err);
    return res.status(500).json(Object.assign({ error: 'server' }, stats));
  }
};
