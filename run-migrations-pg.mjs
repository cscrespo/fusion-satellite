import pkg from 'pg'
const { Client } = pkg
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Supabase connection string format:
// postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
const connectionString = `postgresql://postgres.aozsrfvzutkamsnibtug:${encodeURIComponent('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvenNyZnZ6dXRrYW1zbmlidHVnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDg4NTE4NSwiZXhwIjoyMDgwNDYxMTg1fQ.dduZlhP30FFM3nX9Rj5XsX_rORIyMP1ioKYMbCPqX_M')}@aws-0-sa-east-1.pooler.supabase.com:6543/postgres`

async function executeMigration(client, migrationFile) {
    console.log(`\n📄 Executando: ${migrationFile}`)

    const sql = readFileSync(
        join(__dirname, 'supabase', 'migrations', migrationFile),
        'utf-8'
    )

    try {
        await client.query(sql)
        console.log(`✅ ${migrationFile} - Sucesso!`)
    } catch (error) {
        console.error(`⚠️  ${migrationFile} - ${error.message.substring(0, 100)}`)
        // Continue mesmo com erros (tabelas podem já existir)
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
}

async function runMigrations() {
    console.log('🚀 Conectando ao Supabase via PostgreSQL...\n')

    const client = new Client({ connectionString })

    try {
        await client.connect()
        console.log('✅ Conectado ao banco de dados!\n')

        const migrations = [
            '01_core_tables.sql',
            '02_patient_management.sql',
            '03_nutrition_diet.sql',
            '04_consultations_plans_financial.sql'
        ]

        for (const migration of migrations) {
            await executeMigration(client, migration)
        }

        console.log('\n✅ Todas as migrations foram executadas!')

        await verifyTables(client)

        console.log('\n🎯 Próximo passo: Criar primeiro usuário e organização')

    } catch (error) {
        console.error('\n❌ Erro:', error.message)
    } finally {
        await client.end()
    }
}

runMigrations()
