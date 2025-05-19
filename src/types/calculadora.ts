
export type RescisionValues = {
  saldoSalario: number;
  avisoPrevia: number;
  descontoAvisoPrevio: number; // Added for tracking prior notice deduction
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
  seguroDesemprego: number;
  salarioFamilia: number;
  honorariosAdvocaticios: number;
};

export type DadosContrato = {
  dataAdmissao: string;
  dataDemissao: string;
  salarioBase: string;
  tipoRescisao: 'sem_justa_causa' | 'pedido_demissao' | 'justa_causa' | 'rescisao_indireta';
  diasTrabalhados: string;
  mesesTrabalhados: string;
  aviso_previo_cumprido: boolean; // Indicates if notice period was fulfilled
  // Removed ferias_vencidas field
};

export type CustomCalculo = {
  id: string;
  descricao: string;
  valor: string;
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
  calculosCustom: CustomCalculo[];
  descricaoCustom: string;
  valorCustom: string;
  calcularSeguroDesemprego: boolean;
  tipoTrabalhador?: 'padrao' | 'domestico' | 'pescador';
  salarioUltimos3Meses?: 'sim' | 'nao';
  ultimoSalario: string;
  salarioMes1?: string;
  salarioMes2?: string;
  mesesTrabalhadosUltimoEmprego: string;
  tempoContribuicaoINSS: string;
  calcularSalarioFamilia: boolean;
  quantidadeFilhos: string;
  calcularHonorariosAdvocaticios: boolean;
  percentualHonorariosAdvocaticios: string;
  valorHonorariosAdvocaticios: string; // Adicionado para armazenar o valor exato
  incluirTotalGeralHonorarios: boolean;
};

export type Resultados = {
  verbasRescisorias: RescisionValues;
  adicionais: AdditionalValues;
};
