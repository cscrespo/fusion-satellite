import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://aozsrfvzutkamsnibtug.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvenNyZnZ6dXRrYW1zbmlidHVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4ODUxODUsImV4cCI6MjA4MDQ2MTE4NX0.e7oT9Gqd_l5B--Gep5QsT0B5TGUSuLVQ5PS5Nf2yCA0'

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storage: window.localStorage
    }
})

// Helper function to get current user's organization
export const getCurrentOrganization = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id, organization:organizations(*)')
        .eq('id', user.id)
        .single()

    return profile?.organization || null
}

// Helper function to check if user is admin
export const isAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    return profile?.role === 'admin'
}
