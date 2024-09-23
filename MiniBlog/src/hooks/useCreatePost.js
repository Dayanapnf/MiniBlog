import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthValue } from '../Context/AuthContext';
import { useInsertDocument } from '../hooks/useInsertDocument';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/config';

const useCreatePost = () => {
  const [formError, setFormError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuthValue();
  const navigate = useNavigate();
  const { insertDocument, response } = useInsertDocument('posts');

  const createPost = async (title, imageType, image, file, body, tags) => {
    setFormError('');
    setIsSubmitting(true);

    if (imageType === 'url' && !image) {
      setFormError('Por favor, insira uma URL da imagem.');
      setIsSubmitting(false);
      return;
    }

    if (imageType === 'upload' && !file) {
      setFormError('Por favor, selecione um arquivo para upload.');
      setIsSubmitting(false);
      return;
    }

    if (!title || !body || !tags) {
      setFormError('Por favor, preencha todos os campos!');
      setIsSubmitting(false);
      return;
    }

    let imageUrl = '';

    if (imageType === 'upload') {
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
          await insertPost({ title, imageUrl, body, tags, user });
        },
      );
    } else {
      imageUrl = image;
      await insertPost({ title, imageUrl, body, tags, user });
    }
  };

  const insertPost = async ({ title, imageUrl, body, tags, user }) => {
    const tagsArray = tags.split(',').map((tag) => tag.trim().toLowerCase());

    await insertDocument({
      title,
      image: imageUrl,
      body,
      tags: tagsArray,
      uid: user.uid,
      createdBy: user.displayName,
    });

    navigate('/');
  };

  return { createPost, formError, isSubmitting, uploadProgress, response };
};

export default useCreatePost;
