
// Dados fictícios de índices de correção (em situação real, viriam de API)
export const INDICES = {
  // Últimos 12 meses (valores fictícios para exemplo)
  "IPCA-E": [
    { mes: "04/2024", indice: 0.36 },
    { mes: "03/2024", indice: 0.40 },
    { mes: "02/2024", indice: 0.83 },
    { mes: "01/2024", indice: 0.41 },
    { mes: "12/2023", indice: 0.56 },
    { mes: "11/2023", indice: 0.46 },
    { mes: "10/2023", indice: 0.28 },
    { mes: "09/2023", indice: 0.35 },
    { mes: "08/2023", indice: 0.23 },
    { mes: "07/2023", indice: 0.17 },
    { mes: "06/2023", indice: 0.11 },
    { mes: "05/2023", indice: 0.36 }
  ],
  "INPC": [
    { mes: "04/2024", indice: 0.38 },
    { mes: "03/2024", indice: 0.44 },
    { mes: "02/2024", indice: 0.81 },
    { mes: "01/2024", indice: 0.57 },
    { mes: "12/2023", indice: 0.55 },
    { mes: "11/2023", indice: 0.63 },
    { mes: "10/2023", indice: 0.12 },
    { mes: "09/2023", indice: 0.21 },
    { mes: "08/2023", indice: 0.20 },
    { mes: "07/2023", indice: 0.07 },
    { mes: "06/2023", indice: 0.18 },
    { mes: "05/2023", indice: 0.40 }
  ],
  "TR": [
    { mes: "04/2024", indice: 0.08 },
    { mes: "03/2024", indice: 0.08 },
    { mes: "02/2024", indice: 0.07 },
    { mes: "01/2024", indice: 0.06 },
    { mes: "12/2023", indice: 0.06 },
    { mes: "11/2023", indice: 0.05 },
    { mes: "10/2023", indice: 0.04 },
    { mes: "09/2023", indice: 0.04 },
    { mes: "08/2023", indice: 0.03 },
    { mes: "07/2023", indice: 0.03 },
    { mes: "06/2023", indice: 0.02 },
    { mes: "05/2023", indice: 0.02 }
  ]
};

export type TipoIndiceCorrecao = "IPCA-E" | "INPC" | "TR";
