import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Configuração do Firebase com as credenciais do projeto
const firebaseConfig = {
  apiKey: 'AIzaSyD4OCxxTXTBAjeI1G8D3MTDF2USR1qj3xY', // Chave de API para autenticação com o Firebase
  authDomain: 'miniblog-d6357.firebaseapp.com', // Domínio de autenticação
  projectId: 'miniblog-d6357', // ID do projeto Firebase
  storageBucket: 'miniblog-d6357.appspot.com', // Bucket do Storage para armazenar arquivos
  messagingSenderId: '425440055473', // ID do remetente para o serviço de mensagens (FCM)
  appId: '1:425440055473:web:4429d3756b6ac096a09290', // ID da aplicação
  measurementId: 'G-0TXJLKVHXB', // ID de medição para o Google Analytics (opcional)
};

// Inicializa o Firebase com a configuração fornecida
const app = initializeApp(firebaseConfig);

// Inicializa o Firestore, que é o banco de dados em tempo real do Firebase
const db = getFirestore(app);

// Inicializa o Storage do Firebase, que é utilizado para armazenar arquivos como imagens e vídeos
const storage = getStorage(app);

// Exporta as instâncias do Firestore e Storage para serem usadas em outras partes da aplicação
export { db, storage };
