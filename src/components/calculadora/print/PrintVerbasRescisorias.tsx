
import React from 'react';
import { formatarMoeda } from '@/utils/formatters';

interface PrintVerbasRescisoriasProps {
  verbas: any;
}

const PrintVerbasRescisorias: React.FC<PrintVerbasRescisoriasProps> = ({ verbas }) => {
  if (!verbas) return null;
  
  return (
    <div className="mb-4">
      <h4 className="text-md font-bold mb-2">Verbas Rescisórias</h4>
      <div className="space-y-2">
        {verbas.saldoSalario > 0 && (
          <div className="flex justify-between">
            <span>Saldo de Salário</span>
            <span>{formatarMoeda(verbas.saldoSalario)}</span>
          </div>
        )}
        {verbas.avisoPrevia > 0 && (
          <div className="flex justify-between">
            <span>Aviso Prévio</span>
            <span>{formatarMoeda(verbas.avisoPrevia)}</span>
          </div>
        )}
        {verbas.decimoTerceiroAvisoPrevia > 0 && (
          <div className="flex justify-between">
            <span className="pl-4 italic text-blue-600">13º salário proporcional ao aviso prévio</span>
            <span>{formatarMoeda(verbas.decimoTerceiroAvisoPrevia)}</span>
          </div>
        )}
        {verbas.feriasAvisoPrevia > 0 && (
          <div className="flex justify-between">
            <span className="pl-4 italic text-blue-600">Férias proporcionais ao aviso prévio</span>
            <span>{formatarMoeda(verbas.feriasAvisoPrevia)}</span>
          </div>
        )}
        {verbas.decimoTerceiro > 0 && (
          <div className="flex justify-between">
            <span>13º Salário Proporcional</span>
            <span>{formatarMoeda(verbas.decimoTerceiro)}</span>
          </div>
        )}
        {verbas.ferias > 0 && (
          <div className="flex justify-between">
            <span>Férias Proporcionais</span>
            <span>{formatarMoeda(verbas.ferias)}</span>
          </div>
        )}
        {verbas.tercoConstitucional > 0 && (
          <div className="flex justify-between">
            <span>1/3 Constitucional</span>
            <span>{formatarMoeda(verbas.tercoConstitucional)}</span>
          </div>
        )}
        {verbas.fgts > 0 && (
          <div className="flex justify-between">
            <span>FGTS sobre verbas</span>
            <span>{formatarMoeda(verbas.fgts)}</span>
          </div>
        )}
        {verbas.multaFgts > 0 && (
          <div className="flex justify-between">
            <span>Multa FGTS (40%)</span>
            <span>{formatarMoeda(verbas.multaFgts)}</span>
          </div>
        )}
        {verbas.descontoAvisoPrevio > 0 && (
          <div className="flex justify-between text-red-600">
            <span>Desconto Aviso Prévio não cumprido</span>
            <span>- {formatarMoeda(verbas.descontoAvisoPrevio)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold border-t pt-1">
          <span>Total Verbas Rescisórias</span>
          <span>{formatarMoeda((verbas.total || 0) - (verbas.descontoAvisoPrevio || 0))}</span>
        </div>
      </div>
    </div>
  );
};

export default PrintVerbasRescisorias;
