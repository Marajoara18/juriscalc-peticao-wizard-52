
import { formatarValor } from '../formatters/htmlFormatters';

/**
 * Creates HTML content for the verbas rescisórias table
 */
export function renderVerbasRescisoriasHTML(verbas: any) {
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
