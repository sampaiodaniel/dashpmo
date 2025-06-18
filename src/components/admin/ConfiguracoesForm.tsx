
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Save, Settings } from 'lucide-react';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

export function ConfiguracoesForm() {
  const [configuracoes, setConfiguracoes] = useState({
    nomeInstancia: 'Sistema PMO',
    emailNotificacoes: 'admin@exemplo.com',
    diasLimiteStatus: 7,
    notificacoesEmail: true,
    backupAutomatico: true,
    logDetalhado: false,
    observacoes: ''
  });

  const handleSave = () => {
    // Simular salvamento
    toast({
      title: "Sucesso",
      description: "Configurações salvas com sucesso!",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurações do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="nomeInstancia">Nome da Instância</Label>
              <Input
                id="nomeInstancia"
                value={configuracoes.nomeInstancia}
                onChange={(e) => setConfiguracoes(prev => ({
                  ...prev,
                  nomeInstancia: e.target.value
                }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emailNotificacoes">Email para Notificações</Label>
              <Input
                id="emailNotificacoes"
                type="email"
                value={configuracoes.emailNotificacoes}
                onChange={(e) => setConfiguracoes(prev => ({
                  ...prev,
                  emailNotificacoes: e.target.value
                }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="diasLimite">Dias Limite para Status</Label>
              <Input
                id="diasLimite"
                type="number"
                value={configuracoes.diasLimiteStatus}
                onChange={(e) => setConfiguracoes(prev => ({
                  ...prev,
                  diasLimiteStatus: parseInt(e.target.value)
                }))}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Preferências</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Notificações por Email</Label>
                <p className="text-sm text-pmo-gray">Enviar notificações automáticas por email</p>
              </div>
              <Switch
                checked={configuracoes.notificacoesEmail}
                onCheckedChange={(checked) => setConfiguracoes(prev => ({
                  ...prev,
                  notificacoesEmail: checked
                }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Backup Automático</Label>
                <p className="text-sm text-pmo-gray">Realizar backup automático dos dados</p>
              </div>
              <Switch
                checked={configuracoes.backupAutomatico}
                onCheckedChange={(checked) => setConfiguracoes(prev => ({
                  ...prev,
                  backupAutomatico: checked
                }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Log Detalhado</Label>
                <p className="text-sm text-pmo-gray">Registrar logs detalhados do sistema</p>
              </div>
              <Switch
                checked={configuracoes.logDetalhado}
                onCheckedChange={(checked) => setConfiguracoes(prev => ({
                  ...prev,
                  logDetalhado: checked
                }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              placeholder="Observações sobre as configurações..."
              value={configuracoes.observacoes}
              onChange={(e) => setConfiguracoes(prev => ({
                ...prev,
                observacoes: e.target.value
              }))}
            />
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Salvar Configurações
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
