import { useState, useEffect, useRef } from 'react';
import { useFetchDocument } from './useFetchDocument';
import { useUpdateDocument } from './useUpdateDocument';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/config';
import { useNavigate } from 'react-router-dom'; // Adicione esta linha

const useEditPost = (id) => {
  const navigate = useNavigate(); // Adicione esta linha
  const { document: post } = useFetchDocument('posts', id);
  const { updateDocument, response } = useUpdateDocument('posts');

  const [title, setTitle] = useState('');
  const [imageType, setImageType] = useState('url');
  const [image, setImage] = useState('');
  const [file, setFile] = useState(null);
  const [body, setBody] = useState('');
  const [tags, setTags] = useState([]);
  const [formError, setFormError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setImage(post.image);
      setBody(post.body);
      setTags(post.tags.join(', '));
      adjustTextareaHeight();
    }
  }, [post]);

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleBodyChange = (e) => {
    setBody(e.target.value);
    adjustTextareaHeight();
  };

  const updatePost = async (imageUrl) => {
    const tagsArray = tags.split(',').map((tag) => tag.trim().toLowerCase());
    const data = {
      title,
      image: imageUrl,
      body,
      tags: tagsArray,
    };

    await updateDocument(id, data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setIsEditing(true);

    let imageUrl = '';
    if (imageType === 'url') {
      try {
        new URL(image);
        imageUrl = image;
      } catch (error) {
        setFormError('A imagem precisa ser uma URL válida.');
        setIsEditing(false);
        return;
      }
    } else if (imageType === 'upload') {
      if (!file) {
        setFormError('Por favor, selecione um arquivo para upload.');
        setIsEditing(false);
        return;
      }

      const fileRef = ref(storage, `images/${file.name}`);
      const uploadTask = uploadBytesResumable(fileRef, file);

      await new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          null,
          (error) => {
            setFormError('Erro ao fazer o upload da imagem.');
            console.error('Upload Error:', error);
            setIsEditing(false);
            reject(error);
          },
          async () => {
            imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
            resolve();
          },
        );
      });
    } else {
      setFormError('Tipo de imagem desconhecido.');
      setIsEditing(false);
      return;
    }

    await updatePost(imageUrl);
    navigate(`/posts/${id}`); // Agora deve funcionar
  };

  return {
    post,
    title,
    setTitle,
    imageType,
    setImageType,
    image,
    setImage,
    file,
    setFile,
    body,
    handleBodyChange,
    tags,
    setTags,
    formError,
    isEditing,
    handleSubmit,
    textareaRef,
    response,
  };
};

export default useEditPost;
