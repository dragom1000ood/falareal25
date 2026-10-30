# CHANGELOG — Falaut

## v13.4.0 — 2026-10-30 · Planos novos: Básico €19 e Premium €39

**Onde está:** seção **Preços** (`#preco`), nas 3 trilhas (🇩🇪 🇬🇧 🇧🇷) e nos 4 idiomas da interface.

**O que mudou**
- Os cards **Fundador (€15/mês)** e **Anual (€149/ano)** saíram da página para quem chega agora. No lugar:
  - **Básico — €19/mês** (selo "Mais popular"): o app inteiro sem limite — todos os níveis + nível infinito, conversas ilimitadas com todos os sotaques, gramática A1–C2, palavra bônus e proteção da sequência.
  - **Premium — €39/mês**: tudo do Básico + **1 conversa ao vivo comigo por mês (30 min)**, tira-dúvidas e correção de áudio no WhatsApp e plano de estudo pessoal.
  - O plano **Grátis (€0)** continua igual.
- Aviso embaixo dos planos: *"Já é Fundador (€15/mês) ou Anual (€149/ano)? Teu preço continua travado enquanto a assinatura estiver ativa."*
- Os textos de bloqueio ("exclusivo de fundador") viraram **"exclusivo dos planos Básico e Premium"**, e "como fundador" virou **"como assinante"** (proteção da sequência, palavra bônus, níveis 3+, gramática C1–C2).

**⚠️ O que você precisa fazer**
1. **Stripe:** crie 2 Payment Links de assinatura mensal (€19 e €39) e cole em `index.html`, no bloco *PLANOS NOVOS*:
   ```js
   const PLAN_LINKS = {
     basico:  'https://buy.stripe.com/...',
     premium: 'https://buy.stripe.com/...'
   };
   ```
   Enquanto ficar vazio, os botões "Quero o Básico/Premium" levam para a **lista de espera** (`#comecar`), não para um checkout quebrado. Quando o link existe, o código de quem indicou vai junto como `client_reference_id`.
2. **Liberar o acesso:** igual hoje, quem assina Básico ou Premium precisa de `is_founder = true` na tabela `profiles` do Supabase. O nome do campo continua o mesmo; ele só significa "plano pago".
3. Os links antigos de Fundador e Anual no Stripe podem continuar ativos para quem já assina. Eles só não aparecem mais no site.

**Arquivos para subir na raiz do repositório:** `index.html` e `sw.js` (substituir os atuais).
Service Worker: cache `falaut-v13.4.0` — quem tem o app instalado recebe o aviso "Nova versão" e precisa tocar em **Atualizar**.


## v13.3.0 — 2026-10-30 · Ofensiva social: card pro Stories, missão de divulgação e recorde

**Onde está:** card **Sequência diária** (seção *Experimente*), em todas as trilhas (🇩🇪 🇬🇧 🇧🇷) e nos 4 idiomas da interface.

**📣 Missão de divulgação** (caixa nova acima do botão "Divulgar minha ofensiva")
- **Divulgou hoje = +15 xp** (1x por dia). Esse XP **não marca o dia de estudo**: a sequência continua exigindo treino de verdade.
- **Divulgou 3 dias na semana = 1 congelador ❄️ grátis** (se já tiver 2 guardados, vira +30 xp). Bolinhas mostram o progresso (●●○ 2/3). Reseta toda segunda.
- Mostra também o **🏆 recorde** da sua sequência.
- Conta como divulgação: concluir o compartilhamento pelo botão do celular, mandar no WhatsApp ou baixar a imagem. Cancelar o compartilhamento não dá recompensa.

