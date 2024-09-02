import { useEffect, useState } from 'react';
import { useAuthentication } from '../../hooks/useAuthentication';
import { Link } from 'react-router-dom';
import Card from '../../components/Card'; // Importa o componente Card
import styles from './Login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { login, error: authError, loading } = useAuthentication();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');

    const user = {
      email,
      password,
    };

    const res = await login(user);

    console.log(res);
  };

  useEffect(() => {
    console.log(authError);
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  return (
    <div className={styles.login}>
      <h2>Entre para postar</h2>
      <p>Faça o login e desfrute de uma experiência mais completa</p>
      <Card className={styles.full_width_card}>
        <form onSubmit={handleSubmit}>
          <label>
            <span>E-mail:</span>
            <input
              type="email"
              name="email"
              required
              placeholder="E-mail do usuário"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </label>
          <label>
            <span>Senha:</span>
            <input
              type="password"
              name="password"
              required
              placeholder="Insira a senha"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </label>
          <div className={styles.button_container}>
            <button className="btn" type="submit" disabled={loading}>
              {loading ? 'Aguarde...' : 'Entrar'}
            </button>
            {error && <p className="error">{error}</p>}
            <p>
              <Link to="/esqueceu-senha">Esqueceu sua senha?</Link>
            </p>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Login;
