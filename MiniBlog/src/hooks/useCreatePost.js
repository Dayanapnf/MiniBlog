import { useState } from 'react';
import { useInsertDocument } from './useInsertDocument'; // Importa o hook para inserir documentos
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/config'; // Importa a configuração do Firebase

const useCreatePost = () => {
  const [formError, setFormError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { insertDocument, response } = useInsertDocument('posts'); // Inicializa o hook de inserção

  const createPost = async (postData, imageType, file) => {
    setFormError('');
    setIsSubmitting(true);

    let imageUrl = '';

    if (imageType === 'upload') {
      if (!file) {
        setFormError('Por favor, selecione um arquivo para upload.');
        setIsSubmitting(false);
        return;
      }

      const fileRef = ref(storage, `images/${file.name}`);
      const uploadTask = uploadBytesResumable(fileRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          setFormError('Erro ao fazer o upload da imagem.');
          console.error('Upload Error:', error);
          setIsSubmitting(false);
        },
        async () => {
          imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
          postData.image = imageUrl; // Adiciona a URL da imagem ao postData
          insertDocument(postData); // Insere o documento
          setIsSubmitting(false); // Restaura o estado de envio
        },
      );
    } else {
      imageUrl = postData.image; // Usa a URL fornecida
      insertDocument({ ...postData, image: imageUrl }); // Insere o documento
      setIsSubmitting(false);
    }
  };

  return { createPost, isSubmitting, formError, uploadProgress, response };
};

export default useCreatePost;
