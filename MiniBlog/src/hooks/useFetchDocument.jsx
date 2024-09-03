import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

// Hook personalizado para buscar um documento específico de uma coleção no Firestore
export const useFetchDocument = (docCollection, id) => {
  // Estado para armazenar o documento retornado do Firestore
  const [document, setDocument] = useState(null);
  // Estado para capturar erros que possam ocorrer durante a busca
  const [error, setError] = useState(null);
  // Estado para indicar o carregamento da busca
  const [loading, setLoading] = useState(null);

  // useEffect para carregar o documento quando os parâmetros da coleção ou id mudarem
  useEffect(() => {
    // Função assíncrona para buscar o documento do Firestore
    const loadDocument = async () => {
      setLoading(true); // Inicia o estado de carregamento

      try {
        // Cria uma referência ao documento específico da coleção com o ID fornecido
        const docRef = await doc(db, docCollection, id);
        // Busca o documento a partir da referência criada
        const docSnap = await getDoc(docRef);

        // Atualiza o estado com os dados do documento se ele for encontrado
        setDocument(docSnap.data());
      } catch (error) {
        // Captura e define o erro caso a busca falhe
        console.log(error);
        setError(error.message);
      }

      setLoading(false); // Finaliza o estado de carregamento
    };

    loadDocument(); // Chama a função para carregar o documento assim que o componente monta
  }, [docCollection, id]); // Reexecuta o efeito se a coleção ou id mudar

  // Exibe o documento no console para debug
  console.log(document);

  // Retorna o documento, estado de carregamento e possíveis erros para uso no componente
  return { document, loading, error };
};
