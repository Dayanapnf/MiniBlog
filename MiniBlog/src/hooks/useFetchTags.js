import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, query, onSnapshot } from 'firebase/firestore';

// Hook personalizado para buscar tags de posts no Firestore
export const useFetchTags = () => {
  // Estado para armazenar as tags coletadas dos documentos
  const [tags, setTags] = useState([]);
  // Estado para gerenciar o carregamento da busca
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Função assíncrona para buscar as tags dos posts no Firestore
    const fetchTags = async () => {
      // Referência à coleção de posts no Firestore
      const collectionRef = collection(db, 'posts');
      // Cria uma query para buscar todos os documentos da coleção
      const q = query(collectionRef);

      // Configura um listener para capturar atualizações em tempo real
      onSnapshot(q, (querySnapshot) => {
        const tagsMap = {}; // Objeto para contar as ocorrências de cada tag

        // Itera sobre os documentos da coleção
        querySnapshot.forEach((doc) => {
          const postTags = doc.data().tags; // Extrai as tags de cada post
          // Conta as ocorrências de cada tag
          postTags.forEach((tag) => {
            if (tagsMap[tag]) {
              tagsMap[tag]++; // Incrementa a contagem se a tag já existe
            } else {
              tagsMap[tag] = 1; // Inicializa a contagem se a tag ainda não foi registrada
            }
          });
        });

        // Converte o objeto de contagem de tags em um array de objetos com nome e contagem
        const tagsArray = Object.keys(tagsMap).map((tag) => ({
          name: tag,
          count: tagsMap[tag],
        }));

        // Ordena as tags pelo número de ocorrências em ordem decrescente
        tagsArray.sort((a, b) => b.count - a.count);

        // Define tamanhos para as tags com base na contagem de ocorrências
        const maxCount = tagsArray[0]?.count || 1; // Maior contagem de tags
        const minCount = tagsArray[tagsArray.length - 1]?.count || 1; // Menor contagem de tags
        tagsArray.forEach((tag) => {
          // Atribui tamanhos baseados na frequência das tags
          if (tag.count === maxCount) {
            tag.size = 'large'; // Maior contagem -> tamanho grande
          } else if (tag.count === minCount) {
            tag.size = 'small'; // Menor contagem -> tamanho pequeno
          } else {
            tag.size = 'medium'; // Contagens intermediárias -> tamanho médio
          }
        });

        setTags(tagsArray); // Atualiza o estado com as tags processadas
        setLoading(false); // Finaliza o estado de carregamento
      });
    };

    fetchTags(); // Chama a função de busca das tags
  }, []); // Executa apenas na montagem do componente

  // Retorna as tags e o estado de carregamento para uso no componente
  return { tags, loading };
};
