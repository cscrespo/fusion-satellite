import { writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const envContent = `# Supabase Configuration
VITE_SUPABASE_URL=https://aozsrfvzutkamsnibtug.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvenNyZnZ6dXRrYW1zbmlidHVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4ODUxODUsImV4cCI6MjA4MDQ2MTE4NX0.e7oT9Gqd_l5B--Gep5QsT0B5TGUSuLVQ5PS5Nf2yCA0
`

try {
    const envPath = join(__dirname, '.env.local')
    writeFileSync(envPath, envContent, 'utf-8')
    console.log('✅ Arquivo .env.local criado com sucesso!')
    console.log(`   Localização: ${envPath}`)
    console.log('\n📋 Conteúdo:')
    console.log(envContent)
    console.log('\n🎯 Próximo passo: Reiniciar o dev server')
    console.log('   1. Parar o servidor (Ctrl+C)')
    console.log('   2. Executar: npm run dev')
} catch (error) {
    console.error('❌ Erro ao criar .env.local:', error.message)
}
