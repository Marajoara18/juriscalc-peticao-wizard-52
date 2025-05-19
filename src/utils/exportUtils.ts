
import * as XLSX from 'xlsx';
import { toast } from "sonner";

type ExportData = {
  verbasRescisorias?: Record<string, any>;
  adicionais?: Record<string, any>;
  totalGeral?: number;
};

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
          background-color: #f9f9f9;
          padding: 10px;
          border: 1px solid #ddd;
          font-weight: bold;
          text-align: center;
          margin-top: 20px;
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

export const exportToExcel = (data: ExportData, fileName?: string) => {
  if (!data) {
    toast.error('Não há dados para exportar!');
    return;
  }

  try {
    // Prepare verbas rescisórias data
    const verbas = data.verbasRescisorias || {};
    const verbasRows = Object.entries(verbas)
      .filter(([key, value]) => 
        typeof value === 'number' && 
        value > 0 && 
        key !== 'total' && 
        key !== 'descontoAvisoPrevio'
      )
      .map(([key, value]) => {
        const descricao = 
          key === 'saldoSalario' ? 'Saldo de Salário' :
          key === 'avisoPrevia' ? 'Aviso Prévio' :
          key === 'decimoTerceiro' ? '13º Salário Proporcional' :
          key === 'ferias' ? 'Férias Proporcionais' :
          key === 'tercoConstitucional' ? '1/3 Constitucional' :
          key === 'fgts' ? 'FGTS sobre verbas' :
          key === 'multaFgts' ? 'Multa FGTS (40%)' : key;
        
        return { 
          "Tipo": "Verbas Rescisórias", 
          "Descrição": descricao, 
          "Valor": value 
        };
      });
    
    // Prepare adicionais data
    const adicionais = data.adicionais || {};
    const adicionaisRows = Object.entries(adicionais)
      .filter(([key, value]) => 
        typeof value === 'number' && 
        value > 0 && 
        key !== 'total'
      )
      .map(([key, value]) => {
        const descricao = 
          key === 'adicionalInsalubridade' ? 'Adicional de Insalubridade' :
          key === 'adicionalPericulosidade' ? 'Adicional de Periculosidade' :
          key === 'multa467' ? 'Multa Art. 467 da CLT' :
          key === 'multa477' ? 'Multa Art. 477 da CLT' :
          key === 'adicionalNoturno' ? 'Adicional Noturno' :
          key === 'horasExtras' ? 'Horas Extras' :
          key === 'feriasVencidas' ? 'Férias Vencidas' :
          key === 'indenizacaoDemissao' ? 'Indenização por Demissão' :
          key === 'valeTransporte' ? 'Vale Transporte' :
          key === 'valeAlimentacao' ? 'Vale Alimentação' :
          key === 'adicionalTransferencia' ? 'Adicional de Transferência' :
          key === 'descontosIndevidos' ? 'Descontos Indevidos' :
          key === 'diferencasSalariais' ? 'Diferenças Salariais' :
          key === 'customCalculo' ? 'Cálculo Personalizado' :
          key === 'seguroDesemprego' ? 'Seguro Desemprego' : key;
        
        return { 
          "Tipo": "Adicionais e Multas", 
          "Descrição": descricao, 
          "Valor": value 
        };
      });
    
    // Combine all data
    const exportData = [
      ...verbasRows,
      ...adicionaisRows,
    ];
    
    // Add the total value at the end
    if (data.totalGeral) {
      exportData.push({ 
        "Tipo": "Total", 
        "Descrição": "VALOR TOTAL DA RECLAMAÇÃO", 
        "Valor": data.totalGeral 
      });
    } else {
      // Calculate total from verbas and adicionais if totalGeral is not provided
      const totalVerbas = verbas.total || 0;
      const totalAdicionais = Object.values(adicionais).reduce((sum: number, val) => 
        sum + (typeof val === 'number' ? val : 0), 0);
      const calculatedTotal = totalVerbas + totalAdicionais - (verbas.descontoAvisoPrevio || 0);
      
      exportData.push({ 
        "Tipo": "Total", 
        "Descrição": "VALOR TOTAL DA RECLAMAÇÃO", 
        "Valor": calculatedTotal 
      });
    }

    // Create workbook and worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Cálculos");

    // Column widths
    const colWidths = [
      { wch: 20 }, // Tipo
      { wch: 30 }, // Descrição
      { wch: 15 }, // Valor
    ];
    ws['!cols'] = colWidths;

    // Generate file name with current date
    const date = new Date();
    const defaultFileName = `calculo_trabalhista_${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}.xlsx`;
    
    // Add header information with logo
    const nomeEscritorio = localStorage.getItem('userName') || 'IusCalc';
    
    // Insert a header row with information
    XLSX.utils.sheet_add_aoa(ws, [
      ['DEMONSTRATIVO DE CÁLCULOS TRABALHISTAS'],
      [`Cálculos: ${nomeEscritorio}`],
      [`Data: ${date.toLocaleDateString('pt-BR')}`],
      [''] // Empty row before the data
    ], { origin: 'A1' });
    
    // Make header cells merge and style for better appearance
    if (!ws['!merges']) ws['!merges'] = [];
    ws['!merges'].push(
      { s: {r: 0, c: 0}, e: {r: 0, c: 2} }, // Merge first row across all columns
      { s: {r: 1, c: 0}, e: {r: 1, c: 2} }, // Merge second row
      { s: {r: 2, c: 0}, e: {r: 2, c: 2} }  // Merge third row
    );
    
    // Add only "IusCalc" at the bottom of the Excel file (without website URL)
    XLSX.utils.sheet_add_aoa(ws, [
      ['IusCalc']
    ], { origin: { r: exportData.length + 5, c: 0 } });
    
    // Merge the IusCalc row
    ws['!merges'].push({ s: {r: exportData.length + 5, c: 0}, e: {r: exportData.length + 5, c: 2} });
    
    // Export to file
    XLSX.writeFile(wb, fileName || defaultFileName);
    toast.success('Demonstrativo de cálculos exportado em Excel com sucesso!');
    return true;
  } catch (error) {
    console.error('Erro ao exportar para Excel:', error);
    toast.error('Erro ao exportar para Excel. Tente novamente.');
    return false;
  }
};

