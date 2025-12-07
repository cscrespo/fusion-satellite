import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const SUPABASE_URL = 'https://aozsrfvzutkamsnibtug.supabase.co'
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvenNyZnZ6dXRrYW1zbmlidHVnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDg4NTE4NSwiZXhwIjoyMDgwNDYxMTg1fQ.dduZlhP30FFM3nX9Rj5XsX_rORIyMP1ioKYMbCPqX_M'

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})

async function executeSql(sql) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
        },
        body: JSON.stringify({ sql })
    })

    return response
}

async function executeMigration(migrationFile) {
    console.log(`\n📄 Lendo: ${migrationFile}`)

    const sql = readFileSync(
        join(__dirname, 'supabase', 'migrations', migrationFile),
        'utf-8'
    )

    console.log(`📤 Executando migration...`)

    // Split SQL into individual statements
    const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'))

    console.log(`   ${statements.length} statements encontrados`)

    let successCount = 0
    let errorCount = 0

    for (let i = 0; i < statements.length; i++) {
        const statement = statements[i] + ';'

        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain',
                    'apikey': SERVICE_ROLE_KEY,
                    'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
                    'Content-Profile': 'public'
                },
                body: statement
            })

            if (response.ok || response.status === 204) {
                successCount++
                process.stdout.write('.')
            } else {
                errorCount++
                const error = await response.text()
                console.log(`\n   ⚠️  Statement ${i + 1} falhou: ${error.substring(0, 100)}`)
            }
        } catch (error) {
            errorCount++
            console.log(`\n   ⚠️  Erro no statement ${i + 1}: ${error.message}`)
        }
    }

    console.log(`\n   ✅ ${successCount} statements executados`)
    if (errorCount > 0) {
        console.log(`   ⚠️  ${errorCount} statements com erro (pode ser normal se já existirem)`)
    }
}

async function verifyTables() {
    console.log('\n📊 Verificando tabelas criadas...')

    const { data, error } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .order('table_name')

    if (error) {
        console.log('⚠️  Não foi possível verificar via Supabase client')
        console.log('   Você pode verificar manualmente no SQL Editor')
        return
    }

    if (data && data.length > 0) {
        console.log(`\n✅ ${data.length} tabelas encontradas:`)
        data.forEach(t => console.log(`   - ${t.table_name}`))
    }
}

async function runMigrations() {
    console.log('🚀 Iniciando execução de migrations via Supabase API\n')
    console.log('⚠️  NOTA: Alguns erros são esperados se as tabelas já existirem\n')

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
            console.error(`\n❌ Erro fatal em ${migration}:`, error.message)
        }
    }

    console.log('\n\n✅ Processo de migrations concluído!')

    await verifyTables()

    console.log('\n📝 Próximo passo: Criar primeiro usuário e organização')
}

runMigrations().catch(error => {
    console.error('\n❌ Erro fatal:', error)
    process.exit(1)
})
