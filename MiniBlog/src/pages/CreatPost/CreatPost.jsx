import styles from './CreatPost.module.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthValue } from '../../Context/AuthContext';
import { useInsertDocument } from '../../hooks/useInsertDocument';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase/config';
import Card from '../../components/Card';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [imageType, setImageType] = useState('url'); // Estado para o tipo de imagem
  const [image, setImage] = useState('');
  const [file, setFile] = useState(null); // Estado para o arquivo
  const [body, setBody] = useState('');
  const [tags, setTags] = useState('');
  const [formError, setFormError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0); // Para mostrar o progresso do upload

  const { user } = useAuthValue();
  const navigate = useNavigate();
  const { insertDocument, response } = useInsertDocument('posts');

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    // Verificar se o tipo de imagem está correto
    if (imageType === 'url' && !image) {
      setFormError('Por favor, insira uma URL da imagem.');
      return;
    }

    if (imageType === 'upload' && !file) {
      setFormError('Por favor, selecione um arquivo para upload.');
      return;
    }

    // Verificar se o conteúdo está preenchido
    if (!title || !body || !tags) {
      setFormError('Por favor, preencha todos os campos!');
      return;
    }

    // Se o tipo de imagem for 'upload', fazer o upload e obter a URL
    let imageUrl = '';
    if (imageType === 'upload') {
      const fileRef = ref(storage, `images/${file.name}`);
      const uploadTask = uploadBytesResumable(fileRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Progresso do upload
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          setFormError('Erro ao fazer o upload da imagem.');
          console.error('Upload Error:', error);
        },
        async () => {
          imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
          createPost(imageUrl);
        },
      );
    } else {
      // Caso contrário, use a URL fornecida
      imageUrl = image;
      createPost(imageUrl);
    }
  };

  const createPost = (imageUrl) => {
    // Criar o post com a URL da imagem
    const tagsArray = tags.split(',').map((tag) => tag.trim().toLowerCase());

    insertDocument({
      title,
      image: imageUrl,
      body,
      tags: tagsArray,
      uid: user.uid,
      createdBy: user.displayName,
    });

    // Redirecionar para a página inicial
    navigate('/');
  };

  return (
    <div className={styles.creat_post}>
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
