import styles from './CreatPost.module.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthValue } from '../../Context/AuthContext';
import { useInsertDocument } from '../../hooks/useInsertDocument';
import Card from '../../components/Card';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState('');
  const [formError, setFormError] = useState('');

  const { user } = useAuthValue();
  const navigate = useNavigate();
  const { insertDocument, response } = useInsertDocument('posts');

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    // Verificação básica
    if (!title || !image || !body || !tags) {
      setFormError('Por favor, preencha todos os campos.');
      return;
    }

    const tagsArray = tags.split(',').map((tag) => tag.trim().toLowerCase());

    const data = {
      title,
      image,
      body,
      tags: tagsArray,
      uid: user.uid,
      createdBy: user.displayName,
    };

    insertDocument(data);
    navigate('/dashboard');
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
            <span>URL da imagem:</span>
            <input
              type="text"
              name="image"
              required
              placeholder="Insira uma imagem que represente seu post"
              onChange={(e) => setImage(e.target.value)}
              value={image}
            />
          </label>
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
            {!response.loading && <button className="btn">Criar Post</button>}
            {response.loading && (
              <button className="btn" disabled>
                Aguarde...
              </button>
            )}
            {(response.error || formError) && (
              <p className="error">{response.error || formError}</p>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreatePost;
