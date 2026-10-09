# CHANGELOG — Falaut

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
