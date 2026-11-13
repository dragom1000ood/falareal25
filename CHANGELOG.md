# CHANGELOG — Falaut

## v15.3.2 — 2026-11-13 · Falaut é alemão, inglês e português (não só alemão)

**Onde está:** tela de abertura do app, tela offline, nome do app instalado e prévia de link.

**O que mudou**
- Frase da tela de abertura e da tela offline: "alemão de verdade…" → **"idiomas de verdade, sem sala de aula."**
- Nome do app (`manifest.json`): "Falaut — alemão de verdade" → **"Falaut — idiomas de verdade"**, com a descrição citando as 3 línguas.
- Título da página e textos da prévia de link (Google, WhatsApp, Instagram) agora falam de **alemão, inglês e português**, das 5 palavras por dia e do teste grátis de 7 dias.
- Os textos da trilha de alemão no site continuam falando de alemão, porque só aparecem pra quem escolheu alemão.

**Arquivos para subir na raiz do repositório:** `index.html`, `sw.js`, `manifest.json`, `offline.html`, `CHANGELOG.md` e a pasta `splash/`.
Service Worker: cache `falaut-v15.3.2`.

## v15.3.1 — 2026-11-13 · Tela de abertura com a logo nova (iPhone)

**Onde está:** tela que aparece ao abrir o app instalado no iPhone/iPad (`splash/`).

**O que mudou**
- A tela de abertura ainda mostrava o selo antigo "fl / FALAUT". Agora mostra o **ícone novo** (mascote + F com ondas) sobre o verde, com a frase "alemão de verdade, sem sala de aula." e o traço dourado embaixo, no mesmo estilo de antes.
- **Força o iPhone a buscar as imagens novas:** os links das telas de abertura, do `apple-touch-icon` e dos ícones do `manifest.json` ganharam `?v=15.3.1`. Antes, o iPhone podia continuar mostrando a versão antiga guardada em cache.

**Arquivos para subir na raiz do repositório:** `index.html`, `sw.js`, `manifest.json`, `CHANGELOG.md` e a pasta `splash/` (e os ícones da v15.3.0, se ainda não subiu).
Service Worker: cache `falaut-v15.3.1`.

## v15.3.0 — 2026-11-13 · Ícone novo do app: mascote + F com ondas

**Onde está:** ícone do app instalado e telas de abertura (splash).

**O que mudou:** o ícone agora é a arte nova: o mascote fazendo joinha, o F creme com ondas douradas, o livro com as bandeiras da Alemanha, do Reino Unido e do Brasil, e a moldura dourada.
- `icon-192/512`: com cantos arredondados transparentes (os cantos pretos da imagem original foram removidos).
- `apple-touch-icon` (iPhone) e `icon-*-maskable` (Android): fundo verde da marca, pra não aparecer canto preto quando o sistema arredonda o ícone.
- Telas de abertura: ícone novo no centro, sobre o verde.
- Os **favicons** (aba do navegador, 16 e 32 px) continuam com o F + ondas da v15.1.1, porque a arte detalhada vira um borrão nesse tamanho.

**Arquivos para subir na raiz do repositório:** `index.html`, `sw.js`, `CHANGELOG.md`, `icon-192.png`, `icon-512.png`, `icon-192-maskable.png`, `icon-512-maskable.png`, `apple-touch-icon.png`, a pasta `icons/` e a pasta `splash/`.
Service Worker: cache `falaut-v15.3.0`.

## v15.2.0 — 2026-11-13 · Mascote anime no site + banner com a marca

**Onde está:** topo do site (`.hero-visual`), card da **Lição do dia** (`#licao`) e prévia de link no WhatsApp/Instagram (`og-image.jpg`).

**O que mudou**
- **Topo:** a ilustração antiga de ondas foi trocada pelo mascote (jaqueta verde, fone com o F, joinha). No computador ele fica à esquerda, "apresentando" o título; no celular, fica em cima do título.
- **Lição do dia:** o rosto do mascote aparece ao lado do aviso ("Primeira lição…", "⚠️ Faz hoje pra não perder…"). Quando a pessoa termina a lição, o mascote aparece grande, comemorando junto com a 🔥.
- **Prévia de link:** quem compartilha o site no WhatsApp agora vê o banner com o mascote, a logo e o slogan (`og-image.jpg`, 1200×630).

**Como funciona:** imagens em WebP, leves: `mascote.webp` (720 px, ~100 KB) e `mascote-cabeca.webp` (240 px, ~25 KB). A parte de baixo do mascote some num degradê pra não ficar um corte reto.

