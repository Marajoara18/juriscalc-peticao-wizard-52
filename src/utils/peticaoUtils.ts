
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
        visibility: hidden !important;
        display: none !important;
      }
      .print\\:block, .print\\:block * {
        visibility: visible !important;
        display: block !important;
      }
      .print\\:hidden {
        display: none !important;
      }
      /* Esconder toasts, notificações, etc */
      [id^='sonner-'], .sonner-toast-container {
        display: none !important;
        visibility: hidden !important;
      }
      header, footer, button, .card-header, .cursor-pointer {
        display: none !important;
        visibility: hidden !important;
      }
      /* Ajuste para impressão adequada */
      .print\\:block {
        position: absolute !important;
        left: 0 !important;
        top: 0 !important;
        width: 100% !important;
        padding: 20px !important;
      }
      /* Garantir que apenas a previsão da petição seja visível */
      .peticao-preview-content {
        visibility: visible !important;
        display: block !important;
        position: absolute !important;
        left: 0 !important;
        top: 0 !important;
        width: 100% !important;
      }
      .peticao-preview-content * {
        visibility: visible !important;
        display: block !important;
      }
      /* Melhorar a formatação das tabelas na impressão */
      table {
        width: 100% !important;
        border-collapse: collapse !important;
        margin: 15px 0 !important;
      }
      th, td {
        border: 1px solid #ddd !important;
        padding: 8px !important;
        text-align: left !important;
      }
      th {
        background-color: #f9f9f9 !important;
        font-weight: bold !important;
      }
      .tabela-calculos {
        page-break-inside: avoid !important;
        margin-top: 20px !important;
        margin-bottom: 20px !important;
      }
      /* Estilo para títulos e seções */
      h1, h2, h3, h4 {
        page-break-after: avoid !important;
      }
      h1 {
        font-size: 22px !important;
        text-align: center !important;
        margin-bottom: 20px !important;
      }
      h3 {
        font-size: 16px !important;
        margin-top: 15px !important;
        color: #0f172a !important;
      }
      /* Preservar quebras de linha no texto */
      .whitespace-pre-wrap {
        white-space: pre-wrap !important;
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
export const printDocument = (elementId?: string, asPDF: boolean = false) => {
  // Se um ID for fornecido, ajuste o conteúdo visível para impressão
  if (elementId) {
    const contentToPrint = document.getElementById(elementId);
    if (contentToPrint) {
      // Criar um novo documento para impressão
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert('Por favor, permita pop-ups para esta página para imprimir a petição.');
        return;
      }
      
      // Título para o documento (varia de acordo com o tipo de exportação)
      const documentTitle = asPDF ? 'Petição (PDF)' : 'Petição';
      
      // Escrever apenas o conteúdo da petição no novo documento
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${documentTitle}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              padding: 20px;
              max-width: 800px;
              margin: 0 auto;
              color: #333;
            }
            @media print {
              body {
                padding: 0;
              }
            }
            /* Estilos para tabelas */
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 15px 0;
              font-size: 0.95em;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
              font-weight: bold;
            }
            .tabela-calculos {
              page-break-inside: avoid;
              margin: 20px 0;
            }
            /* Títulos e seções */
            h1, h2, h3, h4 {
              page-break-after: avoid;
              color: #0f172a;
            }
            h1 {
              font-size: 22px;
              text-align: center;
              margin-bottom: 20px;
              border-bottom: 1px solid #eee;
              padding-bottom: 10px;
            }
            h3 {
              font-size: 16px;
              margin-top: 20px;
              margin-bottom: 10px;
              border-bottom: 1px solid #f5f5f5;
              padding-bottom: 5px;
            }
            /* Cabeçalhos das tabelas */
            .font-medium {
              font-weight: 500;
            }
            /* Total e valores importantes */
            .font-bold {
              font-weight: 700;
            }
            .text-right {
              text-align: right;
            }
            /* Manter quebras de linha */
            .whitespace-pre-wrap {
              white-space: pre-wrap;
            }
            /* Footer das tabelas de cálculos */
            .calculadora-tabela .mt-5 {
              margin-top: 1.25rem;
              text-align: center;
              font-size: 0.75rem;
              color: #6b7280;
            }
            /* Preservar estilos da tabela de cálculos */
            .bg-juriscalc-navy {
              background-color: #0f172a !important;
              color: white !important;
            }
            /* Estilo para o valor total da reclamação */
            .valor-total-reclamacao {
              font-weight: bold !important;
              color: #000 !important;
            }
            /* Esconder o logo IusCalc e informações do footer */
            .iuscalc-logo, .calculadora-footer {
              display: none !important;
            }
          </style>
        </head>
        <body>
          ${contentToPrint.innerHTML}
          <script>
            // Auto-print e fechar
            setTimeout(() => {
              // Remover elementos com classe iuscalc-logo
              const logosToRemove = document.querySelectorAll('.iuscalc-logo, .calculadora-footer');
              logosToRemove.forEach(logo => logo.remove());
              
              // Adicionar classe ao elemento de valor total
              const totalElements = document.querySelectorAll('.calculadora-tabela div[style*="background-color: #f9fafb"]');
              totalElements.forEach(el => {
                el.classList.add('valor-total-reclamacao');
              });
              
              window.print();
              ${asPDF ? '' : 'setTimeout(() => window.close(), 500);'}
            }, 500);
          </script>
        </body>
        </html>
      `);
      
      printWindow.document.close();
      return;
    }
  }
  
  // Se nenhum ID for fornecido ou o elemento não for encontrado, usar o método padrão
  handlePrint();
};
