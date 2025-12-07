const SUPABASE_URL = 'https://aozsrfvzutkamsnibtug.supabase.co'
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvenNyZnZ6dXRrYW1zbmlidHVnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDg4NTE4NSwiZXhwIjoyMDgwNDYxMTg1fQ.dduZlhP30FFM3nX9Rj5XsX_rORIyMP1ioKYMbCPqX_M'

const fs = require('fs')
const path = require('path')

async function executeMigration(migrationFile) {
    console.log(`\n📄 Executando: ${migrationFile}`)

    const sql = fs.readFileSync(
        path.join(__dirname, 'supabase', 'migrations', migrationFile),
        'utf-8'
    )

    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
        },
        body: JSON.stringify({ query: sql })
    })

    if (!response.ok) {
        // Try alternative endpoint
        const response2 = await fetch(`${SUPABASE_URL}/rest/v1/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/vnd.pgrst.object+json',
                'apikey': SERVICE_ROLE_KEY,
                'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
                'Prefer': 'return=minimal'
            },
            body: sql
        })

        if (!response2.ok) {
            const error = await response2.text()
            throw new Error(`Erro na migration: ${error}`)
        }
    }

    console.log(`✅ ${migrationFile} executada com sucesso!`)
}

async function runMigrations() {
    console.log('🚀 Iniciando execução de migrations...\n')

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
            console.error(`❌ Erro em ${migration}:`, error.message)
            console.log('\n⚠️  Continuando com próxima migration...\n')
        }
    }

    console.log('\n✅ Processo de migrations concluído!')
    console.log('\n📊 Verificando tabelas criadas...')

    // Verificar tabelas
    const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
        method: 'GET',
        headers: {
            'apikey': SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
        }
    })

    if (response.ok) {
        const tables = await response.json()
        console.log('\n📋 Tabelas disponíveis:', tables)
    }
}

runMigrations().catch(console.error)
