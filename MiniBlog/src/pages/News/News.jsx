import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import styles from './News.module.css';
import PostNews from '../../components/PostNews';

const News = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [noResults, setNoResults] = useState(false);

  const fetchNews = async (searchQuery) => {
    setLoading(true);
    setNoResults(false);
    try {
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${searchQuery}&language=pt&apiKey=92c9de3e70384490a70674fde6f63300`,
      );
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
    }
  };

  useEffect(() => {
    fetchNews('noticias');
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setQuery(searchInput);
    fetchNews(searchInput);
  };

  const handleClear = () => {
    setQuery('');
    setSearchInput('');
    fetchNews('noticias');
  };

  return (
    <div className={styles.news}>
      <h2>Últimas Notícias</h2>
      <form className={styles.search_form} onSubmit={handleSubmit}>
        <input
          type="text"
          name="search"
          placeholder="Busque por notícias..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button type="submit" className="btn btn-dark">
          Pesquisar
        </button>
        {query && (
          <button
            type="button"
            className={styles.clear_button}
            onClick={handleClear}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        )}
      </form>
      {loading ? (
        <p>Carregando notícias...</p>
      ) : (
        <div className={styles.articles}>
          {noResults ? (
            <p>Não foram encontradas notícias a partir da sua busca...</p>
          ) : (
            articles.map((article, index) => (
              <PostNews key={index} article={article} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default News;
