import React from 'react';
import { useParams } from 'react-router-dom';
import Card from '../../components/Card';
import styles from './Post.module.css';

// hooks
import { useFetchDocument } from '../../hooks/useFetchDocument';

const Post = () => {
  const { id } = useParams();
  const { document: post } = useFetchDocument('posts', id);

  return (
    <Card className={`${styles.post_container} ${styles.extra_margin}`}>
      {post && (
        <>
          <h2>{post.title}</h2>
          <p className={styles.createdby}>por: {post.createdBy}</p>
          <img src={post.image} alt={post.title} />
          <p className={styles.post_content}>{post.body}</p>
          <h3>Este post trata sobre:</h3>
          <div className={styles.tags}>
            {post.tags.map((tag) => (
              <p key={tag}>
                <span>#</span>
                {tag}
              </p>
            ))}
          </div>
        </>
      )}
    </Card>
  );
};

export default Post;
