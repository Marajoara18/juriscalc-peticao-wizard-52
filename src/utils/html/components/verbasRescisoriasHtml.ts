
import { formatarValor } from '../formatters/htmlFormatters';

/**
 * Creates HTML content for the verbas rescisórias table
 */
export function renderVerbasRescisoriasHTML(verbas: any) {
  // Filtrar verbas principais
  const itens = [
    { descricao: 'Saldo de Salário', valor: verbas.saldoSalario },
    { descricao: 'Aviso Prévio Indenizado', valor: verbas.avisoPrevia },
  ].filter(item => item.valor > 0);

  // Valores proporcionais ao aviso prévio
  const valoresAvisoPrevia = [];
  
  if (verbas.decimoTerceiroAvisoPrevia > 0) {
    valoresAvisoPrevia.push({
      descricao: '13º Proporcional do Aviso Prévio',
      valor: verbas.decimoTerceiroAvisoPrevia
    });
  }
  
  if (verbas.feriasAvisoPrevia > 0) {
    valoresAvisoPrevia.push({
      descricao: 'Férias Indenizadas do Aviso Prévio + 1/3',
      valor: verbas.feriasAvisoPrevia
    });
  }

  // Valores proporcionais gerais
  const valoresGerais = [];
  
  if (verbas.decimoTerceiro > 0) {
    valoresGerais.push({
      descricao: '13º Salário Proporcional',
      valor: verbas.decimoTerceiro
    });
  }
  
  if (verbas.ferias > 0) {
    valoresGerais.push({
      descricao: 'Férias Proporcionais',
      valor: verbas.ferias
    });
  }

  // Outros valores
  const outrosValores = [
    { descricao: '1/3 Constitucional', valor: verbas.tercoConstitucional },
    { descricao: 'FGTS sobre verbas', valor: verbas.fgts },
    { descricao: 'Multa FGTS (40%)', valor: verbas.multaFgts },
  ].filter(item => item.valor > 0);

  if (itens.length === 0 && valoresAvisoPrevia.length === 0 && valoresGerais.length === 0 && outrosValores.length === 0) return '';

  const totalFinal = (verbas.total || 0) - (verbas.descontoAvisoPrevio || 0);

  return `
    <div style="margin-bottom: 1.5rem; page-break-inside: avoid;">
      <h4 style="font-size: 1rem; font-weight: 600; margin-bottom: 0.5rem; color: #0f172a; border-left: 3px solid #0f172a; padding-left: 0.5rem;">1. VERBAS RESCISÓRIAS</h4>
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
          ${valoresAvisoPrevia.map(item => `
            <tr>
              <td style="border: 1px solid #d1d5db; padding: 0.5rem;">${item.descricao}</td>
              <td style="border: 1px solid #d1d5db; padding: 0.5rem; text-align: right;">${formatarValor(item.valor)}</td>
            </tr>
          `).join('')}
          ${valoresGerais.map(item => `
            <tr>
              <td style="border: 1px solid #d1d5db; padding: 0.5rem;">${item.descricao}</td>
              <td style="border: 1px solid #d1d5db; padding: 0.5rem; text-align: right;">${formatarValor(item.valor)}</td>
            </tr>
          `).join('')}
          ${outrosValores.map(item => `
            <tr>
              <td style="border: 1px solid #d1d5db; padding: 0.5rem;">${item.descricao}</td>
              <td style="border: 1px solid #d1d5db; padding: 0.5rem; text-align: right;">${formatarValor(item.valor)}</td>
            </tr>
          `).join('')}
          ${verbas.descontoAvisoPrevio > 0 ? `
            <tr style="color: #dc2626;">
              <td style="border: 1px solid #d1d5db; padding: 0.5rem;">Desconto Aviso Prévio não cumprido</td>
              <td style="border: 1px solid #d1d5db; padding: 0.5rem; text-align: right;">- ${formatarValor(verbas.descontoAvisoPrevio)}</td>
            </tr>
          ` : ''}
          <tr style="font-weight: bold; background-color: #f9fafb;">
            <td style="border: 1px solid #d1d5db; padding: 0.5rem;">Total Verbas Rescisórias</td>
            <td style="border: 1px solid #d1d5db; padding: 0.5rem; text-align: right;">${formatarValor(totalFinal)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
}
