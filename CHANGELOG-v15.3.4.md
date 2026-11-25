## v15.3.4 — 25/11/2026 — Correção de bugs + vozes mais humanas

**Vozes (Lição do dia, simulador de nível e exemplos dos 4 níveis)**
- **Novo motor de voz `FalautVoz`** (script logo antes do bloco de i18n). Escolhe a voz mais natural que o aparelho tiver em alemão, inglês e português: Microsoft "Natural" (Edge), Google (Chrome) e as vozes Premium/Melhorada (iPhone/Mac). Evita as vozes robóticas e "de brincadeira" do macOS (Grandma, Albert, Bubbles…).
- **Lição do dia (#licao):** antes pegava a *primeira* voz da lista do idioma, quase sempre a mais robótica. Agora usa o `FalautVoz`, com velocidade 0.9.
- **Espera as vozes carregarem:** no Chrome a lista chega atrasada. Antes, a primeira palavra saía com a voz padrão.

**Bugs corrigidos**
- **Áudios gravados (ElevenLabs) que não carregam:** se um `audio/*.mp3` não existir ou falhar, o botão ficava mudo e voltava ao normal. Agora cai automaticamente na voz do navegador (simulador "Ouvir este nível" e exemplos dos níveis 1–4).
- **Áudio fantasma:** se a pessoa parava o áudio durante o pequeno atraso inicial (com ruído de fundo), o mp3 começava a tocar mesmo assim. Corrigido.
- **Trocar de idioma no meio da lição:** a lição continuava com as palavras do idioma anterior (ex.: “Tschüss” na trilha de inglês). Agora recomeça com as palavras do idioma novo.
- **Trilha de português:** a tradução aparecia sempre em alemão, mesmo com o site em inglês. Agora segue o idioma do site (alemão → alemão; inglês/espanhol → inglês).
- **`<head>` duplicado:** removidos um `theme-color` conflitante (#12181f, que sobrescrevia o verde #0F2E1D) e links de ícone repetidos.

**Versão:** rodapé e comentário do bloco PWA → v15.3.4.
