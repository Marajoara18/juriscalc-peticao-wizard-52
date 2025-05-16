
import { criarHTMLCalculosEmbutidos } from '@/utils/textUtils';

// Função para gerar o HTML dos cálculos para incorporar na petição
export const gerarHTMLCalculos = (calculosImportados: any) => {
  if (!calculosImportados) return null;

  const tempDiv = document.createElement('div');
  
  // Criar o componente TabelaCalculos temporariamente para capturar o HTML
  const root = document.createElement('div');
  root.id = 'temp-root';
  document.body.appendChild(root);
  
  try {
    // Renderiza a tabela de cálculos no elemento temporário
    const tempElement = document.getElementById('temp-root');
    if (tempElement) {
      tempElement.innerHTML = '';
      tempElement.style.display = 'none';
      
      // Criar manualmente o HTML da tabela com base nos dados
      const html = criarHTMLCalculosEmbutidos(calculosImportados);
      
      return html;
    }
    return null;
  } catch (error) {
    console.error('Erro ao gerar HTML dos cálculos:', error);
    return null;
  } finally {
    // Limpar o elemento temporário
    const tempElement = document.getElementById('temp-root');
    if (tempElement) {
      document.body.removeChild(tempElement);
    }
  }
};

// Função para lidar com a impressão da petição
export const handlePrint = () => {
  window.print();
};
