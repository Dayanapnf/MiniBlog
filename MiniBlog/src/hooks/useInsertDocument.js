import { useState, useEffect, useReducer } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

// Estado inicial do reducer que gerencia o processo de inserção de documentos
const initialState = {
  loading: null, // Indica se a operação de inserção está em andamento
  error: null, // Armazena erros que possam ocorrer durante a inserção
};

// Reducer para gerenciar o estado de inserção de documentos
const insertReducer = (state, action) => {
  switch (action.type) {
    case 'LOADING':
      return { loading: true, error: null }; // Estado quando a inserção está em andamento
    case 'INSERTED_DOC':
      return { loading: false, error: null }; // Estado após a inserção bem-sucedida
    case 'ERROR':
      return { loading: false, error: action.payload }; // Estado quando ocorre um erro durante a inserção
    default:
      return state; // Retorna o estado atual se a ação não for reconhecida
  }
};

// Hook personalizado para inserir documentos em uma coleção específica no Firestore
export const useInsertDocument = (docCollection) => {
  // Utiliza o reducer para gerenciar o estado da resposta da inserção
  const [response, dispatch] = useReducer(insertReducer, initialState);

  // Estado para lidar com vazamentos de memória quando o componente é desmontado
  const [cancelled, setCancelled] = useState(false);

  // Função para verificar se a operação deve ser cancelada antes de despachar uma ação
  const checkCancelBeforeDispatch = (action) => {
    if (!cancelled) {
      dispatch(action); // Só despacha a ação se o componente não estiver desmontado
    }
  };

  // Função assíncrona para inserir um novo documento na coleção
  const insertDocument = async (document) => {
    console.log('Inserting document:', document); // Log para verificar os dados do documento antes da inserção

    checkCancelBeforeDispatch({ type: 'LOADING' }); // Marca o início da operação de inserção

    try {
      // Cria o novo documento com um timestamp para a data de criação
      const newDocument = { ...document, createdAt: Timestamp.now() };

      console.log('New document:', newDocument); // Log para verificar a formatação do novo documento

      // Insere o documento na coleção especificada no Firestore
      const insertedDocument = await addDoc(
        collection(db, docCollection),
        newDocument,
      );

      console.log('Inserted document:', insertedDocument); // Log para verificar se o documento foi inserido corretamente

      // Atualiza o estado para indicar que o documento foi inserido com sucesso
      checkCancelBeforeDispatch({
        type: 'INSERTED_DOC',
        payload: insertedDocument,
      });
    } catch (error) {
      // Captura e registra o erro caso a inserção falhe
      console.error('Error inserting document:', error);
      checkCancelBeforeDispatch({ type: 'ERROR', payload: error.message }); // Atualiza o estado com a mensagem de erro
    }
  };

  // useEffect para definir o estado de cancelamento quando o componente desmontar
  useEffect(() => {
    return () => setCancelled(true); // Marca o componente como cancelado ao desmontar
  }, []);

  // Retorna a função de inserção de documentos e o estado da resposta para uso no componente
  return { insertDocument, response };
};
