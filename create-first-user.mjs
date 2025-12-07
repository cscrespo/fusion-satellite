import pkg from 'pg'
const { Client } = pkg

const config = {
    host: 'db.aozsrfvzutkamsnibtug.supabase.co',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'Action24aid#',
    ssl: { rejectUnauthorized: false }
}

async function createFirstUser() {
    console.log('👤 Criando primeiro usuário e organização...\n')

    const client = new Client(config)

    try {
        await client.connect()
        console.log('✅ Conectado ao banco!\n')

        // 1. Verificar se organização demo já existe
        console.log('1️⃣ Verificando organização demo...')
        const orgCheck = await client.query(`
      SELECT id, name FROM organizations WHERE slug = 'clinica-demo' LIMIT 1;
    `)

        let orgId
        if (orgCheck.rows.length > 0) {
            orgId = orgCheck.rows[0].id
            console.log(`✅ Organização "${orgCheck.rows[0].name}" já existe!`)
            console.log(`   ID: ${orgId}\n`)
        } else {
            console.log('⚠️  Organização demo não encontrada (deveria ter sido criada na migration)\n')
            return
        }

        // 2. Instruções para criar usuário via Dashboard
        console.log('2️⃣ Para criar o primeiro usuário:\n')
        console.log('📋 PASSO 1: Criar usuário no Supabase Auth')
        console.log('   1. Acesse: https://supabase.com/dashboard/project/aozsrfvzutkamsnibtug/auth/users')
        console.log('   2. Clique em "Add user" → "Create new user"')
        console.log('   3. Preencha:')
        console.log('      - Email: admin@clinicademo.com')
        console.log('      - Password: Admin@123456 (ou outra senha forte)')
        console.log('      - ✅ Marcar "Auto Confirm User"')
        console.log('   4. Clique em "Create user"')
        console.log('   5. COPIE o UUID do usuário criado\n')

        console.log('📋 PASSO 2: Criar profile (execute este SQL no SQL Editor):\n')
        console.log(`INSERT INTO profiles (`)
        console.log(`    id, -- COLE AQUI o UUID do usuário criado`)
        console.log(`    organization_id,`)
        console.log(`    full_name,`)
        console.log(`    role`)
        console.log(`) VALUES (`)
        console.log(`    'UUID-DO-USUARIO-AQUI', -- Substituir pelo UUID copiado`)
        console.log(`    '${orgId}',`)
        console.log(`    'Administrador',`)
        console.log(`    'admin'`)
        console.log(`);\n`)

        console.log('📋 PASSO 3: Testar login')
        console.log('   1. Criar arquivo .env.local na raiz do projeto com:')
        console.log('      VITE_SUPABASE_URL=https://aozsrfvzutkamsnibtug.supabase.co')
        console.log('      VITE_SUPABASE_ANON_KEY=eyJhbGc...(sua anon key)')
        console.log('   2. Reiniciar dev server: npm run dev')
        console.log('   3. Acessar http://localhost:5173')
        console.log('   4. Fazer login com admin@clinicademo.com\n')

        console.log('✅ Quando terminar, me avise para migrarmos o AuthContext!')

    } catch (error) {
        console.error('❌ Erro:', error.message)
    } finally {
        await client.end()
    }
}

createFirstUser()
