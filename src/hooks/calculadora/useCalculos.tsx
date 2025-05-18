
import { DadosContrato, Adicionais, Resultados } from '@/types/calculadora';
import { calcularVerbasRescisorias } from '@/utils/calculadora/verbasRescisoriasUtils';
import { calcularAdicionais } from '@/utils/calculadora/adicionaisUtils';
import { validarDadosContrato, notificarCalculoRealizado, notificarErroCalculo, expandirAcordeoes } from '@/utils/calculadora/validacaoUtils';

export const useCalculos = (
  dadosContrato: DadosContrato,
  adicionais: Adicionais,
  setResultados: React.Dispatch<React.SetStateAction<Resultados>>
) => {
  // Função para calcular os resultados
  const calcularResultados = () => {
    // Validação dos dados do contrato
    if (!validarDadosContrato(dadosContrato)) {
      return;
    }

    try {
      // Extrair valores numéricos
      const salarioBase = parseFloat(dadosContrato.salarioBase) || 0;
      const diasTrabalhados = parseInt(dadosContrato.diasTrabalhados) || 0;
      const mesesTrabalhados = parseInt(dadosContrato.mesesTrabalhados) || 0;
      
      console.log("Calculando com:", { salarioBase, diasTrabalhados, mesesTrabalhados });

      // Cálculo das verbas rescisórias
      const verbasRescisorias = calcularVerbasRescisorias(dadosContrato);
      
      // Cálculo dos adicionais
      const adicionaisCalculados = calcularAdicionais(
        salarioBase, 
        adicionais, 
        verbasRescisorias.saldoSalario, 
        verbasRescisorias.avisoPrevia, 
        verbasRescisorias.decimoTerceiro, 
        verbasRescisorias.ferias, 
        verbasRescisorias.tercoConstitucional
      );

      // Atualiza o estado com os resultados calculados
      setResultados({
        verbasRescisorias,
        adicionais: adicionaisCalculados
      });

      // Notifica o usuário e expande os acordeões
      notificarCalculoRealizado();
      expandirAcordeoes();
      
      console.log("Cálculos realizados:", { 
        verbasRescisorias,
        adicionais: adicionaisCalculados
      });
    } catch (error) {
      notificarErroCalculo(error);
    }
  };

  return { calcularResultados };
};
