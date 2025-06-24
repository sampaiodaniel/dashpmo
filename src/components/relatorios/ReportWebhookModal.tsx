import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Share, Calendar, Shield, Loader2, Link, ExternalLink } from 'lucide-react';
import { useReportWebhook, CriarRelatorioCompartilhavelParams, RelatorioCompartilhavel } from '@/hooks/useReportWebhook';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import React from 'react';
import { useAuth } from '@/hooks/useAuth';

interface ReportWebhookModalProps {
  isOpen: boolean;
  onClose: () => void;
  dadosRelatorio: any;
  tipoRelatorio: 'visual' | 'asa' | 'consolidado';
  tituloSugerido: string;
  carteira?: string;
  responsavel?: string;
}

export function ReportWebhookModal({
  isOpen,
  onClose,
  dadosRelatorio,
  tipoRelatorio,
  tituloSugerido,
  carteira,
  responsavel
}: ReportWebhookModalProps) {
  const { criarRelatorioCompartilhavel, loading } = useReportWebhook();
  const { userUuid, isLoading: isAuthLoading } = useAuth();
  
  // Log para depuração
  console.log('[ReportWebhookModal] userUuid:', userUuid, '| isAuthLoading:', isAuthLoading);

  // Estados do formulário
  const [titulo, setTitulo] = useState('');
  const [expiraEm, setExpiraEm] = useState(30);
  const [protegidoPorSenha, setProtegidoPorSenha] = useState(false);
  const [senha, setSenha] = useState('');
  const [descricao, setDescricao] = useState('');
  
  // Estado do relatório criado
  const [relatorioGerado, setRelatorioGerado] = useState<RelatorioCompartilhavel | null>(null);

  // Definir título automático quando modal abrir
  React.useEffect(() => {
    if (isOpen && !titulo && tituloSugerido) {
      setTitulo(tituloSugerido);
    }
  }, [isOpen, tituloSugerido, titulo]);

  const handleGerarRelatorio = async () => {
    if (!dadosRelatorio) return;

    const parametros: CriarRelatorioCompartilhavelParams = {
      tipo: tipoRelatorio,
      titulo: titulo.trim() || tituloSugerido,
      dados: {
        ...dadosRelatorio,
        configuracao: {
          descricao: descricao.trim() || undefined,
          geradoPorCompartilhamento: true
        }
      },
      carteira,
      responsavel,
      expiraEm,
      protegidoPorSenha,
      senha: protegidoPorSenha ? senha : undefined
    };

    const resultado = await criarRelatorioCompartilhavel(parametros);
    if (resultado) {
      setRelatorioGerado(resultado);
    }
  };

  const handleCopiarLink = async () => {
    if (!relatorioGerado) return;
    
    try {
      await navigator.clipboard.writeText(relatorioGerado.url);
    } catch (error) {
      console.error('Erro ao copiar link:', error);
    }
  };

  const handleCompartilhar = async () => {
    if (!relatorioGerado) return;

    const textoCompartilhamento = `
📊 ${relatorioGerado.titulo}

${descricao ? `📝 ${descricao}\n\n` : ''}📅 Gerado em: ${new Date(relatorioGerado.metadados.dataGeracao).toLocaleDateString('pt-BR')}
${relatorioGerado.metadados.carteira ? `📂 Carteira: ${relatorioGerado.metadados.carteira}` : ''}
${relatorioGerado.metadados.responsavel ? `👤 Responsável: ${relatorioGerado.metadados.responsavel}` : ''}

🔗 Acesse o relatório: ${relatorioGerado.url}
${protegidoPorSenha ? '🔒 Relatório protegido por senha' : ''}
⏰ Válido até: ${new Date(Date.now() + expiraEm * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')}
    `.trim();

    if (navigator.share) {
      try {
        await navigator.share({
          title: relatorioGerado.titulo,
          text: textoCompartilhamento,
          url: relatorioGerado.url
        });
      } catch (error) {
        // Fallback para clipboard
        await navigator.clipboard.writeText(textoCompartilhamento);
      }
    } else {
      await navigator.clipboard.writeText(textoCompartilhamento);
    }
  };

  const handleReset = () => {
    setTitulo(tituloSugerido);
    setExpiraEm(30);
    setProtegidoPorSenha(false);
    setSenha('');
    setDescricao('');
    setRelatorioGerado(null);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  // Opções de expiração
  const opcoesExpiracao = [
    { valor: 1, label: '1 dia' },
    { valor: 7, label: '7 dias' },
    { valor: 15, label: '15 dias' },
    { valor: 30, label: '30 dias' },
    { valor: 60, label: '60 dias' },
    { valor: 90, label: '90 dias' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share className="h-5 w-5 text-blue-600" />
            {relatorioGerado ? 'Relatório Compartilhável Criado!' : 'Gerar Link de Compartilhamento'}
          </DialogTitle>
        </DialogHeader>

        {!relatorioGerado ? (
          // Formulário de configuração
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título do Relatório</Label>
              <Input
                id="titulo"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Digite um título para o relatório..."
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição (Opcional)</Label>
              <Textarea
                id="descricao"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Adicione uma descrição para contextualizar o relatório..."
                className="w-full min-h-[80px]"
                maxLength={500}
              />
              <p className="text-xs text-gray-500">{descricao.length}/500 caracteres</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiracao">Válido por</Label>
                <Select value={expiraEm.toString()} onValueChange={(value) => setExpiraEm(parseInt(value))}>
              <SelectTrigger>
                    <SelectValue />
              </SelectTrigger>
              <SelectContent>
                    {opcoesExpiracao.map(opcao => (
                      <SelectItem key={opcao.valor} value={opcao.valor.toString()}>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {opcao.label}
                        </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

              <div className="space-y-2">
                <Label>Informações</Label>
                <div className="flex flex-col gap-2">
                  {carteira && (
                    <Badge variant="outline" className="w-fit">
                      📂 {carteira}
                    </Badge>
                  )}
                  {responsavel && (
                    <Badge variant="outline" className="w-fit">
                      👤 {responsavel}
                    </Badge>
                  )}
                  <Badge variant="outline" className="w-fit">
                    📊 {tipoRelatorio === 'visual' ? 'Visual' : tipoRelatorio === 'asa' ? 'ASA' : 'Consolidado'}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-4 border-t pt-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Proteger com senha
                  </Label>
                  <p className="text-sm text-gray-500">
                    Adiciona uma camada extra de segurança
                  </p>
                </div>
                <Switch
                  checked={protegidoPorSenha}
                  onCheckedChange={setProtegidoPorSenha}
                />
              </div>

              {protegidoPorSenha && (
                <div className="space-y-2">
                  <Label htmlFor="senha">Senha</Label>
                  <Input
                    id="senha"
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="Digite uma senha..."
                    className="w-full"
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          // Resultado - link gerado
          <div className="space-y-6 py-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Link className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-800">Link Gerado com Sucesso!</h3>
                  <p className="text-sm text-green-600">
                    Relatório compartilhável criado e pronto para uso
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
          <div>
                <Label>Link do Relatório</Label>
                <div className="flex gap-2 mt-1">
            <Input
                    value={relatorioGerado.url}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    onClick={handleCopiarLink}
                    variant="outline"
                    size="sm"
                    className="shrink-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Tipo:</span>
                  <div className="font-medium capitalize">{relatorioGerado.tipo}</div>
                </div>
                <div>
                  <span className="text-gray-500">Tamanho:</span>
                  <div className="font-medium">{relatorioGerado.metadados.tamanhoMB} MB</div>
                </div>
                <div>
                  <span className="text-gray-500">Expira em:</span>
                  <div className="font-medium">
                    {new Date(Date.now() + expiraEm * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Proteção:</span>
                  <div className="font-medium">
                    {protegidoPorSenha ? '🔒 Com senha' : '🔓 Público'}
                  </div>
                </div>
              </div>

              {descricao && (
                <div>
                  <span className="text-gray-500 text-sm">Descrição:</span>
                  <div className="mt-1 p-3 bg-gray-50 rounded border text-sm">
                    {descricao}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <DialogFooter>
          {!relatorioGerado ? (
            <>
              <Button variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
            <Button 
                onClick={handleGerarRelatorio}
                disabled={loading || isAuthLoading || (!titulo.trim() && !tituloSugerido.trim()) || (protegidoPorSenha && !senha.trim())}
                className="bg-blue-600 hover:bg-blue-700"
                title={isAuthLoading ? 'Aguardando autenticação...' : undefined}
              >
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {isAuthLoading ? 'Aguardando autenticação...' : 'Gerar Link'}
              </Button>
                </>
              ) : (
                <>
              <Button variant="outline" onClick={handleReset}>
                Gerar Novo
              </Button>
              <Button
                onClick={handleCompartilhar}
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50"
              >
                <Share className="h-4 w-4 mr-2" />
                Compartilhar
              </Button>
              <Button
                onClick={() => window.open(relatorioGerado.url, '_blank')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Abrir Relatório
              </Button>
                </>
              )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
