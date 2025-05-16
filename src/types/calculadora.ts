
export type RescisionValues = {
  saldoSalario: number;
  avisoPrevia: number;
  decimoTerceiro: number;
  ferias: number;
  tercoConstitucional: number;
  fgts: number;
  multaFgts: number;
  total: number;
};

export type AdditionalValues = {
  adicionalInsalubridade: number;
  adicionalPericulosidade: number;
  multa467: number;
  multa477: number;
  adicionalNoturno: number;
  horasExtras: number;
  feriasVencidas: number;
  indenizacaoDemissao: number;
  valeTransporte: number;
  valeAlimentacao: number;
  adicionalTransferencia: number;
  descontosIndevidos: number;
  diferencasSalariais: number;
  customCalculo: number;
};

export type DadosContrato = {
  dataAdmissao: string;
  dataDemissao: string;
  salarioBase: string;
  tipoRescisao: 'sem_justa_causa' | 'pedido_demissao' | 'justa_causa' | 'rescisao_indireta';
  diasTrabalhados: string;
  mesesTrabalhados: string;
};

export type Adicionais = {
  calcularInsalubridade: boolean;
  grauInsalubridade: 'minimo' | 'medio' | 'maximo';
  baseCalculoInsalubridade: 'salario_minimo' | 'salario_base';
  calcularPericulosidade: boolean;
  percentualPericulosidade: string;
  baseCalculoPericulosidade: 'salario_base' | 'salario_minimo';
  calcularMulta467: boolean;
  calcularMulta477: boolean;
  calcularAdicionalNoturno: boolean;
  percentualAdicionalNoturno: string;
  horasNoturnas: string;
  calcularHorasExtras: boolean;
  quantidadeHorasExtras: string;
  percentualHorasExtras: string;
  calcularFeriasVencidas: boolean;
  periodosFeriasVencidas: string;
  calcularIndenizacaoDemissao: boolean;
  valorIndenizacaoDemissao: string;
  calcularValeTransporte: boolean;
  valorDiarioVT: string;
  diasValeTransporte: string;
  calcularValeAlimentacao: boolean;
  valorDiarioVA: string;
  diasValeAlimentacao: string;
  calcularAdicionalTransferencia: boolean;
  percentualAdicionalTransferencia: string;
  calcularDescontosIndevidos: boolean;
  valorDescontosIndevidos: string;
  calcularDiferencasSalariais: boolean;
  valorDiferencasSalariais: string;
  calcularCustom: boolean;
  descricaoCustom: string;
  valorCustom: string;
};

export type Resultados = {
  verbasRescisorias: RescisionValues;
  adicionais: AdditionalValues;
};
