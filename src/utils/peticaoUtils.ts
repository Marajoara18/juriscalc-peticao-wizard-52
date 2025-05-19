
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

// Função para lidar com a impressão da petição ou cálculos
export const handlePrint = () => {
  // Usar um pequeno timeout para garantir que quaisquer alterações no DOM sejam aplicadas
  setTimeout(() => {
    window.print();
  }, 100);
};

// Função para preparar a página para impressão e mostrar diálogo de impressão
export const printDocument = (elementId?: string) => {
  // Se um ID for fornecido, ajuste o conteúdo visível para impressão
  if (elementId) {
    const contentToPrint = document.getElementById(elementId);
    if (contentToPrint) {
      // Armazenar o estilo original de todo o corpo
      const originalBodyContent = document.body.innerHTML;
      
      // Substituir temporariamente o conteúdo do corpo pelo conteúdo a ser impresso
      document.body.innerHTML = contentToPrint.innerHTML;
      
      // Imprimir
      window.print();
      
      // Restaurar o conteúdo original
      document.body.innerHTML = originalBodyContent;
      
      return;
    }
  }
  
  // Se nenhum ID for fornecido ou o elemento não for encontrado, imprimir normalmente
  window.print();
};
