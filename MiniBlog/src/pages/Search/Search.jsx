import React from 'react';
import styles from './Search.module.css';
import { useFetchDocuments } from '../../hooks/useFetchDocuments';
useFetchDocuments;
const Search = () => {
  return (
    <div>
      <h2>Search</h2>
      <p>{search}</p>
    </div>
  );
};

export default Search;
