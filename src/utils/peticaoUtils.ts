
import { criarHTMLCalculosEmbutidos } from '@/utils/textUtils';

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

// Função para lidar com a impressão da petição ou cálculos
export const handlePrint = () => {
  // Usar um pequeno timeout para garantir que quaisquer alterações no DOM sejam aplicadas
  setTimeout(() => {
    window.print();
  }, 100);
};
