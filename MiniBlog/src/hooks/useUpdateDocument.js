import { useState, useEffect, useReducer } from 'react';
import { db } from '../firebase/config';
import { updateDoc, doc } from 'firebase/firestore';

// Estado inicial do reducer para gerenciar o processo de atualização de documentos
const initialState = {
  loading: null, // Indica se a operação de atualização está em andamento
  error: null, // Armazena possíveis erros que ocorram durante a atualização
};

// Reducer para gerenciar ações relacionadas ao processo de atualização de documentos
const updateReducer = (state, action) => {
  switch (action.type) {
    case 'LOADING':
      return { loading: true, error: null }; // Estado quando a atualização está em andamento
    case 'UPDATED_DOC':
      return { loading: false, error: null }; // Estado após a atualização bem-sucedida
    case 'ERROR':
      return { loading: false, error: action.payload }; // Estado quando ocorre um erro
    default:
      return state; // Retorna o estado atual se a ação não for reconhecida
  }
};

// Hook personalizado para atualizar documentos em uma coleção específica do Firestore
export const useUpdateDocument = (docCollection) => {
  // Usa o reducer para gerenciar o estado da resposta da atualização
  const [response, dispatch] = useReducer(updateReducer, initialState);

  // Estado para lidar com possíveis vazamentos de memória quando o componente desmonta
  const [cancelled, setCancelled] = useState(false);

  // Função para verificar se a operação deve ser cancelada antes de despachar uma ação
  const checkCancelBeforeDispatch = (action) => {
    if (!cancelled) {
      dispatch(action); // Apenas despacha a ação se o componente não estiver marcado como cancelado
    }
  };

  // Função assíncrona para atualizar um documento específico na coleção
  const updateDocument = async (uid, data) => {
    checkCancelBeforeDispatch({ type: 'LOADING' }); // Indica o início da operação de atualização

    try {
      // Cria uma referência ao documento específico pelo ID (uid) na coleção fornecida
      const docRef = await doc(db, docCollection, uid);

      console.log(docRef); // Log para verificar a referência ao documento

      // Atualiza o documento com os dados fornecidos
      const updatedDocument = await updateDoc(docRef, data);

      console.log(updateDocument); // Log para verificar a atualização

      // Atualiza o estado para indicar que o documento foi atualizado com sucesso
      checkCancelBeforeDispatch({
        type: 'UPDATED_DOC',
        payload: updatedDocument,
      });
    } catch (error) {
      // Captura e exibe o erro caso a atualização falhe
      console.log(error);
      checkCancelBeforeDispatch({ type: 'ERROR', payload: error.message }); // Atualiza o estado com a mensagem de erro
    }
  };

  // useEffect para definir o estado de cancelamento quando o componente desmontar
  useEffect(() => {
    return () => setCancelled(true); // Marca o componente como cancelado ao desmontar
  }, []);

  // Retorna a função de atualização de documentos e o estado da resposta para uso no componente
  return { updateDocument, response };
};
