-- Adicionar campos na tabela subjects
ALTER TABLE subjects 
ADD COLUMN IF NOT EXISTS teacher TEXT,
ADD COLUMN IF NOT EXISTS description TEXT;

-- Adicionar campos na tabela activities
ALTER TABLE activities 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS weight NUMERIC, -- Peso da nota (apenas para type 'exam' ou 'assignment')
ADD COLUMN IF NOT EXISTS grade NUMERIC;  -- Nota obtida
