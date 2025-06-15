
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useUsuariosOperations } from '@/hooks/useUsuarios';
import { Usuario } from '@/types/pmo';

const usuarioSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres').optional(),
  tipo_usuario: z.enum(['GP', 'Responsavel', 'Admin']),
  areas_acesso: z.array(z.string()),
  ativo: z.boolean(),
});

type UsuarioFormData = z.infer<typeof usuarioSchema>;

interface UsuarioModalProps {
  aberto: boolean;
  onFechar: () => void;
  usuario: Usuario | null;
}

export function UsuarioModal({ aberto, onFechar, usuario }: UsuarioModalProps) {
  const { createUsuario, updateUsuario } = useUsuariosOperations();
  const [areasDisponiveis] = useState(['Área 1', 'Área 2', 'Área 3']);

  const form = useForm<UsuarioFormData>({
    resolver: zodResolver(usuarioSchema),
    defaultValues: {
      nome: '',
      email: '',
      senha: '',
      tipo_usuario: 'GP',
      areas_acesso: [],
      ativo: true,
    },
  });

  useEffect(() => {
    if (usuario) {
      form.reset({
        nome: usuario.nome,
        email: usuario.email,
        senha: '', // Não preenchemos a senha na edição
        tipo_usuario: usuario.tipo_usuario,
        areas_acesso: usuario.areas_acesso || [],
        ativo: usuario.ativo,
      });
    } else {
      form.reset({
        nome: '',
        email: '',
        senha: '',
        tipo_usuario: 'GP',
        areas_acesso: [],
        ativo: true,
      });
    }
  }, [usuario, form]);

  const onSubmit = async (data: UsuarioFormData) => {
    try {
      if (usuario) {
        // Edição - construir objeto com tipos corretos
        const updateData = {
          id: usuario.id,
          nome: data.nome,
          email: data.email,
          tipo_usuario: data.tipo_usuario,
          areas_acesso: data.areas_acesso,
          ativo: data.ativo,
          ...(data.senha && { senha: data.senha }) // Só inclui senha se foi preenchida
        };
        await updateUsuario.mutateAsync(updateData);
      } else {
        // Criação - senha é obrigatória
        if (!data.senha) {
          form.setError('senha', { message: 'Senha é obrigatória para novos usuários' });
          return;
        }
        const createData = {
          nome: data.nome,
          email: data.email,
          senha: data.senha,
          tipo_usuario: data.tipo_usuario,
          areas_acesso: data.areas_acesso,
          ativo: data.ativo,
        };
        await createUsuario.mutateAsync(createData);
      }
      onFechar();
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
    }
  };

  const handleAreaChange = (area: string, checked: boolean) => {
    const currentAreas = form.getValues('areas_acesso');
    if (checked) {
      form.setValue('areas_acesso', [...currentAreas, area]);
    } else {
      form.setValue('areas_acesso', currentAreas.filter(a => a !== area));
    }
  };

  return (
    <Dialog open={aberto} onOpenChange={onFechar}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {usuario ? 'Editar Usuário' : 'Novo Usuário'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="email@empresa.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="senha"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {usuario ? 'Nova Senha (deixe vazio para manter atual)' : 'Senha'}
                  </FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Senha" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tipo_usuario"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Usuário</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="GP">GP (Gerente de Projeto)</SelectItem>
                      <SelectItem value="Responsavel">Responsável</SelectItem>
                      <SelectItem value="Admin">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <Label>Áreas de Acesso</Label>
              <div className="space-y-2">
                {areasDisponiveis.map((area) => (
                  <div key={area} className="flex items-center space-x-2">
                    <Checkbox
                      id={area}
                      checked={form.watch('areas_acesso').includes(area)}
                      onCheckedChange={(checked) => handleAreaChange(area, checked as boolean)}
                    />
                    <Label htmlFor={area}>{area}</Label>
                  </div>
                ))}
              </div>
            </div>

            <FormField
              control={form.control}
              name="ativo"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Usuário ativo</FormLabel>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onFechar}>
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={createUsuario.isPending || updateUsuario.isPending}
              >
                {createUsuario.isPending || updateUsuario.isPending ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
