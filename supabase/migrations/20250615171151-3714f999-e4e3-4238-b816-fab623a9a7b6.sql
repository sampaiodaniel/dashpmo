
-- Criar tabela de perfis de usuários
CREATE TABLE public.perfis_usuario (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  nome VARCHAR(255),
  sobrenome VARCHAR(255),
  foto_url VARCHAR(500),
  data_criacao TIMESTAMP WITH TIME ZONE DEFAULT now(),
  data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(usuario_id)
);

-- Criar bucket para fotos de perfil
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true);

-- Política para permitir que usuários vejam suas próprias fotos
CREATE POLICY "Usuários podem ver suas próprias fotos de perfil" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

-- Política para permitir que usuários façam upload de suas próprias fotos
CREATE POLICY "Usuários podem fazer upload de suas próprias fotos" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'avatars');

-- Política para permitir que usuários atualizem suas próprias fotos
CREATE POLICY "Usuários podem atualizar suas próprias fotos" ON storage.objects
FOR UPDATE USING (bucket_id = 'avatars');

-- Política para permitir que usuários deletem suas próprias fotos
CREATE POLICY "Usuários podem deletar suas próprias fotos" ON storage.objects
FOR DELETE USING (bucket_id = 'avatars');
