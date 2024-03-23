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
        Este projeto consiste em um blog feito com react no fornt-end e Firebase
        no banck-end
      </p>
      <Link to="/posts/creat" className="btn">
        Criar post
      </Link>
    </div>
  );
};

export default About;
