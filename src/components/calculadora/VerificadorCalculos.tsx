
import React, { useEffect } from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { Adicionais } from '@/types/calculadora';

interface VerificadorCalculosProps {
  setAdicionais: React.Dispatch<React.SetStateAction<Adicionais>>;
}

// Adicionais padrão para o teste automático
const adicionaisTeste: Adicionais = {
  calcularInsalubridade: true,
  grauInsalubridade: "medio",
  baseCalculoInsalubridade: "salario_minimo",
  calcularPericulosidade: false,
  percentualPericulosidade: "30",
  baseCalculoPericulosidade: "salario_base",
  calcularMulta467: true,
  calcularMulta477: true,
  calcularAdicionalNoturno: false,
  percentualAdicionalNoturno: "20",
  horasNoturnas: "",
  calcularHorasExtras: false,
  quantidadeHorasExtras: "",
  percentualHorasExtras: "50",
  calcularFeriasVencidas: false,
  periodosFeriasVencidas: "1",
  calcularIndenizacaoDemissao: false,
  valorIndenizacaoDemissao: "",
  calcularValeTransporte: false,
  valorDiarioVT: "",
  diasValeTransporte: "",
  calcularValeAlimentacao: false,
  valorDiarioVA: "",
  diasValeAlimentacao: "",
  calcularAdicionalTransferencia: false,
  percentualAdicionalTransferencia: "25",
  calcularDescontosIndevidos: false,
  valorDescontosIndevidos: "",
  calcularDiferencasSalariais: false,
  valorDiferencasSalariais: "",
  calcularCustom: false,
  calculosCustom: [],
  descricaoCustom: "",
  valorCustom: "",
  calcularSeguroDesemprego: false,
  ultimoSalario: "",
  mesesTrabalhadosUltimoEmprego: "",
  tempoContribuicaoINSS: "",
  calcularSalarioFamilia: false,
  quantidadeFilhos: "",
  calcularHonorariosAdvocaticios: false,
  percentualHonorariosAdvocaticios: "20",
  valorHonorariosAdvocaticios: "", // Adicionado campo faltante
  incluirTotalGeralHonorarios: false,
};

/**
 * Componente para verificar se os cálculos estão funcionando corretamente
 * ao instalar o sistema pela primeira vez
 */
const VerificadorCalculos: React.FC<VerificadorCalculosProps> = ({ setAdicionais }) => {
  // Hook para verificar o funcionamento dos cálculos automaticamente
  useEffect(() => {
    // Verificação automática desabilitada por padrão
    const AUTO_VERIFICAR = false;
    
    if (AUTO_VERIFICAR) {
      console.log("Verificando cálculos...");
      
      // Configurar os adicionais para o teste
      setAdicionais(adicionaisTeste);
      
      // O cálculo deve ser acionado manualmente pelo usuário
      console.log("Adicionais configurados. Clique em Calcular para testar.");
    }
  }, [setAdicionais]);
  
  return (
    <Alert className="bg-blue-50 border-blue-200 mb-4">
      <div className="flex items-start">
        <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
        <AlertDescription className="text-sm text-gray-700">
          Preencha os dados do contrato e configure os adicionais desejados.
          Depois clique em <span className="font-semibold">Calcular</span> para obter os resultados.
        </AlertDescription>
      </div>
    </Alert>
  );
};

export default VerificadorCalculos;