**Arquivos para subir na raiz do repositório:** `index.html`, `sw.js`, `CHANGELOG.md`, `mascote.webp`, `mascote-cabeca.webp`, `og-image.jpg`.
Service Worker: cache `falaut-v15.2.0`.

## v15.1.1 — 2026-11-13 · Logo final: F creme com ondas douradas (versão C)

**Onde está:** ícone do app, favicon e telas de abertura (splash).

**O que mudou:** o F dourado da v15.1.0 foi trocado pela versão escolhida, a C. É um **F creme (Fraunces) sobre o verde da marca, com 3 ondas douradas** saindo dele, de "laut", ou seja, falar alto. Nas telas de abertura, o ícone ganhou uma borda dourada fina pra não sumir no fundo verde.

**Arquivos para subir na raiz do repositório:** `index.html`, `sw.js`, `CHANGELOG.md`, os PNGs de ícone (`icon-*`, `apple-touch-icon`, `favicon-*`), a pasta `icons/` e a pasta `splash/`.
Service Worker: cache `falaut-v15.1.1`.

## v15.1.0 — 2026-11-13 · Logo nova do app: um F sozinho

**Onde está:** ícone do app instalado (tela inicial do celular), favicon da aba e telas de abertura (splash) do iPhone/iPad.

**O que mudou:** o selo verde com "fl" + "FALAUT" deu lugar a um **F grande** (Fraunces Black, verde-escuro) sobre **fundo dourado**, com um ponto vermelho-tijolo ("F."). O dourado se destaca na tela inicial, e o F continua legível até no tamanho de favicon (16 px). As splash screens agora mostram o ícone novo sobre o verde da marca.

**Como funciona:** os PNGs têm os mesmos nomes, na raiz e na pasta `icons/`: `icon-192/512`, `icon-192/512-maskable` (com o F menor, dentro da área segura do Android), `apple-touch-icon`, `favicon-16/32` e `splash/*.png`. O `manifest.json` não mudou.

**Atenção:** no iPhone, o ícone de quem já instalou só troca removendo o app da tela inicial e adicionando de novo. No Android, troca sozinho em alguns dias.

**Arquivos para subir na raiz do repositório:** `index.html`, `sw.js`, `CHANGELOG.md`, os PNGs de ícone, a pasta `icons/` e a pasta `splash/`.
Service Worker: cache `falaut-v15.1.0`.

## v15.0.0 — 2026-11-13 · Lição do dia (5 palavras) + ofensiva única que salva direito

**Onde está:** nova seção **Lição do dia** (`#licao`), logo abaixo do topo. Os botões **Quero testar**, **Quero começar de graça**, **Testar agora** e o botão do card da sequência levam pra ela.

**O que mudou**
- **Lição do dia:** 5 palavras novas por dia, em uns 2 minutos.
  1. **Aprender:** cartão com emoji, a palavra (no alemão o artigo vem colorido: der azul, die vermelho, das verde), a tradução e o áudio, que toca sozinho.
  2. **Testar:** 5 perguntas ("Como se diz em alemão?" / "O que significa?"). Quem erra vê a resposta certa, e a pergunta volta no fim da fila.
  3. **Fim:** confete, 🔥 +1 na ofensiva, lista das 5 palavras pra ouvir de novo. Botão **Quero mais 5 agora**, que dá XP mas não conta outro dia.
  - 150 palavras (30 lições), do "Hallo" ao "Wo ist die Toilette?", passando por Hund, Kuli e Feuer. Funciona nas 3 trilhas: alemão e inglês com tradução em português, e português com tradução em alemão. Depois da lição 30, o baralho recomeça como revisão.
  - O aviso muda conforme a situação: primeira lição, "⚠️ faz hoje pra não perder sua ofensiva de X dias", ofensiva zerada ou lição de hoje já feita.
- **Ofensiva única (correção do bug):** antes existiam 3 ofensivas separadas (alemão, inglês e português). Quem treinava um dia em cada idioma ficava sempre no dia 1. Agora é **uma só pra todos os idiomas**.
  - Na primeira vez que o site abre, as 3 antigas são juntadas: dias treinados somados num calendário só, XP somado, recorde e congeladores mantidos.
- O botão do card da sequência ("Marcar hoje") virou **Fazer a lição de hoje →**. Não dá mais pra marcar o dia sem estudar. Estudar gramática ou a palavra do dever de casa continua contando.
- Se pular um dia, a ofensiva zera, com as mesmas exceções de antes: congeladores ❄️ e a proteção de 1 dia do assinante.

