import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PopularTags.module.css';

// Definindo uma paleta de cores fortes para garantir bom contraste
const strongColors = [
  '#C62828', // Dark Red
  '#F57C00', // Dark Orange
  '#FBC02D', // Dark Yellow
  '#8BC34A', // Dark Green
  '#4CAF50', // Medium Green
  '#009688', // Teal
  '#0288D1', // Dark Light Blue
  '#1565C0', // Dark Blue
  '#6A1B9A', // Dark Purple
  '#C2185B', // Dark Pink
];

// Função para obter uma cor aleatória da paleta de cores fortes
const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * strongColors.length);
  return strongColors[randomIndex];
};

const PopularTags = ({ tags }) => {
  const navigate = useNavigate();

  // Função para lidar com o clique na tag e navegar para a página de busca com a tag como query
  const handleTagClick = (tag) => {
    navigate(`/search?q=${tag}`);
  };

  return (
    <div className={styles.sidebar}>
      <h3>Tags Mais Usadas</h3>
      <div className={styles['tags-container']}>
        <ul className={styles.tags}>
          {tags.slice(0, 10).map((tag, index) => {
            // Exibindo apenas as 10 tags mais usadas
            const color = getRandomColor(); // Obtendo uma cor aleatória para cada tag
            return (
              <li
                key={index}
                className={styles[`tag-${tag.size}`]}
                style={{ color, border: `1px solid ${color}` }} // Aplicando a cor e a borda
                onClick={() => handleTagClick(tag.name)} // Navegando para a página de busca ao clicar na tag
              >
                {tag.name}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default PopularTags;
