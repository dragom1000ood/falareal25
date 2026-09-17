# FalaReal PWA v11.31.0 — como instalar

Versão caprichada. O que mudou em relação ao pacote anterior (update_14):

- ícone novo (carimbo de passaporte, na identidade da marca) + versão *maskable* pro Android;
- **15 telas de abertura (splash)** pro iPhone e iPad — sem elas o iOS abre o app numa tela branca;
- **página offline** com a cara do site, no lugar do erro feio do Safari;
- **aviso de "nova versão disponível"** com botão Atualizar — o usuário nunca fica preso numa versão velha;
- avisos de offline / de volta online;
- botão "Instalar" no Android e dica de instalação no iPhone, os dois só depois de 25s de uso;
- atalhos de app (segurar o ícone → Teste de nível, E-book, Assinar);
- tudo o que é JavaScript ficou num arquivo só (`pwa.js`), em vez de blocos colados no HTML.

---

## 1. Arquivos no repositório

No repo `dragom1000ood/falareal25`, na **raiz** (mesmo nível do `index.html`):

```
index.html
manifest.json          <- substitui o anterior
sw.js                  <- substitui o anterior
pwa.js                 <- novo
offline.html           <- novo
icons/                 <- substitui a pasta inteira
  icon-192.png
  icon-512.png
  icon-192-maskable.png
  icon-512-maskable.png
  apple-touch-icon.png
  favicon-32.png
  favicon-16.png
  sc-quiz.png
  sc-ebook.png
  sc-assinar.png
splash/                <- novo (15 arquivos)
```

> `sw.js` **tem que ficar na raiz**. Dentro de uma subpasta ele só controla aquela
> subpasta e o app não funciona.

---

## 2. No `<head>` do `index.html`

Cole o conteúdo de **`head-snippet.html`** logo depois do `<title>`.

Se você já tinha colado o bloco da v11.30.0, **apague o bloco antigo** e use este
no lugar — ele inclui as tags de splash, que não existiam antes.

Confira também que o viewport está assim:

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
```

O `viewport-fit=cover` é o que faz o app ocupar a tela toda no iPhone com notch.

---

## 3. Antes do `</body>` do `index.html`

Uma linha só:

```html
<script src="/pwa.js" defer></script>
```

Se você tinha colado os scripts inline da v11.30.0 (registro do SW + banner do iOS),
**apague os dois** — o `pwa.js` faz tudo isso e mais um pouco. Deixar os dois juntos
faz o aviso aparecer duplicado.

---

## 4. Rodapé

Troque a versão do rodapé para **v11.31.0**.

---

## 5. Publique e teste

1. Suba o `index.html` alterado na **raiz** do repo (subpasta o Vercel não pega).
2. Espere o deploy terminar.
3. No iPhone, abra `https://falareal-site31.vercel.app` **no Safari**
   (Chrome no iOS não instala PWA).
4. **Compartilhar** → **Adicionar à Tela de Início** → **Adicionar**.
5. Abra pelo ícone: tem que aparecer a tela verde com o carimbo (splash) e depois o
   site em tela cheia, sem barra de endereço.

**Teste rápido do modo offline:** com o app aberto, ative o modo avião e recarregue.
Você deve ver o site em cache (ou a página offline verde), nunca o dinossauro/erro do Safari.

---

## 6. A regra de ouro pra todo deploy futuro

Toda vez que publicar uma versão nova do site, mude **uma linha** do `sw.js`:

```js
const CACHE_VERSION = 'falareal-v11.31.0';   // -> v11.32.0, v11.33.0 ...
```

É isso que dispara o aviso "Nova versão disponível" pra quem já instalou.
Se você esquecer, o usuário instalado pode continuar vendo arquivos antigos.

---

## O que o service worker NÃO intercepta

De propósito, passa direto pra rede:

- qualquer requisição que não seja `GET` — envio do Formspree, login do Supabase;
- qualquer domínio externo — Stripe, Supabase, Google Fonts;
- qualquer URL com `/api/`.

Login, pagamento e captura de e-mail continuam funcionando exatamente como hoje.

---

## Detalhes que valem saber

- **Splash em paisagem:** só gerei retrato. Se alguém abrir o app deitado, o iOS mostra
  fundo liso por um instante — não quebra nada. Dá pra gerar as versões landscape depois,
  se quiser (dobra o número de arquivos).
- **Aparelhos novos:** a lista de splash cobre até o iPhone 16 Pro Max. Modelos com
  resolução nova que saírem depois caem no fundo liso até a lista ser atualizada.
- **iOS e armazenamento:** se o usuário passar semanas sem abrir o app, o iOS pode
  limpar o cache. Ele recarrega da rede na próxima abertura — não perde nada, só não
  fica offline naquele momento.
- **Progresso do usuário:** continua no localStorage/Supabase como sempre. O service
  worker não mexe nisso.
