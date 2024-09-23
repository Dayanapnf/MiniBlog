import styles from './CreatePost.module.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthValue } from '../../Context/AuthContext';
import useCreatePost from '../../hooks/useCreatePost';
import Card from '../../components/Card';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [imageType, setImageType] = useState('url');
  const [image, setImage] = useState('');
  const [file, setFile] = useState(null);
  const [body, setBody] = useState('');
  const [tags, setTags] = useState('');
  const { user } = useAuthValue();
  const navigate = useNavigate();
  const { createPost, isSubmitting, formError, uploadProgress } =
    useCreatePost();

  const handleSubmit = (e) => {
    e.preventDefault();

    const tagsArray = tags.split(',').map((tag) => tag.trim().toLowerCase());
    const postData = {
      title,
      body,
      tags: tagsArray,
      uid: user.uid,
      createdBy: user.displayName,
    };

    createPost(postData, imageType, file);
    navigate('/'); // Redireciona para a página inicial após a criação do post
  };

  return (
    <div className={styles.create_post}>
      <h2>Criar Novo Post</h2>
      <p>Escreva sobre o que quiser e compartilhe seu conhecimento!</p>
      <Card className={styles.full_width_card}>
        <form onSubmit={handleSubmit}>
          <label>
            <span>Título:</span>
            <input
              type="text"
              required
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
          </label>
          <label>
            <span>Tipo de Imagem:</span>
            <select
              onChange={(e) => setImageType(e.target.value)}
              value={imageType}
            >
              <option value="url">URL</option>
              <option value="upload">Upload</option>
            </select>
          </label>
          {imageType === 'url' && (
            <label>
              <span>URL da imagem:</span>
              <input
                type="text"
                onChange={(e) => setImage(e.target.value)}
                value={image}
              />
            </label>
          )}
          {imageType === 'upload' && (
            <label>
              <span>Arquivo da imagem:</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
          )}
          <label>
            <span>Conteúdo:</span>
            <textarea
              required
              onChange={(e) => setBody(e.target.value)}
              value={body}
            ></textarea>
          </label>
          <label>
            <span>Tags:</span>
            <input
              type="text"
              required
              onChange={(e) => setTags(e.target.value)}
              value={tags}
            />
          </label>
          <div className={styles.button_container}>
            <button className=" btn " disabled={isSubmitting}>
              {isSubmitting ? 'Criando...' : 'Criar Post'}
            </button>
            {formError && <p className="error">{formError}</p>}
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreatePost;
