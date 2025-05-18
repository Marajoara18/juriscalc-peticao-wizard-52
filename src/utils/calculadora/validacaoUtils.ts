
/**
 * Validation utilities for calculator
 */
import { DadosContrato } from "@/types/calculadora";
import { toast } from "@/components/ui/use-toast";

/**
 * Validates if the contract data is complete and valid
 * @param dadosContrato Contract data to validate
 * @returns Boolean indicating if data is valid
 */
export const validarDadosContrato = (dadosContrato: DadosContrato): boolean => {
  // Verificar datas de admissão e demissão
  if (!dadosContrato.dataAdmissao || !dadosContrato.dataDemissao) {
    toast({
      title: "Dados incompletos",
      description: "Por favor, informe as datas de admissão e demissão.",
      variant: "destructive"
    });
    return false;
  }

  // Verificar salário base
  if (!dadosContrato.salarioBase || parseFloat(dadosContrato.salarioBase) <= 0) {
    toast({
      title: "Dados incompletos",
      description: "Por favor, informe um salário base válido.",
      variant: "destructive"
    });
    return false;
  }

  return true;
};

/**
 * Shows a successful calculation toast
 */
export const notificarCalculoRealizado = () => {
  toast({
    title: "Cálculos realizados",
    description: "Os valores foram calculados com sucesso.",
  });
};

/**
 * Shows an error toast for calculation errors
 * @param error Error object or message
 */
export const notificarErroCalculo = (error: any) => {
  console.error("Erro ao calcular resultados:", error);
  toast({
    title: "Erro ao calcular",
    description: "Ocorreu um erro nos cálculos. Verifique os dados informados.",
    variant: "destructive"
  });
};

/**
 * Expand result accordions to show the calculated values
 */
export const expandirAcordeoes = () => {
  document.querySelectorAll('[data-state="closed"]').forEach((accordion) => {
    const button = accordion.querySelector('button');
    if (button) button.click();
  });
};
