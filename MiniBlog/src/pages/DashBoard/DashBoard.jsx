import React, { useState } from 'react';
import styles from './DashBoard.module.css';
import { useNavigate } from 'react-router-dom';
import { useAuthValue } from '../../Context/AuthContext';
import { useFetchDocuments } from '../../hooks/useFetchDocuments';
import { useDeleteDocument } from '../../hooks/useDeleteDocument';

const DashBoard = () => {
  const navigate = useNavigate();
  const { user } = useAuthValue();
  const uid = user.uid;
  const { documents: posts, loading } = useFetchDocuments('posts', null, uid);
  const { deleteDocument } = useDeleteDocument('posts');

  const [selectedPostId, setSelectedPostId] = useState(null);

  if (loading) {
    return <p>Carregando...</p>;
  }

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
        <div className={styles.noposts}>
          <p>Não foram encontrados posts</p>
          <button onClick={() => navigate('/posts/create')} className="btn">
            Criar primeiro Post
          </button>
        </div>
      ) : (
        <>
          <div className={styles.post_header}>
            <span>Título:</span>
            <span>Ações:</span>
          </div>
          {posts &&
            posts.map((post) => (
              <div className={styles.post_row} key={post.id}>
                <p>{post.title}</p>
                <div className={styles.actions}>
                  <button
                    onClick={() => navigate(`/posts/${post.id}`)}
                    className="btn dash"
                  >
                    Ver
                  </button>
                  <button
                    onClick={() => navigate(`/posts/edit/${post.id}`)}
                    className="btn dash"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="btn dash btn-danger"
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
