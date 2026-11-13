# Ligar a conversa com IA e a liberação automática do plano (v14.0.0)

Faz isso uma vez só, leva uns 15 minutos. Sem estes passos, a conversa mostra
"ainda não foi ligada no servidor" e quem paga não é liberado sozinho.

## 1. Chave da IA (Anthropic)
1. Entra em **console.anthropic.com** e cria uma conta.
2. **Billing** → coloca crédito (US$ 5 já dá pra muitas conversas de teste).
3. **Billing → Limits**: define um **limite mensal de gasto** (ex.: US$ 20). Assim a conta nunca passa disso.
4. **API Keys** → **Create Key** → copia a chave (começa com `sk-ant-`).

## 2. Vercel: variáveis de ambiente
Vercel → projeto **falareal-site31** → Settings → **Environment Variables** (Environment: Production):

| Nome | Valor |
|---|---|
| `ANTHROPIC_API_KEY` | a chave `sk-ant-...` do passo 1 |
| `STRIPE_WEBHOOK_SECRET` | vem do passo 4 (`whsec_...`) |
| `SUPABASE_SERVICE_ROLE_KEY` | já existe (do lembrete diário) |

Opcional: `ANTHROPIC_MODEL` troca o modelo (padrão: `claude-haiku-5-5`, o mais barato e rápido).

⚠️ Nenhuma dessas chaves vai pro GitHub. Ficam só na Vercel.

## 3. Supabase: tabela de assinantes
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

## 4. Stripe: webhook
Stripe → **Developers → Webhooks** → **Add endpoint**:
- URL: `https://falareal-site31.vercel.app/api/stripe-webhook` (ou o domínio novo, quando estiver no ar)
- Eventos: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
- Salva e copia o **Signing secret** (`whsec_...`) pra variável `STRIPE_WEBHOOK_SECRET` (passo 2).

## 5. Subir e fazer o redeploy
Suba na raiz do repositório: `index.html`, `sw.js`, a pasta `api/` (com os arquivos novos) e os `.md`.
Se você adicionou as variáveis **depois** do deploy: Deployments → ⋯ → **Redeploy**.

## 6. Testar
- Abre o site → seção **Conversa de verdade. Agora.** → escolhe um cenário → **Começar conversa**. A pessoa tem que falar primeiro.
- Responde 2 vezes → **Terminar e ver retorno** → aparece o retorno.
- Plano: faz uma compra com um cupom de 100% (ou modo de teste) → Supabase → `assinantes` deve ganhar uma linha com o e-mail.
  Depois entra no site com esse e-mail: o selo 🎖️ aparece e tudo fica liberado.

## Como funciona o acesso
- **Teste grátis de 7 dias**: tudo liberado, sem cartão, começa na primeira visita (fica salvo no aparelho).
- **Depois**: Grátis = níveis 1 e 2, 3 conversas por semana.
- **Assinante** (qualquer plano pago, encontrado pelo e-mail do pagamento): tudo liberado.
- A conversa ao vivo avulsa (€50) não libera o app.
