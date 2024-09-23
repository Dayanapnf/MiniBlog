import React from 'react';
import { Link } from 'react-router-dom';
import Card from './Card'; // Importa o componente Card
import styles from './PostDetail.module.css';

// Componente que exibe os detalhes de um post
const PostDetail = ({ post }) => {
  return (
    <Card className={styles.post_detail}>
      {/* Imagem do post */}
      <img src={post.image} alt={post.title} />

      {/* Título do post */}
      <h2>{post.title}</h2>

      {/* Nome do autor do post */}
      <p className={styles.createdby}>por: {post.createdBy}</p>

      {/* Tags associadas ao post */}
      <div className={styles.tags}>
        {Array.isArray(post.tags) && post.tags.length > 0 ? (
          post.tags.map((tag) => (
            <p key={tag}>
              <span>#</span>
              {tag}
            </p>
          ))
        ) : (
          <p>Nenhuma tag disponível</p> // Mensagem padrão se não houver tags
        )}
      </div>

      {/* Link para ler o post completo */}
      <Link
        to={`/posts/${post.id}`}
        className={`btn btn-outline ${styles.btn}`}
      >
        Ler
      </Link>
    </Card>
  );
};

export default PostDetail;
