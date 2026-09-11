# Changelog

## v11.28.1 — Logo "fala real" volta ao topo

**O quê:** Clicar no logo "fala real" no canto superior esquerdo da nav
agora rola a tela suavemente de volta pro topo da página, como é padrão
na maioria dos sites.

**Onde:** nav, logo no canto superior esquerdo (não mexi no logo que
aparece no rodapé, ao lado do número de versão).

**Como funciona:** o logo virou um link (antes era só um `<div>`, sem
ação nenhuma ao clicar); o clique dispara `window.scrollTo({top:0,
behavior:'smooth'})` em vez de recarregar a página — assim é mais rápido
e não perde nada que já estava carregado (XP, sequência, progresso do
quiz etc. continuam do jeito que estavam).

---

# Changelog

## v11.28.0 — Espanhol adicionado como idioma da interface

**O quê:** O seletor de idioma da interface (canto superior direito da nav)
agora tem uma terceira opção: 🇪🇸 Español, além de 🇧🇷 Português e 🇬🇧 English.
Hispanofalantes conseguem navegar o site inteiro em espanhol — nav, FAQ,
Hero, Comparação, Níveis, Preços, faixa de e-mail, quiz de diagnóstico e
os textos gerados dinamicamente (toasts, mensagens de formulário) — enquanto
ainda escolhem se querem aprender alemão ou inglês (esse é outro toggle,
que continua funcionando do jeito de sempre).

**Onde:** `<select id="site-lang-select">` na nav, mais um novo bloco
`es: {...}` dentro de `I18N_STRINGS` no `<script>` principal, com as 365
chaves que já existiam em `pt`/`en`, todas traduzidas.

**Como funciona:** Seguiu exatamente a receita que já estava documentada
no código desde a v11.25.0 pra adicionar um novo idioma: um bloco novo em
`I18N_STRINGS` copiando as chaves de referência, mais uma `<option>` no
seletor. Não precisou mexer em mais nada — nem no `applyInterfaceLanguage()`,
nem em RTL (espanhol é escrito da esquerda pra direita, então `RTL_LANGS`
não mudou).

