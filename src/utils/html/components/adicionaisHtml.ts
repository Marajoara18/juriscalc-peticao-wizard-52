
import { formatarValor } from '../formatters/htmlFormatters';
import { getCustomCalculoDescription } from "../../calculadora/descricaoUtils";

/**
 * Creates HTML content for the adicionais e multas table
 */
export function renderAdicionaisHTML(adicionais: any, calculos: any) {
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
  
  // Add custom calculation with proper description
  if (adicionais.customCalculo > 0) {
    itens.push({
      descricao: getCustomCalculoDescription(calculos),
      valor: adicionais.customCalculo
    });
  }

  if (itens.length === 0) return '';

  return `
    <div style="margin-bottom: 1.5rem; page-break-inside: avoid;">
      <h4 style="font-size: 1rem; font-weight: 600; margin-bottom: 0.5rem; color: #0f172a; border-left: 3px solid #0f172a; padding-left: 0.5rem;">2. ADICIONAIS E MULTAS</h4>
      <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
        <thead>
          <tr style="background-color: #f9fafb;">
            <th style="border: 1px solid #d1d5db; padding: 0.5rem; text-align: left; width: 66.666667%;">Descrição</th>
            <th style="border: 1px solid #d1d5db; padding: 0.5rem; text-align: right; width: 33.333333%;">Valor</th>
          </tr>
        </thead>
        <tbody>
          ${itens.map(item => `
            <tr>
              <td style="border: 1px solid #d1d5db; padding: 0.5rem;">${item.descricao}</td>
              <td style="border: 1px solid #d1d5db; padding: 0.5rem; text-align: right;">${formatarValor(item.valor)}</td>
            </tr>
          `).join('')}
          <tr style="font-weight: bold; background-color: #f9fafb;">
            <td style="border: 1px solid #d1d5db; padding: 0.5rem;">Total Adicionais</td>
            <td style="border: 1px solid #d1d5db; padding: 0.5rem; text-align: right;">${formatarValor(totalAdicionais)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
}
