import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
} from 'firebase/auth';
import { useEffect, useState } from 'react';

export const useAuthentication = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);

  //cleanup
  const [cancelled, setCancelled] = useState(null);

  const auth = getAuth();

  function checkIfIsCancelled() {
    if (cancelled) {
      return;
    }
  }
};
