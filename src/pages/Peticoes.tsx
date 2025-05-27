
import React from 'react';
import PeticoesManager from '@/components/peticoes/PeticoesManager';

/**
 * Página principal de Petições
 * Esta página foi refatorada para usar componentes menores
 * e mais focados para melhor manutenção.
 */
const Peticoes = () => {
  console.log('PETICOES: Renderizando PeticoesManager para usuário autenticado');
  return <PeticoesManager />;
};

export default Peticoes;
