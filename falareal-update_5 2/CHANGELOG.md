# Changelog

## v11.24.0 — Sistema de idioma da interface (i18n genérico)

**O quê:** Adicionado um sistema de tradução da interface do site, separado do
toggle existente "🇩🇪 Alemão / 🇬🇧 Inglês" (que continua sendo sobre qual
idioma a pessoa está *aprendendo*, e não muda).

**Onde:** Novo seletor de idioma (🇧🇷 Português / 🇬🇧 English) no canto
superior direito da nav, ao lado do toggle de idioma de aprendizado.

**Como funciona:**
- Todo texto fixo da interface (nav, botões, seção "Testa aqui" — perfil,
  XP, sequência, desafios, dever de casa, trilha de gramática —, "Como
  funciona", "Conversa ao vivo", rodapé, modal de login, painel de feedback)
  agora vem de um dicionário `I18N_STRINGS` dentro do `<script>` principal.
- Cada elemento traduzível ganhou um atributo `data-i18n="chave"` (ou
  `data-i18n-placeholder` / `data-i18n-title` / `data-i18n-aria` /
  `data-i18n-html` conforme o caso).
- A função `applyInterfaceLanguage(lang)` varre esses atributos e troca o
  texto. A escolha fica salva no navegador (`localStorage`) e é respeitada
  na próxima visita.
- **Suporte a RTL já embutido:** qualquer idioma escrito da direita pra
  esquerda (ex: árabe, hebraico) listado em `RTL_LANGS` já vira
  `dir="rtl"` automaticamente, e o CSS principal (nav, formulários, listas)
  já se adapta.
- **Adicionar um novo idioma no futuro = 2 passos, sem mexer no resto do
  código:**
  1. Adicionar um bloco novo em `I18N_STRINGS` (ex: `ar: {...}`) — as
     instruções e a lista completa de chaves estão comentadas logo acima
     do dicionário no código.
  2. Adicionar `<option value="ar">🇸🇦 العربية</option>` no
     `<select id="site-lang-select">`.
- O conteúdo de aprendizado de alemão (frases, trilha de gramática,
  vocabulário) **não foi alterado** — continua exatamente como estava.

**O que ainda não entrou nessa fase (próximo passo sugerido):**
As seções de marketing que já tinham conteúdo duplicado manualmente por
trilha de aprendizado — Hero, Comparação, Níveis, FAQ, Preços, faixa de
e-mail (`#comecar`) — ainda **não** estão no sistema de i18n. Elas hoje
alternam texto conforme o toggle 🇩🇪/🇬🇧 de forma independente e um pouco
inconsistente (algumas seções trocam pra inglês nesse toggle, outras não).
Migrar essas seções pro mesmo sistema — e decidir se o toggle de idioma
de aprendizado e o de idioma da interface devem ficar combinados ou não —
é o próximo passo, e vale uma conversa à parte por ser uma mudança maior.

Também não entraram: textos gerados dinamicamente via JavaScript em tempo
de execução (mensagens de toast, status de desafios, texto da trilha
lendária, contadores tipo "X / 29 tópicos estudados") — esses continuam
em português por enquanto, pois exigem localizar cada função que gera
esses textos, não só o HTML estático.

---

## Versões anteriores
Ver histórico de commits / builds anteriores (v11.6–v11.23) para o
sistema de desafios, ligas de XP, trilha de gramática A1–C2, dever de
casa e demais funcionalidades.
