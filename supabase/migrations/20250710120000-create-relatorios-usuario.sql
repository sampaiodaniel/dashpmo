-- Migration: Criação da tabela relatorios_usuario para persistência de relatórios gerados e compartilhados

create table if not exists relatorios_usuario (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references auth.users(id) on delete cascade,
  tipo text not null, -- visual, asa, consolidado, etc
  titulo text not null,
  dados jsonb not null,
  criado_em timestamptz not null default now(),
  expira_em timestamptz,
  protegido_por_senha boolean default false,
  senha_hash text,
  acessos integer default 0,
  ultimo_acesso timestamptz,
  compartilhado boolean default false,
  compartilhado_com text[],
  descricao text
);

create index if not exists idx_relatorios_usuario_usuario_id on relatorios_usuario(usuario_id);
create index if not exists idx_relatorios_usuario_tipo on relatorios_usuario(tipo); 