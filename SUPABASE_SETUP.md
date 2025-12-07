# 🚀 Setup Supabase - Próximos Passos

## ✅ Concluído

- [x] Dependência `@supabase/supabase-js` instalada
- [x] Cliente Supabase configurado em `src/lib/supabase.js`
- [x] Migrations SQL criadas em `supabase/migrations/`

---

## 📝 PASSO 1: Criar arquivo .env.local

**IMPORTANTE**: Crie manualmente o arquivo `.env.local` na raiz do projeto com o seguinte conteúdo:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://aozsrfvzutkamsnibtug.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvenNyZnZ6dXRrYW1zbmlidHVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4ODUxODUsImV4cCI6MjA4MDQ2MTE4NX0.e7oT9Gqd_l5B--Gep5QsT0B5TGUSuLVQ5PS5Nf2yCA0
```

**Como criar**:
1. Abrir VS Code
2. Criar novo arquivo na raiz: `.env.local`
3. Copiar e colar o conteúdo acima
4. Salvar

---

## 🗄️ PASSO 2: Executar Migrations no Supabase

### Acessar SQL Editor

1. Abrir: https://supabase.com/dashboard/project/aozsrfvzutkamsnibtug
2. Ir em **SQL Editor** (menu lateral esquerdo)
3. Clicar em **New query**

### Executar Migrations na Ordem

#### Migration 1: Core Tables

1. Abrir arquivo: `supabase/migrations/01_core_tables.sql`
2. Copiar TODO o conteúdo
3. Colar no SQL Editor
4. Clicar em **Run** (ou Ctrl+Enter)
5. Aguardar mensagem: ✅ **Success**

#### Migration 2: Patient Management

1. Abrir arquivo: `supabase/migrations/02_patient_management.sql`
2. Copiar TODO o conteúdo
3. Colar no SQL Editor
4. Clicar em **Run**
5. Aguardar: ✅ **Success**

#### Migration 3: Nutrition & Diet

1. Abrir arquivo: `supabase/migrations/03_nutrition_diet.sql`
2. Copiar TODO o conteúdo
3. Colar no SQL Editor
4. Clicar em **Run**
5. Aguardar: ✅ **Success**

#### Migration 4: Consultations & Financial

1. Abrir arquivo: `supabase/migrations/04_consultations_plans_financial.sql`
2. Copiar TODO o conteúdo
3. Colar no SQL Editor
4. Clicar em **Run**
5. Aguardar: ✅ **Success**

---

## ✅ PASSO 3: Verificar Tabelas Criadas

No SQL Editor, executar:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

**Deve retornar** (20+ tabelas):
- adherence_logs
- consultations
- daily_food_logs
- daily_water_logs
- diet_meal_items
- diet_meals
- diet_plans
- invoices
- organizations
- patient_measurements
- patient_medications
- patient_subscriptions
- patient_supplements
- patient_tasks
- patients
- payments
- profiles
- treatment_plans

---

## 👤 PASSO 4: Criar Primeiro Usuário

### 4.1 Criar Organização

No SQL Editor:

```sql
INSERT INTO organizations (
    name,
    slug,
    platform_name,
    email,
    plan_type,
    status
) VALUES (
    'Clínica Demo',
    'clinica-demo',
    'Bloom',
    'contato@clinicademo.com',
    'premium',
    'active'
) RETURNING id;
```

**Copiar o UUID retornado** (ex: `123e4567-e89b-12d3-a456-426614174000`)

### 4.2 Criar Usuário no Auth

1. Ir em **Authentication** → **Users** (menu lateral)
2. Clicar em **Add user**
3. Preencher:
   - **Email**: `admin@clinicademo.com`
   - **Password**: `Admin@123456` (ou senha forte)
   - **Auto Confirm User**: ✅ Marcar
4. Clicar em **Create user**
5. **Copiar o UUID do usuário criado**

### 4.3 Criar Profile

No SQL Editor (substituir os UUIDs):

```sql
INSERT INTO profiles (
    id, -- UUID do usuário criado no Auth
    organization_id, -- UUID da organização criada
    full_name,
    role
) VALUES (
    'UUID-DO-USUARIO-AUTH',
    'UUID-DA-ORGANIZACAO',
    'Administrador',
    'admin'
);
```

---

## 🧪 PASSO 5: Testar Conexão

### Reiniciar Dev Server

```bash
# Parar o servidor (Ctrl+C)
# Iniciar novamente
npm run dev
```

### Testar Login

1. Acessar: http://localhost:5173
2. Fazer login com:
   - **Email**: `admin@clinicademo.com`
   - **Password**: A senha que você criou

---

## 🎯 Próximos Passos

Após executar todos os passos acima:

1. [ ] Migrar `AuthContext` para usar Supabase Auth
2. [ ] Migrar `PatientContext` para usar Supabase queries
3. [ ] Testar CRUD de pacientes
4. [ ] Configurar Storage bucket
5. [ ] Testar multi-tenant (criar 2ª organização)

---

## 🆘 Problemas?

### Erro ao executar migration
- Verificar se executou na ordem correta
- Verificar se migration anterior foi bem-sucedida
- Tentar executar novamente

### Erro ao criar usuário
- Verificar se organização foi criada
- Verificar se UUIDs estão corretos
- Verificar se email não está duplicado

### Erro ao fazer login
- Verificar se `.env.local` foi criado
- Verificar se dev server foi reiniciado
- Verificar se profile foi criado

---

**Status**: ⏳ Aguardando execução manual dos passos acima
