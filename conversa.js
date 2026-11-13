// Falaut v14.0.0 — POST /api/conversa
// A conversa com a IA (passo 2 do site). Modos:
//   chat     → a personagem do cenário responde (fica sempre no papel)
//   hint     → "💡 Ajuda": tradução da última fala + sugestão do que responder
//   feedback → "passo 3": o que você entendeu, o que passou batido, o que treinar
// Precisa da variável ANTHROPIC_API_KEY na Vercel (ver SETUP-CONVERSA.md).
// A chave nunca vai pro navegador: o site só fala com esta função.

const MODEL = process.env.ANTHROPIC_MODEL || 'claude-haiku-5-5';
const API_URL = 'https://api.anthropic.com/v1/messages';

const TRACKS = ['de', 'en', 'pt'];
const UI_LANGS = { pt: 'português do Brasil', en: 'English', es: 'español', de: 'Deutsch' };
const TARGET = { de: 'German', en: 'English', pt: 'Brazilian Portuguese' };
const MAX_MESSAGES = 30;      // ~15 falas de cada lado
const MAX_CHARS = 600;        // por mensagem

// ---------- cenários ----------
const SCENARIOS = {
  de: {
    arzt:    'You are the receptionist (Medizinische Fachangestellte) at a busy Hausarztpraxis. The learner calls or walks in and wants an appointment because they feel sick. Ask for the Versichertenkarte, symptoms, whether it is urgent, offer times.',
    amt:     'You are a clerk at the Bürgeramt. The learner must register their new address (Wohnsitz anmelden). Ask for the Wohnungsgeberbestätigung, passport, move-in date, etc. You follow the rules strictly.',
    job:     'You are the manager of a care home / restaurant doing a job interview (Vorstellungsgespräch) with the learner. Ask about experience, availability for shifts, why Germany, strengths. Professional but direct.',
    arbeit:  'You are a colleague (Kollege/Kollegin) at work. You need to swap a shift with the learner this weekend, and you also chat a bit about work. Informal, uses "du".',
    nachbar: 'You are the neighbour. You took a parcel (Paket) for the learner, and you also want to mention that it was a bit loud last night. Friendly but a little grumpy. Uses "Sie" at first.',
    baecker: 'You are the person at the counter of a Bäckerei in the morning rush. Take the learner\'s order, ask follow-up questions (zum Mitnehmen? Tüte? Karte oder bar?), there is a queue behind them.',
    vermieter: 'You are the landlord (Vermieter) on the phone. The learner calls because the heating is broken. You are not in a hurry to fix it and ask lots of questions.'
  },
  en: {
    interview:  'You are a hiring manager doing a job interview with the learner for a job abroad. Ask about experience, strengths, a difficult situation, salary expectations.',
    restaurant: 'You are a waiter/waitress in a busy restaurant. Take the learner\'s order, recommend dishes, ask about drinks, allergies, then the bill.',
    workcall:   'You are a colleague on a work call. You need to agree on a deadline and split tasks with the learner. You talk fast and use some business jargon.',
    airport:    'You are an airline check-in agent / airport staff. The learner\'s flight is delayed or overbooked; handle bags, seat, rebooking.',
    smalltalk:  'You are a friendly stranger at a party / bar. Make small talk with the learner: where are you from, what do you do, plans for the weekend.',
    doctor:     'You are a receptionist at a doctor\'s office. The learner wants an appointment; ask for details, insurance, symptoms, availability.'
  },
  pt: {
    padaria: 'Você é atendente de uma padaria no Brasil de manhã. Atenda o aprendiz: pão francês, café, pão de queijo, pergunta quantos, se é pra viagem, forma de pagamento (Pix, cartão).',
    uber:    'Você é motorista de Uber/táxi no Brasil. Bate papo com o passageiro (o aprendiz): de onde é, o trânsito, o calor, futebol, dicas da cidade.',
    feira:   'Você é feirante numa feira livre no Brasil. Ofereça frutas, negocie preço, faça graça, fale rápido como feirante.',
    festa:   'Você é um brasileiro simpático num churrasco/festa. Faça amizade com o aprendiz: o que acha do Brasil, comida, música, convide pra outro rolê.',
    hotel:   'Você é recepcionista de uma pousada/hotel no Brasil. Faça o check-in do aprendiz, explique café da manhã, Wi-Fi, passeios.',
    medico:  'Você é recepcionista de uma clínica no Brasil. O aprendiz quer marcar consulta; pergunte convênio ou particular, sintomas, horários.'
  }
};

