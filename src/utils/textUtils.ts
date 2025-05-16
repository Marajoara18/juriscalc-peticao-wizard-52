
/**
 * Converts a numeric value to its text representation in Portuguese
 */
export const valorPorExtenso = (valor: number): string => {
  if (valor === 0) return "zero reais";
  
  const unidades = ["", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove"];
  const dezADezenove = ["dez", "onze", "doze", "treze", "quatorze", "quinze", "dezesseis", "dezessete", "dezoito", "dezenove"];
  const dezenas = ["", "", "vinte", "trinta", "quarenta", "cinquenta", "sessenta", "setenta", "oitenta", "noventa"];
  const centenas = ["", "cento", "duzentos", "trezentos", "quatrocentos", "quinhentos", "seiscentos", "setecentos", "oitocentos", "novecentos"];
  
  const valorInteiro = Math.floor(valor);
  const centavos = Math.round((valor - valorInteiro) * 100);
  
  let extenso = "";
  
  // Processando a parte inteira
  if (valorInteiro > 0) {
    if (valorInteiro === 1) {
      extenso = "um real";
    } else {
      // Processamento para milhões
      const milhoes = Math.floor(valorInteiro / 1000000);
      if (milhoes > 0) {
        if (milhoes === 1) {
          extenso += "um milhão";
        } else {
          extenso += converterNumero(milhoes) + " milhões";
        }
        if (valorInteiro % 1000000 !== 0) extenso += " e ";
      }
      
      // Processamento para milhares
      const restoDivisaoMilhoes = valorInteiro % 1000000;
      const milhares = Math.floor(restoDivisaoMilhoes / 1000);
      if (milhares > 0) {
        if (milhares === 1) {
          extenso += "mil";
        } else {
          extenso += converterNumero(milhares) + " mil";
        }
        if (valorInteiro % 1000 !== 0) extenso += " e ";
      }
      
      // Processamento para unidades
      const resto = valorInteiro % 1000;
      if (resto > 0) {
        extenso += converterNumero(resto);
      }
      
      extenso += " reais";
    }
  }
  
  // Processando os centavos
  if (centavos > 0) {
    if (extenso !== "") {
      extenso += " e ";
    }
    
    if (centavos === 1) {
      extenso += "um centavo";
    } else {
      extenso += converterNumero(centavos) + " centavos";
    }
  }
  
  return extenso;
  
  // Função auxiliar para converter números menores
  function converterNumero(num: number): string {
    if (num < 10) return unidades[num];
    if (num < 20) return dezADezenove[num - 10];
    if (num < 100) {
      const dezena = Math.floor(num / 10);
      const unidade = num % 10;
      return dezenas[dezena] + (unidade > 0 ? " e " + unidades[unidade] : "");
    }
    if (num < 1000) {
      const centena = Math.floor(num / 100);
      const resto = num % 100;
      
      // Caso especial para 100
      if (centena === 1 && resto === 0) return "cem";
      
      return centenas[centena] + (resto > 0 ? " e " + converterNumero(resto) : "");
    }
    return "";
  }
};

/**
 * Creates HTML content for embedded calculations
 */
export const criarHTMLCalculosEmbutidos = (calculos: any) => {
  if (!calculos) return '';

  // Importar dados necessários
  const logoUrl = localStorage.getItem('userLogoUrl');
  const nomeEscritorio = calculos?.nomeEscritorio || localStorage.getItem('userName') || 'JurisCalc Trabalhista';
  const dataCalculo = calculos.timestamp ? 
    new Date(calculos.timestamp).toLocaleDateString('pt-BR') : 
    new Date().toLocaleDateString('pt-BR');
  const nomeCalculo = calculos.nome ? `${calculos.nome} - ` : '';
  
  // Garantir que os objetos existam para evitar erros
  const verbasRescisorias = calculos.verbasRescisorias || {
    saldoSalario: 0,
    avisoPrevia: 0,
    decimoTerceiro: 0,
    ferias: 0,
    tercoConstitucional: 0,
    fgts: 0,
    multaFgts: 0,
    total: 0
  };
  
  const adicionais = calculos.adicionais || {
    adicionalInsalubridade: 0,
    adicionalPericulosidade: 0,
    multa467: 0,
    multa477: 0,
    adicionalNoturno: 0,
    horasExtras: 0,
    feriasVencidas: 0,
    indenizacaoDemissao: 0,
    valeTransporte: 0,
    valeAlimentacao: 0,
    adicionalTransferencia: 0,
    descontosIndevidos: 0,
    diferencasSalariais: 0,
    customCalculo: 0,
    seguroDesemprego: 0
  };
  
  // Calcular o total geral
  const totalGeral = calculos.totalGeral || 0;
  
  // Formatação de valores
  const formatarValor = (valor: number): string => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };
  
  // Construir HTML manualmente
  const html = `
    <div class="calculadora-tabela" style="margin: 1.5rem 0; page-break-inside: avoid;">
      <div style="text-align: center; margin-bottom: 1rem;">
        ${logoUrl ? `<img src="${logoUrl}" alt="Logo" style="height: 3rem; margin: 0.5rem auto;" />` : ''}
        <h3 style="font-size: 1.25rem; font-weight: bold; border-bottom: 2px solid navy; padding-bottom: 0.5rem;">DEMONSTRATIVO DE CÁLCULOS TRABALHISTAS</h3>
        ${nomeCalculo ? `<p style="font-weight: 500; font-size: 0.875rem;">${nomeCalculo}</p>` : ''}
        <p style="font-size: 0.75rem; color: #666; margin-bottom: 0.5rem;">Gerado em: ${dataCalculo}</p>
      </div>
      
      <div style="margin-top: 1rem;">
        ${renderVerbasRescisoriasHTML(verbasRescisorias)}
        ${renderAdicionaisHTML(adicionais)}
        
        <div style="background-color: #0f172a; padding: 0.5rem; border-radius: 0.375rem; color: white; margin-top: 0.5rem;">
          <div style="text-align: center;">
            <p style="font-size: 0.75rem; font-weight: 500;">VALOR TOTAL DA RECLAMAÇÃO</p>
            <p style="font-size: 1rem; font-weight: 700;">${formatarValor(totalGeral)}</p>
          </div>
        </div>
        
        <div style="text-align: center; font-size: 0.75rem; color: #6b7280; border-top: 1px solid #e5e7eb; margin-top: 0.5rem; padding-top: 0.25rem;">
          <p>Cálculos: <span style="font-weight: 500;">${nomeEscritorio}</span></p>
        </div>
      </div>
    </div>
  `;

  function renderVerbasRescisoriasHTML(verbas: any) {
    // Filtrar verbas com valor > 0
    const itens = [
      { descricao: 'Saldo de Salário', valor: verbas.saldoSalario },
      { descricao: 'Aviso Prévio', valor: verbas.avisoPrevia },
      { descricao: '13º Salário Proporcional', valor: verbas.decimoTerceiro },
      { descricao: 'Férias Proporcionais', valor: verbas.ferias },
      { descricao: '1/3 Constitucional', valor: verbas.tercoConstitucional },
      { descricao: 'FGTS sobre verbas', valor: verbas.fgts },
      { descricao: 'Multa FGTS (40%)', valor: verbas.multaFgts },
    ].filter(item => item.valor > 0);

    if (itens.length === 0) return '';

    return `
      <div style="margin-bottom: 1rem;">
        <h4 style="font-size: 0.875rem; font-weight: 500; margin-bottom: 0.25rem; color: navy;">1. VERBAS RESCISÓRIAS</h4>
        <table style="width: 100%; border-collapse: collapse; font-size: 0.75rem;">
          <thead>
            <tr style="background-color: #f9fafb;">
              <th style="border: 1px solid #d1d5db; padding: 0.25rem; text-align: left; width: 66.666667%;">Descrição</th>
              <th style="border: 1px solid #d1d5db; padding: 0.25rem; text-align: right; width: 33.333333%;">Valor</th>
            </tr>
          </thead>
          <tbody>
            ${itens.map(item => `
              <tr>
                <td style="border: 1px solid #d1d5db; padding: 0.25rem;">${item.descricao}</td>
                <td style="border: 1px solid #d1d5db; padding: 0.25rem; text-align: right;">${formatarValor(item.valor)}</td>
              </tr>
            `).join('')}
            <tr style="font-weight: bold; background-color: #f9fafb;">
              <td style="border: 1px solid #d1d5db; padding: 0.25rem;">Total Verbas Rescisórias</td>
              <td style="border: 1px solid #d1d5db; padding: 0.25rem; text-align: right;">${formatarValor(verbas.total)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  }
  
  function renderAdicionaisHTML(adicionais: any) {
    // Calcular total de adicionais
    const totalAdicionais = 
      adicionais.adicionalInsalubridade +
      adicionais.adicionalPericulosidade +
      adicionais.multa467 +
      adicionais.multa477 +
      adicionais.adicionalNoturno +
      adicionais.horasExtras +
      adicionais.feriasVencidas +
      adicionais.indenizacaoDemissao +
      adicionais.valeTransporte +
      adicionais.valeAlimentacao +
      adicionais.adicionalTransferencia +
      adicionais.descontosIndevidos +
      adicionais.diferencasSalariais +
      adicionais.customCalculo +
      adicionais.seguroDesemprego;
    
    // Filtrar adicionais com valor > 0
    const itens = [
      { descricao: 'Adicional de Insalubridade', valor: adicionais.adicionalInsalubridade },
      { descricao: 'Adicional de Periculosidade', valor: adicionais.adicionalPericulosidade },
      { descricao: 'Multa Art. 467 da CLT', valor: adicionais.multa467 },
      { descricao: 'Multa Art. 477 da CLT', valor: adicionais.multa477 },
      { descricao: 'Adicional Noturno', valor: adicionais.adicionalNoturno },
      { descricao: 'Horas Extras', valor: adicionais.horasExtras },
      { descricao: 'Férias Vencidas (+ 1/3)', valor: adicionais.feriasVencidas },
      { descricao: 'Indenização por Demissão Indevida', valor: adicionais.indenizacaoDemissao },
      { descricao: 'Vale Transporte Não Pago', valor: adicionais.valeTransporte },
      { descricao: 'Vale Alimentação Não Pago', valor: adicionais.valeAlimentacao },
      { descricao: 'Adicional de Transferência', valor: adicionais.adicionalTransferencia },
      { descricao: 'Descontos Indevidos', valor: adicionais.descontosIndevidos },
      { descricao: 'Diferenças Salariais', valor: adicionais.diferencasSalariais },
      { descricao: 'Seguro Desemprego', valor: adicionais.seguroDesemprego },
    ].filter(item => item.valor > 0);

    if (itens.length === 0) return '';

    return `
      <div style="margin-bottom: 1rem;">
        <h4 style="font-size: 0.875rem; font-weight: 500; margin-bottom: 0.25rem; color: navy;">2. ADICIONAIS E MULTAS</h4>
        <table style="width: 100%; border-collapse: collapse; font-size: 0.75rem;">
          <thead>
            <tr style="background-color: #f9fafb;">
              <th style="border: 1px solid #d1d5db; padding: 0.25rem; text-align: left; width: 66.666667%;">Descrição</th>
              <th style="border: 1px solid #d1d5db; padding: 0.25rem; text-align: right; width: 33.333333%;">Valor</th>
            </tr>
          </thead>
          <tbody>
            ${itens.map(item => `
              <tr>
                <td style="border: 1px solid #d1d5db; padding: 0.25rem;">${item.descricao}</td>
                <td style="border: 1px solid #d1d5db; padding: 0.25rem; text-align: right;">${formatarValor(item.valor)}</td>
              </tr>
            `).join('')}
            <tr style="font-weight: bold; background-color: #f9fafb;">
              <td style="border: 1px solid #d1d5db; padding: 0.25rem;">Total Adicionais</td>
              <td style="border: 1px solid #d1d5db; padding: 0.25rem; text-align: right;">${formatarValor(totalAdicionais)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  }
  
  return html;
};
