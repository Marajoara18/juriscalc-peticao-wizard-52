
import { toast } from "sonner";

// Modified to properly use print functionality with a focused content
export const exportToPDF = () => {
  // Create a dedicated print window for just the results
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    toast.error('Não foi possível abrir a janela de impressão. Verifique se o bloqueador de pop-ups está desativado.');
    return;
  }

  // Get calculation results from the hidden print-only div
  const calculosDiv = document.getElementById('print-results-only');
  if (!calculosDiv) {
    toast.error('Não foi possível encontrar os resultados para impressão.');
    return;
  }

  // Get logo URL from localStorage if available
  const logoUrl = localStorage.getItem('userLogoUrl');
  const nomeEscritorio = localStorage.getItem('userName') || 'IusCalc';

  // Write the focused content to the print window
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Resultados do Cálculo</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
          border-bottom: 1px solid #ddd;
          padding-bottom: 10px;
        }
        .logo {
          max-height: 60px;
          max-width: 200px;
          margin-bottom: 10px;
        }
        h1 {
          font-size: 18px;
          text-align: center;
          margin-bottom: 20px;
        }
        .result-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        .result-label {
          font-weight: normal;
        }
        .result-value {
          font-weight: normal;
        }
        .total {
          font-weight: bold;
          border-top: 1px solid #ddd;
          padding-top: 8px;
          margin-top: 8px;
        }
        .section {
          margin-bottom: 20px;
        }
        .grand-total {
          background-color: #ffffff;
          padding: 10px;
          border: 1px solid #ddd;
          font-weight: bold;
          text-align: center;
          margin-top: 20px;
        }
        .grand-total div:first-child {
          text-transform: uppercase;
          font-size: 14px;
          margin-bottom: 5px;
        }
        .grand-total div:last-child {
          font-size: 16px;
        }
        .footer {
          margin-top: 30px;
          font-size: 12px;
          text-align: center;
          color: #666;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .iuscalc-logo {
          height: 20px;
          margin-right: 5px;
        }
        .iuscalc-container {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      </style>
    </head>
    <body>
      <div class="header">
        ${logoUrl ? `<img src="${logoUrl}" alt="Logo" class="logo" />` : ''}
        <h1>DEMONSTRATIVO DE CÁLCULOS TRABALHISTAS</h1>
      </div>
      ${calculosDiv.innerHTML}
      <div class="footer">
        <p>Cálculos: ${nomeEscritorio}</p>
        <div class="iuscalc-container">
          <img src="/lovable-uploads/caf683c7-0cb3-4ef4-8e5f-5de22f996b8a.png" alt="Logo IusCalc" class="iuscalc-logo" />
          <span style="font-weight: bold; font-size: 0.75rem; color: #0f172a; font-family: serif;">IusCalc</span>
        </div>
      </div>
      <script>
        setTimeout(() => {
          window.print();
          setTimeout(() => window.close(), 500);
        }, 500);
      </script>
    </body>
    </html>
  `);

  printWindow.document.close();
  toast.success('Demonstrativo de cálculos enviado para impressão como PDF!');
};
