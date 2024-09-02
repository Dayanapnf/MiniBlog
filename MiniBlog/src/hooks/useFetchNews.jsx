import { useState, useEffect } from 'react';

export const useFetchNews = (query) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=${query}&language=pt&apiKey=92c9de3e70384490a70674fde6f63300`,
        );
        const data = await response.json();
        const filteredArticles = data.articles.filter(
          (article) => article.urlToImage,
        );
        setArticles(filteredArticles);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar notícias:', error);
        setLoading(false);
      }
    };

    if (query) {
      fetchNews();
    }
  }, [query]);

  return { articles, loading };
};
