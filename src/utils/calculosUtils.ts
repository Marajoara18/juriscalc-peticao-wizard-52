
// Utility functions for handling calculation data

/**
 * Prepara os metadados dos cálculos (nome, data, escritório)
 */
export const prepararMetadados = (calculos: any) => {
  // Data da criação dos cálculos
  const dataCalculo = calculos.timestamp ? 
    new Date(calculos.timestamp).toLocaleDateString('pt-BR') : 
    new Date().toLocaleDateString('pt-BR');

  // Verifica se há um nome para os cálculos
  const nomeCalculo = calculos.nome ? `${calculos.nome} - ` : '';

  // Obter o logo da empresa do usuário atual
  const logoUrl = localStorage.getItem('userLogoUrl');
  
  // Obter o nome do escritório do usuário atual ou dos cálculos
  const nomeEscritorio = calculos?.nomeEscritorio || localStorage.getItem('userName') || 'JurisCalc Trabalhista';

  return {
    dataCalculo,
    nomeCalculo,
    logoUrl,
    nomeEscritorio
  };
};

/**
 * Verifica se os cálculos são válidos para exibição
 */
export const calculosValidos = (calculos: any): boolean => {
  if (!calculos) return false;
  return !!(calculos.verbasRescisorias || calculos.adicionais);
};
