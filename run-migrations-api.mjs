import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const SUPABASE_URL = 'https://aozsrfvzutkamsnibtug.supabase.co'
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvenNyZnZ6dXRrYW1zbmlidHVnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDg4NTE4NSwiZXhwIjoyMDgwNDYxMTg1fQ.dduZlhP30FFM3nX9Rj5XsX_rORIyMP1ioKYMbCPqX_M'
const PROJECT_REF = 'aozsrfvzutkamsnibtug'

async function executeSQL(sql) {
    // Use Supabase Management API
    const response = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
            'apikey': SERVICE_ROLE_KEY
        },
        body: JSON.stringify({
            query: sql
        })
    })

    if (!response.ok) {
        const error = await response.text()
        throw new Error(`API Error: ${response.status} - ${error}`)
    }

    return await response.json()
}

async function executeMigration(migrationFile) {
    console.log(`\n📄 Executando: ${migrationFile}`)

    const sql = readFileSync(
        join(__dirname, 'supabase', 'migrations', migrationFile),
        'utf-8'
    )

    try {
        const result = await executeSQL(sql)
        console.log(`✅ ${migrationFile} - Sucesso!`)
        return result
    } catch (error) {
        console.error(`❌ ${migrationFile} - Erro:`, error.message)
        throw error
    }
}

async function verifyTables() {
    console.log('\n📊 Verificando tabelas criadas...')

    const sql = `
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    ORDER BY table_name;
  `

    try {
        const result = await executeSQL(sql)
        console.log(`\n✅ ${result.length || 0} tabelas encontradas:`)
        if (result && result.length > 0) {
            result.forEach(row => console.log(`   - ${row.table_name}`))
        }
    } catch (error) {
        console.error('⚠️  Erro ao verificar tabelas:', error.message)
    }
}

async function runMigrations() {
    console.log('🚀 Executando migrations via Supabase Management API\n')

    const migrations = [
        '01_core_tables.sql',
        '02_patient_management.sql',
        '03_nutrition_diet.sql',
        '04_consultations_plans_financial.sql'
    ]

    for (const migration of migrations) {
        try {
            await executeMigration(migration)
        } catch (error) {
            console.error(`\n❌ Erro fatal em ${migration}`)
            console.error('Tentando continuar...\n')
        }
    }

    console.log('\n✅ Migrations concluídas!')

    await verifyTables()

    console.log('\n🎯 Próximo passo: Criar primeiro usuário')
}

runMigrations().catch(error => {
    console.error('\n❌ Erro fatal:', error)
    process.exit(1)
})
