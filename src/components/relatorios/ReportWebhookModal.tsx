
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { X, Send } from 'lucide-react';
import { CARTEIRAS } from '@/types/pmo';
import { useReportWebhook } from '@/hooks/useReportWebhook';

interface ReportWebhookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReportWebhookModal({ isOpen, onClose }: ReportWebhookModalProps) {
  const [carteira, setCarteira] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const { enviarReport, isLoading } = useReportWebhook();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!carteira || !webhookUrl) {
      return;
    }

    const success = await enviarReport(carteira, webhookUrl);
    if (success) {
      handleClose();
    }
  };

  const handleClose = () => {
    setCarteira('');
    setWebhookUrl('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Enviar Report da Carteira</DialogTitle>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="carteira">Carteira *</Label>
            <Select value={carteira} onValueChange={setCarteira}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma carteira" />
              </SelectTrigger>
              <SelectContent>
                {CARTEIRAS.map((cart) => (
                  <SelectItem key={cart} value={cart}>
                    {cart}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="webhook">URL do Webhook *</Label>
            <Input
              id="webhook"
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://hooks.zapier.com/..."
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              type="submit" 
              className="bg-pmo-primary hover:bg-pmo-primary/90"
              disabled={isLoading || !carteira || !webhookUrl}
            >
              {isLoading ? (
                <>
                  <Send className="h-4 w-4 mr-2 animate-pulse" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Report
                </>
              )}
            </Button>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
