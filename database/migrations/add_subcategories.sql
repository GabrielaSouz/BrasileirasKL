-- Criar tabela de subcategorias
CREATE TABLE IF NOT EXISTS subcategories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Adicionar coluna subcategory_id na tabela services
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS subcategory_id UUID REFERENCES subcategories(id) ON DELETE SET NULL;

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_subcategories_category_id ON subcategories(category_id);
CREATE INDEX IF NOT EXISTS idx_services_subcategory_id ON services(subcategory_id);

-- Inserir algumas subcategorias de exemplo
INSERT INTO subcategories (name, category_id) VALUES 
('Pediatra', (SELECT id FROM categories WHERE name ILIKE '%médico%' OR name ILIKE '%medico%' LIMIT 1)),
('Cardiologista', (SELECT id FROM categories WHERE name ILIKE '%médico%' OR name ILIKE '%medico%' LIMIT 1)),
('Ginecologista', (SELECT id FROM categories WHERE name ILIKE '%médico%' OR name ILIKE '%medico%' LIMIT 1)),
('Dentista', (SELECT id FROM categories WHERE name ILIKE '%médico%' OR name ILIKE '%medico%' LIMIT 1)),
('Cabeleireira', (SELECT id FROM categories WHERE name ILIKE '%beleza%' LIMIT 1)),
('Manicure', (SELECT id FROM categories WHERE name ILIKE '%beleza%' LIMIT 1)),
('Costura', (SELECT id FROM categories WHERE name ILIKE '%serviços gerais%' OR name ILIKE '%servicos gerais%' LIMIT 1)),
('Limpeza', (SELECT id FROM categories WHERE name ILIKE '%serviços gerais%' OR name ILIKE '%servicos gerais%' LIMIT 1))
ON CONFLICT DO NOTHING;
