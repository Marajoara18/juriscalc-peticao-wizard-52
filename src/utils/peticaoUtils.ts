
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

// Função para lidar com a impressão apenas da petição
export const handlePrint = () => {
  // Cria um estilo que vai esconder tudo exceto o conteúdo a ser impresso
  const style = document.createElement('style');
  style.id = 'print-style';
  style.innerHTML = `
    @media print {
      body * {
        visibility: hidden;
      }
      .print\\:block, .print\\:block * {
        visibility: visible;
      }
      .print\\:hidden {
        display: none !important;
      }
      /* Esconder toasts, notificações, etc */
      [id^='sonner-'], .sonner-toast-container {
        display: none !important;
      }
      header, footer, button, .card-header, .cursor-pointer {
        display: none !important;
      }
      /* Ajuste para impressão adequada */
      .print\\:block {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        padding: 20px;
      }
    }
  `;
  
  document.head.appendChild(style);
  
  // Dá um pequeno timeout para garantir que o estilo foi aplicado
  setTimeout(() => {
    window.print();
    
    // Remove o estilo após imprimir
    setTimeout(() => {
      const styleElement = document.getElementById('print-style');
      if (styleElement) {
        styleElement.remove();
      }
    }, 100);
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
