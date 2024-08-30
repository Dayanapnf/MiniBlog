import React from 'react';
import { Link } from 'react-router-dom';
//CSS
import styles from './Aboute.module.css';

const About = () => {
  return (
    <div className={styles.about}>
      <h2>
        Sobre o Mini <span>Blog</span>
      </h2>
      <p>
        Este projeto é um blog desenvolvido com React no front-end e Firebase no
        back-end. O objetivo é criar uma plataforma simples e eficiente para
        postagem de conteúdo. O blog permite que os usuários criem, visualizem,
        editem e excluam postagens de forma prática e intuitiva.
      </p>
      <Link to="/posts/creat" className="btn">
        Criar post
      </Link>
    </div>
  );
};

export default About;
