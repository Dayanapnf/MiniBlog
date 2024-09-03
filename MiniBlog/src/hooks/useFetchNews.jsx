import { useState, useEffect } from 'react';

// Hook personalizado para buscar notícias com base em uma consulta (query)
export const useFetchNews = (query) => {
  // Estado para armazenar os artigos de notícias retornados da API
  const [articles, setArticles] = useState([]);
  // Estado para gerenciar o estado de carregamento da busca
  const [loading, setLoading] = useState(true);

  // useEffect para buscar as notícias quando a consulta (query) mudar
  useEffect(() => {
    // Função assíncrona para buscar as notícias da API
    const fetchNews = async () => {
      try {
        // Faz a requisição à API de notícias com a query especificada e configurações desejadas
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=${query}&language=pt&apiKey=92c9de3e70384490a70674fde6f63300`,
        );
        // Converte a resposta da API para JSON
        const data = await response.json();
        // Filtra os artigos que possuem uma imagem associada
        const filteredArticles = data.articles.filter(
          (article) => article.urlToImage,
        );
        // Atualiza o estado com os artigos filtrados
        setArticles(filteredArticles);
        setLoading(false); // Finaliza o estado de carregamento
      } catch (error) {
        // Captura e exibe o erro no console caso a busca falhe
        console.error('Erro ao buscar notícias:', error);
        setLoading(false); // Finaliza o estado de carregamento em caso de erro
      }
    };

    // Chama a função de busca se houver uma query fornecida
    if (query) {
      fetchNews();
    }
  }, [query]); // Reexecuta o efeito se o parâmetro query mudar

  // Retorna os artigos e o estado de carregamento para uso no componente
  return { articles, loading };
};
