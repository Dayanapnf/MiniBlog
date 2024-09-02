import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, query, onSnapshot } from 'firebase/firestore';

export const useFetchTags = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTags = async () => {
      const collectionRef = collection(db, 'posts');
      const q = query(collectionRef);

      onSnapshot(q, (querySnapshot) => {
        const tagsMap = {};
        querySnapshot.forEach((doc) => {
          const postTags = doc.data().tags;
          postTags.forEach((tag) => {
            if (tagsMap[tag]) {
              tagsMap[tag]++;
            } else {
              tagsMap[tag] = 1;
            }
          });
        });

        const tagsArray = Object.keys(tagsMap).map((tag) => ({
          name: tag,
          count: tagsMap[tag],
        }));

        // Sort tags by count in descending order
        tagsArray.sort((a, b) => b.count - a.count);

        // Assign sizes based on count
        const maxCount = tagsArray[0]?.count || 1;
        const minCount = tagsArray[tagsArray.length - 1]?.count || 1;
        tagsArray.forEach((tag) => {
          if (tag.count === maxCount) {
            tag.size = 'large';
          } else if (tag.count === minCount) {
            tag.size = 'small';
          } else {
            tag.size = 'medium';
          }
        });

        setTags(tagsArray);
        setLoading(false);
      });
    };

    fetchTags();
  }, []);

  return { tags, loading };
};
