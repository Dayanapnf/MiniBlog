import React, { useState } from 'react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import Card from '../../components/Card'; // Importa o componente Card
import styles from './EsqueceuSenha.module.css';

const EsqueceuSenha = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const auth = getAuth();

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage(
        'Se o e-mail estiver registrado, você receberá um link para redefinir sua senha',
      );
      setEmail('');
      setError('');
    } catch (error) {
      setError('Erro ao enviar e-mail. Verifique se o endereço está correto.');
      setMessage('');
      console.error('Erro ao enviar e-mail:', error);
    }
  };

  return (
    <div className={styles.resetPassword}>
      <h2>Redefinir Senha</h2>
      <p>
        Insira o e-mail associado à sua conta.
        <br /> Você receberá um link para redefinir sua senha.
      </p>
      <Card className={styles.full_width_card}>
        <form onSubmit={handleResetPassword}>
          <label>
            <span>E-mail:</span>
            <input
              type="email"
              required
              placeholder="Digite seu e-mail"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </label>
          <div className={styles.button_container}>
            <button className="btn" type="submit">
              Enviar
            </button>
            {message && <p className="message">{message}</p>}
            {error && <p className="error">{error}</p>}
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EsqueceuSenha;
