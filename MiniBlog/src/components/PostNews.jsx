import React from 'react';
import Card from './Card'; // Importa o componente Card
import styles from './PostNews.module.css';

// Componente que exibe os detalhes de um artigo de notícia
const PostNews = ({ article }) => {
  return (
    <Card className={styles.article}>
      {/* Imagem do artigo */}
      <img src={article.urlToImage} alt={article.title} />

      {/* Título do artigo */}
      <h3>{article.title}</h3>

      {/* Descrição do artigo */}
      <p>{article.description}</p>

      {/* Link para ler o artigo completo */}
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`btn btn-outline ${styles.btn}`}
      >
        Leia mais
      </a>
    </Card>
  );
};

export default PostNews;
