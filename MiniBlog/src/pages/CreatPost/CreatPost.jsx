import { useNavigate } from 'react-router-dom';
import styles from './CreatPost.module.css';
import { useAuthValue } from '../../Context/AuthContext';
import { useState } from 'react';

const CreatPost = () => {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState([]);
  const [fomrError, setFormError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <div className={styles.creat_post}>
      <h2>Criar Post</h2>
      <p>Escreva sobre o que quiser e compartilhe o seu conhecimento!</p>
      <form>
        <label>
          <span>Título:</span>
          <input
            type="text"
            name="title"
            required
            placeholder="Pense em um bom título"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
        </label>
        <label>
          <span>URL da imagem:</span>
          <input
            type="text"
            name="image"
            required
            placeholder="Insira uma imagem que representa o seu post"
            onChange={(e) => setImage(e.target.value)}
            value={image}
          />
        </label>
        <label>
          <span>Conteúdo:</span>
          <textarea
            name="body"
            required
            placeholder="Insira o seu conteúdo"
            onChange={(e) => setBody(e.target.value)}
            value={body}
          ></textarea>
        </label>
        <label>
          <span>Tags:</span>
          <input
            type="text"
            name="tags"
            required
            placeholder="Insira as Tags separadas por vírgula"
            onChange={(e) => setTags(e.target.value)}
            value={tags}
          />
        </label>
        {/* <button className="btn" type="submit" disabled={loading}>
          {loading ? 'Aguarde...' : 'Enviar'}
        </button>
        {error && <p className="error">{error}</p>} */}
      </form>
    </div>
  );
};

export default CreatPost;
