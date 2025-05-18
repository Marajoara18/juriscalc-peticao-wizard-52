
/**
 * Converts a numeric value to its text representation in Portuguese
 */
export const valorPorExtenso = (valor: number): string => {
  if (valor === 0) return "zero reais";
  
  const unidades = ["", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove"];
  const dezADezenove = ["dez", "onze", "doze", "treze", "quatorze", "quinze", "dezesseis", "dezessete", "dezoito", "dezenove"];
  const dezenas = ["", "", "vinte", "trinta", "quarenta", "cinquenta", "sessenta", "setenta", "oitenta", "noventa"];
  const centenas = ["", "cento", "duzentos", "trezentos", "quatrocentos", "quinhentos", "seiscentos", "setecentos", "oitocentos", "novecentos"];
  
  const valorInteiro = Math.floor(valor);
  const centavos = Math.round((valor - valorInteiro) * 100);
  
  let extenso = "";
  
  // Processando a parte inteira
  if (valorInteiro > 0) {
    if (valorInteiro === 1) {
      extenso = "um real";
    } else {
      // Processamento para milhões
      const milhoes = Math.floor(valorInteiro / 1000000);
      if (milhoes > 0) {
        if (milhoes === 1) {
          extenso += "um milhão";
        } else {
          extenso += converterNumero(milhoes) + " milhões";
        }
        if (valorInteiro % 1000000 !== 0) extenso += " e ";
      }
      
      // Processamento para milhares
      const restoDivisaoMilhoes = valorInteiro % 1000000;
      const milhares = Math.floor(restoDivisaoMilhoes / 1000);
      if (milhares > 0) {
        if (milhares === 1) {
          extenso += "mil";
        } else {
          extenso += converterNumero(milhares) + " mil";
        }
        if (valorInteiro % 1000 !== 0) extenso += " e ";
      }
      
      // Processamento para unidades
      const resto = valorInteiro % 1000;
      if (resto > 0) {
        extenso += converterNumero(resto);
      }
      
      extenso += " reais";
    }
  }
  
  // Processando os centavos
  if (centavos > 0) {
    if (extenso !== "") {
      extenso += " e ";
    }
    
    if (centavos === 1) {
      extenso += "um centavo";
    } else {
      extenso += converterNumero(centavos) + " centavos";
    }
  }
  
  return extenso;
  
  // Função auxiliar para converter números menores
  function converterNumero(num: number): string {
    if (num < 10) return unidades[num];
    if (num < 20) return dezADezenove[num - 10];
    if (num < 100) {
      const dezena = Math.floor(num / 10);
      const unidade = num % 10;
      return dezenas[dezena] + (unidade > 0 ? " e " + unidades[unidade] : "");
    }
    if (num < 1000) {
      const centena = Math.floor(num / 100);
      const resto = num % 100;
      
      // Caso especial para 100
      if (centena === 1 && resto === 0) return "cem";
      
      return centenas[centena] + (resto > 0 ? " e " + converterNumero(resto) : "");
    }
    return "";
  }
};
