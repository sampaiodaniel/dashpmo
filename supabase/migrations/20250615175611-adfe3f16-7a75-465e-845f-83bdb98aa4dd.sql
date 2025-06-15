
-- Criar políticas RLS para a tabela notificacoes_lidas
CREATE POLICY "Users can view their own read notifications" 
  ON public.notificacoes_lidas 
  FOR SELECT 
  USING (usuario_id = (SELECT id FROM usuarios WHERE email = current_setting('request.jwt.claims', true)::json->>'email'));

CREATE POLICY "Users can insert their own read notifications" 
  ON public.notificacoes_lidas 
  FOR INSERT 
  WITH CHECK (usuario_id = (SELECT id FROM usuarios WHERE email = current_setting('request.jwt.claims', true)::json->>'email'));

CREATE POLICY "Users can update their own read notifications" 
  ON public.notificacoes_lidas 
  FOR UPDATE 
  USING (usuario_id = (SELECT id FROM usuarios WHERE email = current_setting('request.jwt.claims', true)::json->>'email'));

CREATE POLICY "Users can delete their own read notifications" 
  ON public.notificacoes_lidas 
  FOR DELETE 
  USING (usuario_id = (SELECT id FROM usuarios WHERE email = current_setting('request.jwt.claims', true)::json->>'email'));
