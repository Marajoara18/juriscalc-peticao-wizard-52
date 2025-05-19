
import { renderVerbasRescisoriasHTML } from './verbasRescisoriasHtml';
import { renderAdicionaisHTML } from './adicionaisHtml';
import { formatarValor } from '../formatters/htmlFormatters';

/**
 * Creates HTML content for embedded calculations
 */
export const criarHTMLCalculosEmbutidos = (calculos: any) => {
  if (!calculos) return '';

  // Importar dados necessários
  const logoUrl = localStorage.getItem('userLogoUrl');
  const nomeEscritorio = calculos?.nomeEscritorio || localStorage.getItem('userName') || 'IusCalc';
  const dataCalculo = calculos.timestamp ? 
    new Date(calculos.timestamp).toLocaleDateString('pt-BR') : 
    new Date().toLocaleDateString('pt-BR');
  
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
  
  // Construir HTML manualmente com melhor formatação para impressão
  const html = `
    <div class="calculadora-tabela" style="margin: 1.5rem 0; page-break-inside: avoid;">
      <div style="text-align: center; margin-bottom: 1rem;">
        ${logoUrl ? `<img src="${logoUrl}" alt="Logo" style="height: 3rem; max-width: 200px; margin: 0.5rem auto;" />` : ''}
        <h3 style="font-size: 1.25rem; font-weight: bold; border-bottom: 2px solid #0f172a; padding-bottom: 0.5rem; color: #0f172a;">DEMONSTRATIVO DE CÁLCULOS TRABALHISTAS</h3>
        <p style="font-size: 0.75rem; color: #666; margin-bottom: 0.5rem;">Gerado em: ${dataCalculo}</p>
      </div>
      
      <div style="margin-top: 1rem;">
        ${renderVerbasRescisoriasHTML(verbasRescisorias)}
        ${renderAdicionaisHTML(adicionais, calculos)}
        
        <div class="valor-total" style="background-color: #1D2D5A; padding: 10px 20px; border-radius: 10px; text-align: center; font-family: Arial, sans-serif; margin-top: 20px; color: #FFFFFF;">
          <span class="titulo" style="display: block; font-size: 14px; font-weight: bold; color: #FFFFFF; text-transform: uppercase;">VALOR TOTAL DA RECLAMAÇÃO</span>
          <span class="valor" style="display: block; font-size: 22px; font-weight: bold; color: #FFFFFF; margin-top: 5px;">${formatarValor(totalGeral)}</span>
        </div>
        
        <div class="calculadora-footer" style="text-align: center; font-size: 0.75rem; color: #6b7280; border-top: 1px solid #e5e7eb; margin-top: 1rem; padding-top: 0.5rem;">
          <p>Cálculos: <span style="font-weight: 500;">${nomeEscritorio}</span></p>
        </div>
      </div>
    </div>
  `;

  return html;
};
