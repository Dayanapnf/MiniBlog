import React, { useState } from 'react';
import styles from './Home.module.css';
import { Link, useNavigate } from 'react-router-dom';
import PostDetail from '../../components/PostDetail';
import { useFetchDocuments } from '../../hooks/useFetchDocuments';
import { useFetchTags } from '../../hooks/useFetchTags';
import PopularTags from '../../components/PopularTags';

const Home = () => {
  // Usando hooks personalizados para buscar posts e tags
  const { documents: posts, loading: loadingPosts } =
    useFetchDocuments('posts');
  const { tags, loading: loadingTags } = useFetchTags();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  // Função para lidar com a submissão do formulário de busca
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query) {
      return navigate(`/search?q=${query}`);
    }
  };

  return (
    <div className={styles.home}>
      {/* Sidebar com as tags mais populares */}
      <div className={styles.sidebar}>
        {loadingTags ? <p>Carregando tags...</p> : <PopularTags tags={tags} />}
      </div>

      {/* Área principal de conteúdo */}
      <div className={styles.content}>
        <h2>Veja os nossos posts mais recentes</h2>

        {/* Formulário de busca */}
        <form className={styles.search_form} onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Ou busque por tags..."
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="btn btn-dark">Pesquisar</button>
        </form>

        {/* Lista de posts */}
        <div className={styles.post_list}>
          {loadingPosts && <p>Carregando...</p>}
          {posts && posts.length === 0 && (
            <div className={styles.noposts}>
              <p>Não foram encontrados posts</p>
              <Link to="/posts/create" className="btn">
                Criar primeiro post
              </Link>
            </div>
          )}
          {posts &&
            posts.map((post) => <PostDetail key={post.id} post={post} />)}
        </div>
      </div>
    </div>
  );
};

export default Home;
