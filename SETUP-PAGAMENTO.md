# Liberação automática do plano depois do pagamento (v14.1.0)

Faz isso uma vez só, leva uns 10 minutos. Sem estes passos, quem paga não é liberado sozinho no site.

## 1. Vercel: variáveis de ambiente
Vercel → projeto **falareal-site31** → Settings → **Environment Variables** (Environment: Production):

| Nome | Valor |
|---|---|
| `STRIPE_WEBHOOK_SECRET` | vem do passo 3 (`whsec_...`) |
| `SUPABASE_SERVICE_ROLE_KEY` | já existe (do lembrete diário) |

⚠️ Nenhuma dessas chaves vai pro GitHub. Ficam só na Vercel.

## 2. Supabase: tabela de assinantes
Supabase → **SQL Editor** → New query → cola e clica **Run**:

```sql
create table if not exists public.assinantes (
  email            text primary key,
  plano            text,
  status           text not null default 'active',
  stripe_customer  text,
  ref              text,
  updated_at       timestamptz not null default now()
);
create index if not exists assinantes_customer on public.assinantes (stripe_customer);
-- só o servidor lê e escreve
alter table public.assinantes enable row level security;
```

**Quem já pagou antes da v14** (Fundador/Anual): adiciona na mão, um por linha:
```sql
insert into public.assinantes (email, plano) values ('email@da.pessoa', 'fundador')
on conflict (email) do update set status = 'active';
```

## 3. Stripe: webhook
Stripe → **Developers → Webhooks** → **Add endpoint**:
- URL: `https://falareal-site31.vercel.app/api/stripe-webhook` (ou o domínio novo, quando estiver no ar)
- Eventos: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
- Salva e copia o **Signing secret** (`whsec_...`) pra variável `STRIPE_WEBHOOK_SECRET` (passo 1).

## 4. Subir e fazer o redeploy
Suba na raiz do repositório: `index.html`, `sw.js`, a pasta `api/` (com os arquivos novos) e os `.md`.
Se você já tinha subido a v14.0.0: apague `api/conversa.js` e `SETUP-CONVERSA.md` do repositório.
Se você adicionou as variáveis **depois** do deploy: Deployments → ⋯ → **Redeploy**.

## 5. Testar
- Plano: faz uma compra com um cupom de 100% (ou modo de teste) → Supabase → `assinantes` deve ganhar uma linha com o e-mail.
  Depois entra no site com esse e-mail: o selo 🎖️ aparece e tudo fica liberado.

## Como funciona o acesso
- **Teste grátis de 7 dias**: tudo liberado (todos os níveis, gramática completa, palavra bônus, desafios), sem cartão, começa na primeira visita (fica salvo no aparelho).
- **Depois**: Grátis = níveis 1 e 2, sequência, XP e palavra do dia.
- **Assinante** (qualquer plano pago, encontrado pelo e-mail do pagamento): tudo liberado.
- A conversa ao vivo avulsa (€50) não libera o app.
