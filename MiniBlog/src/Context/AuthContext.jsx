import { useContext, createContext } from 'react';

// Criando o contexto de autenticação
const AuthContext = createContext();

// Função que fornece o contexto de autenticação para seus filhos
export function AuthProvider({ children, value }) {
  // O AuthProvider usa o AuthContext.Provider para envolver seus filhos
  // e fornece o valor passado para o contexto
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook customizado para usar o valor do AuthContext
export function useAuthValue() {
  // Retorna o valor atual do contexto de autenticação usando useContext
  return useContext(AuthContext);
}
