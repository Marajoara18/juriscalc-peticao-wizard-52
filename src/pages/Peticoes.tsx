
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const peticoesModelo = [
  { 
    id: 1, 
    titulo: 'Reclamação Trabalhista - Verbas Rescisórias', 
    descricao: 'Modelo padrão para ação de reclamação de verbas rescisórias não pagas',
    categoria: 'verbas'
  },
  { 
    id: 2, 
    titulo: 'Reclamação Trabalhista - Horas Extras', 
    descricao: 'Modelo para reclamação de horas extras não pagas',
    categoria: 'horas'
  },
  { 
    id: 3, 
    titulo: 'Pedido de Adicional de Insalubridade', 
    descricao: 'Modelo para pedido de adicional de insalubridade',
    categoria: 'adicionais'
  },
  { 
    id: 4, 
    titulo: 'Pedido de Adicional de Periculosidade', 
    descricao: 'Modelo para pedido de adicional de periculosidade',
    categoria: 'adicionais'
  },
  { 
    id: 5, 
    titulo: 'Reclamação por Assédio Moral', 
    descricao: 'Modelo para pedido de indenização por assédio moral',
    categoria: 'danos'
  },
  { 
    id: 6, 
    titulo: 'Rescisão Indireta', 
    descricao: 'Modelo para pedido de rescisão indireta do contrato de trabalho',
    categoria: 'verbas'
  }
];

const peticoesRecentes = [
  { 
    id: 1, 
    titulo: 'Reclamação Trabalhista - João da Silva', 
    descricao: 'Verbas rescisórias e horas extras',
    data: '15/05/2025',
    status: 'finalizada'
  },
  { 
    id: 2, 
    titulo: 'Pedido de Insalubridade - Maria Oliveira', 
    descricao: 'Adicional de insalubridade para enfermeira',
    data: '10/05/2025',
    status: 'rascunho'
  },
  { 
    id: 3, 
    titulo: 'Rescisão Indireta - Carlos Santos', 
    descricao: 'Assédio moral e atrasos salariais',
    data: '05/05/2025',
    status: 'finalizada'
  }
];

const ModeloCard = ({ modelo }: { modelo: typeof peticoesModelo[0] }) => {
  return (
    <Card className="cursor-pointer hover:border-juriscalc-navy transition-all">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg font-serif">{modelo.titulo}</CardTitle>
            <CardDescription className="mt-1 line-clamp-2">{modelo.descricao}</CardDescription>
          </div>
          <div className="w-10 h-10 rounded-full bg-juriscalc-navy/10 flex items-center justify-center shrink-0">
            <FileText size={18} className="text-juriscalc-navy" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Button size="sm" className="w-full bg-juriscalc-navy hover:bg-opacity-90">Usar Modelo</Button>
      </CardContent>
    </Card>
  );
};

const PeticaoRecenteCard = ({ peticao }: { peticao: typeof peticoesRecentes[0] }) => {
  return (
    <Card className="cursor-pointer hover:border-juriscalc-navy transition-all">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg font-serif">{peticao.titulo}</CardTitle>
            <CardDescription className="mt-1">{peticao.descricao}</CardDescription>
          </div>
          <div className={`px-2 py-1 rounded text-xs font-medium ${
            peticao.status === 'finalizada' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-amber-100 text-amber-800'
          }`}>
            {peticao.status === 'finalizada' ? 'Finalizada' : 'Rascunho'}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Criada em {peticao.data}
          </div>
          <Button size="sm" variant="outline">Editar</Button>
        </div>
      </CardContent>
    </Card>
  );
};

const Peticoes = () => {
  return (
    <Layout>
      <div className="container mx-auto py-10 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-juriscalc-navy">Petições</h1>
          <Button className="bg-juriscalc-gold text-juriscalc-navy hover:bg-opacity-90">
            <Plus className="mr-2 h-4 w-4" />
            Nova Petição
          </Button>
        </div>

        <Tabs defaultValue="recentes" className="mb-8">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="recentes" className="flex-1">Petições Recentes</TabsTrigger>
            <TabsTrigger value="modelos" className="flex-1">Modelos de Petição</TabsTrigger>
          </TabsList>

          <TabsContent value="recentes">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {peticoesRecentes.map((peticao) => (
                <PeticaoRecenteCard key={peticao.id} peticao={peticao} />
              ))}
            </div>
            {peticoesRecentes.length === 0 && (
              <div className="text-center py-12">
                <FileText size={48} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-serif font-bold mb-2">Nenhuma petição recente</h3>
                <p className="text-gray-500">Crie uma nova petição para começar</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="modelos">
            <div className="mb-6">
              <h2 className="text-xl font-serif font-semibold mb-4 text-juriscalc-navy">Modelos Disponíveis</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {peticoesModelo.map((modelo) => (
                  <ModeloCard key={modelo.id} modelo={modelo} />
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="bg-juriscalc-lightgray rounded-lg p-6 mt-12">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-serif font-bold mb-2 text-juriscalc-navy">Precisando de ajuda?</h3>
              <p className="text-juriscalc-darkgray mb-2">
                Confira nosso guia sobre como elaborar petições eficazes.
              </p>
            </div>
            <Button variant="outline" className="border-juriscalc-navy text-juriscalc-navy">
              Ver Guia de Petições
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Peticoes;
