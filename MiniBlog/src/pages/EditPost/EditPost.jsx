import styles from './EditPost.module.css';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthValue } from '../../Context/AuthContext';
import { useFetchDocument } from '../../hooks/useFetchDocument';
import { useUpdateDocument } from '../../hooks/useUpdateDocument';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase/config';
import Card from '../../components/Card'; // Importa o componente Card

const EditPost = () => {
  const { id } = useParams();
  const { document: post } = useFetchDocument('posts', id);

  const [title, setTitle] = useState('');
  const [imageType, setImageType] = useState('url'); // Estado para o tipo de imagem
  const [image, setImage] = useState('');
  const [file, setFile] = useState(null); // Estado para o arquivo
  const [body, setBody] = useState('');
  const [tags, setTags] = useState([]);
  const [formError, setFormError] = useState('');

  const { user } = useAuthValue();
  const navigate = useNavigate();
  const { updateDocument, response } = useUpdateDocument('posts');

  const textareaRef = useRef(null);

  // Ajuste da altura do textarea
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      // Reseta para calcular o scrollHeight corretamente
      textareaRef.current.style.height = 'auto';
      // Define a altura para acomodar o conteúdo completo
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  // UseEffect para carregar o post e ajustar a altura inicialmente
  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setImage(post.image);
      setBody(post.body);
      setTags(post.tags.join(', '));
      adjustTextareaHeight(); // Ajuste inicial ao carregar o post
    }
  }, [post]);

  // Função para mudar o conteúdo do textarea
  const handleBodyChange = (e) => {
    setBody(e.target.value);
    adjustTextareaHeight(); // Ajusta a altura ao mudar o conteúdo
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    // Verificando se o tipo de imagem está correto
    let imageUrl = '';
    if (imageType === 'url') {
      try {
        new URL(image);
        imageUrl = image;
      } catch (error) {
        setFormError('A imagem precisa ser uma URL válida.');
        return;
      }
    } else if (imageType === 'upload') {
      if (!file) {
        setFormError('Por favor, selecione um arquivo para upload.');
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
        },
        async () => {
          imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
          updatePost(imageUrl);
        },
      );
      return;
    } else {
      setFormError('Tipo de imagem desconhecido.');
      return;
    }

    // Atualizar post com a URL da imagem
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
    navigate('/dashboard');
  };

  return (
    <div className={styles.edit_post}>
      {post && (
        <>
          <h2>Editando post: {post.title}</h2>
          <p>Altere os dados do post como desejar</p>
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
                    required
                    placeholder="Insira uma imagem que represente seu post"
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
              <p className={styles.preview_title}>Preview da imagem:</p>
              <img
                className={styles.image_preview}
                src={
                  imageType === 'url'
                    ? image
                    : file
                    ? URL.createObjectURL(file)
                    : post.image
                }
                alt={post.title}
              />
              <label>
                <span>Conteúdo:</span>
                <textarea
                  name="body"
                  required
                  placeholder="Insira o conteúdo do post"
                  onChange={handleBodyChange}
                  value={body}
                  ref={textareaRef}
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
                {!response.loading && <button className="btn">Editar</button>}
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
        </>
      )}
    </div>
  );
};

export default EditPost;
