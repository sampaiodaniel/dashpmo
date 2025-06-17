
import { supabase } from '@/integrations/supabase/client';
import { AreaResponsavel, CARTEIRAS } from '@/types/pmo';

export interface ResponsavelHierarchy {
  responsaveisHierarquia: string[];
  carteirasPermitidas: AreaResponsavel[];
}

export async function getResponsavelHierarchy(responsavelASA: string): Promise<ResponsavelHierarchy> {
  let responsaveisHierarquia: string[] = [];
  let carteirasPermitidas: AreaResponsavel[] = [];
  
  // Buscar responsável selecionado para entender a hierarquia
  const { data: responsavelSelecionado } = await supabase
    .from('responsaveis_asa')
    .select('*')
    .eq('nome', responsavelASA)
    .eq('ativo', true)
    .single();

  if (responsavelSelecionado) {
    responsaveisHierarquia = [responsavelSelecionado.nome];
    
    // Filtrar apenas pelas carteiras válidas do enum
    const carteirasValidas = (responsavelSelecionado.carteiras || [])
      .filter((c): c is AreaResponsavel => CARTEIRAS.includes(c as AreaResponsavel));
    carteirasPermitidas = carteirasValidas;
    
    // Se é um Head, incluir todos os superintendentes abaixo dele
    if (responsavelSelecionado.nivel === 'Head') {
      const { data: superintendentes } = await supabase
        .from('responsaveis_asa')
        .select('nome, carteiras')
        .eq('head_id', responsavelSelecionado.id)
        .eq('ativo', true);
      
      if (superintendentes) {
        responsaveisHierarquia.push(...superintendentes.map(s => s.nome));
        // Adicionar carteiras dos superintendentes
        superintendentes.forEach(s => {
          if (s.carteiras) {
            const carteirasValidasSuperintendente = s.carteiras
              .filter((c): c is AreaResponsavel => CARTEIRAS.includes(c as AreaResponsavel));
            carteirasPermitidas.push(...carteirasValidasSuperintendente);
          }
        });
      }
    }
  }

  return { responsaveisHierarquia, carteirasPermitidas };
}
