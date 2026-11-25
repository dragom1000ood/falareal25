## v15.4.0 — 25/11/2026 — Congelador corrigido + Missão de resgate 🛟

**Nova: Missão de resgate da ofensiva 🛟** (cartão da ofensiva, `#freeze-info` + Lição do dia `#licao`)
- Se a ofensiva quebrar (faltou mais dias do que os congeladores cobrem), dá pra recuperar no dia em que a pessoa volta:
  - **1 dia perdido → 1 tarefa:** fazer a lição de hoje.
  - **2 a 7 dias perdidos → 2 tarefas:** a lição de hoje + 1 lição extra.
  - **Mais de 7 dias:** a ofensiva zera (como antes).
- Ao completar, a ofensiva volta inteira (+1 do dia de hoje) e os dias perdidos aparecem como ❄️ no calendário. Tem confete e aviso.
- A missão vale só no dia em que é aberta. No dia seguinte ela expira.
- Textos em PT, EN, ES e DE. Na Lição do dia, depois da 1ª tarefa, o botão "Quero mais 5" vira o botão principal para completar a missão.
- Como funciona no código: `streakData.repair` = `{date, from, prev, missed, need, done}`; `markStreakToday()` abre a missão e `repairStep()` (chamado no fim de cada lição) conta as tarefas e restaura. Também tem `window.falautRepairInfo()` / `window.falautRepairStep()`.

**Congelador ❄️ — bugs corrigidos**
- **Congelador sumia ao sincronizar entre aparelhos:** ao juntar o progresso da nuvem, a quantidade de congeladores vinha só do aparelho com a data mais recente. O XP gasto ficava, mas o congelador desaparecia. Agora são contados os ganhos (`fzIn`) e os usados (`fzOut`), que só crescem: congeladores = ganhos − usados.
- **Proteção de assinante/teste + congelador não se somavam:** assinante que faltava 2 dias com 1 congelador perdia tudo. Agora a proteção cobre 1 dia e o congelador cobre o resto.
- **A ofensiva mostrada na tela** (`liveStreak`) usa a mesma regra somada.

**Versão:** rodapé e comentário do bloco PWA → v15.4.0. Inclui também tudo da v15.3.4 (vozes mais humanas e correções de áudio e da lição).
