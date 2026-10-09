# CHANGELOG — Falaut

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
