import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Upload, FileSpreadsheet, Eye, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ImportacaoUpload } from '@/components/admin/ImportacaoUpload';
import { ImportacaoPreview } from '@/components/admin/ImportacaoPreview';
import { toast } from '@/hooks/use-toast';

type ImportacaoEtapa = 'upload' | 'preview' | 'concluida';

interface DadosImportacao {
  projetos: any[];
  status: any[];
  entregas: any[];
}

export default function AdminImportacao() {
  const { usuario, isLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [etapa, setEtapa] = useState<ImportacaoEtapa>('upload');
  const [dadosImportacao, setDadosImportacao] = useState<DadosImportacao>({
    projetos: [],
    status: [],
    entregas: []
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg">
              <img 
                src="/lovable-uploads/DashPMO_Icon_recortado.png" 
                alt="DashPMO" 
                className="w-8 h-8" 
              />
            </div>
            <div className="text-pmo-gray">Carregando...</div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!usuario) {
    return <LoginForm />;
  }

  if (!isAdmin()) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-pmo-primary mb-4">Acesso Negado</h1>
            <p className="text-pmo-gray mb-6">Você não tem permissão para acessar esta área.</p>
            <Button onClick={() => navigate('/dashboard')} variant="outline">
              Voltar ao Dashboard
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const handleUploadConcluido = (dados: DadosImportacao) => {
    setDadosImportacao(dados);
    setEtapa('preview');
  };

  const handleImportacaoFinalizada = () => {
    setEtapa('concluida');
    toast({
      title: "Sucesso",
      description: "Importação realizada com sucesso!",
    });
  };

  const renderEtapa = () => {
    switch (etapa) {
      case 'upload':
        return (
          <ImportacaoUpload 
            onUploadConcluido={handleUploadConcluido}
          />
        );
      case 'preview':
        return (
          <ImportacaoPreview 
            dados={dadosImportacao}
            onImportacaoFinalizada={handleImportacaoFinalizada}
            onVoltar={() => setEtapa('upload')}
          />
        );
      case 'concluida':
        return (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-pmo-primary mb-2">
                  Importação Concluída!
                </h2>
                <p className="text-pmo-gray mb-6">
                  Os dados foram importados com sucesso para o sistema.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button onClick={() => navigate('/projetos')}>
                    Ver Projetos
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setEtapa('upload');
                      setDadosImportacao({ projetos: [], status: [], entregas: [] });
                    }}
                  >
                    Nova Importação
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  const getEtapaIcon = () => {
    switch (etapa) {
      case 'upload': return Upload;
      case 'preview': return Eye;
      case 'concluida': return CheckCircle;
    }
  };

  const getEtapaTitulo = () => {
    switch (etapa) {
      case 'upload': return 'Upload da Planilha';
      case 'preview': return 'Revisão dos Dados';
      case 'concluida': return 'Importação Concluída';
    }
  };

  const EtapaIcon = getEtapaIcon();

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button onClick={() => navigate('/administracao')} variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-pmo-primary/10 rounded-lg">
                <EtapaIcon className="h-6 w-6 text-pmo-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-pmo-primary">Importação de Dados</h1>
                <p className="text-pmo-gray mt-1">{getEtapaTitulo()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Indicador de progresso */}
        <div className="flex items-center justify-center space-x-8 py-4">
          <div className={`flex items-center gap-2 ${etapa === 'upload' ? 'text-pmo-primary' : etapa === 'preview' || etapa === 'concluida' ? 'text-green-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${etapa === 'upload' ? 'bg-pmo-primary text-white' : etapa === 'preview' || etapa === 'concluida' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
              1
            </div>
            <span className="font-medium">Upload</span>
          </div>
          
          <div className={`h-px w-16 ${etapa === 'preview' || etapa === 'concluida' ? 'bg-green-600' : 'bg-gray-300'}`} />
          
          <div className={`flex items-center gap-2 ${etapa === 'preview' ? 'text-pmo-primary' : etapa === 'concluida' ? 'text-green-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${etapa === 'preview' ? 'bg-pmo-primary text-white' : etapa === 'concluida' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
              2
            </div>
            <span className="font-medium">Revisão</span>
          </div>
          
          <div className={`h-px w-16 ${etapa === 'concluida' ? 'bg-green-600' : 'bg-gray-300'}`} />
          
          <div className={`flex items-center gap-2 ${etapa === 'concluida' ? 'text-green-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${etapa === 'concluida' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
              3
            </div>
            <span className="font-medium">Concluído</span>
          </div>
        </div>

        {renderEtapa()}
      </div>
    </Layout>
  );
} 