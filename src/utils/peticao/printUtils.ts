
/**
 * This file contains utilities for handling print functionality in petições
 */

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
      /* Estilo para o valor total */
      .valor-total {
        background-color: #1D2D5A !important;
        padding: 10px 20px !important;
        border-radius: 10px !important;
        text-align: center !important;
        font-family: Arial, sans-serif !important;
        margin-top: 20px !important;
        color: #FFFFFF !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .titulo {
        display: block !important;
        font-size: 14px !important;
        font-weight: bold !important;
        color: #FFFFFF !important;
        text-transform: uppercase !important;
      }
      .valor {
        display: block !important;
        font-size: 22px !important;
        font-weight: bold !important;
        color: #FFFFFF !important;
        margin-top: 5px !important;
      }
      /* Esconder o logo IusCalc e informações do footer */
      .iuscalc-logo, 
      .calculadora-footer,
      .iuscalc-container {
        display: none !important;
        visibility: hidden !important;
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

// Exportar como função independente para o index.ts
export const printDocument = (elementId?: string, asPDF = false) => {
  handlePrint();
};