**Como funciona**
- Progresso da lição: `falaut_licao_de_v1`, `falaut_licao_en_v1` e `falaut_licao_pt_v1` (número de lições feitas + último dia).
- Ofensiva: `falareal_streak_all_v1`. As chaves antigas (`falareal_streak_de/en/pt_v1`) ficam guardadas e são juntadas toda vez que a ofensiva carrega.
- As 4 chaves novas entram na sincronização da conta (Supabase), então a lição e a ofensiva seguem a pessoa entre aparelhos quando ela está logada.
- Baralho no `index.html`: bloco `LIÇÃO DO DIA`, `const DECK` = [emoji, alemão, inglês, português]. Pra adicionar palavras, basta acrescentar linhas de 5 em 5.

**Arquivos para subir na raiz do repositório:** `index.html`, `sw.js`, `CHANGELOG.md` (e a pasta `api/` e o `SETUP-PAGAMENTO.md` da v14.1.0, se ainda não subiu).
Service Worker: cache `falaut-v15.0.0`.

## v14.1.0 — 2026-11-13 · Conversa com IA retirada (fica pra depois), página direta e teste grátis mantidos

**Onde está:** a página toda. Ordem nova: topo → **Seu progresso** (`#experimente`) → **Preços** (`#preco`) → comparação → níveis → conversa ao vivo → FAQ.

**O que mudou**
- **A conversa com IA da v14.0.0 saiu** (seção `#conversa` e `api/conversa.js`). O código continua no pacote da v14.0.0, se quiser usar depois.
- Os botões **Quero testar** (menu e topo), **Quero começar de graça** e **Testar agora** levam pra **Seu progresso**, que abre sozinha ao chegar por esses links.
- **Preços sem promessa de conversa com IA:** Grátis = níveis 1 e 2, palavra do dia, sequência e XP, grupo do WhatsApp. O Básico agora lista "Todos os desafios e recompensas (cupons de desconto)" no lugar de "Conversas ilimitadas".
- **Conversa ao vivo** ganhou um texto novo, sem falar de IA ("Quer praticar com uma pessoa de verdade?").
- O FAQ 1 voltou ao texto original.
- **Mantido da v14.0.0:** teste grátis de 7 dias sem cartão (agora com o selo 🎁 no perfil), liberação automática do plano depois do pagamento, quiz e "Como funciona" fora da tela e a área de progresso fechada.

**Como funciona:** a configuração do pagamento está em **SETUP-PAGAMENTO.md** (substitui o SETUP-CONVERSA.md).

**Arquivos para subir na raiz do repositório:** `index.html`, `sw.js`, a pasta `api/`, `CHANGELOG.md`, `SETUP-PAGAMENTO.md`. Se a v14.0.0 já foi subida, apague `api/conversa.js` e `SETUP-CONVERSA.md`.
Service Worker: cache `falaut-v14.1.0`.

## v14.0.0 — 2026-11-13 · A conversa com IA funciona de verdade + teste grátis de 7 dias + página mais direta

**Onde está:** nova seção **Conversa de verdade. Agora.** (`#conversa`), logo abaixo do topo. Os botões **Quero testar** (menu e topo) e **Quero começar de graça** (preços) levam pra lá.

**O que mudou**
- **Conversa com IA (o passo 2 que faltava).** A pessoa escolhe o cenário (7 no alemão, 6 no inglês, 6 no português) e o nível 1–4. A personagem fala primeiro, com voz. A resposta pode ser falada (🎤) ou digitada.
  - Nível 1: devagar e claro. Nível 2: ritmo do dia a dia. Nível 3: sotaque regional (bávaro, suábio, saxão / britânico, australiano, irlandês / carioca, paraibano, mineiro) e ruído de fundo. Nível 4: sotaque forte (suíço, austríaco…), pressa, interrupções; se a pessoa demora mais de 9 segundos, a personagem cobra ("Hallo? Sind Sie noch da?").
  - Nos níveis 3 e 4 o texto vem borrado: primeiro ouvir, depois **👁 mostrar texto**.
  - **💡 Não entendi:** explica a última fala (com as gírias/dialeto) e sugere uma resposta, com botão **usar**.
  - **Terminar e ver retorno (passo 3):** o que você entendeu, o que passou batido, o que treinar, e as frases com erro no jeito natural. Dá XP.
