# CHANGELOG — Falaut

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
