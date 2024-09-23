import { useState, useEffect } from 'react';

// Hook personalizado para buscar notícias com base em uma consulta (query)
export const useFetchNews = (initialQuery) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noResults, setNoResults] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 5; // Definindo o número de artigos por página
  const apiKey = '92c9de3e70384490a70674fde6f63300'; // sua chave da API

  const fetchNews = async (searchQuery) => {
    setLoading(true);
    setNoResults(false);
    try {
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${searchQuery}&language=pt&apiKey=${apiKey}`,
      );

      if (!response.ok) {
        throw new Error('Falha ao buscar notícias.');
      }

      const data = await response.json();
      const filteredArticles = data.articles.filter(
        (article) => article.urlToImage,
      );
      setArticles(filteredArticles);
      setLoading(false);
      if (filteredArticles.length === 0) {
        setNoResults(true);
      }
    } catch (error) {
      console.error('Erro ao buscar notícias:', error);
      setLoading(false);
      setNoResults(true);
    }
  };

  useEffect(() => {
    fetchNews(initialQuery);

    // Atualizar as notícias a cada 60 segundos
    const intervalId = setInterval(() => {
      fetchNews(initialQuery);
    }, 60000);

    return () => clearInterval(intervalId); // Limpa o intervalo ao desmontar o componente
  }, [initialQuery]);

  // Calcular os artigos a serem exibidos
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles.slice(
    indexOfFirstArticle,
    indexOfLastArticle,
  );

  // Determinar o número total de páginas
  const totalPages = Math.ceil(articles.length / articlesPerPage);

  return {
    articles: currentArticles,
    loading,
    noResults,
    fetchNews,
    setCurrentPage,
    totalPages,
  };
};