// ---------- níveis e sotaques ----------
const ACCENTS = {
  de: {
    1: [{ id: 'hochdeutsch', label: 'Hochdeutsch', voice: 'de-DE', note: 'Clear standard German (Hochdeutsch), no dialect.' }],
    2: [{ id: 'hochdeutsch', label: 'Hochdeutsch', voice: 'de-DE', note: 'Standard German but natural everyday colloquial (Umgangssprache): "nee", "ne?", "halt", "mal", contractions like "hab", "gibt\'s".' }],
    3: [
      { id: 'bayerisch', label: 'Bayerisch', voice: 'de-DE', note: 'Light Bavarian flavour: "Grüß Gott", "Servus", "fei", "gell", "a bissl", "ned" instead of "nicht", "mia" for "wir" sometimes.' },
      { id: 'schwaebisch', label: 'Schwäbisch', voice: 'de-DE', note: 'Light Swabian flavour: "-le" diminutives (Momentle, Häusle), "isch" for "ist", "net" for "nicht", "gell", "schaffe" for "arbeiten".' },
      { id: 'saechsisch', label: 'Sächsisch', voice: 'de-DE', note: 'Light Saxon flavour: "nu" for "ja", "ni" for "nicht", "Gudn Tach", soft consonants written occasionally.' }
    ],
    4: [
      { id: 'schweizerisch', label: 'Schweizerdeutsch', voice: 'de-CH', note: 'Strong Swiss flavour: "Grüezi", "merci vielmal", "Velo", "parkieren", "ä bitzeli", "nöd", "gäll", "Ciao zäme". Keep it readable but clearly Swiss.' },
      { id: 'oesterreichisch', label: 'Österreichisch', voice: 'de-AT', note: 'Strong Austrian flavour: "Servus", "Grüß Gott", "Paradeiser", "Jänner", "heuer", "leiwand", "ur", "passt scho".' },
      { id: 'bayerisch-stark', label: 'Bayerisch (stark)', voice: 'de-DE', note: 'Strong Bavarian: "Griaß di", "ned", "mia", "i hob", "a Hoibe", "gell", "pfiat di".' }
    ]
  },
  en: {
    1: [{ id: 'us', label: 'American (neutral)', voice: 'en-US', note: 'Clear neutral American English.' }],
    2: [{ id: 'us', label: 'American', voice: 'en-US', note: 'Natural American English with everyday contractions and light slang ("gonna", "kinda", "no worries").' }],
    3: [
      { id: 'uk', label: 'British', voice: 'en-GB', note: 'British English: "cheers", "mate", "brilliant", "queue", "fancy a...?", "innit" occasionally.' },
      { id: 'au', label: 'Australian', voice: 'en-AU', note: 'Australian English: "arvo", "reckon", "heaps", "no worries", "mate", "how ya going?".' },
      { id: 'ie', label: 'Irish', voice: 'en-IE', note: 'Irish English: "grand", "craic", "your man", "ye", "sure look".' }
    ],
    4: [
      { id: 'scottish', label: 'Scottish', voice: 'en-GB', note: 'Strong Scottish: "aye", "wee", "cannae", "dinnae", "ken", "braw".' },
      { id: 'cockney', label: 'London / Cockney', voice: 'en-GB', note: 'Fast London: "innit", "bruv", "proper", "blimey", "ain\'t", dropped h\'s.' },
      { id: 'southern', label: 'US Southern', voice: 'en-US', note: 'Strong US Southern: "y\'all", "fixin\' to", "might could", "bless your heart".' }
    ]
  },
  pt: {
    1: [{ id: 'neutro', label: 'Neutro', voice: 'pt-BR', note: 'Clear, neutral Brazilian Portuguese, simple words.' }],
    2: [{ id: 'paulista', label: 'Paulista', voice: 'pt-BR', note: 'Natural São Paulo Portuguese: "meu", "mano", "tipo", "né", "tá", "pra".' }],
    3: [
      { id: 'carioca', label: 'Carioca', voice: 'pt-BR', note: 'Carioca: "maneiro", "irado", "caraca", "mermão", "parada", "partiu".' },
      { id: 'nordestino', label: 'Nordestino (paraibano)', voice: 'pt-BR', note: 'Northeastern (Paraíba): "oxe", "visse", "arretado", "massa", "vixe", "mainha", "abestado".' },
      { id: 'mineiro', label: 'Mineiro', voice: 'pt-BR', note: 'Mineiro: "uai", "trem", "sô", "cê", contractions like "pó pô" (pode pôr), "nossinhora".' }
    ],
    4: [
      { id: 'nordestino-forte', label: 'Nordestino (forte)', voice: 'pt-BR', note: 'Strong Northeastern, fast: "oxente", "bichinho", "vôte", "aperreado", "pantim", "arrocha".' },
      { id: 'gaucho', label: 'Gaúcho', voice: 'pt-BR', note: 'Strong gaúcho: "bah", "tchê", "tri", "guri/guria", "capaz", "barbaridade", uses "tu".' },
      { id: 'carioca-forte', label: 'Carioca (forte)', voice: 'pt-BR', note: 'Fast carioca street talk: "qual é, mermão", "papo reto", "sinistro", "vacilão", "tá ligado".' }
    ]
  }
};