**🖼️ Janela de compartilhar (nova)**
- Card em **Stories 9:16** (padrão) ou **Post 1:1**, com: marca **falaut**, trilha (ex.: ALEMÃO DE VERDADE 🇩🇪), 🔥 + número de dias, **semana atual** (dias treinados e ❄️ congelados), recorde, liga e XP, e uma caixa **"Treina comigo 👇"** com o endereço do site, o **código de convite** da pessoa e **@falautoficial**. No Stories, a caixa fica acima da barra de resposta do Instagram.
- **📤 Compartilhar:** abre o menu do celular (Instagram, TikTok, WhatsApp…) já com a imagem, e **copia a legenda** automaticamente. No computador, baixa a imagem.
- **📲 WhatsApp**, **📥 Baixar imagem** e **📋 Copiar legenda**. A legenda vem com link de convite (`?ref=CÓDIGO`) e hashtags da trilha (#alemaodeverdade #brasileirosnaalemanha #falaut…).

**🏅 Marcos abrem o card sozinho**
- Ao chegar em **3, 7, 14, 21, 30, 50, 75, 100, 150, 200, 250, 300, 365** dias (depois, a cada 100), a janela abre com o selo **"CONQUISTA · N DIAS"** pronta pra postar.
- **Novo recorde** (a partir de 3 dias) mostra o aviso "🏆 Novo recorde: N dias seguidos!".

**🐞 Bugs corrigidos**
- O card de compartilhar ainda mostrava a **marca antiga "falareal"**.
- O card mostrava o **número velho** da sequência mesmo depois de ela quebrar. Agora usa a sequência que vale hoje, e o botão de divulgar some quando a sequência está em 0.
- **"Baixar imagem" não funcionava no app do iPhone**: agora usa o compartilhar nativo, e o download usa arquivo (blob) em vez de data URL.
- O link compartilhado era a URL da página (às vezes com `?ref=` de outra pessoa) e **não levava o seu código de convite**. Agora leva o seu.
- O **código de convite mudava em cada aparelho**. Agora vai junto com a conta ☁️.
- O botão **"Copiar"** do convite dava erro em navegadores sem área de transferência. Agora tem plano B.
- O atalho de teste `?devstreak=` não preenchia a trilha de português.

**Por trás** (`index.html`)
- Bloco *OFENSIVA SOCIAL* (substitui o antigo "Card de compartilhamento"): `renderShareMission`, `rewardShare`, `drawShareCard`, `openShareModal`.
- Dados novos: `falaut_social_v1` (dias em que divulgou, congelador da semana) e `best` (recorde) dentro de cada `falareal_streak_*`. Ambos entram na sincronização da nuvem (junta os aparelhos, sem perder nada).

**Arquivos para subir na raiz do repositório:** `index.html` e `sw.js` (substituir os atuais).
Service Worker: cache `falaut-v13.3.0`. Quem tem o app instalado recebe o aviso "Nova versão" e precisa tocar em **Atualizar**.


## v13.2.1 — 2026-10-26 · Correção: sequência presa no dia 1 e recompensas sem poder resgatar

**1. App aberto em segundo plano ficava preso no dia anterior** (causa principal dos dois problemas)
- O app instalado no celular (e a aba do navegador) fica dias "dormindo" sem recarregar. Ao voltar no dia seguinte, nada virava o dia: o botão continuava **"Treinado hoje ✓" travado**, os desafios diários continuavam **"✓ resgatado"** (impossível resgatar o XP de novo) e semanal/mensal não resetavam. Como não dava pra marcar, a sequência quebrava e voltava pro **1**.
- Agora o site detecta a virada do dia ao voltar pro app (`visibilitychange`, `focus`, `pageshow`) e a cada 1 minuto, e também logo antes de marcar a sequência, ganhar XP ou resgatar. Tudo é recarregado: botão liberado, desafios novos, semana/mês resetados.
- Logado (☁️): ao voltar pro app depois de 5+ minutos (ou num dia novo), o progresso da nuvem é baixado de novo, pra juntar o que você fez em outro aparelho.
- Onde: `index.html`, bloco *VIRADA DO DIA COM O APP ABERTO* (função `checkDayRollover`), antes do bloco do idioma inicial.

**2. Desafios impossíveis no plano free**
- No free o nível para no 2, mas os desafios pediam "Suba 3/5 níveis" e "Alcance o nível 8". Eles nunca completavam, o **dia perfeito** nunca fechava e os **cupons do combo** nunca destravavam.
- Novos desafios diários pra todo mundo: **"Faça a palavra do dia"** (+10xp) e **"Acerte 1 exercício de gramática"** (+12xp, conta também a revisão). No free, os desafios de nível não aparecem mais.
- Semanal no free: "Alcance o nível 8" foi trocado por **"Ouça 10 áudios essa semana"** (+30xp). Fundadores continuam com os desafios de nível.
- Onde: seção *DESAFIOS* (`dailyPoolFor`, `weeklyChallenges`).

**3. Cupons do combo com código errado**
- O site mostrava **FALA2–FALA5**, mas no Stripe eles foram renomeados para **FALAREAL2–FALAREAL5** — o código copiado era recusado no checkout. Corrigido em `COMBO_REWARD_TIERS`.

**4. Número da sequência mais honesto**
- Se a sequência já quebrou (faltou dia sem congelador/folga de fundador), o card mostra **0** em vez do número velho que depois "pulava" pra 1. O dado salvo não muda. Função `liveStreak()`.

**5. Textos dos desafios traduzidos**
- "🎁 Abrir recompensa", "✓ resgatado" e "quase lá 🔥" estavam fixos em português; agora seguem o idioma da interface (pt/en/es/de).

**Observação:** uma sequência que já voltou pro 1 não é recuperada sozinha (o número antigo não existe mais). Dá pra restaurar manualmente se quiser.

**Arquivos para subir na raiz do repositório:** `index.html` e `sw.js` (substituir os atuais).
Service Worker: cache `falaut-v13.2.1` — quem tem o app instalado recebe o aviso "Nova versão" e precisa tocar em **Atualizar**.


## v13.2.0 — 2026-10-15 · Calendário da série, congelador ❄️ e lembrete diário 🔔

**Onde está:** tudo no card **Sequência diária / Tägliche Serie** (seção *Experimente*), em todas as trilhas (🇩🇪 🇬🇧 🇧🇷) e nos 4 idiomas da interface.

**📅 Semana real + calendário do mês**
- Os 7 quadradinhos agora são a **semana atual, de segunda a domingo**, com as iniciais dos dias (no idioma da interface). Dourado = treinou, ❄ azul = salvo por congelador, borda dourada = hoje, apagado = dias que ainda não chegaram.
- Botão **"📅 Ver mês"** abre o calendário do mês com setas ‹ › para os meses anteriores e o total: "🔥 X dias treinados · ❄️ Y congelados".
- O app passou a guardar o **histórico dos dias treinados** (até 400 dias, por idioma). Quem já tinha sequência antes da atualização ganha os últimos N dias preenchidos automaticamente a partir da sequência atual.
- Na conta ☁️, o histórico dos aparelhos é **somado** (o dia treinado no celular aparece no computador e vice-versa).

**❄️ Congelar série**
- Botão **"❄️ Congelar série · 100 xp"**: compra um congelador com XP. Dá para guardar até **2**.
- Se você faltar dias, ao voltar cada dia perdido usa 1 congelador automaticamente e a sequência **continua** (aparece o aviso "Congelador usado"). Se faltarem mais dias do que congeladores, a sequência recomeça como antes.
- O XP gasto **não diminui sua liga nem o total de XP**: ele sai de um saldo separado ("X xp pra gastar" = XP ganho − XP já gasto em congeladores).
- Para fundadores, a folga de 1 dia continua valendo primeiro (de graça). O congelador só entra depois dela.

**🔔 Lembrete diário**
- Botão **"🔔 Lembrete diário"**: pede permissão de notificação e liga o lembrete. Tocando de novo, desliga.
- Todo dia por volta das **20h** (horário da Alemanha), quem **ainda não treinou** recebe uma notificação no idioma da interface. Se a sequência está viva, ela diz "Sua sequência de N dias acaba hoje!". Quem já treinou não recebe nada. Tocar na notificação abre o site no card da sequência.
- **iPhone:** só funciona com o app instalado na Tela de Início (iOS 16.4+). No Safari normal, o botão abre o tutorial de instalação.
- Como funciona por trás: `sw.js` (mostra a notificação) → `/api/push-subscribe` (guarda a inscrição no Supabase) → `/api/push-cron` (a Vercel chama 1x por dia, configurado em `vercel.json`, e manda só pra quem precisa). Inscrições que o celular cancelou são apagadas sozinhas.
- ⚠️ **Precisa de configuração única na Vercel e no Supabase. Veja `SETUP-LEMBRETE.md`.** Sem ela, o calendário e o congelador funcionam normalmente e só o lembrete mostra erro.

**Arquivos para subir na raiz do repositório:** `index.html`, `sw.js`, `vercel.json` (novo) e a pasta `api/` (nova: `push-subscribe.js`, `push-cron.js`, `_webpush.js`, `_supabase.js`).
Service Worker: cache `falaut-v13.2.0`. Quem tem o app instalado precisa tocar em **Atualizar** para receber os lembretes.


## v13.1.1 — 2026-10-12 · Correção: sequência diária presa no 1

**O problema**
- Para quem usa conta (☁️), a sequência voltava pro **1** mesmo treinando todo dia.
- Causa: ao juntar o progresso do aparelho com o da nuvem, ganhava sempre o lado com a **data mais nova**. Se um aparelho marcava o dia com dados velhos (sem internet, estudou antes do login carregar, app instalado x Safari — que no iPhone têm armazenamentos separados —, ou o iPhone apagou os dados do site), ele gravava "sequência 1, hoje". Essa data de hoje passava por cima da sequência certa da nuvem ("40, ontem") e o 1 ficava valendo em todo lugar.

**O que mudou** (`index.html`, seção *LOGIN / CADASTRO / SINCRONIZAÇÃO*, funções `dayDiff` e `mergeRun`)
- Quando as duas sequências **se encostam no calendário** (a mais velha termina no dia anterior ao começo da mais nova, ou elas se sobrepõem), agora elas são **somadas**, descontando os dias contados nos dois lados. Ex.: nuvem "40 até ontem" + aparelho "1 hoje" = **41**.
- Se tem um buraco de verdade (dia sem treino), a sequência continua quebrando normalmente. Fundadores mantêm a tolerância de 1 dia de folga.
- A mesma correção vale para a sequência de **palavra do dia** (dever de casa).
- Datas comparadas sempre como dia do calendário (sem fuso/horário de verão).

**Importante**
- A correção evita que a sequência caia de novo daqui pra frente. Uma sequência que **já foi** sobrescrita pelo 1 não volta sozinha, porque o número antigo não existe mais em lugar nenhum. Se quiser, dá pra restaurar manualmente.
- Lembrete: a sequência é **separada por idioma** (🇩🇪 / 🇬🇧 / 🇧🇷). Treinar alemão num dia e inglês no outro quebra as duas.
- Service Worker: cache `falaut-v13.1.1` — quem tem o app instalado recebe o aviso de nova versão.

**Arquivos para subir:** `index.html` e `sw.js` na raiz do repositório (substituir os atuais).


## v13.1.0 — 2026-10-09 · Botão "Baixar app" no menu + mini tutorial

**Onde está**
- O botão de instalar saiu do canto de cima à esquerda (onde ficava por cima do logo) e foi para o **menu do topo**, logo antes de "Quero testar". Estilo contornado em dourado, para não competir com o botão principal.
- No celular aparece como ícone + **"App"**; em telas bem pequenas (≤340px) só o ícone. Em tablet (641–940px) o seletor Alemão/Inglês/Português mostra só as bandeiras para caber tudo, e no celular o seletor de idioma do site mostra só a bandeira.
- O botão agora aparece **sempre** (antes, no Android, só aparecia quando o Chrome liberava a instalação). Some sozinho se o site já estiver aberto como app.

**Como funciona o tutorial** (`pwa.js`, seção 6)
- Clicar em "Baixar app" abre uma janela com **3 passos ilustrados**, já na aba certa para o aparelho da pessoa: **iPhone** (Compartilhar → Adicionar à Tela de Início → Adicionar), **Android** (⋮ → Instalar app → Instalar) ou **Computador** (ícone de instalar na barra do Chrome/Edge; Safari do Mac: Arquivo → Adicionar ao Dock). Dá para trocar de aba.
- No Android/Chrome, quando o navegador permite, aparece em cima um botão grande **"Instalar agora"** que instala com um toque; os passos manuais ficam embaixo como plano B.
- No iPhone fora do Safari (Chrome, Instagram etc.) aparece um aviso para abrir o site no Safari.
- Textos nos 4 idiomas da interface (pt, en, es, de) e acompanham a troca de idioma do site.
- Fecha no X, em "Entendi", tocando fora ou com Esc.
- O lembrete automático do iPhone (após 25s) agora tem o botão **"Ver como"**, que abre o mesmo tutorial.
- Para abrir o tutorial de outro lugar do site: `window.falautOpenInstallTutorial()` (ou com `'ios'`, `'android'`, `'desktop'`).


## v13.0.0 — 2026-10-09 · Rebrand: FalaReal → Falaut

**O que mudou**
- O nome **FalaReal / Fala Real** virou **Falaut** em tudo que o visitante vê: título da aba, Open Graph/Twitter, nome do app (manifest e iOS), logo do topo e do rodapé (`fala` + `ut` em dourado), comparação, FAQ, e-book, widget de feedback, mensagens de convite por WhatsApp e textos dinâmicos (toasts) nos 4 idiomas da interface (pt, en, es, de).
- Páginas extras atualizadas: `obrigado.html`, `reembolso.html`, `offline.html`, `loading-aviao.html`, `pwa.js` (banner "Instalar o app Falaut").
- **Ícones e splash screens novos** (`/icons`, `/splash`): selo com monograma **fl** e "FALAUT", mesmas cores (verde #113320, dourado #C9A227, creme #EDE6D6), tagline do splash mantida.
- Imagem de compartilhar sequência agora baixa como `falaut-sequencia.png`.
- Canonical / og:url / schema corrigidos para o endereço que está no ar de verdade: `https://falareal-site31.vercel.app` (antes apontavam para o antigo `falareal-site23-4`).
- Service Worker: cache renomeado para `falaut-v13.0.0`. Quem tem o app instalado recebe o aviso "Nova versão disponível" e passa a ver o nome novo e os ícones novos.

**O que NÃO mudou (de propósito)**
- **Cupons do Stripe** (`FALAREAL100` … `FALAREALSUPREME1000`): continuam iguais, porque é assim que estão cadastrados no Stripe.
- **Chaves de dados salvos** (`falareal_streak_…`, `falareal_profile_v1`, `falareal_ref_code` etc.): continuam iguais, para ninguém perder streak, XP, gramática, perfil ou link de indicação. Não aparecem para o usuário.
- Endereço do Vercel (`falareal-site31.vercel.app`) e caminho do e-book.
- Os nomes de origem enviados ao Formspree agora dizem "Falaut …" — filtros antigos que procuravam "FalaReal" precisam ser ajustados.

**Como subir**
Substitua os arquivos na **raiz** do repositório (index.html, manifest.json, sw.js, pwa.js, páginas .html e as pastas `icons/` e `splash/`). Só subir a pasta como subpasta não é pego pelo Vercel.
