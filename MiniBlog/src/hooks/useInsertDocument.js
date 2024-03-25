import { useState, useEffect, useReducer } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

const initialState = {
  loading: null,
  error: null,
};

const insertReducer = (state, action) => {
  switch (action.type) {
    case 'LOADING':
      return { loading: true, error: null };
    case 'INSERTED_DOC':
      return { loading: false, error: null };
    case 'ERROR':
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const useInsertDocument = (docCollection) => {
  const [response, dispatch] = useReducer(insertReducer, initialState);

  // deal with memory leak
  const [cancelled, setCancelled] = useState(false);

  const checkCancelBeforeDispatch = (action) => {
    if (!cancelled) {
      dispatch(action);
    }
  };

  const insertDocument = async (document) => {
    console.log('Inserting document:', document); // Log para verificar os dados do documento

    checkCancelBeforeDispatch({ type: 'LOADING' });

    try {
      const newDocument = { ...document, createdAt: Timestamp.now() };

      console.log('New document:', newDocument); // Log para verificar a formatação do novo documento

      const insertedDocument = await addDoc(
        collection(db, docCollection),
        newDocument,
      );

      console.log('Inserted document:', insertedDocument); // Log para verificar se o documento foi inserido corretamente

      checkCancelBeforeDispatch({
        type: 'INSERTED_DOC',
        payload: insertedDocument,
      });
    } catch (error) {
      console.error('Error inserting document:', error); // Log para verificar erros durante a inserção do documento
      checkCancelBeforeDispatch({ type: 'ERROR', payload: error.message });
    }
  };

  useEffect(() => {
    return () => setCancelled(true);
  }, []);

  return { insertDocument, response };
};
