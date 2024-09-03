import React from 'react';
import './Card.css';

// Componente Card que recebe filhos e classes adicionais como props
const Card = ({ children, className = '', ...props }) => {
  return (
    <div className={`card ${className}`} {...props}>
      {children} {/* Renderiza os filhos dentro do card */}
    </div>
  );
};

export default Card; // Exporta o componente Card para ser usado em outros arquivos
