import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import styles from './News.module.css';
import PostNews from '../../components/PostNews';
import { useFetchNews } from '../../hooks/useFetchNews';

const News = () => {
  const [searchInput, setSearchInput] = useState('');

  // Usando o hook para buscar notícias, passando uma query inicial
  const {
    articles,
    loading,
    noResults,
    fetchNews,
    setCurrentPage,
    totalPages,
    currentPage,
  } = useFetchNews('notícias');

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchNews(searchInput); // Atualiza a consulta com o input do usuário
    setCurrentPage(1); // Reseta para a primeira página ao buscar novos artigos
  };

  const handleClear = () => {
    fetchNews('notícias'); // Redefine para a busca padrão
    setSearchInput('');
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
        {searchInput && (
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
      {!loading && !noResults && (
        <div className={styles.pagination}>
          <button
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
          >
            Anterior
          </button>
          <span>
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
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
