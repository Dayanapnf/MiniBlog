import styles from './EditPost.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import useEditPost from '../../hooks/useEditPost';
import Card from '../../components/Card';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
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
  } = useEditPost(id);

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
                <button className="btn" disabled={isEditing}>
                  {isEditing ? 'Editando...' : 'Editar'}
                </button>
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
