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
  const [currentPage, setCurrentPage] = useState(1);
  const [articlesPerPage] = useState(5);

  const fetchNews = async (searchQuery) => {
    setLoading(true);
    setNoResults(false);
    try {
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${searchQuery}&language=pt&apiKey=92c9de3e70384490a70674fde6f63300`,
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
      setNoResults(true); // Exibe mensagem de erro ao usuário
    }
  };

  useEffect(() => {
    fetchNews('notícias');
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setQuery(searchInput);
    setCurrentPage(1); // Resetar para a primeira página ao buscar novos artigos
    fetchNews(searchInput);
  };

  const handleClear = () => {
    setQuery('');
    setSearchInput('');
    setCurrentPage(1); // Resetar para a primeira página ao limpar a busca
    fetchNews('notícias');
  };

  // Calcular os artigos a serem exibidos
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles.slice(
    indexOfFirstArticle,
    indexOfLastArticle,
  );

  // Função para mudar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Determinar o número total de páginas
  const totalPages = Math.ceil(articles.length / articlesPerPage);

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
            currentArticles.map((article, index) => (
              <PostNews key={index} article={article} />
            ))
          )}
        </div>
      )}
      {!loading && !noResults && (
        <div className={styles.pagination}>
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Anterior
          </button>
          <span>
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  );
};

export default News;
