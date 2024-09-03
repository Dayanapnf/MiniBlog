import styles from './CreatPost.module.css'; // Importa estilos específicos para o componente
import { useState } from 'react'; // Importa o hook useState para gerenciar estados
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para redirecionar após a criação do post
import { useAuthValue } from '../../Context/AuthContext'; // Importa o contexto de autenticação
import { useInsertDocument } from '../../hooks/useInsertDocument'; // Importa o hook customizado para inserir documentos no Firebase
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'; // Importa funções do Firebase Storage
import { storage } from '../../firebase/config'; // Importa a configuração do Firebase Storage
import Card from '../../components/Card'; // Importa o componente Card para a estilização

const CreatePost = () => {
  // Estados para gerenciar os dados do formulário e o progresso do upload
  const [title, setTitle] = useState('');
  const [imageType, setImageType] = useState('url'); // Estado para o tipo de imagem
  const [image, setImage] = useState('');
  const [file, setFile] = useState(null); // Estado para o arquivo
  const [body, setBody] = useState('');
  const [tags, setTags] = useState('');
  const [formError, setFormError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0); // Para mostrar o progresso do upload

  const { user } = useAuthValue(); // Obtém informações do usuário autenticado
  const navigate = useNavigate(); // Hook para redirecionar após a criação do post
  const { insertDocument, response } = useInsertDocument('posts'); // Função para inserir o post no Firebase

  // Função para ajustar automaticamente a altura da área de texto
  const autoResizeTextarea = (e) => {
    const textarea = e.target;
    textarea.style.height = 'auto'; // Reseta a altura para recalcular
    textarea.style.height = `${textarea.scrollHeight}px`; // Define a nova altura com base no conteúdo
  };

  // Função chamada ao submeter o formulário
  const handleSubmit = (e) => {
    e.preventDefault(); // Previne o comportamento padrão de envio do formulário
    setFormError(''); // Limpa qualquer erro anterior

    // Valida os dados do formulário
    if (imageType === 'url' && !image) {
      setFormError('Por favor, insira uma URL da imagem.');
      return;
    }

    if (imageType === 'upload' && !file) {
      setFormError('Por favor, selecione um arquivo para upload.');
      return;
    }

    if (!title || !body || !tags) {
      setFormError('Por favor, preencha todos os campos!');
      return;
    }

    // Se o tipo de imagem for 'upload', faz o upload e obtém a URL
    let imageUrl = '';
    if (imageType === 'upload') {
      const fileRef = ref(storage, `images/${file.name}`); // Referência ao arquivo no Firebase Storage
      const uploadTask = uploadBytesResumable(fileRef, file); // Inicia o upload do arquivo

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Calcula e define o progresso do upload
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          // Define erro e exibe mensagem de erro
          setFormError('Erro ao fazer o upload da imagem.');
          console.error('Upload Error:', error);
        },
        async () => {
          // Obtém a URL da imagem após o upload ser concluído
          imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
          createPost(imageUrl); // Cria o post com a URL da imagem
        },
      );
    } else {
      // Caso contrário, usa a URL fornecida
      imageUrl = image;
      createPost(imageUrl); // Cria o post com a URL da imagem
    }
  };

  // Função para criar o post
  const createPost = (imageUrl) => {
    const tagsArray = tags.split(',').map((tag) => tag.trim().toLowerCase()); // Converte as tags para um array

    // Insere o documento no Firebase
    insertDocument({
      title,
      image: imageUrl,
      body,
      tags: tagsArray,
      uid: user.uid,
      createdBy: user.displayName,
    });

    // Redireciona para a página inicial após a criação do post
    navigate('/');
  };

  return (
    <div className={styles.creat_post}>
      {' '}
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
              onChange={(e) => {
                setBody(e.target.value);
                autoResizeTextarea(e); // Ajusta a altura da área de texto
              }}
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