const LEVEL_STYLE = {
  1: 'LEVEL 1 (slow & clear): very short, simple sentences (max ~12 words each), common vocabulary, polite, patient. Never interrupt. Ask one question at a time.',
  2: 'LEVEL 2 (everyday pace): natural speed and everyday expressions, 1-3 sentences, some common idioms. Patient but not slow.',
  3: 'LEVEL 3 (accents & environment): the regional accent described below is clearly present in your wording. Mention the noisy environment occasionally (phone ringing, someone calling you, queue). Natural speed, 1-3 sentences, some fillers.',
  4: 'LEVEL 4 (real life): strong accent as described below, you are in a hurry and a bit impatient. Sometimes cut the learner off ("— ja ja, schon klar, aber..." style dashes), change topic abruptly, ask two things at once, use fillers and slang. Short and fast. Still a realistic person, never rude or insulting.'
};

// ---------- limite simples por IP (melhor esforço) ----------
const hits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const list = (hits.get(ip) || []).filter((t) => now - t < windowMs);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) hits.clear();
  return list.length > 80;
}

function pickAccent(track, level, accentId) {
  const list = ACCENTS[track][level];
  return list.find((a) => a.id === accentId) || list[Math.floor(Math.random() * list.length)];
}

function cleanMessages(raw) {
  if (!Array.isArray(raw)) return null;
  const out = [];
  for (const m of raw.slice(-MAX_MESSAGES)) {
    if (!m || (m.role !== 'user' && m.role !== 'assistant')) return null;
    const text = String(m.content || '').slice(0, MAX_CHARS).trim();
    if (!text) continue;
    const last = out[out.length - 1];
    if (last && last.role === m.role) last.content += '\n' + text;
    else out.push({ role: m.role, content: text });
  }
  return out;
}

function chatSystem(track, scenario, level, accent) {
  return [
    `You are a character in a speaking-practice role-play for a language learner. The learner is practising ${TARGET[track]}.`,
    `SCENE: ${SCENARIOS[track][scenario]}`,
    `ACCENT / REGISTER: ${accent.note}`,
    LEVEL_STYLE[level],
    'RULES:',
    `- Speak ONLY ${TARGET[track]}, in character, as spoken dialogue. Never switch to another language, never explain grammar, never correct the learner, never mention that you are an AI or that this is practice.`,
    '- Your text will be read aloud by a text-to-speech voice: no emojis, no stage directions, no asterisks, no lists, no quotation marks around your whole reply.',
    '- Keep replies short (normally 1-3 sentences) and always give the learner something to answer.',
    '- If the learner\'s message is unclear, react like a real person would (ask again, guess, get a bit confused).',
    '- If the first user message is "(START)", open the scene yourself with a natural first line.',
    '- After roughly 10 exchanges, bring the situation to a natural end.'
  ].join('\n');
}

function transcript(messages) {
  return messages
    .filter((m) => m.content !== '(START)')
    .map((m) => (m.role === 'user' ? 'LEARNER: ' : 'CHARACTER: ') + m.content)
    .join('\n');
}

async function callClaude(system, messages, maxTokens) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json'
    },
    body: JSON.stringify({ model: MODEL, max_tokens: maxTokens, system, messages })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error((data.error && data.error.message) || ('HTTP ' + res.status));
    err.status = res.status;
    throw err;
  }
  return (data.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('').trim();
}

function parseJson(text) {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start < 0 || end < start) return null;
  try { return JSON.parse(text.slice(start, end + 1)); } catch (e) { return null; }
}

const strList = (v, n) => (Array.isArray(v) ? v : []).map((x) => String(x).slice(0, 300)).filter(Boolean).slice(0, n);

