
import React from 'react';

interface PrintHeaderProps {
  dadosContrato?: any;
}

const PrintHeader: React.FC<PrintHeaderProps> = ({ dadosContrato }) => {
  if (!dadosContrato) return null;
  
  return (
    <div className="mb-6 border rounded-md p-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium mb-1">Data de Admissão</h4>
          <p className="border rounded-md p-2">{dadosContrato.dataAdmissao || '-'}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium mb-1">Data de Demissão</h4>
          <p className="border rounded-md p-2">{dadosContrato.dataDemissao || '-'}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium mb-1">Salário Base (R$)</h4>
          <p className="border rounded-md p-2">{parseFloat(dadosContrato.salarioBase) || 0}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium mb-1">Tipo de Rescisão</h4>
          <p className="border rounded-md p-2">
            {dadosContrato.tipoRescisao === 'sem_justa_causa' ? 'Demissão sem Justa Causa' : 
             dadosContrato.tipoRescisao === 'pedido_demissao' ? 'Pedido de Demissão' : 
             dadosContrato.tipoRescisao === 'justa_causa' ? 'Demissão por Justa Causa' :
             dadosContrato.tipoRescisao === 'rescisao_indireta' ? 'Rescisão Indireta' : 
             'Não especificado'}
          </p>
        </div>
        <div>
          <h4 className="text-sm font-medium mb-1">Dias Trabalhados no último mês</h4>
          <p className="border rounded-md p-2">{dadosContrato.diasTrabalhados || '0'}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium mb-1">Total de Meses Trabalhados</h4>
          <p className="border rounded-md p-2">{dadosContrato.mesesTrabalhados || '0'}</p>
        </div>
      </div>
      <div className="mt-4">
        <label className="flex items-center">
          <input 
            type="checkbox" 
            checked={dadosContrato.avisoPrevioCumprido || false} 
            readOnly 
            className="mr-2" 
          />
          <span>Aviso Prévio Cumprido</span>
        </label>
      </div>
    </div>
  );
};

export default PrintHeader;
