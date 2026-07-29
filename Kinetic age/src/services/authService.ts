import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { apiRequest, setStoredToken, removeStoredToken } from './api';
import { User } from '../types';

export const authService = {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const normalizedEmail = email.trim().toLowerCase();
    
    // Call API backend first to validate credentials & get backend token
    const res = await apiRequest<{ user: User; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: normalizedEmail, password }),
    });

    if (res.token) {
      setStoredToken(res.token);
    }

    // Authenticate with Firebase Auth & Firestore in parallel/background
    try {
      let firebaseUser;
      try {
        const userCredential = await signInWithEmailAndPassword(auth, normalizedEmail, password);
        firebaseUser = userCredential.user;
      } catch (authErr: any) {
        // If user is not yet created in Firebase Auth (e.g. seeded demo user), create in Firebase
        if (authErr.code === 'auth/user-not-found' || authErr.code === 'auth/invalid-credential') {
          try {
            const userCredential = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
            firebaseUser = userCredential.user;
          } catch (createErr) {
            console.warn('Firebase user creation fallback skipped:', createErr);
          }
        }
      }

      if (firebaseUser) {
        // Sync user profile data to Firestore
        const userRef = doc(db, 'users', firebaseUser.uid);
        await setDoc(
          userRef,
          {
            uid: firebaseUser.uid,
            name: res.user.name,
            email: res.user.email,
            role: res.user.role,
            phone: res.user.phone || '',
            age: res.user.age || null,
            emergencyContact: res.user.emergencyContact || '',
            lastLoginAt: new Date().toISOString(),
          },
          { merge: true }
        );
      }
    } catch (firebaseErr) {
      console.warn('Firebase login sync notice:', firebaseErr);
    }

    return res;
  },

  async register(data: {
    name: string;
    email: string;
    password: string;
    role?: 'user' | 'admin';
    phone?: string;
    age?: number;
    emergencyContact?: string;
  }): Promise<{ user: User; token: string }> {
    const normalizedEmail = data.email.trim().toLowerCase();

    // Call API backend to register user and produce backend JWT token
    const res = await apiRequest<{ user: User; token: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ ...data, email: normalizedEmail }),
    });

    if (res.token) {
      setStoredToken(res.token);
    }

    // Register user in Firebase Auth & store in Firestore
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, normalizedEmail, data.password);
      const firebaseUser = userCredential.user;

      const userRef = doc(db, 'users', firebaseUser.uid);
      await setDoc(userRef, {
        uid: firebaseUser.uid,
        name: data.name,
        email: normalizedEmail,
        role: data.role || 'user',
        phone: data.phone || '',
        age: data.age || null,
        emergencyContact: data.emergencyContact || '',
        createdAt: new Date().toISOString(),
      });
    } catch (firebaseErr) {
      console.warn('Firebase registration sync notice:', firebaseErr);
    }

    return res;
  },

  async logout(): Promise<void> {
    try {
      await signOut(auth);
      await apiRequest('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.warn('Logout notice:', err);
    } finally {
      removeStoredToken();
    }
  },

  async getMe(): Promise<User> {
    return apiRequest<User>('/api/auth/me');
  },
};
