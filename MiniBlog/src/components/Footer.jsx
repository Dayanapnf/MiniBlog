import React from 'react';
import styles from './Footer.module.css';

// Componente Footer que exibe informações no rodapé da página
const Footer = () => {
  return (
    <footer className={styles.footer}>
      <h3>Escreva sobre o que tem interesse!</h3>
      <p>Mini blog &copy; 2024</p>
    </footer>
  );
};

export default Footer; //
