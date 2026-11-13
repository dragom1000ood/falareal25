// Falaut v14.0.0 — POST /api/plano
// O site manda o token de login do Supabase; a gente confere quem é
// e diz se esse e-mail tem assinatura ativa (tabela "assinantes").
const db = require('./_assinantes');

module.exports = async (req, res) => {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).end(); }
  const auth = String(req.headers.authorization || '');
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token || token.length > 4000) return res.status(401).json({ ativo: false });
  try {
    const email = await db.emailFromToken(token);
    if (!email) return res.status(401).json({ ativo: false });
    const row = await db.getByEmail(email);
    const ativo = !!(row && row.status === 'active');
    return res.status(200).json({ ativo, plano: ativo ? row.plano : null });
  } catch (e) {
    console.error('plano', e.message);
    return res.status(500).json({ ativo: false });
  }
};
