
import React from 'react';
import { Button, ButtonProps } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Download, FileSpreadsheet, FileText } from "lucide-react"; 
import { exportToExcel, exportToPDF, ExportData } from '@/utils/export';

interface ExportDropdownProps extends Omit<ButtonProps, 'onClick'> {
  data?: ExportData;
  dropdownAlign?: "start" | "end" | "center";
  onClose?: () => void;
}

const ExportDropdown: React.FC<ExportDropdownProps> = ({ 
  data,
  className,
  variant = "default",
  size,
  dropdownAlign = "end", 
  onClose,
  ...props
}) => {
  const [open, setOpen] = React.useState(false);

  const handleExportExcel = () => {
    if (!data) {
      return;
    }
    
    // Generate file name with current date and calculo name if provided
    let fileName;
    if (data.nome) {
      const calculoName = data.nome.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_').toLowerCase();
      const date = new Date();
      fileName = `${calculoName}_${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}.xlsx`;
    }
    
    const success = exportToExcel(data, fileName);
    if (success) {
      setOpen(false);
      onClose?.();
    }
  };
  
  const handleExportPDF = () => {
    exportToPDF();
    setOpen(false);
    onClose?.();
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={className}
          {...props}
        >
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={dropdownAlign}>
        <DropdownMenuItem onClick={handleExportExcel}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          <span>Exportar como Excel</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportPDF} className="font-medium">
          <FileText className="h-4 w-4 mr-2" />
          <span>Exportar como PDF</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportDropdown;