module.exports = async (req, res) => {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ error: 'method' }); }
  if (!process.env.ANTHROPIC_API_KEY) return res.status(503).json({ error: 'not_configured' });

  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (rateLimited(ip)) return res.status(429).json({ error: 'rate_limited' });

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = null; } }
  if (!body || typeof body !== 'object') return res.status(400).json({ error: 'body' });

  const mode = body.mode;
  const track = TRACKS.includes(body.track) ? body.track : null;
  const scenario = track && SCENARIOS[track][body.scenario] ? body.scenario : null;
  const level = [1, 2, 3, 4].includes(Number(body.level)) ? Number(body.level) : null;
  const uiLang = UI_LANGS[body.uiLang] ? body.uiLang : 'pt';
  const messages = cleanMessages(body.messages);
  if (!track || !scenario || !level || !messages) return res.status(400).json({ error: 'params' });

  const accent = pickAccent(track, level, body.accent);

  try {
    if (mode === 'chat') {
      const msgs = messages.length ? messages : [{ role: 'user', content: '(START)' }];
      if (msgs[0].role !== 'user') msgs.unshift({ role: 'user', content: '(START)' });
      if (msgs[msgs.length - 1].role !== 'user') return res.status(400).json({ error: 'turn' });
      const reply = await callClaude(chatSystem(track, scenario, level, accent), msgs, 220);
      return res.status(200).json({
        reply: reply.replace(/^\s*["“]|["”]\s*$/g, '').replace(/\*[^*]+\*/g, '').trim(),
        accent: accent.id, accentLabel: accent.label, voice: accent.voice
      });
    }

    if (mode === 'hint') {
      const lastAi = [...messages].reverse().find((m) => m.role === 'assistant');
      if (!lastAi) return res.status(400).json({ error: 'nothing' });
      const system = `You help a learner of ${TARGET[track]} during a role-play. Answer ONLY with JSON: {"traducao": "...", "sugestao": "...", "sugestaoTraducao": "..."}. "traducao" = what the character's last line means, explained in ${UI_LANGS[uiLang]} (include the meaning of any dialect/slang words). "sugestao" = one short, natural answer the learner could give, in ${TARGET[track]} (standard, level-appropriate). "sugestaoTraducao" = that suggestion in ${UI_LANGS[uiLang]}.`;
      const text = await callClaude(system, [{ role: 'user', content: 'Scene so far:\n' + transcript(messages) + '\n\nCharacter\'s last line: ' + lastAi.content }], 350);
      const j = parseJson(text) || {};
      return res.status(200).json({
        traducao: String(j.traducao || '').slice(0, 600),
        sugestao: String(j.sugestao || '').slice(0, 300),
        sugestaoTraducao: String(j.sugestaoTraducao || '').slice(0, 300)
      });
    }

    if (mode === 'feedback') {
      if (!messages.some((m) => m.role === 'user' && m.content !== '(START)')) return res.status(400).json({ error: 'nothing' });
      const system = `You are a warm but honest ${TARGET[track]} coach for a learner. Read the role-play transcript (level ${level}, accent: ${accent.label}). Write ALL explanations in ${UI_LANGS[uiLang]}. Answer ONLY with JSON:
{"resumo": "1-2 sentences on how it went, encouraging and specific",
 "entendeu": ["2-3 things the learner clearly understood or handled well"],
 "passou": ["2-3 things the learner missed or misunderstood: words, dialect expressions or questions they did not react to — quote the original words in ${TARGET[track]} and explain them"],
 "treinar": ["2-3 concrete things to practise next time"],
 "frases": [{"errado": "learner's sentence with a mistake (exact)", "certo": "natural corrected version in ${TARGET[track]}"}]}
"frases": up to 3 items, only real mistakes; empty array if none. Be specific to this transcript, no generic advice.`;
      const text = await callClaude(system, [{ role: 'user', content: transcript(messages) }], 900);
      const j = parseJson(text);
      if (!j) return res.status(502).json({ error: 'parse' });
      return res.status(200).json({
        resumo: String(j.resumo || '').slice(0, 500),
        entendeu: strList(j.entendeu, 4),
        passou: strList(j.passou, 4),
        treinar: strList(j.treinar, 4),
        frases: (Array.isArray(j.frases) ? j.frases : []).slice(0, 3)
          .map((f) => ({ errado: String((f && f.errado) || '').slice(0, 300), certo: String((f && f.certo) || '').slice(0, 300) }))
          .filter((f) => f.errado && f.certo)
      });
    }

    return res.status(400).json({ error: 'mode' });
  } catch (e) {
    console.error('conversa error', e.status, e.message);
    return res.status(502).json({ error: 'upstream' });
  }
};

// exportado só pra teste local
module.exports._internal = { SCENARIOS, ACCENTS, chatSystem, cleanMessages };
