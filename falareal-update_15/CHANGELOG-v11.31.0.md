# CHANGELOG

## v11.31.0 — 2026-09-17

### PWA completo: splash de iOS, página offline, aviso de atualização e ícone novo

Refinamento da v11.30.0 (que só tinha o básico: manifest + service worker simples).
Agora o FalaReal instalado se comporta como app de verdade.

#### Arquivos

| Arquivo | Onde | O que faz |
|---|---|---|
| `manifest.json` | raiz | **Reescrito.** Ganhou `id`, `display_override`, ícones *maskable* (Android recorta o ícone em círculo/squircle — sem isso o logo fica cortado) e três **atalhos de app**: Teste de nível (`#diagnostico`), E-book grátis (`#ebook-gratis`) e Assinar (`#comecar`). No Android aparecem ao segurar o ícone. |
| `sw.js` | raiz | **Reescrito.** Navegação network-first com timeout de 4s, `navigationPreload`, stale-while-revalidate pros assets, fallback pra `/offline.html`. Não chama mais `skipWaiting()` sozinho. |
| `pwa.js` | raiz | **Novo.** Todo o JS do PWA num arquivo só: registro do SW, aviso de atualização, botão instalar (Android), dica de instalar (iOS), avisos de offline/online. |
| `offline.html` | raiz | **Novo.** Página offline na identidade da marca; recarrega sozinha quando a conexão volta. |
| `icons/*` | `/icons/` | **Redesenhados.** Carimbo de passaporte: anel dourado sólido + anel tracejado interno, monograma "fr" em creme, régua dourada e micro-texto "FALA REAL". Variantes `any` e `maskable` em 192 e 512, apple-touch-icon 180, favicons 32/16, e 3 ícones de atalho 96×96. |
| `splash/*` | `/splash/` | **Novo.** 15 telas de abertura, do iPhone SE ao 16 Pro Max, mais 3 de iPad. Fundo #0F2E1D, carimbo centralizado e a tagline. |

#### Mudanças no `index.html`

- `<head>`: bloco PWA ampliado (ver `head-snippet.html`), incluindo as 15 tags
  `apple-touch-startup-image` com media queries por aparelho.
- Antes de `</body>`: os dois scripts inline da v11.30.0 foram **removidos** e
  trocados por `<script src="/pwa.js" defer></script>`.
- Rodapé: v11.31.0.

#### Como funciona o aviso de atualização

Fluxo em quatro passos:

1. O usuário abre o app; o navegador baixa o `sw.js` novo em segundo plano.
2. Como o SW não chama mais `skipWaiting()` na instalação, a versão nova fica
   parada em estado *waiting* — o app continua rodando a versão antiga, sem
   troca de código no meio de um exercício.
3. O `pwa.js` detecta o *waiting* e mostra o aviso "Nova versão disponível"
   com o botão **Atualizar**.
4. No toque, a página manda `{type:'SKIP_WAITING'}` pro SW; ele assume, dispara
   `controllerchange` e a página recarrega **uma única vez** (há um guard contra
   loop de reload).

O `reg.update()` também roda toda vez que o app volta ao primeiro plano
(`visibilitychange`), então quem deixa o app aberto no fundo recebe o aviso na
próxima vez que voltar.

#### Estratégia de cache

- **Navegação (HTML):** network-first com timeout de 4s → `/index.html` do cache →
  `/offline.html`. Evita o problema clássico de PWA em que o usuário fica travado
  numa versão antiga.
- **Assets do mesmo domínio:** stale-while-revalidate.
- **Nunca interceptado:** métodos != `GET`, domínios externos (Stripe, Supabase,
  Formspree, Google Fonts) e rotas `/api/`.

#### Manutenção

`CACHE_VERSION`, na primeira linha do `sw.js`, precisa ser incrementada a cada
deploy. É o gatilho de todo o mecanismo de atualização.
