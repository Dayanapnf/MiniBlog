import React from 'react';
import styles from './DashBoard.module.css';
import { Link } from 'react-router-dom';
import { useAuthValue } from '../../Context/AuthContext';
import { useFetchDocuments } from '../../hooks/useFetchDocuments';
import { useDeleteDocument } from '../../hooks/useDeleteDocument';

const DashBoard = () => {
  // Obtendo o usuário autenticado
  const { user } = useAuthValue();
  const uid = user.uid;

  // Buscando os posts do usuário
  const { documents: posts, loading } = useFetchDocuments('posts', null, uid);

  // Hook para deletar documentos
  const { deleteDocument } = useDeleteDocument('posts');

  // Exibindo mensagem de carregamento enquanto os posts são buscados
  if (loading) {
    return <p>Carregando...</p>;
  }

  // Função para lidar com a exclusão de um post
  const handleDelete = (id) => {
    if (window.confirm('Tem certeza de que deseja excluir este post?')) {
      deleteDocument(id);
    }
  };

  return (
    <div className={styles.dashboard}>
      <h2>Dashboard</h2>
      <p>Gerenciar os seus posts</p>
      {posts && posts.length === 0 ? (
        // Exibindo mensagem quando não há posts
        <div className={styles.noposts}>
          <p>Não foram encontrados posts</p>
          <Link to="/posts/create" className="btn">
            Criar primeiro Post
          </Link>
        </div>
      ) : (
        <>
          {/* Cabeçalho da lista de posts */}
          <div className={styles.post_header}>
            <span>Título:</span>
            <span>Ações:</span>
          </div>
          {/* Listando os posts */}
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
                    onClick={() => handleDelete(post.id)}
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