- **Teste grátis de 7 dias, sem cartão.** Começa na primeira visita: tudo liberado (níveis 3–4, conversas sem limite, gramática completa, palavra bônus). Depois volta pro Grátis (níveis 1–2, 3 conversas por semana). Banner novo em **Preços**.
- **Plano liberado sozinho depois do pagamento.** O Stripe avisa o site (`/api/stripe-webhook`), o e-mail entra na tabela `assinantes`, e quando a pessoa entra com esse e-mail o site libera tudo (`/api/plano`). Antes, quem pagava Básico/Premium não era liberado.
- **Página mais direta:** ordem nova = topo → conversa → preços → comparação → níveis → progresso → ao vivo → FAQ. O quiz de diagnóstico e o "Como funciona" saíram da tela. A área de XP/desafios/recompensas fica fechada atrás do botão **📊 Ver meu progresso**.
- Textos que diziam que a IA "ainda está sendo construída" (seção ao vivo e FAQ 1) foram corrigidos nos 4 idiomas.

**Como funciona**
- `api/conversa.js` fala com a IA (Anthropic). A chave fica só na Vercel (`ANTHROPIC_API_KEY`). Limites: 15 falas por conversa, 600 caracteres por mensagem, 80 pedidos a cada 10 min por IP.
- Voz: reconhecimento e voz do próprio navegador (Chrome, Safari, Android). Se o navegador não reconhece voz, a pessoa digita.
- Teste grátis: `trialInfo()` no `index.html` (chave `falaut_trial_start` no aparelho).
- Configuração única: ver **SETUP-CONVERSA.md**.

**Arquivos para subir na raiz do repositório:** `index.html`, `sw.js`, a pasta `api/` (novos: `conversa.js`, `plano.js`, `stripe-webhook.js`, `_assinantes.js`), `CHANGELOG.md`, `SETUP-CONVERSA.md`.
Service Worker: cache `falaut-v14.0.0`.

## v13.4.6 — 2026-11-09 · E-book e ícones nos lugares certos

**Onde está:** botão **Baixar e-book agora** (`#ebook-gratis`), ícones do app e da aba do navegador.

**O que mudou:** o upload no GitHub colocou o PDF e os ícones novos soltos na raiz, sem as pastas `ebook/` e `icons/`. O e-book dava erro 404, e o app continuava com o ícone antigo da pasta `icons/`. Agora `index.html`, `sw.js`, `manifest.json` e as outras páginas apontam para os arquivos na raiz.

**Como funciona:** o site não depende mais das pastas `ebook/` e `icons/` para esses arquivos; todos ficam soltos na raiz do repositório.

**Arquivos para subir na raiz do repositório (só arquivos soltos, sem pasta):** os arquivos deste pacote.
Service Worker: cache `falaut-v13.4.6`.

## v13.4.5 — 2026-11-09 · E-book baixa de verdade

**Onde está:** seção **E-book grátis** (`#ebook-gratis`) e pasta `ebook/` na raiz do site.

**O que mudou**
- **O PDF não estava na raiz do repositório**, só dentro de pastas de update. O botão "Baixar e-book agora" dava erro 404. O zip agora traz a pasta `ebook/`.
- **Download automático:** depois de enviar o e-mail, o download começa sozinho. O botão continua na tela como plano B.
- **Se o envio do e-mail falhar**, a pessoa recebe o e-book mesmo assim, em vez de um alerta de erro.

**Como funciona:** função `showEbookDownload` no `index.html`. No app instalado (PWA) o download não dispara sozinho, porque a tela do PDF pode não ter botão de voltar; lá a pessoa toca no botão.

**Arquivos para subir na raiz do repositório:** `index.html`, `sw.js`, `obrigado.html`, `reembolso.html`, `loading-aviao.html`, `og-image.png`, a pasta `icons/` e a pasta `ebook/` (inclui tudo da v13.4.1 até a v13.4.4).
Service Worker: cache `falaut-v13.4.5`.

## v13.4.4 — 2026-11-09 · Links de pagamento reais

**Onde está:** botões **Quero o Básico** e **Quero o Premium** (`#preco`, nas 3 trilhas) e **Pagar e marcar minha conversa** (`#ao-vivo`). Configuração em `index.html`, bloco *LINKS DE PAGAMENTO*.

**O que mudou:** os 3 links do Stripe entraram em `PLAN_LINKS`: Básico €19/mês, Premium €39/mês e Conversa ao vivo €50.

**Como funciona:** cada botão abre o checkout do Stripe em nova aba e leva junto o código de quem indicou, quando existir.

**Arquivos para subir na raiz do repositório:** `index.html`, `sw.js`, `obrigado.html`, `reembolso.html`, `loading-aviao.html`, `og-image.png` e a pasta `icons/` (inclui tudo da v13.4.1, v13.4.2 e v13.4.3).
Service Worker: cache `falaut-v13.4.4`.

