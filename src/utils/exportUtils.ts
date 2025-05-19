
import * as XLSX from 'xlsx';
import { toast } from "sonner";
import { handlePrint } from './peticaoUtils';

type ExportData = {
  verbasRescisorias?: Record<string, any>;
  adicionais?: Record<string, any>;
  totalGeral?: number;
};

export const exportToPDF = () => {
  handlePrint();
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
      { 
        "Tipo": "Total", 
        "Descrição": "VALOR TOTAL DA RECLAMAÇÃO", 
        "Valor": data.totalGeral || 0 
      }
    ];

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

// Função para compartilhar via WhatsApp
export const shareViaWhatsApp = (text: string) => {
  const encodedText = encodeURIComponent(text);
  window.open(`https://wa.me/?text=${encodedText}`);
};

// Função para compartilhar via Email
export const shareViaEmail = (subject: string, body: string) => {
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);
  window.open(`mailto:?subject=${encodedSubject}&body=${encodedBody}`);
};
