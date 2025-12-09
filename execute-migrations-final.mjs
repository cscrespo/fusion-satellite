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
            '04_consultations_plans_financial.sql',
            '05_crud_schema.sql',
            '97_add_doctor_details.sql',
            '98_create_doctors_table.sql',
            '99_fix_measurements_policy.sql',
            '99_seed_financial_data.sql',
            '100_public_read_policies.sql',
            '101_seed_plans.sql',
            '102_users_crud_setup.sql',
            '103_create_user_rpc.sql',
            '104_fix_dr_smith_login.sql',
            '105_seed_financial_test_data.sql',
            '106_cleanup_dr_smith_auth.sql',
            '107_proper_auth_fix.sql',
            '108_seed_more_consultations.sql',
            '109_seed_full_flow.sql',
            '110_cleanup_duplicates.sql',
            '111_setup_super_admin.sql',
            '112_fix_super_admin_auth.sql',
            '113_saas_management.sql',
            '114_link_orgs_to_plans.sql',
            '115_admin_functions.sql',
            '116_list_users_rpc.sql',
            '117_fix_list_users_rpc.sql',
            '118_fix_org_emails.sql',
            '119_saas_app_structure.sql'
        ]

        let successCount = 0
        for (const migration of migrations) {
            const success = await executeMigration(client, migration)
            if (success) successCount++
        }

        await verifyTables(client)

    } catch (error) {
        console.error('\n❌ Erro:', error.message)
    } finally {
        await client.end()
    }
}

runMigrations()
