
import React from 'react';
import { formatarMoeda } from '@/utils/formatters';

interface ResultadosPrintableProps {
  resultados: any;
}

const ResultadosPrintable: React.FC<ResultadosPrintableProps> = ({ resultados }) => {
  // Não renderizar nada se não houver resultados
  if (!resultados || (!resultados.verbasRescisorias && !resultados.adicionais)) {
    return null;
  }

  // Dados necessários
  const verbas = resultados.verbasRescisorias || {};
  const adicionais = resultados.adicionais || {};
  
  // Filtrar valores maiores que zero para não mostrar zeros
  const verbasAMostrar = Object.entries(verbas).filter(([key, value]) => 
    typeof value === 'number' && value > 0 && key !== 'total' && key !== 'descontoAvisoPrevio'
  );
  
  const adicionaisAMostrar = Object.entries(adicionais).filter(([key, value]) => 
    typeof value === 'number' && value > 0 && key !== 'total'
  );
  
  // Calcular total dos adicionais
  const totalAdicionais = adicionaisAMostrar.reduce((acc, [_, value]) => acc + parseFloat(value as string), 0);
  
  // Verificar se há desconto de aviso prévio a mostrar
  const temDescontoAvisoPrevio = typeof verbas.descontoAvisoPrevio === 'number' && verbas.descontoAvisoPrevio > 0;
  
  // Calcular o subtotal
  const subTotal = verbas.total + totalAdicionais - (verbas.descontoAvisoPrevio || 0);
  
  // Total geral
  const totalGeral = subTotal;
  
  // Nome do escritório (se disponível)
  const nomeEscritorio = localStorage.getItem('userName') || '';

  return (
    <div id="print-results-only" style={{display: 'none'}}>
      <h1>Resultados do Cálculo</h1>
      
      {/* Verbas Rescisórias */}
      <div className="section">
        <h2>Verbas Rescisórias</h2>
        <div className="result-items">
          {verbasAMostrar.map(([chave, valor]) => (
            <div key={chave} className="result-item">
              <span className="result-label">
                {chave === 'saldoSalario' && 'Saldo de Salário'}
                {chave === 'avisoPrevia' && 'Aviso Prévio'}
                {chave === 'decimoTerceiro' && '13º Salário Proporcional'}
                {chave === 'ferias' && 'Férias Proporcionais'}
                {chave === 'tercoConstitucional' && '1/3 Constitucional'}
                {chave === 'fgts' && 'FGTS sobre verbas'}
                {chave === 'multaFgts' && 'Multa FGTS (40%)'}
              </span>
              <span className="result-value">{formatarMoeda(valor as number)}</span>
            </div>
          ))}
          
          {/* Mostrar desconto do aviso prévio se for aplicável */}
          {temDescontoAvisoPrevio && (
            <div className="result-item">
              <span className="result-label">Desconto Aviso Prévio não cumprido</span>
              <span className="result-value">- {formatarMoeda(verbas.descontoAvisoPrevio as number)}</span>
            </div>
          )}

          <div className="result-item total">
            <span className="result-label">Total Verbas Rescisórias</span>
            <span className="result-value">{formatarMoeda(verbas.total)}</span>
          </div>
        </div>
      </div>
      
      {/* Adicionais - mostrar apenas se tiver algum */}
      {adicionaisAMostrar.length > 0 && (
        <div className="section">
          <h2>Adicionais e Multas</h2>
          <div className="result-items">
            {adicionaisAMostrar.map(([chave, valor]) => (
              <div key={chave} className="result-item">
                <span className="result-label">
                  {chave === 'adicionalInsalubridade' && 'Adicional de Insalubridade'}
                  {chave === 'adicionalPericulosidade' && 'Adicional de Periculosidade'}
                  {chave === 'multa467' && 'Multa do Art. 467 CLT'}
                  {chave === 'multa477' && 'Multa do Art. 477 CLT'}
                  {chave === 'adicionalNoturno' && 'Adicional Noturno'}
                  {chave === 'horasExtras' && 'Horas Extras'}
                  {chave === 'feriasVencidas' && 'Férias Vencidas'}
                  {chave === 'indenizacaoDemissao' && 'Indenização por Demissão'}
                  {chave === 'valeTransporte' && 'Vale Transporte'}
                  {chave === 'valeAlimentacao' && 'Vale Alimentação'}
                  {chave === 'adicionalTransferencia' && 'Adicional de Transferência'}
                  {chave === 'descontosIndevidos' && 'Descontos Indevidos'}
                  {chave === 'diferencasSalariais' && 'Diferenças Salariais'}
                  {chave === 'customCalculo' && 'Cálculo Personalizado'}
                  {chave === 'seguroDesemprego' && 'Seguro Desemprego'}
                  {chave === 'salarioFamilia' && 'Salário Família'}
                </span>
                <span className="result-value">{formatarMoeda(valor as number)}</span>
              </div>
            ))}
            <div className="result-item total">
              <span className="result-label">Total Adicionais</span>
              <span className="result-value">{formatarMoeda(totalAdicionais)}</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Mostrar subtotal */}
      <div className="result-item">
        <span className="result-label">
          Subtotal {temDescontoAvisoPrevio ? "(com desconto aviso prévio)" : ""} 
        </span>
        <span className="result-value">{formatarMoeda(subTotal)}</span>
      </div>
      
      {/* Total Geral */}
      <div className="grand-total">
        <div>VALOR TOTAL DA RECLAMAÇÃO</div>
        <div>{formatarMoeda(totalGeral)}</div>
      </div>
      
      {nomeEscritorio && (
        <div className="footer">
          <p>Cálculos: {nomeEscritorio}</p>
        </div>
      )}
    </div>
  );
};

export default ResultadosPrintable;
