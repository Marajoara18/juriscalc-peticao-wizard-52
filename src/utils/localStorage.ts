
// Inicialização do localStorage para usuários que acessam pela primeira vez
export const initializeLocalStorage = () => {
  if (!localStorage.getItem('peticoesRecentes')) {
    localStorage.setItem('peticoesRecentes', JSON.stringify([]));
  }
  if (!localStorage.getItem('peticoesCount')) {
    localStorage.setItem('peticoesCount', '0');
  }
  if (!localStorage.getItem('userPremium')) {
    localStorage.setItem('userPremium', 'false');
  }
};
