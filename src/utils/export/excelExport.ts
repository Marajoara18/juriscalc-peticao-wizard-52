
import * as XLSX from 'xlsx';
import { toast } from "sonner";

type ExportData = {
  verbasRescisorias?: Record<string, any>;
  adicionais?: Record<string, any>;
  totalGeral?: number;
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
