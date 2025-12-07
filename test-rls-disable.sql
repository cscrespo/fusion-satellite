-- TESTE: Desabilitar RLS temporariamente para diagnóstico
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Verificar se funciona
SELECT * FROM profiles WHERE id = 'de6f46ea-1050-4f19-af17-7c3ffe458338';

-- IMPORTANTE: Re-habilitar depois do teste!
-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