## v13.4.3 — 2026-11-09 · Conversa ao vivo: €50

**Onde está:** seção **Conversa ao vivo** (`#ao-vivo`), nos 4 idiomas da interface.

**O que mudou:** o preço do card e o texto do botão passaram de €15 para **€50**, igual ao produto "Talk with me" no Stripe. O preço antigo de Fundador (€15/mês), que aparece no aviso embaixo dos planos, continua igual.

**Como funciona:** o botão usa `PLAN_LINKS.aoVivo`. Enquanto o link estiver vazio, ele leva ao formulário de horário.

**Arquivos para subir na raiz do repositório:** `index.html`, `sw.js`, `obrigado.html`, `reembolso.html`, `loading-aviao.html`, `og-image.png` e a pasta `icons/` (inclui tudo da v13.4.1 e v13.4.2).
Service Worker: cache `falaut-v13.4.3`.

## v13.4.2 — 2026-11-09 · Capa do app com a marca Falaut

**Onde está:** ícone do app na tela inicial, ícone da aba do navegador e imagem que aparece ao compartilhar o link.

**O que mudou**
- **Ícones do app** (`icons/`): o selo ainda era "fr / FALA REAL". Agora é "fl / FALAUT", igual às telas de abertura, que já estavam certas.
- **Imagem de compartilhamento** (`og-image.png`): o arquivo não existia na raiz, então o link saía sem imagem no WhatsApp e no Instagram. Criada com a marca Falaut. O endereço dela agora é completo, como essas redes exigem.
- **`index.html`, `obrigado.html`, `reembolso.html`:** referências a `/favicon-32.png` e `/favicon.png`, que não existiam, agora apontam para `icons/`.
- **`loading-aviao.html`:** logo "FalaReal" trocado por "falaut".

**Como funciona:** os nomes dos arquivos continuam iguais; o Service Worker novo (`falaut-v13.4.2`) baixa os ícones novos.

**Atenção:** no iPhone, o ícone já instalado não muda sozinho: é preciso apagar o app da tela inicial e adicionar de novo. No Android ele atualiza sozinho, mas pode levar alguns dias.

**Arquivos para subir na raiz do repositório:** `index.html`, `sw.js`, `obrigado.html`, `reembolso.html`, `loading-aviao.html`, `og-image.png` e a pasta `icons/` (inclui também tudo da v13.4.1).

## v13.4.1 — 2026-11-09 · Botões de pagamento e textos pós-compra

**Onde está:** seções **Preços** (`#preco`) e **Conversa ao vivo** (`#ao-vivo`), páginas `obrigado.html` e `reembolso.html`.

**O que mudou**
- Links de pagamento agora ficam **num lugar só**: bloco *LINKS DE PAGAMENTO* em `index.html`, constante `PLAN_LINKS` (`basico`, `premium`, `aoVivo`).
- **Conversa ao vivo:** o botão apontava para um link falso do Stripe (`SUBSTITUA_PELO_SEU_LINK`) e abria uma página de erro. Enquanto não houver link, ele leva ao formulário de horário logo abaixo.
- **Código de convite:** na primeira visita por um link `?ref=`, o código não ia para o Stripe, porque os botões eram montados antes de ele ser salvo. Agora vai. Caracteres que o Stripe recusa em `client_reference_id` são removidos.
- **Conversa ao vivo, texto do preço:** dizia "fundador ou não" e contradizia o Premium. Agora explica que o Premium já inclui 1 conversa por mês (4 idiomas).
- **`obrigado.html`:** dizia que o app "ainda não existe" e falava em "fase fundadora". Agora explica como entrar com o e-mail do pagamento e o que fazer no Premium.
- **`reembolso.html`:** deixou de citar só Fundador e Anual.

**Como funciona:** quando o link existe, o botão abre o Stripe em nova aba e leva junto o código de quem indicou. Quando está vazio, o botão usa o destino de reserva (`#comecar` nos planos, `#ao-vivo-form` na conversa ao vivo).

**⚠️ O que você precisa fazer:** criar os 3 Payment Links e colar em `PLAN_LINKS`. Em cada um: ativar "Permitir códigos promocionais" (os cupons de recompensa dependem disso) e configurar o redirecionamento após o pagamento para `/obrigado.html` (Básico e Premium).

**Arquivos para subir na raiz do repositório:** `index.html`, `sw.js`, `obrigado.html`, `reembolso.html`.
Service Worker: cache `falaut-v13.4.1`.

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
