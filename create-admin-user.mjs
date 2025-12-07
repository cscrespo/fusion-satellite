import { createClient } from '@supabase/supabase-js'
import pkg from 'pg'
const { Client } = pkg

const SUPABASE_URL = 'https://aozsrfvzutkamsnibtug.supabase.co'
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvenNyZnZ6dXRrYW1zbmlidHVnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDg4NTE4NSwiZXhwIjoyMDgwNDYxMTg1fQ.dduZlhP30FFM3nX9Rj5XsX_rORIyMP1ioKYMbCPqX_M'

// Supabase Admin Client
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})

// PostgreSQL Client
const pgConfig = {
    host: 'db.aozsrfvzutkamsnibtug.supabase.co',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'Action24aid#',
    ssl: { rejectUnauthorized: false }
}

async function createFirstUser() {
    console.log('🚀 Criando primeiro usuário automaticamente...\n')

    const pgClient = new Client(pgConfig)

    try {
        await pgClient.connect()
        console.log('✅ Conectado ao PostgreSQL\n')

        // 1. Verificar organização demo
        console.log('1️⃣ Verificando organização demo...')
        const orgResult = await pgClient.query(`
      SELECT id, name FROM organizations WHERE slug = 'clinica-demo' LIMIT 1;
    `)

        if (orgResult.rows.length === 0) {
            console.error('❌ Organização demo não encontrada!')
            return
        }

        const orgId = orgResult.rows[0].id
        console.log(`✅ Organização: ${orgResult.rows[0].name}`)
        console.log(`   ID: ${orgId}\n`)

        // 2. Criar usuário via Supabase Admin API
        console.log('2️⃣ Criando usuário no Supabase Auth...')

        const email = 'admin@clinicademo.com'
        const password = 'Admin@123456'

        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: email,
            password: password,
            email_confirm: true,
            user_metadata: {
                full_name: 'Administrador'
            }
        })

        if (authError) {
            if (authError.message.includes('already registered')) {
                console.log('⚠️  Usuário já existe! Buscando...')

                // Buscar usuário existente
                const { data: users } = await supabase.auth.admin.listUsers()
                const existingUser = users.users.find(u => u.email === email)

                if (existingUser) {
                    console.log(`✅ Usuário encontrado: ${existingUser.id}\n`)

                    // Verificar se profile já existe
                    const profileCheck = await pgClient.query(`
            SELECT id FROM profiles WHERE id = $1 LIMIT 1;
          `, [existingUser.id])

                    if (profileCheck.rows.length > 0) {
                        console.log('✅ Profile já existe!')
                        console.log('\n🎉 TUDO PRONTO! Você já pode fazer login!')
                        console.log(`   Email: ${email}`)
                        console.log(`   Senha: ${password}`)
                        return
                    }

                    // Criar profile para usuário existente
                    await pgClient.query(`
            INSERT INTO profiles (id, organization_id, full_name, role)
            VALUES ($1, $2, $3, $4);
          `, [existingUser.id, orgId, 'Administrador', 'admin'])

                    console.log('✅ Profile criado!\n')
                    console.log('🎉 SUCESSO! Usuário configurado!')
                    console.log(`   Email: ${email}`)
                    console.log(`   Senha: ${password}`)
                    return
                }
            }

            throw authError
        }

        const userId = authData.user.id
        console.log(`✅ Usuário criado: ${userId}`)
        console.log(`   Email: ${email}\n`)

        // 3. Criar profile
        console.log('3️⃣ Criando profile...')
        await pgClient.query(`
      INSERT INTO profiles (id, organization_id, full_name, role)
      VALUES ($1, $2, $3, $4);
    `, [userId, orgId, 'Administrador', 'admin'])

        console.log('✅ Profile criado!\n')

        // 4. Sucesso!
        console.log('🎉 SUCESSO TOTAL!\n')
        console.log('📋 Credenciais de Login:')
        console.log(`   Email: ${email}`)
        console.log(`   Senha: ${password}`)
        console.log(`   User ID: ${userId}`)
        console.log(`   Organization ID: ${orgId}\n`)

        console.log('🎯 Próximos passos:')
        console.log('   1. Criar arquivo .env.local (se ainda não criou)')
        console.log('   2. Reiniciar dev server')
        console.log('   3. Acessar http://localhost:5173')
        console.log('   4. Fazer login com as credenciais acima\n')

    } catch (error) {
        console.error('\n❌ Erro:', error.message)
        console.error(error)
    } finally {
        await pgClient.end()
    }
}

createFirstUser()
