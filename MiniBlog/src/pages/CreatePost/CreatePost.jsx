import styles from './CreatePost.module.css';
import { useState } from 'react';
import useCreatePost from '../../hooks/useCreatePost';
import Card from '../../components/Card';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [imageType, setImageType] = useState('url');
  const [image, setImage] = useState('');
  const [file, setFile] = useState(null);
  const [body, setBody] = useState('');
  const [tags, setTags] = useState('');

  const { createPost, formError, isSubmitting } = useCreatePost(); // Usa o hook

  const handleSubmit = (e) => {
    e.preventDefault();
    createPost(title, imageType, image, file, body, tags);
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
              name="title"
              required
              placeholder="Pense num bom título..."
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
          </label>
          <label>
            <span>Tipo de Imagem:</span>
            <select
              name="imageType"
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
                name="image"
                placeholder="Insira uma imagem que representa seu post"
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
                name="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
          )}
          <label>
            <span>Conteúdo:</span>
            <textarea
              name="body"
              required
              placeholder="Insira o conteúdo do post"
              onChange={(e) => setBody(e.target.value)}
              value={body}
              className={styles.textarea}
            ></textarea>
          </label>
          <label>
            <span>Tags:</span>
            <input
              type="text"
              name="tags"
              required
              placeholder="Insira as tags separadas por vírgula"
              onChange={(e) => setTags(e.target.value)}
              value={tags}
            />
          </label>
          <div className={styles.button_container}>
            <button className="btn" disabled={isSubmitting}>
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
