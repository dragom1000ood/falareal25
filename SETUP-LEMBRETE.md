# Configurar o lembrete diário (uma vez só, ~5 minutos)

## 1. Supabase: criar a tabela
Supabase → seu projeto → **SQL Editor** → New query → cole e clique **Run**:

```sql
create table if not exists public.push_subscriptions (
  endpoint      text primary key,
  subscription  jsonb not null,
  tz            text  not null default 'Europe/Berlin',
  lang          text  not null default 'pt',
  last_trained  date,
  last_sent     date,
  streak        integer not null default 0,
  updated_at    timestamptz not null default now()
);
-- ninguém acessa pelo navegador; só o servidor (service_role) lê e escreve
alter table public.push_subscriptions enable row level security;
```

## 2. Vercel: variáveis de ambiente
Vercel → projeto **falareal-site31** → Settings → **Environment Variables**. Adicione estas 5 (Environment: Production):

| Nome | Valor |
|---|---|
| `VAPID_PUBLIC_KEY` | está no arquivo `falaut-chaves-SECRETAS.txt` |
| `VAPID_PRIVATE_KEY` | está no arquivo `falaut-chaves-SECRETAS.txt` |
| `CRON_SECRET` | está no arquivo `falaut-chaves-SECRETAS.txt` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API Keys → **service_role / secret** (clique em "Reveal") |
| `SUPABASE_URL` | `https://furrxamrtfzmmwhxbtdq.supabase.co` |

⚠️ A `VAPID_PRIVATE_KEY`, o `CRON_SECRET` e a `service_role` **nunca** vão para o GitHub. Ficam só na Vercel.

## 3. Subir os arquivos e fazer o redeploy
Suba `index.html`, `sw.js`, `vercel.json` e a pasta `api/` na raiz do repositório. Se você adicionou as variáveis **depois** do deploy, vá em Deployments → ⋯ → **Redeploy** para elas valerem.

## 4. Testar
- Abra o app instalado → card da sequência → **🔔 Lembrete diário** → permitir.
- Supabase → Table Editor → `push_subscriptions` → deve aparecer 1 linha.
- Vercel → Settings → **Cron Jobs** → `/api/push-cron` aparece; o botão **Run** dispara na hora (você recebe a notificação se ainda não treinou hoje).

O cron roda 1x por dia às 18:00 UTC (20h no horário de verão da Alemanha, 19h no inverno). No plano Hobby a Vercel pode disparar em qualquer minuto dentro dessa hora.
