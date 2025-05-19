
/**
 * This file contains utilities for handling calculations in petições
 */
import { criarHTMLCalculosEmbutidos } from '@/utils/html/calculosHTML';

// Função para gerar o HTML dos cálculos para incorporar na petição
export const gerarHTMLCalculos = (calculosImportados: any) => {
  if (!calculosImportados) return null;

  try {
    // Criar manualmente o HTML da tabela com base nos dados
    const html = criarHTMLCalculosEmbutidos(calculosImportados);
    return html;
  } catch (error) {
    console.error('Erro ao gerar HTML dos cálculos:', error);
    return null;
  }
};
