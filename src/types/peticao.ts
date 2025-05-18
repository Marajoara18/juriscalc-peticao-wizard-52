
export interface PeticaoFormData {
  id: number;
  titulo: string;
  descricao: string;
  reclamante: string;
  reclamado: string;
  status: string;
  data: string;
  calculosAdicionais: {
    feriasVencidas: boolean;
    indenizacaoDemissao: boolean;
    valeTransporte: boolean;
    valeAlimentacao: boolean;
    adicionalTransferencia: boolean;
    descontosIndevidos: boolean;
    diferencasSalariais: boolean;
    salarioFamilia: boolean;
    custom: {
      enabled: boolean;
      descricao: string;
      formula: string;
    };
  };
  calculosTabela?: any;
  htmlCalculos?: string;
}

export interface PeticaoProps {
  modelo?: {
    id: number;
    titulo: string;
    descricao: string;
    categoria: string;
  };
  peticao?: any;
  onVoltar: () => void;
  onSave: (data: any) => void;
}
