
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { CalculoSalvo } from '@/types/calculoSalvo';
import EmptyCalculos from './EmptyCalculos';
import CalculosList from './CalculosList';
import SaveCalculoDialog from './dialogs/SaveCalculoDialog';
import ConfirmPeticaoDialog from './dialogs/ConfirmPeticaoDialog';
import PreviewCalculoDialog from './dialogs/PreviewCalculoDialog';
import useCalculosSalvos from '@/hooks/useCalculosSalvos';

interface CalculosSalvosProps {
  resultados: any;
  totalGeral: number;
  dadosContrato: any;
  onLoadCalculo: (calculo: CalculoSalvo) => void;
}

const CalculosSalvos: React.FC<CalculosSalvosProps> = ({ resultados, totalGeral, dadosContrato, onLoadCalculo }) => {
  const {
    calculosFiltrados,
    dialogOpen,
    nomeCalculo,
    confirmDialogOpen,
    previewDialogOpen,
    selectedCalculoForPeticao,
    selectedCalculoForPreview,
    salvarCalculos,
    handleSalvar,
    handleEditar,
    handleReabrirCalculo,
    handleApagar,
    handleUsarCalculo,
    handlePreviewCalculo,
    handleUsarNaPeticao,
    confirmarUsarNaPeticao,
    setDialogOpen,
    setNomeCalculo,
    setConfirmDialogOpen,
    setPreviewDialogOpen,
  } = useCalculosSalvos(resultados, totalGeral, dadosContrato, onLoadCalculo);

  return (
    <>
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center justify-between">
            <span>Cálculos Salvos</span>
            <Button 
              onClick={salvarCalculos}
              variant="outline" 
              size="sm"
              className="border-juriscalc-navy text-juriscalc-navy"
            >
              <Save className="h-4 w-4 mr-1" />
              Salvar Atual
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {calculosFiltrados.length === 0 ? (
            <EmptyCalculos />
          ) : (
            <CalculosList
              calculosFiltrados={calculosFiltrados}
              onEdit={handleEditar}
              onDelete={handleApagar}
              onUse={handleUsarCalculo}
              onReopen={handleReabrirCalculo}
              onPreview={handlePreviewCalculo}
              onUsePeticao={handleUsarNaPeticao}
            />
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <SaveCalculoDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        nomeCalculo={nomeCalculo}
        setNomeCalculo={setNomeCalculo}
        isEditing={!!nomeCalculo}
        onSave={handleSalvar}
      />

      <ConfirmPeticaoDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        calculo={selectedCalculoForPeticao}
        onConfirm={confirmarUsarNaPeticao}
      />

      <PreviewCalculoDialog
        open={previewDialogOpen}
        onOpenChange={setPreviewDialogOpen}
        calculo={selectedCalculoForPreview}
      />
    </>
  );
};

export default CalculosSalvos;
