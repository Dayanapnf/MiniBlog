import { useState, useEffect, useReducer } from 'react';
import { db } from '../firebase/config';
import { doc, deleteDoc } from 'firebase/firestore';

// Estado inicial do reducer que gerencia o estado de exclusão de documentos
const initialState = {
  loading: null, // Indica se a operação de exclusão está em andamento
  error: null, // Armazena possíveis erros durante a exclusão
};

// Reducer para gerenciar as ações e estados da exclusão de documentos
const deleteReducer = (state, action) => {
  switch (action.type) {
    case 'LOADING':
      return { loading: true, error: null }; // Estado quando a exclusão está em andamento
    case 'DELETED_DOC':
      return { loading: false, error: null }; // Estado após a exclusão bem-sucedida
    case 'ERROR':
      return { loading: false, error: action.payload }; // Estado quando ocorre um erro
    default:
      return state; // Retorna o estado atual se a ação não for reconhecida
  }
};

// Hook personalizado para deletar documentos de uma coleção específica no Firestore
export const useDeleteDocument = (docCollection) => {
  // Utiliza o reducer para gerenciar o estado de resposta
  const [response, dispatch] = useReducer(deleteReducer, initialState);

  // Estado para lidar com possíveis vazamentos de memória ao desmontar o componente
  const [cancelled, setCancelled] = useState(false);

  // Função para verificar se a operação deve ser cancelada antes de despachar uma ação
  const checkCancelBeforeDispatch = (action) => {
    if (!cancelled) {
      dispatch(action); // Só despacha a ação se o componente não estiver desmontado
    }
  };

  // Função assíncrona para deletar um documento da coleção com o ID fornecido
  const deleteDocument = async (id) => {
    checkCancelBeforeDispatch({ type: 'LOADING' }); // Marca o início da operação

    try {
      // Tenta deletar o documento da coleção no Firestore
      const deletedDocument = await deleteDoc(doc(db, docCollection, id));

      // Atualiza o estado para indicar que a exclusão foi bem-sucedida
      checkCancelBeforeDispatch({
        type: 'DELETED_DOC',
        payload: deletedDocument,
      });
    } catch (error) {
      // Atualiza o estado com a mensagem de erro se algo der errado
      checkCancelBeforeDispatch({ type: 'ERROR', payload: error.message });
    }
  };

  // useEffect para marcar o componente como cancelado quando ele é desmontado
  useEffect(() => {
    return () => setCancelled(true); // Define o estado de cancelamento ao desmontar
  }, []);

  // Retorna a função de deletar documento e o estado atual da operação
  return { deleteDocument, response };
};
