
import { toast } from "sonner";

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

// Generate calculation text for sharing
export const generateCalculationText = (resultados: any) => {
  if (!resultados || (!resultados.verbasRescisorias && !resultados.adicionais)) {
    return "Nenhum cálculo disponível.";
  }

  // Format values as currency
  const formatValue = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  // Start building the text
  let text = "*Cálculos Trabalhistas*\n\n";
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

  // Add total geral with special formatting
  const totalGeral = resultados.totalGeral || verbas.total + 
    Object.values(adicionais).reduce((sum: number, value: any) => 
      sum + (typeof value === 'number' ? value : 0), 0
    );
  
  // Formatted with special emphasis
  text += "*VALOR TOTAL DA RECLAMAÇÃO*\n";
  text += `*${formatValue(totalGeral)}*\n\n`;
  
  return text;
};
