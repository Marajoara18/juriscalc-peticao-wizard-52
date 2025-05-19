
import React from 'react';

const ManualRapido: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold text-juriscalc-navy mb-6">Manual Rápido de Uso - IusCalc</h1>
      
      <p className="mb-4">
        Bem-vindo ao IusCalc!
        O IusCalc é uma ferramenta intuitiva e eficiente projetada para ajudar advogados e escritórios de advocacia a realizar cálculos de verbas trabalhistas com rapidez e precisão. Este manual foi criado para guiá-lo nas funcionalidades essenciais da plataforma.
      </p>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-juriscalc-navy mb-2">1. Acesso ao Sistema</h2>
        <p className="mb-2"><strong>Login:</strong> Acesse a plataforma utilizando seu e-mail e senha cadastrados. Caso seja a primeira vez, clique em "Criar Conta" para se registrar.</p>
        <p>
          <strong>Tela Inicial de Login:</strong> Insira suas credenciais e clique em "Entrar". Se tiver problemas para acessar, utilize a opção "Esqueci minha senha" para recuperação.
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-juriscalc-navy mb-2">2. Dashboard - Página Inicial</h2>
        <p className="mb-2">Após o login, você será direcionado para a página principal do sistema. Aqui, você pode:</p>
        <p className="mb-2"><strong>Menu de Navegação:</strong> No topo, utilize os menus Calculadora e Petições para acessar as principais funcionalidades.</p>
        <p>
          <strong>Resumo do Cálculo de Verbas Rescisórias:</strong> A tela de cálculo mostra os campos principais, como Data de Admissão, Data de Demissão, Salário Base, Tipo de Rescisão, e outros detalhes essenciais para o cálculo.
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-juriscalc-navy mb-2">3. Calculadora de Verbas Rescisórias</h2>
        <p className="mb-2"><strong>Passo 1:</strong> Complete os campos obrigatórios:</p>
        <ul className="list-disc pl-6 mb-2">
          <li>Data de Admissão e Data de Demissão</li>
          <li>Salário Base</li>
          <li>Tipo de Rescisão</li>
          <li>Aviso Prévio Cumprido (Ative a opção, se aplicável)</li>
        </ul>

        <p className="mb-2"><strong>Passo 2:</strong> Se necessário, ajuste as Adicionais e Multas aplicáveis:</p>
        <p className="mb-2 pl-6">
          Marque as opções relevantes como Adicional de Insalubridade, Férias Vencidas (+1/3), Multa do Art. 467 da CLT, entre outros.
        </p>

        <p className="mb-2"><strong>Passo 3:</strong> Clique em Calcular. O sistema irá gerar automaticamente o total das verbas rescisórias.</p>

        <p className="mb-2"><strong>Passo 4:</strong> Revise os resultados que aparecem na seção Resultados do Cálculo. O valor total será mostrado de forma clara.</p>

        <p>
          Você também pode Salvar o Cálculo, Exportar para diferentes formatos (WhatsApp, E-mail, PDF) ou gerar uma Petição com os dados calculados.
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-juriscalc-navy mb-2">4. Petições</h2>
        <p className="mb-2"><strong>Criando uma Petição:</strong> Vá para a aba Petições e clique em Nova Petição.</p>
        <p className="mb-2">
          O sistema irá gerar um modelo de petição com os valores calculados, como mostrado na tela. Preencha os campos conforme necessário.
        </p>
        <p className="mb-2"><strong>Inserir Cálculo Salvo:</strong> Se tiver algum cálculo salvo, você pode incluir na petição através do botão "+ Inserir na Petição", localizado no canto superior esquerdo da tela.</p>
        <p>
          Você pode Imprimir, Editar ou Excluir petições salvas.
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-juriscalc-navy mb-2">5. Outras Funcionalidades</h2>
        <p className="mb-2"><strong>Cálculos Salvos:</strong> Na tela de Cálculos Salvos, você pode revisar e acessar os cálculos realizados anteriormente. Basta clicar em Usar ou Verificar para editar ou confirmar.</p>
        <p>
          <strong>Minha Conta:</strong> Acesse Minha Conta e personalize suas preferências, como nome e imagem (foto ou logotipo).
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-juriscalc-navy mb-2">Dicas Importantes:</h3>
        <ul className="list-disc pl-6">
          <li className="mb-1"><strong>Verifique os cálculos antes de exportar:</strong> É sempre bom revisar os valores, especialmente se houver ajustes nos adicionais e multas.</li>
          <li className="mb-1"><strong>Organize suas petições:</strong> Use a função de Salvar petições com regularidade para garantir que você tenha um histórico organizado de todas as suas solicitações.</li>
          <li>Se precisar de ajuda adicional, entre em contato com o suporte através do e-mail de contato localizado no canto inferior direito da tela.</li>
        </ul>
      </div>
    </div>
  );
};

export default ManualRapido;