**Observação de tradução:** o texto de abertura do Hero (que na versão em
português/inglês fala especificamente "pra brasileiro que vive na
Alemanha") foi generalizado em espanhol pra "para quem vive (ou vai
viver) na Alemanha" — já que o público hispanofalante não é
necessariamente brasileiro. Fora esse ajuste, a tradução seguiu o
conteúdo português como referência.

**Testado:** verificação automatizada via Playwright/Chromium — troca pra
espanhol, conferência de texto em várias seções, e teste alternando entre
as trilhas de aprendizado de alemão e inglês com a interface em espanhol
ativa, sem erros de JavaScript no console.

---

# Changelog

## v11.27.0 — Diagnóstico traduzível + correção "German"/"English" + textos dinâmicos no i18n

**Correções de conteúdo:**
- Corrigido: na trilha de aprendizado de inglês, o título da faixa de e-mail
  (#comecar) e a resposta 3 do FAQ diziam "German"/"alemão" por engano
  (herdado do texto da trilha de alemão, copiado sem ajustar). Agora dizem
  "English"/"inglês" nos dois idiomas de interface.

**O quê:**
1. A seção de diagnóstico (quiz de 30 segundos, `#diagnostico`) agora segue
   o seletor de idioma da interface (🇧🇷/🇬🇧) — as duas perguntas, as 4+3
   opções de resposta (nas variantes alemão/inglês de aprendizado) e o link
   "Ver o plano ideal" ganharam `data-i18n`, seguindo o mesmo sistema já
   usado no resto do site. `data-key`/`data-label` (usados internamente
   pelo JavaScript pra montar o resumo do quiz) não foram alterados.
2. Textos que o site gera dinamicamente via JavaScript — toasts de
   recompensa, progresso de sequência/liga, resultado do quiz, mensagens
   de erro/sucesso de formulário, botões "Copiado"/"Enviando..." — agora
   também respeitam o idioma da interface. Foi criada uma função auxiliar
   `t(chave, variáveis)` que lê o dicionário `I18N_STRINGS` no idioma
   selecionado no momento; ~37 novas chaves foram adicionadas cobrindo
   esses textos.

**Onde:** seção `#diagnostico`, toasts de recompensa/sequência/liga,
resumo do quiz, mensagens dos formulários de feedback e "conversa ao
vivo", botões de copiar link/progresso na nuvem.

**Limitação conhecida:** textos dinâmicos que já estavam na tela *antes*
de trocar o idioma da interface (ex: contador "X / 29 tópicos estudados"
da trilha de gramática, badge de liga na barra lateral) só atualizam pro
novo idioma na próxima vez que a própria função que os gera rodar de
novo (ex: ao marcar um tópico, ao subir de nível) — não há uma atualização
instantânea e geral de tudo que já está na tela no momento da troca. Isso
foi uma decisão deliberada pra não arriscar quebrar outras partes do site
numa mudança maior de arquitetura.

**Testado:** verificação automatizada via Playwright/Chromium — troca de
idioma da interface, navegação completa pelo quiz de diagnóstico até o
resultado, sem erros de JavaScript no console.

---

# Changelog

## v11.26.0 — Seções de marketing migradas pro i18n da interface

**O quê:** As seções de marketing que ainda não seguiam o seletor de idioma
da interface (🇧🇷 Português / 🇬🇧 English, no canto superior direito da nav)
agora seguem. Isso completa o que ficou pendente na v11.25.0.

**Onde:** Hero (título, subtítulo, botões), Comparação, Níveis, FAQ, Preços
e a faixa de e-mail no final da página (#comecar) — nas duas variantes de
idioma de aprendizado (alemão e inglês).

**Como funciona:**
- Todo texto fixo dessas seções ganhou atributo `data-i18n` (ou
  `data-i18n-html` onde havia `<em>`/`<a>`/`<span>` dentro do texto,
  `data-i18n-placeholder` / `data-i18n-aria` nos campos de e-mail), seguindo
  exatamente o mesmo sistema já usado no resto do site desde a v11.25.0.
- Foram adicionadas 309 novas chaves em `I18N_STRINGS.pt` e 309 em
  `I18N_STRINGS.en` (agrupadas por seção com comentários `// Hero`,
  `// Comparação`, `// Níveis`, `// FAQ`, `// Preços`, `// Comecar
  (cta-band)` pra facilitar manutenção futura).
- Onde o texto já era diferente entre quem está aprendendo alemão e quem
  está aprendendo inglês, cada variante ganhou sua própria chave (sufixo
  `De`/`En`, mesmo padrão já usado em `step1TitleDe`/`step1TitleEn`).
- O conteúdo de aprendizado em si (frases, níveis, preços, perguntas do
  FAQ) **não foi reescrito** — só exposto ao sistema de tradução da
  interface. O texto em português é uma cópia exata do que já estava no
  ar; o inglês é tradução nova.

**Atenção — dois bugs de conteúdo pré-existentes, não corrigidos aqui:**
Na trilha de aprendizado de inglês, tanto o título da faixa de e-mail
quanto a resposta 3 do FAQ falam de "German"/alemão por engano (deveria
ser inglês) — esse erro já existia no site antes desta atualização e foi
mantido como estava, porque corrigir *conteúdo* não é o escopo desta
mudança (só tradução da interface). Vale uma correção rápida à parte.

**O que ainda não entrou:** textos gerados dinamicamente via JavaScript em
tempo de execução (mensagens de toast, resumo do quiz, contadores) e a
seção `#diagnostico` (quiz de 30 segundos) — ambos citados como pendentes
desde a v11.25.0, continuam em português por enquanto.

---

# Changelog

## v11.25.0 — Sistema de idioma da interface (i18n genérico)

**Correção importante:** a primeira tentativa dessa feature (rotulada como
v11.24.0 num zip anterior) foi construída em cima de uma cópia desatualizada
do site (18/08), que não tinha o fix do loop de recarregamento do Supabase
nem o selo de autenticidade no rodapé (ambos de 21/08, versão v11.24.0
"oficial"). Essa versão errada foi descartada — nunca chegou a ir pro ar.
Esta v11.25.0 foi construída em cima do arquivo certo (o mesmo que já
está valendo), preservando tudo isso.

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
e-mail (`#comecar`) — ainda **não** estão no sistema de i18n. Isso já
aparece hoje: no rodapé, por exemplo, os links já trocam de idioma mas a
frase "Feito por um brazuca..." não, porque faz parte desse bloco
duplicado antigo. Migrar essas seções pro mesmo sistema — e decidir se o
toggle de idioma de aprendizado e o de idioma da interface devem ficar
combinados ou não — é o próximo passo, e vale uma conversa à parte por
ser uma mudança maior (é literalmente onde o lead decide assinar).

Também não entraram: textos gerados dinamicamente via JavaScript em tempo
de execução (mensagens de toast, status de desafios, texto da trilha
lendária, contadores tipo "X / 29 tópicos estudados") — esses continuam
em português por enquanto, pois exigem localizar cada função que gera
esses textos, não só o HTML estático.

---

## v11.24.0 — Fix do loop de recarregamento + selo de autenticidade
- Corrigido: `location.reload()` após restaurar sessão do Supabase causava
  loop infinito de recarregamento pra quem já estava logado com progresso
  salvo. Substituído por `refreshUIFromLocalStorage()`, que atualiza a tela
  sem recarregar a página.
- Adicionado selo de autenticidade discreto no rodapé ("✓ Fala Real · © 2026"),
  reforçando que o site é o canal oficial.

---

## Versões anteriores
Ver histórico de commits / builds anteriores (v11.6–v11.23) para o
sistema de desafios, ligas de XP, trilha de gramática A1–C2, dever de
casa e demais funcionalidades.
