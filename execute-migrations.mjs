import pkg from 'pg'
const { Client } = pkg
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Connection string with real password
const connectionString = `postgresql://postgres.aozsrfvzutkamsnibtug:Action24aid%23@aws-0-sa-east-1.pooler.supabase.com:6543/postgres`

async function executeMigration(client, migrationFile) {
    console.log(`\n📄 Executando: ${migrationFile}`)

    const sql = readFileSync(
        join(__dirname, 'supabase', 'migrations', migrationFile),
        'utf-8'
    )

    try {
        await client.query(sql)
        console.log(`✅ ${migrationFile} - Sucesso!`)
        return true
    } catch (error) {
        // Alguns erros são esperados (ex: tabela já existe)
        if (error.message.includes('already exists')) {
            console.log(`⚠️  ${migrationFile} - Tabelas já existem (OK)`)
            return true
        }
        console.error(`❌ ${migrationFile} - Erro: ${error.message.substring(0, 150)}`)
        return false
    }
}

async function verifyTables(client) {
    console.log('\n📊 Verificando tabelas criadas...')

    const result = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    ORDER BY table_name;
  `)

    console.log(`\n✅ ${result.rows.length} tabelas encontradas:`)
    result.rows.forEach(row => console.log(`   - ${row.table_name}`))

    return result.rows.length
}

async function createFirstUser(client) {
    console.log('\n👤 Criando primeiro usuário e organização...')

    try {
        // Verificar se organização demo já existe
        const orgCheck = await client.query(`
      SELECT id FROM organizations WHERE slug = 'clinica-demo' LIMIT 1;
    `)

        if (orgCheck.rows.length > 0) {
            console.log('✅ Organização demo já existe!')
            return orgCheck.rows[0].id
        }

        console.log('⚠️  Para criar o primeiro usuário, você precisa:')
        console.log('   1. Ir em Authentication → Users no Supabase Dashboard')
        console.log('   2. Criar um usuário com email e senha')
        console.log('   3. Depois executar SQL para criar o profile')

    } catch (error) {
        console.error('Erro ao verificar organização:', error.message)
    }
}

async function runMigrations() {
    console.log('🚀 Conectando ao Supabase PostgreSQL...\n')

    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    })

    try {
        await client.connect()
        console.log('✅ Conectado ao banco de dados!\n')

        const migrations = [
            '01_core_tables.sql',
            '02_patient_management.sql',
            '03_nutrition_diet.sql',
            '04_consultations_plans_financial.sql'
        ]

        let successCount = 0
        for (const migration of migrations) {
            const success = await executeMigration(client, migration)
            if (success) successCount++
        }

        console.log(`\n\n🎉 ${successCount}/${migrations.length} migrations executadas com sucesso!`)

        const tableCount = await verifyTables(client)

        if (tableCount >= 18) {
            console.log('\n✅ SUCESSO! Todas as tabelas foram criadas!')
            await createFirstUser(client)
        } else {
            console.log('\n⚠️  Algumas tabelas podem estar faltando')
        }

    } catch (error) {
        console.error('\n❌ Erro de conexão:', error.message)
    } finally {
        await client.end()
        console.log('\n🔌 Conexão encerrada')
    }
}

runMigrations()
