
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TestTube, Shield, Info } from 'lucide-react';
import { toast } from 'sonner';
import { 
  isUnlimitedTestMode, 
  activateTestMode, 
  deactivateTestMode, 
  getTestModeStatus 
} from '@/utils/testModeUtils';

const TestModeManager = () => {
  const [isTestMode, setIsTestMode] = useState(false);
  const [secretCode, setSecretCode] = useState('');
  const [showSecretActivation, setShowSecretActivation] = useState(false);
  
  const SECRET_ACTIVATION_CODE = 'LOVABLE_TEST_2024';

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

  const handleSecretActivation = () => {
    if (secretCode === SECRET_ACTIVATION_CODE) {
      activateTestMode();
      setIsTestMode(true);
      setSecretCode('');
      setShowSecretActivation(false);
      toast.success('🎉 Modo de teste ativado via código secreto!');
    } else {
      toast.error('Código secreto incorreto');
    }
  };

  const handleURLActivation = () => {
    // Add URL parameter for test mode activation
    const url = new URL(window.location.href);
    url.searchParams.set('test_mode', 'unlimited');
    window.history.pushState({}, '', url.toString());
    
    activateTestMode();
    setIsTestMode(true);
    toast.success('Modo de teste ativado via URL');
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
            <Shield className="h-5 w-5" />
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

        {/* Ativação por código secreto */}
        <div className="space-y-3">
          <Button
            variant="outline"
            onClick={() => setShowSecretActivation(!showSecretActivation)}
            className="w-full"
          >
            {showSecretActivation ? 'Ocultar' : 'Mostrar'} Ativação por Código Secreto
          </Button>
          
          {showSecretActivation && (
            <div className="p-4 border rounded-lg space-y-3">
              <div className="space-y-2">
                <Label htmlFor="secret-code">Código Secreto</Label>
                <Input
                  id="secret-code"
                  type="password"
                  value={secretCode}
                  onChange={(e) => setSecretCode(e.target.value)}
                  placeholder="Digite o código secreto"
                />
              </div>
              <Button onClick={handleSecretActivation} className="w-full">
                Ativar com Código Secreto
              </Button>
            </div>
          )}
        </div>

        {/* Ativação por URL */}
        <div className="space-y-3">
          <Button
            variant="outline"
            onClick={handleURLActivation}
            className="w-full"
          >
            Ativar via Parâmetro de URL
          </Button>
        </div>

        {/* Informações adicionais */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Métodos de ativação disponíveis:</strong>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Toggle manual nesta página</li>
              <li>Código secreto: LOVABLE_TEST_2024</li>
              <li>Parâmetro URL: ?test_mode=unlimited</li>
              <li>Combinação de teclas: Ctrl+Shift+T+E+S+T</li>
            </ul>
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