// Enhanced function to share via WhatsApp with complete calculation details
export const shareViaWhatsApp = (text: string) => {
  const encodedText = encodeURIComponent(text);
  window.open(`https://wa.me/?text=${encodedText}`);
};

// Function to share via Email
export const shareViaEmail = (subject: string, body: string) => {
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);
  window.open(`mailto:?subject=${encodedSubject}&body=${encodedBody}`);
};

// New function to generate calculation text for sharing
export const generateCalculationText = (resultados: any) => {
  if (!resultados || (!resultados.verbasRescisorias && !resultados.adicionais)) {
    return "Nenhum cálculo disponível.";
  }

  // Format values as currency
  const formatValue = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  // Start building the text
  let text = "*Cálculos Trabalhistas - IusCalc*\n\n";
  text += "Demonstrativo de cálculos trabalhistas\n\n";

  // Add verbas rescisórias
  const verbas = resultados.verbasRescisorias || {};
  if (Object.keys(verbas).length > 0) {
    text += "*Verbas Rescisórias:*\n";
    
    if (verbas.saldoSalario > 0) text += `• Saldo de Salário: ${formatValue(verbas.saldoSalario)}\n`;
    if (verbas.avisoPrevia > 0) text += `• Aviso Prévio: ${formatValue(verbas.avisoPrevia)}\n`;
    if (verbas.decimoTerceiro > 0) text += `• 13º Salário Proporcional: ${formatValue(verbas.decimoTerceiro)}\n`;
    if (verbas.ferias > 0) text += `• Férias Proporcionais: ${formatValue(verbas.ferias)}\n`;
    if (verbas.tercoConstitucional > 0) text += `• 1/3 Constitucional: ${formatValue(verbas.tercoConstitucional)}\n`;
    if (verbas.fgts > 0) text += `• FGTS sobre verbas: ${formatValue(verbas.fgts)}\n`;
    if (verbas.multaFgts > 0) text += `• Multa FGTS (40%): ${formatValue(verbas.multaFgts)}\n`;
    
    if (verbas.descontoAvisoPrevio > 0) {
      text += `• Desconto Aviso Prévio: -${formatValue(verbas.descontoAvisoPrevio)}\n`;
    }
    
    text += `• *Subtotal Verbas Rescisórias: ${formatValue(verbas.total)}*\n\n`;
  }

  // Add adicionais
  const adicionais = resultados.adicionais || {};
  const adicionaisValidos = Object.entries(adicionais).filter(
    ([key, value]) => typeof value === 'number' && value > 0 && key !== 'total'
  );
  
  if (adicionaisValidos.length > 0) {
    text += "*Adicionais e Multas:*\n";
    
    for (const [key, value] of adicionaisValidos) {
      const label = 
        key === 'adicionalInsalubridade' ? 'Adicional de Insalubridade' :
        key === 'adicionalPericulosidade' ? 'Adicional de Periculosidade' :
        key === 'multa467' ? 'Multa Art. 467 CLT' :
        key === 'multa477' ? 'Multa Art. 477 CLT' :
        key === 'adicionalNoturno' ? 'Adicional Noturno' :
        key === 'horasExtras' ? 'Horas Extras' :
        key === 'feriasVencidas' ? 'Férias Vencidas' :
        key === 'indenizacaoDemissao' ? 'Indenização por Demissão' :
        key === 'valeTransporte' ? 'Vale Transporte' :
        key === 'valeAlimentacao' ? 'Vale Alimentação' :
        key === 'adicionalTransferencia' ? 'Adicional de Transferência' :
        key === 'descontosIndevidos' ? 'Descontos Indevidos' :
        key === 'diferencasSalariais' ? 'Diferenças Salariais' :
        key === 'customCalculo' ? 'Cálculo Personalizado' :
        key === 'seguroDesemprego' ? 'Seguro Desemprego' : key;
      
      text += `• ${label}: ${formatValue(value as number)}\n`;
    }
    
    // Calculate total adicionais
    const totalAdicionais = adicionaisValidos.reduce((sum, [_, value]) => sum + (value as number), 0);
    text += `• *Subtotal Adicionais: ${formatValue(totalAdicionais)}*\n\n`;
  }

  // Add total geral
  const totalGeral = resultados.totalGeral || verbas.total + 
    Object.values(adicionais).reduce((sum: number, value: any) => 
      sum + (typeof value === 'number' ? value : 0), 0
    );
  
  text += `*Valor total da reclamação: ${formatValue(totalGeral)}*\n\n`;
  
  // Add footer
  text += "Acesse o IusCalc para mais cálculos: https://iuscalc.com";
  
  return text;
};
