import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

// Hook personalizado para obter e manipular os parâmetros de consulta (query parameters) da URL
export function useQuery() {
  // Obtém a parte de busca (query string) da URL atual
  const { search } = useLocation();

  // Cria e retorna uma instância de URLSearchParams para facilitar o acesso aos parâmetros de consulta
  // Utiliza useMemo para memorizar o resultado e evitar recriações desnecessárias quando 'search' não muda
  return useMemo(() => new URLSearchParams(search), [search]);
}
