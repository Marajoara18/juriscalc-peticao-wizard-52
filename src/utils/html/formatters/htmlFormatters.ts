
/**
 * Formatters specifically for HTML rendering
 */

/**
 * Formats a numeric value to Brazilian currency (R$) for HTML display
 */
export const formatarValor = (valor: number): string => {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
};
