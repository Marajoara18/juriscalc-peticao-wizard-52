
/**
 * Formata um valor numérico para moeda brasileira (R$)
 */
export const formatarMoeda = (valor: number): string => {
  return new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  }).format(valor);
};

/**
 * Formata uma data no padrão brasileiro (dd/mm/aaaa)
 */
export const formatarData = (data: string): string => {
  if (!data) return '';
  
  const partes = data.split('-');
  if (partes.length !== 3) return data;
  
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
};

/**
 * Calcula a diferença em meses entre duas datas
 */
export const calcularMesesEntreDatas = (dataInicial: string, dataFinal: string): number => {
  if (!dataInicial || !dataFinal) return 0;
  
  const inicio = new Date(dataInicial);
  const fim = new Date(dataFinal);
  
  return (fim.getFullYear() - inicio.getFullYear()) * 12 + (fim.getMonth() - inicio.getMonth());
};

/**
 * Calcula a diferença em dias entre duas datas
 */
export const calcularDiasEntreDatas = (dataInicial: string, dataFinal: string): number => {
  if (!dataInicial || !dataFinal) return 0;
  
  const inicio = new Date(dataInicial);
  const fim = new Date(dataFinal);
  
  const diferencaEmMS = fim.getTime() - inicio.getTime();
  return Math.floor(diferencaEmMS / (1000 * 60 * 60 * 24));
};

/**
 * Formata um número com duas casas decimais
 */
export const formatarDecimal = (valor: number): string => {
  return valor.toFixed(2);
};
