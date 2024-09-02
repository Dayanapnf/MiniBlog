import styles from './Search.module.css';

// hooks
import { useFetchNews } from '../../hooks/useFetchNews';
import { useQuery } from '../../hooks/useQuery';

// components
import { Link } from 'react-router-dom';

const Search = () => {
  const query = useQuery();
  const search = query.get('q');

  const { articles, loading } = useFetchNews(search);

  return (
    <div className={styles.search_container}>
      <h1>Resultados encontrados para: {search}</h1>
      <div>
        {loading && <p>Carregando notícias...</p>}
        {!loading && articles.length === 0 && (
          <div className={styles.noposts}>
            <p>Não foram encontradas notícias a partir da sua busca...</p>
            <Link to="/" className="btn btn-dark">
              Voltar
            </Link>
          </div>
        )}
        {!loading &&
          articles.map((article, index) => (
            <div key={index} className={styles.article}>
              <img src={article.urlToImage} alt={article.title} />
              <h3>{article.title}</h3>
              <p>{article.description}</p>
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                Leia mais
              </a>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Search;
