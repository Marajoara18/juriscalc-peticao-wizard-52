
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import MobileLayout from './layout/MobileLayout';
import DesktopLayout from './layout/DesktopLayout';
import useCalculadora from '@/hooks/useCalculadora';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from "sonner";
import CalculadoraToolbar from './layout/CalculadoraToolbar';

interface CalculadoraContainerProps {
  scrollToCalculosSalvos: () => void;
}

const CalculadoraContainer: React.FC<CalculadoraContainerProps> = ({ 
  scrollToCalculosSalvos
}) => {
  const isMobile = useIsMobile();
  const [layoutMode, setLayoutMode] = useState<'desktop' | 'mobile'>(isMobile ? 'mobile' : 'desktop');
  const [showUserPanel, setShowUserPanel] = useState(false);
  const [showManual, setShowManual] = useState(false);
  
  const {
    dadosContrato, 
    adicionais, 
    resultados,
    handleDadosContratoChange,
    handleCheckboxChange,
    handleTipoRescisaoChange,
    handleAdicionaisChange,
    calcularResultados,
    totalGeral,
    hasCalculos,
    handleLoadCalculo
  } = useCalculadora();

  // Toggle between desktop and mobile layout
  const toggleLayoutMode = () => {
    setLayoutMode(prev => prev === 'desktop' ? 'mobile' : 'desktop');
  };

  // Function for starting a new calculation
  const handleComecaCalcular = () => {
    // Placeholder for new calculation functionality
    window.location.reload();
  };

  // Função para mostrar o manual rápido
  const showManualRapido = () => {
    setShowManual(!showManual);
  };

  // Função para calcular as verbas rescisórias
  const handleCalcularClick = () => {
    // Verificar se os campos obrigatórios foram preenchidos
    if (!dadosContrato.dataAdmissao || !dadosContrato.dataDemissao || !dadosContrato.salarioBase) {
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    calcularResultados();
    
    // Rolar até a seção de resultados/cálculos salvos
    setTimeout(() => {
      scrollToCalculosSalvos();
    }, 500);
  };

  return (
    <div>
      <CalculadoraToolbar 
        showUserPanel={showUserPanel}
        layoutMode={layoutMode}
        toggleLayoutMode={toggleLayoutMode}
        handleComecaCalcular={handleComecaCalcular}
        setShowUserPanel={setShowUserPanel}
        showManualRapido={showManualRapido}
      />

      {showManual ? (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-bold text-juriscalc-navy mb-4">Manual Rápido de Uso - IusCalc</h2>
          
          <p className="mb-4">
            Bem-vindo ao IusCalc!
            O IusCalc é uma ferramenta intuitiva e eficiente projetada para ajudar advogados e escritórios de advocacia a realizar cálculos de verbas trabalhistas com rapidez e precisão. Este manual foi criado para guiá-lo nas funcionalidades essenciais da plataforma.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-xl font-semibold text-juriscalc-navy mb-3">1. Acesso ao Sistema</h3>
              <p className="mb-2"><strong>Login:</strong> Acesse a plataforma utilizando seu e-mail e senha cadastrados. Caso seja a primeira vez, clique em "Criar Conta" para se registrar.</p>
              <p>
                <strong>Tela Inicial de Login:</strong> Insira suas credenciais e clique em "Entrar". Se tiver problemas para acessar, utilize a opção "Esqueci minha senha" para recuperação.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-xl font-semibold text-juriscalc-navy mb-3">2. Dashboard - Página Inicial</h3>
              <p className="mb-2">Após o login, você será direcionado para a página principal do sistema. Aqui, você pode:</p>
              <p className="mb-2"><strong>Menu de Navegação:</strong> No topo, utilize os menus Calculadora e Petições para acessar as principais funcionalidades.</p>
              <p>
                <strong>Resumo do Cálculo de Verbas Rescisórias:</strong> A tela de cálculo mostra os campos principais, como Data de Admissão, Data de Demissão, Salário Base, Tipo de Rescisão, e outros detalhes essenciais para o cálculo.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-xl font-semibold text-juriscalc-navy mb-3">3. Calculadora de Verbas Rescisórias</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  <strong>Complete os campos obrigatórios:</strong>
                  <ul className="list-disc pl-5 mt-1">
                    <li>Data de Admissão e Data de Demissão</li>
                    <li>Salário Base</li>
                    <li>Tipo de Rescisão</li>
                    <li>Aviso Prévio Cumprido (Ative a opção, se aplicável)</li>
                  </ul>
                </li>
                <li>
                  <strong>Ajuste as Adicionais e Multas aplicáveis:</strong>
                  <p className="mt-1">Marque as opções relevantes como Adicional de Insalubridade, Férias Vencidas (+1/3), Multa do Art. 467 da CLT, entre outros.</p>
                </li>
                <li><strong>Clique em Calcular.</strong> O sistema irá gerar automaticamente o total das verbas rescisórias.</li>
                <li><strong>Revise os resultados</strong> que aparecem na seção Resultados do Cálculo. O valor total será mostrado de forma clara.</li>
              </ol>
              <p className="mt-2">
                Você também pode Salvar o Cálculo, Exportar para diferentes formatos (WhatsApp, E-mail, PDF) ou gerar uma Petição com os dados calculados.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-xl font-semibold text-juriscalc-navy mb-3">4. Petições</h3>
              <p className="mb-2"><strong>Criando uma Petição:</strong> Vá para a aba Petições e clique em Nova Petição.</p>
              <p className="mb-2">
                O sistema irá gerar um modelo de petição com os valores calculados. Preencha os campos conforme necessário.
              </p>
              <p className="mb-2"><strong>Inserir Cálculo Salvo:</strong> Se tiver algum cálculo salvo, você pode incluir na petição através do botão "+ Inserir na Petição".</p>
              <p>
                Você pode Imprimir, Editar ou Excluir petições salvas.
              </p>
            </div>
          </div>

          <div className="mt-6 bg-gray-50 p-4 rounded-lg">
            <h3 className="text-xl font-semibold text-juriscalc-navy mb-3">5. Outras Funcionalidades</h3>
            <p className="mb-2"><strong>Cálculos Salvos:</strong> Na tela de Cálculos Salvos, você pode revisar e acessar os cálculos realizados anteriormente. Basta clicar em Usar ou Verificar para editar ou confirmar.</p>
            <p>
              <strong>Minha Conta:</strong> Acesse Minha Conta e personalize suas preferências, como nome e imagem (foto ou logotipo).
            </p>
          </div>

          <div className="mt-6 border-t pt-4">
            <h3 className="text-lg font-semibold text-juriscalc-navy mb-2">Dicas Importantes:</h3>
            <ul className="list-disc pl-5">
              <li className="mb-1"><strong>Verifique os cálculos antes de exportar:</strong> É sempre bom revisar os valores, especialmente se houver ajustes nos adicionais e multas.</li>
              <li className="mb-1"><strong>Organize suas petições:</strong> Use a função de Salvar petições com regularidade para garantir que você tenha um histórico organizado de todas as suas solicitações.</li>
              <li>Se precisar de ajuda adicional, entre em contato com o suporte através do e-mail de contato localizado no canto superior direito da tela.</li>
            </ul>
          </div>
        </div>
      ) : (
        layoutMode === 'mobile' ? (
          <MobileLayout
            dadosContrato={dadosContrato}
            adicionais={adicionais}
            resultados={resultados}
            showCorrecaoMonetaria={false}
            hasCalculos={hasCalculos}
            totalGeral={totalGeral}
            handleDadosContratoChange={handleDadosContratoChange}
            handleCheckboxChange={handleCheckboxChange}
            handleTipoRescisaoChange={handleTipoRescisaoChange}
            handleAdicionaisChange={handleAdicionaisChange}
            handleCalcularClick={handleCalcularClick}
            handleLoadCalculo={handleLoadCalculo}
            setShowCorrecaoMonetaria={() => {}}
            aplicarCorrecaoMonetaria={() => {}}
          />
        ) : (
          <DesktopLayout
            dadosContrato={dadosContrato}
            adicionais={adicionais}
            resultados={resultados}
            showCorrecaoMonetaria={false}
            hasCalculos={hasCalculos}
            totalGeral={totalGeral}
            handleDadosContratoChange={handleDadosContratoChange}
            handleCheckboxChange={handleCheckboxChange}
            handleTipoRescisaoChange={handleTipoRescisaoChange}
            handleAdicionaisChange={handleAdicionaisChange}
            handleCalcularClick={handleCalcularClick}
            handleLoadCalculo={handleLoadCalculo}
            setShowCorrecaoMonetaria={() => {}}
            aplicarCorrecaoMonetaria={() => {}}
          />
        )
      )}
    </div>
  );
};

export default CalculadoraContainer;
