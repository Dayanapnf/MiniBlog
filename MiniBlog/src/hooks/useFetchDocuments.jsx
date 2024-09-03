import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  where,
} from 'firebase/firestore';

// Hook personalizado para buscar múltiplos documentos de uma coleção no Firestore com filtros opcionais
export const useFetchDocuments = (docCollection, search = null, uid = null) => {
  // Estado para armazenar os documentos retornados do Firestore
  const [documents, setDocuments] = useState(null);
  // Estado para capturar possíveis erros durante a busca
  const [error, setError] = useState(null);
  // Estado para indicar quando a busca está em andamento
  const [loading, setLoading] = useState(null);
  // Estado para lidar com vazamentos de memória quando o componente é desmontado
  const [cancelled, setCancelled] = useState(false);

  // useEffect que executa a busca dos documentos no Firestore
  useEffect(() => {
    async function loadData() {
      // Verifica se o hook foi cancelado para evitar operações desnecessárias
      if (cancelled) {
        return;
      }

      setLoading(true); // Inicia o estado de carregamento

      // Cria uma referência à coleção no Firestore
      const collectionRef = await collection(db, docCollection);

      try {
        let q; // Variável para armazenar a consulta (query)

        // Define a query com base nos parâmetros de busca fornecidos
        if (search) {
          // Filtra documentos com a tag especificada e ordena por data de criação
          q = await query(
            collectionRef,
            where('tags', 'array-contains', search),
            orderBy('createdAt', 'desc'),
          );
        } else if (uid) {
          // Filtra documentos com um ID de usuário específico e ordena por data de criação
          q = await query(
            collectionRef,
            where('uid', '==', uid),
            orderBy('createdAt', 'desc'),
          );
        } else {
          // Ordena os documentos apenas pela data de criação
          q = await query(collectionRef, orderBy('createdAt', 'desc'));
        }

        // Configura um listener para capturar os documentos em tempo real
        await onSnapshot(q, (querySnapshot) => {
          setDocuments(
            // Mapeia os documentos para um formato amigável com ID e dados do documento
            querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })),
          );
        });
      } catch (error) {
        // Captura e define o erro caso ocorra durante a consulta
        console.log(error);
        setError(error.message);
      }

      setLoading(false); // Finaliza o estado de carregamento
    }

    loadData(); // Chama a função para carregar os dados
  }, [docCollection, search, uid, cancelled]); // Executa novamente se qualquer uma das dependências mudar

  console.log(documents); // Debug: Exibe os documentos no console

  // useEffect para definir o estado de cancelamento quando o componente desmonta
  useEffect(() => {
    return () => setCancelled(true);
  }, []);

  // Retorna os documentos, estado de carregamento e possíveis erros
  return { documents, loading, error };
};
