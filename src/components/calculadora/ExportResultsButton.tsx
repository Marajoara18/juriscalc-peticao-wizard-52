
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Download, FilePdf, FileExcel } from "lucide-react";
import { handlePrint } from '@/utils/peticaoUtils';
import { toast } from "sonner";
import * as XLSX from 'xlsx';

interface ExportResultsButtonProps {
  disabled?: boolean;
  resultados?: any;
}

const ExportResultsButton: React.FC<ExportResultsButtonProps> = ({ 
  disabled = false, 
  resultados 
}) => {
  const [open, setOpen] = useState(false);

  const handleExportPDF = () => {
    handlePrint();
    toast.success('Demonstrativo de cálculos enviado para impressão como PDF!');
    setOpen(false);
  };

  const handleExportExcel = () => {
    if (!resultados) {
      toast.error('Não há dados para exportar!');
      return;
    }

    try {
      // Prepare verbas rescisórias data
      const verbas = resultados.verbasRescisorias || {};
      const verbasRows = Object.entries(verbas)
        .filter(([key, value]) => 
          typeof value === 'number' && 
          value > 0 && 
          key !== 'total' && 
          key !== 'descontoAvisoPrevio'
        )
        .map(([key, value]) => {
          const descricao = 
            key === 'saldoSalario' ? 'Saldo de Salário' :
            key === 'avisoPrevia' ? 'Aviso Prévio' :
            key === 'decimoTerceiro' ? '13º Salário Proporcional' :
            key === 'ferias' ? 'Férias Proporcionais' :
            key === 'tercoConstitucional' ? '1/3 Constitucional' :
            key === 'fgts' ? 'FGTS sobre verbas' :
            key === 'multaFgts' ? 'Multa FGTS (40%)' : key;
          
          return { 
            "Tipo": "Verbas Rescisórias", 
            "Descrição": descricao, 
            "Valor": value 
          };
        });
      
      // Prepare adicionais data
      const adicionais = resultados.adicionais || {};
      const adicionaisRows = Object.entries(adicionais)
        .filter(([key, value]) => 
          typeof value === 'number' && 
          value > 0 && 
          key !== 'total'
        )
        .map(([key, value]) => {
          const descricao = 
            key === 'adicionalInsalubridade' ? 'Adicional de Insalubridade' :
            key === 'adicionalPericulosidade' ? 'Adicional de Periculosidade' :
            key === 'multa467' ? 'Multa Art. 467 da CLT' :
            key === 'multa477' ? 'Multa Art. 477 da CLT' :
            key === 'adicionalNoturno' ? 'Adicional Noturno' :
            key === 'horasExtras' ? 'Horas Extras' :
            key === 'feriasVencidas' ? 'Férias Vencidas' :
            key === 'indenizacaoDemissao' ? 'Indenização por Demissão' :
            key === 'valeTransporte' ? 'Vale Transporte' :
            key === 'valeAlimentacao' ? 'Vale Alimentação' :
            key === 'adicionalTransferencia' ? 'Adicional de Transferência' :
            key === 'descontosIndevidos' ? 'Descontos Indevidos' :
            key === 'diferencasSalariais' ? 'Diferenças Salariais' :
            key === 'customCalculo' ? 'Cálculo Personalizado' :
            key === 'seguroDesemprego' ? 'Seguro Desemprego' : key;
          
          return { 
            "Tipo": "Adicionais e Multas", 
            "Descrição": descricao, 
            "Valor": value 
          };
        });
      
      // Combine all data
      const data = [
        ...verbasRows,
        ...adicionaisRows,
        { 
          "Tipo": "Total", 
          "Descrição": "VALOR TOTAL DA RECLAMAÇÃO", 
          "Valor": resultados.totalGeral || 0 
        }
      ];

      // Create workbook and worksheet
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Cálculos");

      // Column widths
      const colWidths = [
        { wch: 20 }, // Tipo
        { wch: 30 }, // Descrição
        { wch: 15 }, // Valor
      ];
      ws['!cols'] = colWidths;

      // Generate file name with current date
      const date = new Date();
      const fileName = `calculo_trabalhista_${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}.xlsx`;
      
      // Export to file
      XLSX.writeFile(wb, fileName);
      toast.success('Demonstrativo de cálculos exportado em Excel com sucesso!');
      setOpen(false);
    } catch (error) {
      console.error('Erro ao exportar para Excel:', error);
      toast.error('Erro ao exportar para Excel. Tente novamente.');
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          Exportar Resultados
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleExportPDF}>
          <FilePdf className="h-4 w-4 mr-2" />
          <span>Exportar como PDF</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportExcel}>
          <FileExcel className="h-4 w-4 mr-2" />
          <span>Exportar como Excel</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportResultsButton;
