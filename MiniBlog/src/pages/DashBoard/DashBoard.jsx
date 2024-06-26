import React from 'react';
import styles from './DashBoard.module.css';
import { Link } from 'react-router-dom';
import { useAuthValue } from '../../Context/AuthContext';
import { useFetchDocuments } from '../../hooks/useFetchDocuments';

const DashBoard = () => {
  const { user } = useAuthValue();
  const uid = user.uid;
  const { documents: posts, loading } = useFetchDocuments('posts', null, uid);

  const deleteDocument = (id) => {};
  if (loading) {
    return <p>Carregando...</p>;
  }
  // posts do usuario
  return (
    <div className={styles.dashboard}>
      <h2>Dashboard</h2>
      <p>Gerenciar os seus posts</p>
      {posts && posts.length === 0 ? (
        <div className="{styles.noposts}">
          <p>Não foram encontrados posts</p>
          <Link to="/posts/creat" className="btn">
            Criar primeiro Post
          </Link>
        </div>
      ) : (
        <>
          <div className={styles.post_header}>
            <span>Título</span>
            <span>Ações</span>
          </div>
          {posts &&
            posts.map((post) => (
              <div className={styles.post_row} key={post.id}>
                <p>{post.title}</p>
                <div className={styles.actions}>
                  <Link to={`/posts/${post.id}`} className="btn btn-outline">
                    Ver
                  </Link>
                  <Link
                    to={`/posts/edit/${post.id}`}
                    className="btn btn-outline"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => deleteDocument(post.id)}
                    className="btn btn-outline btn-danger"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
        </>
      )}
    </div>
  );
};

export default DashBoard;
