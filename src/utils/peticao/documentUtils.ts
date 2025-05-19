
/**
 * This file contains utilities for document generation and export
 */

import { handlePrint } from './printUtils';

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
            /* Estilos para o valor total */
            .valor-total {
              background-color: #1D2D5A;
              padding: 10px 20px;
              border-radius: 10px;
              text-align: center;
              font-family: Arial, sans-serif;
              margin-top: 20px;
              color: #FFFFFF;
            }
            .titulo {
              display: block;
              font-size: 14px;
              font-weight: bold;
              color: #FFFFFF;
              text-transform: uppercase;
            }
            .valor {
              display: block;
              font-size: 22px;
              font-weight: bold;
              color: #FFFFFF;
              margin-top: 5px;
            }
            @media print {
              .valor-total {
                background-color: #1D2D5A !important;
                color: #FFFFFF !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              .titulo, .valor {
                color: #FFFFFF !important;
              }
            }
            /* Esconder o logo IusCalc e informações do footer */
            .iuscalc-logo, 
            .calculadora-footer,
            .iuscalc-container {
              display: none !important;
              visibility: hidden !important;
            }
          </style>
        </head>
        <body>
          ${contentToPrint.innerHTML}
          <script>
            // Auto-print e fechar
            setTimeout(() => {
              // Remover elementos com classe iuscalc-logo e calculadora-footer
              const elementsToRemove = document.querySelectorAll('.iuscalc-logo, .calculadora-footer, .iuscalc-container');
              elementsToRemove.forEach(element => {
                if (element && element.parentNode) {
                  element.parentNode.removeChild(element);
                }
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
