import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, CheckCircle, ArrowLeft, Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface ImportacaoPreviewProps {
  dados: {
    projetos: any[];
    status: any[];
    entregas: any[];
  };
  onImportacaoFinalizada: () => void;
  onVoltar: () => void;
}

// Função para formatar texto com quebras de linha
function formatarTextoComQuebras(texto: string): React.ReactNode {
  if (!texto) return 'N/A';
  
  return texto.split('\n').map((linha, index, array) => (
    <span key={index}>
      {linha}
      {index < array.length - 1 && <br />}
    </span>
  ));
}

// Função para formatar data em formato brasileiro
function formatarDataBR(dataISO: string): string {
  if (!dataISO) return '';
  
  try {
    const data = new Date(dataISO + 'T00:00:00'); // Evita problemas de timezone
    return data.toLocaleDateString('pt-BR');
  } catch {
    return dataISO;
  }
}

export function ImportacaoPreview({ dados, onImportacaoFinalizada, onVoltar }: ImportacaoPreviewProps) {
  const { usuario } = useAuth();
  const [importando, setImportando] = useState(false);
  const [dadosEditaveis, setDadosEditaveis] = useState(dados);

  const contarErros = () => {
    let totalErros = 0;
    dadosEditaveis.projetos.forEach(p => totalErros += p._erros?.length || 0);
    dadosEditaveis.status.forEach(s => totalErros += s._erros?.length || 0);
    dadosEditaveis.entregas.forEach(e => totalErros += e._erros?.length || 0);
    return totalErros;
  };

  const realizarImportacao = async () => {
    setImportando(true);
    
    try {
      // Importar projetos primeiro
      const projetosImportados = [];
      for (const projeto of dadosEditaveis.projetos) {
        try {
          // Verificar se projeto já existe
          const { data: projetoExistente } = await supabase
            .from('projetos')
            .select('id')
            .eq('nome_projeto', projeto.nome_projeto)
            .single();

          if (!projetoExistente) {
            const { data: novoProjeto, error } = await supabase
              .from('projetos')
              .insert({
                nome_projeto: projeto.nome_projeto,
                descricao: projeto.descricao,
                area_responsavel: projeto.area_responsavel,
                responsavel_asa: projeto.responsavel_asa,
                gp_responsavel: projeto.gp_responsavel,
                equipe: projeto.equipe,
                carteira_secundaria: projeto.carteira_secundaria,
                carteira_terciaria: projeto.carteira_terciaria,
                finalizacao_prevista: projeto.finalizacao_prevista,
                responsavel_interno: projeto.responsavel_asa || 'Importação',
                criado_por: usuario?.nome || 'Importação',
                status_ativo: true
              } as any)
              .select()
              .single();

            if (error) throw error;
            projetosImportados.push({ ...projeto, id: novoProjeto.id });
          } else {
            projetosImportados.push({ ...projeto, id: projetoExistente.id });
          }
        } catch (error) {
          console.error(`Erro ao importar projeto ${projeto.nome_projeto}:`, error);
        }
      }

      // Após criação ou localização dos projetos, aplicar updates selecionados
      for (const proj of dadosEditaveis.projetos) {
        if (proj._acao === 'ATUALIZAR' && proj._updateFields) {
          const camposSelecionados = Object.keys(proj._updateFields).filter(k => proj._updateFields[k]);
          if (camposSelecionados.length > 0) {
            const updateObj: any = {};
            camposSelecionados.forEach((field) => {
              updateObj[field] = proj[field];
            });
            if (Object.keys(updateObj).length > 0) {
              try {
                const { error } = await supabase
                  .from('projetos')
                  .update(updateObj)
                  .eq('id', proj._idExistente);
                if (error) throw error;
              } catch (err) {
                console.error('Erro ao atualizar projeto', proj.nome_projeto, err);
              }
            }
          }
        }
      }

      const statusIdMap: Record<number, number> = {};
      // Importar status
      for (const status of dadosEditaveis.status) {
        try {
          const projetoImportado = projetosImportados.find(p => p.nome_projeto === status.projeto_nome);
          if (!projetoImportado) continue;

          const { data: statusInserido, error } = await supabase
            .from('status_projeto')
            .insert({
              projeto_id: projetoImportado.id,
              data_atualizacao: status.data_atualizacao,
              status_geral: status.status_geral,
              status_visao_gp: status.status_visao_gp,
              impacto_riscos: status.impacto_riscos,
              probabilidade_riscos: status.probabilidade_riscos,
              progresso_estimado: status.progresso_estimado,
              realizado_semana_atual: status.realizado_semana_atual,
              backlog: status.backlog,
              bloqueios_atuais: status.bloqueios_atuais,
              observacoes_pontos_atencao: status.observacoes_pontos_atencao,
              aprovado: false,
              criado_por: usuario?.nome || 'Importação'
            })
            .select('id')
            .single();

          if (error) throw error;

          statusIdMap[status._numeroLinha] = statusInserido.id;
        } catch (error) {
          console.error(`Erro ao importar status:`, error);
        }
      }

      // Importar entregas
      for (const entrega of dadosEditaveis.entregas) {
        try {
          const statusId = statusIdMap[entrega._numeroLinha];
          if (!statusId) continue;

          // Mapear status_entrega para ID
          const mapStatusEntregaId = (status: string): number | null => {
            if (!status) return null;
            const s = status.toLowerCase();
            if (s.includes('no prazo')) return 1;
            if (s.includes('aten')) return 2; // Atenção
            if (s.includes('atras')) return 3; // Atrasado
            if (s.includes('não iniciado') || s.includes('nao iniciado')) return 4;
            if (s.includes('conclu')) return 5;
            return null;
          };

          const statusEntregaId = mapStatusEntregaId(entrega.status_entrega);

          const insertObj: any = {
            status_id: statusId,
            ordem: entrega._indiceEntrega,
            nome_entrega: entrega.titulo,
            data_entrega: entrega.data_prevista,
            entregaveis: entrega.escopo,
            status_da_entrega: entrega.status_entrega,
            status_entrega_id: statusEntregaId
          };

          console.log('Insert entrega_status:', insertObj);

          const { error } = await supabase
            .from('entregas_status')
            .insert(insertObj);

          if (error) throw error;
        } catch (error) {
          console.error(`Erro ao importar entrega:`, error);
        }
      }

      toast({
        title: "Sucesso",
        description: "Importação realizada com sucesso!",
      });

      onImportacaoFinalizada();

    } catch (error) {
      console.error('Erro na importação:', error);
      toast({
        title: "Erro",
        description: "Erro durante a importação. Verifique os logs.",
        variant: "destructive",
      });
    } finally {
      setImportando(false);
    }
  };

  const totalErros = contarErros();

  return (
    <div className="space-y-6">
      {/* Resumo */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo da Importação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-pmo-primary">
                {dadosEditaveis.projetos.length}
              </div>
              <div className="text-sm text-gray-600">Projetos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {dadosEditaveis.status.length}
              </div>
              <div className="text-sm text-gray-600">Status</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {dadosEditaveis.entregas.length}
              </div>
              <div className="text-sm text-gray-600">Entregas</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${totalErros > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {totalErros}
              </div>
              <div className="text-sm text-gray-600">Erros</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dados para revisão */}
      <Tabs defaultValue="projetos">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="projetos">
            Projetos ({dadosEditaveis.projetos.length})
          </TabsTrigger>
          <TabsTrigger value="status">
            Status ({dadosEditaveis.status.length})
          </TabsTrigger>
          <TabsTrigger value="entregas">
            Entregas ({dadosEditaveis.entregas.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="projetos" className="space-y-4">
          {dadosEditaveis.projetos.map((projeto, index) => (
            <Card key={index} className={projeto._erros?.length > 0 ? 'border-red-200' : ''}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{projeto.nome_projeto}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Linha {projeto._numeroLinha}</Badge>
                    {projeto._erros?.length > 0 && (
                      <Badge variant="destructive">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {projeto._erros.length} erro(s)
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {projeto._acao === 'CRIAR' ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Novo Projeto
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        Projeto Existente
                      </Badge>
                    )}
                  </div>
                </div>
                {projeto._acao === 'ATUALIZAR' && (
                  <div className="mt-1">
                    <p className="text-sm text-gray-600">
                      ℹ️ Este projeto já existe na base{projeto._nomeOriginal && projeto._nomeOriginal !== projeto.nome_projeto ? ` como "${projeto._nomeOriginal}"` : ''}. Apenas o status será adicionado.
                    </p>
                    
                    {projeto._diffEntries && projeto._diffEntries.length > 0 && (
                       <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded">
                         <p className="font-medium text-yellow-800 mb-2">⚠️ Diferenças detectadas nos dados do projeto:</p>
                         <ul className="text-yellow-700 text-xs space-y-1 list-none mb-3">
                           {projeto._diffEntries.map((entry: any, idx: number) => (
                             <li key={idx} className="flex items-start gap-2">
                               <input
                                 type="checkbox"
                                 className="mt-0.5"
                                 checked={projeto._updateFields[entry.campo] || false}
                                 onChange={(e) => {
                                   const novos = [...dadosEditaveis.projetos];
                                   novos[index]._updateFields[entry.campo] = e.target.checked;
                                   // If any field checked, mark atualizarProjeto true automatically
                                   novos[index]._atualizarProjeto = Object.values(novos[index]._updateFields).some(Boolean);
                                   setDadosEditaveis({ ...dadosEditaveis, projetos: novos });
                                 }}
                               />
                               <span>{entry.texto}</span>
                             </li>
                           ))}
                         </ul>
                         <div className="flex items-center gap-3">
                           <label className="flex items-center gap-2 text-sm font-medium text-yellow-800">
                             <input
                               type="checkbox"
                               checked={Object.values(projeto._updateFields || {}).some(Boolean)}
                               onChange={(e) => {
                                 const novosDados = [...dadosEditaveis.projetos];
                                 const marcar = e.target.checked;
                                 const fieldsObj = novosDados[index]._updateFields || {};
                                 Object.keys(fieldsObj).forEach(k => {
                                   fieldsObj[k] = marcar;
                                 });
                                 novosDados[index]._updateFields = fieldsObj;
                                 novosDados[index]._atualizarProjeto = marcar;
                                 setDadosEditaveis({ ...dadosEditaveis, projetos: novosDados });
                               }}
                               className="rounded"
                             />
                             Marcar/Desmarcar todos
                           </label>
                         </div>
                         {!Object.values(projeto._updateFields || {}).some(Boolean) && (
                           <p className="text-xs text-yellow-600 mt-2">
                             ℹ️ Se nenhum campo estiver marcado, apenas o status será adicionado ao projeto existente.
                           </p>
                         )}
                       </div>
                     )}
                     {(!projeto._diffEntries || projeto._diffEntries.length === 0) && (
                       <p className="text-xs text-green-600 mt-1">
                         ✅ Dados do projeto estão idênticos na planilha e na base.
                       </p>
                     )}
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Tipo:</span> {projeto.tipo_projeto}
                  </div>
                  <div>
                    <span className="font-medium">Carteira:</span> {projeto.area_responsavel}
                  </div>
                  <div>
                    <span className="font-medium">Responsável ASA:</span> {projeto.responsavel_asa}
                  </div>
                  <div>
                    <span className="font-medium">Chefe do Projeto:</span> {projeto.gp_responsavel}
                  </div>
                </div>
                {projeto.descricao && (
                  <div className="mt-2 text-sm">
                    <span className="font-medium">Descrição:</span> {formatarTextoComQuebras(projeto.descricao)}
                  </div>
                )}
                {projeto._erros?.length > 0 && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                    <p className="font-medium text-red-800 mb-2">Erros encontrados:</p>
                    <ul className="text-red-700 text-sm space-y-1">
                      {projeto._erros.map((erro: string, idx: number) => (
                        <li key={idx}>• {erro}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="status" className="space-y-4">
          {dadosEditaveis.status.map((status, index) => (
            <Card key={index} className="border-l-4 border-l-green-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Status - {status.projeto_nome}</CardTitle>
                  <div className="flex gap-2">
                    {status._acao === 'ADICIONAR_STATUS' ? (
                      <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                        Adicionar Status
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Novo Status
                      </Badge>
                    )}
                  </div>
                </div>
                {status._acao === 'ADICIONAR_STATUS' && (
                  <p className="text-sm text-gray-600 mt-1">
                    ℹ️ Status será adicionado ao projeto existente: {status._projetoExistente}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Status Geral:</span> {status.status_geral}
                  </div>
                  <div>
                    <span className="font-medium">Visão Chefe:</span> {status.status_visao_gp}
                  </div>
                  <div>
                    <span className="font-medium">Data:</span> {formatarDataBR(status.data_atualizacao)}
                  </div>
                  <div>
                    <span className="font-medium">Progresso:</span> {status.progresso_estimado}%
                  </div>
                  <div>
                    <span className="font-medium">Prob. Riscos:</span> {status.probabilidade_riscos || 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">Impacto Riscos:</span> {status.impacto_riscos || 'N/A'}
                  </div>
                  <div className="md:col-span-2">
                    <span className="font-medium">Realizado na Semana:</span> {formatarTextoComQuebras(status.realizado_semana_atual || '')}
                  </div>
                  <div className="md:col-span-2">
                    <span className="font-medium">Backlog:</span> {formatarTextoComQuebras(status.backlog || '')}
                  </div>
                  <div className="md:col-span-2">
                    <span className="font-medium">Bloqueios:</span> {formatarTextoComQuebras(status.bloqueios_atuais || '')}
                  </div>
                  <div className="md:col-span-2">
                    <span className="font-medium">Pontos de Atenção:</span> {formatarTextoComQuebras(status.observacoes_pontos_atencao || '')}
                  </div>
                </div>
                {status._erros?.length > 0 && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                    <p className="font-medium text-red-800 mb-2">Erros encontrados:</p>
                    <ul className="text-red-700 text-sm space-y-1">
                      {status._erros.map((erro: string, idx: number) => (
                        <li key={idx}>• {erro}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="entregas" className="space-y-4">
          {dadosEditaveis.entregas.map((entrega, index) => (
            <Card key={index} className={entrega._erros?.length > 0 ? 'border-red-200' : ''}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{entrega.titulo}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {entrega.projeto_nome} - Entrega {entrega._indiceEntrega}
                    </Badge>
                    {entrega._erros?.length > 0 && (
                      <Badge variant="destructive">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {entrega._erros.length} erro(s)
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Data da Entrega:</span> {formatarDataBR(entrega.data_prevista)}
                    </div>
                    <div>
                      <span className="font-medium">Status:</span> {entrega.status_entrega}
                    </div>
                  </div>
                  {entrega.escopo && (
                    <div className="mt-2 text-sm">
                      <span className="font-medium">Entregáveis:</span> {formatarTextoComQuebras(entrega.escopo)}
                    </div>
                  )}
                {entrega._erros?.length > 0 && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                    <p className="font-medium text-red-800 mb-2">Erros encontrados:</p>
                    <ul className="text-red-700 text-sm space-y-1">
                      {entrega._erros.map((erro: string, idx: number) => (
                        <li key={idx}>• {erro}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Ações */}
      <div className="flex justify-between">
        <Button onClick={onVoltar} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        
        <Button 
          onClick={realizarImportacao}
          disabled={importando || totalErros > 0}
          className="bg-pmo-primary hover:bg-pmo-primary/90"
        >
          {importando ? 'Importando...' : 'Confirmar Importação'}
          <Save className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {totalErros > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-medium">
                Há {totalErros} erro(s) que precisam ser corrigidos antes da importação.
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 