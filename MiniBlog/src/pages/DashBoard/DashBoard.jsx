import React from 'react';
import styles from './DashBoard.module.css';
import { Link } from 'react-router-dom';
import { useAuthValue } from '../../Context/AuthContext';
import { useFetchDocuments } from '../../hooks/useFetchDocuments';

const DashBoard = () => {
  const { user } = useAuthValue();
  const uid = user.uid;
  const posts = [];
  // posts do usuario
  return (
    <div>
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
        <div>
          <p>Tem posts!</p>
        </div>
      )}
    </div>
  );
};

export default DashBoard;
