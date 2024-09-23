// hooks/useEditPost.js
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetchDocument } from './useFetchDocument';
import { useUpdateDocument } from './useUpdateDocument';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/config';

const useEditPost = (id) => {
  const { document: post } = useFetchDocument('posts', id);
  const [title, setTitle] = useState('');
  const [imageType, setImageType] = useState('url');
  const [image, setImage] = useState('');
  const [file, setFile] = useState(null);
  const [body, setBody] = useState('');
  const [tags, setTags] = useState([]);
  const [formError, setFormError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const { updateDocument, response } = useUpdateDocument('posts');
  const navigate = useNavigate();
  const textareaRef = useRef(null);

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setImage(post.image);
      setBody(post.body);
      setTags(post.tags.join(', '));
      adjustTextareaHeight();
    }
  }, [post]);

  const handleBodyChange = (e) => {
    setBody(e.target.value);
    adjustTextareaHeight();
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

      uploadTask.on(
        'state_changed',
        null,
        (error) => {
          setFormError('Erro ao fazer o upload da imagem.');
          console.error('Upload Error:', error);
          setIsEditing(false);
        },
        async () => {
          imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
          updatePost(imageUrl);
        },
      );
      return;
    } else {
      setFormError('Tipo de imagem desconhecido.');
      setIsEditing(false);
      return;
    }

    updatePost(imageUrl);
  };

  const updatePost = (imageUrl) => {
    const tagsArray = tags.split(',').map((tag) => tag.trim().toLowerCase());

    const data = {
      title,
      image: imageUrl,
      body,
      tags: tagsArray,
    };

    updateDocument(id, data);
    navigate(`/posts/${id}`);
  };

  return {
    title,
    setTitle,
    imageType,
    setImageType,
    image,
    setImage,
    file,
    setFile,
    body,
    setBody,
    tags,
    setTags,
    formError,
    isEditing,
    handleBodyChange,
    handleSubmit,
    response,
    textareaRef,
    post,
  };
};

export default useEditPost;
