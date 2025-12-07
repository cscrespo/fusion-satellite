import pkg from 'pg'
const { Client } = pkg
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Try different connection formats
const configs = [
    // Format 1: Direct connection
    {
        host: 'db.aozsrfvzutkamsnibtug.supabase.co',
        port: 5432,
        database: 'postgres',
        user: 'postgres',
        password: 'Action24aid#',
        ssl: { rejectUnauthorized: false }
    },
    // Format 2: Pooler connection
    {
        host: 'aws-0-sa-east-1.pooler.supabase.com',
        port: 6543,
        database: 'postgres',
        user: 'postgres.aozsrfvzutkamsnibtug',
        password: 'Action24aid#',
        ssl: { rejectUnauthorized: false }
    }
]

async function testConnection(config, index) {
    console.log(`\n🔌 Tentando conexão ${index + 1}...`)
    const client = new Client(config)

    try {
        await client.connect()
        console.log('✅ Conectado com sucesso!')

        // Test query
        const result = await client.query('SELECT current_database(), current_user;')
        console.log(`   Database: ${result.rows[0].current_database}`)
        console.log(`   User: ${result.rows[0].current_user}`)

        await client.end()
        return config
    } catch (error) {
        console.log(`❌ Falhou: ${error.message.substring(0, 80)}`)
        return null
    }
}

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
        if (error.message.includes('already exists')) {
            console.log(`⚠️  ${migrationFile} - Já existe (OK)`)
            return true
        }
        console.error(`❌ ${migrationFile} - ${error.message.substring(0, 100)}`)
        return false
    }
}

async function verifyTables(client) {
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

async function runMigrations() {
    console.log('🚀 Testando conexões com Supabase...\n')

    // Find working connection
    let workingConfig = null
    for (let i = 0; i < configs.length; i++) {
        const config = await testConnection(configs[i], i)
        if (config) {
            workingConfig = config
            break
        }
    }

    if (!workingConfig) {
        console.error('\n❌ Nenhuma conexão funcionou!')
        console.log('\n📋 Tente executar manualmente via SQL Editor:')
        console.log('   1. Abra: https://supabase.com/dashboard/project/aozsrfvzutkamsnibtug/sql')
        console.log('   2. Execute cada migration do arquivo migrations_234.md')
        return
    }

    console.log('\n🎯 Executando migrations...')
    const client = new Client(workingConfig)

    try {
        await client.connect()

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

        console.log(`\n\n🎉 ${successCount}/${migrations.length} migrations executadas!`)

        await verifyTables(client)

    } catch (error) {
        console.error('\n❌ Erro:', error.message)
    } finally {
        await client.end()
    }
}

runMigrations()
