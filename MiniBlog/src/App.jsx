import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { useAuthentication } from './hooks/useAuthentication';

// pages
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import CreatePost from './pages/CreatePost/CreatePost';
import DashBoard from './pages/DashBoard/DashBoard';
import Search from './pages/Search/Search';
import EditPost from './pages/EditPost/EditPost';
import EsqueceuSenha from './pages/Login/EsqueceuSenha';
import News from './pages/News/News';
import Post from './pages/Post/Post';

// components
import NavBar from './components/NavBar';
import Footer from './components/Footer';

// context
import { AuthProvider } from './Context/AuthContext';

function App() {
  const [user, setUser] = useState(undefined);
  const { auth } = useAuthentication();
  const loadingUser = user === undefined;

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
  }, [auth]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollToTopBtn = document.getElementById('scrollToTopBtn');
      if (
        document.body.scrollTop > 20 ||
        document.documentElement.scrollTop > 20
      ) {
        scrollToTopBtn.style.display = 'block';
      } else {
        scrollToTopBtn.style.display = 'none';
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loadingUser) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="App">
      <AuthProvider value={{ user }}>
        <BrowserRouter>
          <NavBar />
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/login"
                element={!user ? <Login /> : <Navigate to="/" />}
              />
              <Route path="/esqueceu-senha" element={<EsqueceuSenha />} />
              <Route
                path="/register"
                element={!user ? <Register /> : <Navigate to="/" />}
              />
              <Route
                path="/posts/edit/:id"
                element={user ? <EditPost /> : <Navigate to="/login" />}
              />
              <Route
                path="/posts/create"
                element={user ? <CreatePost /> : <Navigate to="/login" />}
              />
              <Route
                path="/dashboard"
                element={user ? <DashBoard /> : <Navigate to="/login" />}
              />
              <Route path="/search" element={<Search />} />
              <Route path="/news" element={<News />} />
              <Route path="/about" element={<About />} />
              <Route path="/posts/:id" element={<Post />} />
            </Routes>
          </div>
          <Footer />
          <button
            id="scrollToTopBtn"
            className="scrollToTopBtn"
            onClick={scrollToTop}
          >
            ↑
          </button>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
