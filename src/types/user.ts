
export interface UserData {
  id: string;
  nome: string;
  email: string;
  senha?: string;  // Adding the senha field as optional for UserData
  isAdmin: boolean;
  logoUrl?: string;
  canViewPanels?: boolean;
  isPremium?: boolean;
}
