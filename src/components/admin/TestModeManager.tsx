
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TestTube, Info } from 'lucide-react';
import { toast } from 'sonner';
import { 
  isUnlimitedTestMode, 
  activateTestMode, 
  deactivateTestMode, 
  getTestModeStatus 
} from '@/utils/testModeUtils';

const TestModeManager = () => {
  const [isTestMode, setIsTestMode] = useState(false);

  useEffect(() => {
    setIsTestMode(isUnlimitedTestMode());
  }, []);

  const handleToggleTestMode = () => {
    if (isTestMode) {
      deactivateTestMode();
      setIsTestMode(false);
      toast.success('Modo de teste desativado - Limites normais restaurados');
    } else {
      activateTestMode();
      setIsTestMode(true);
      toast.success('Modo de teste ativado - Cálculos ilimitados habilitados');
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="h-5 w-5" />
          Gerenciador do Modo de Teste
        </CardTitle>
        <CardDescription>
          Controle o acesso ilimitado para usuário de teste
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status atual */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-3">
            <TestTube className="h-5 w-5" />
            <div>
              <p className="font-medium">Status do Modo de Teste</p>
              <p className="text-sm text-gray-600">
                {isTestMode ? 'Ativo - Cálculos ilimitados' : 'Inativo - Limites normais'}
              </p>
            </div>
          </div>
          <Badge variant={isTestMode ? 'default' : 'secondary'}>
            {isTestMode ? 'ATIVO' : 'INATIVO'}
          </Badge>
        </div>

        {/* Toggle principal */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <Label htmlFor="test-mode-toggle" className="flex flex-col gap-1">
            <span>Ativar/Desativar Modo de Teste</span>
            <span className="text-sm text-gray-600">
              Alterna entre limitado (3 cálculos) e ilimitado
            </span>
          </Label>
          <Switch
            id="test-mode-toggle"
            checked={isTestMode}
            onCheckedChange={handleToggleTestMode}
          />
        </div>

        {/* Informações sobre acesso premium para usuários */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Acesso Premium para Usuários:</strong>
            <p className="mt-2">
              Para conceder acesso premium permanente a usuários do tipo "usuário", 
              utilize o painel de administração para ativar o "Acesso Premium" na 
              conta do usuário desejado. Isso garantirá cálculos ilimitados sem 
              necessidade do modo de teste.
            </p>
          </AlertDescription>
        </Alert>

        {/* Informações técnicas */}
        <div className="text-xs text-gray-500 p-3 bg-gray-50 rounded">
          <p><strong>Local Storage Key:</strong> lovable_user_test_mode</p>
          <p><strong>Valor Ativo:</strong> unlimited_calculations</p>
          <p><strong>Status Atual:</strong> {getTestModeStatus()}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestModeManager;
