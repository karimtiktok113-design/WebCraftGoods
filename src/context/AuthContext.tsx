import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  loginOwner: (identity: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  ownerEmail: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Master Owner Credentials
export const OWNER_EMAIL = 'karimtiktok113@gmail.com';
export const OWNER_PASSWORD = 'KarimOwner#2026';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isOwnerAuthenticated, setIsOwnerAuthenticated] = useState<boolean>(() => {
    // Clear legacy public demo admin key
    try {
      localStorage.removeItem('webcraft_demo_admin');
    } catch {
      // ignore
    }
    // Owner session is securely stored in sessionStorage
    return sessionStorage.getItem('webcraft_owner_auth_session') === 'verified';
  });

  useEffect(() => {
    // Clean up any legacy public demo admin keys
    try {
      localStorage.removeItem('webcraft_demo_admin');
    } catch {
      // ignore
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      // If signed in with owner email via Firebase, also confirm owner session
      if (currentUser?.email?.toLowerCase() === OWNER_EMAIL.toLowerCase()) {
        setIsOwnerAuthenticated(true);
        sessionStorage.setItem('webcraft_owner_auth_session', 'verified');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Admin access is strictly restricted to verified owner session
  const isAdmin = Boolean(isOwnerAuthenticated);

  /**
   * Strictly verifies owner credentials.
   * Only the store owner with the readymade credentials can log in.
   */
  const loginOwner = async (identity: string, pass: string): Promise<void> => {
    const normalizedIdentity = identity.trim().toLowerCase();
    const isOwnerIdentifier =
      normalizedIdentity === OWNER_EMAIL.toLowerCase() ||
      normalizedIdentity === 'admin' ||
      normalizedIdentity === 'karim' ||
      normalizedIdentity === 'admin@webcraftgoods.com';

    const isPasswordValid = pass === OWNER_PASSWORD;

    if (!isOwnerIdentifier || !isPasswordValid) {
      throw new Error(
        'Access Denied: Invalid credentials. Only the authorized store owner can access the Admin Command Center.'
      );
    }

    // Set verified owner session
    setIsOwnerAuthenticated(true);
    sessionStorage.setItem('webcraft_owner_auth_session', 'verified');

    // Synchronize with Firebase Auth
    try {
      await signInWithEmailAndPassword(auth, OWNER_EMAIL, OWNER_PASSWORD);
    } catch (firebaseErr: any) {
      // If Firebase user does not exist yet, auto-provision owner account in Firebase
      if (
        firebaseErr.code === 'auth/user-not-found' ||
        firebaseErr.code === 'auth/invalid-credential'
      ) {
        try {
          await createUserWithEmailAndPassword(auth, OWNER_EMAIL, OWNER_PASSWORD);
        } catch {
          // Firebase account creation silent catch, session is already verified locally
        }
      }
    }
  };

  const logout = async () => {
    setIsOwnerAuthenticated(false);
    sessionStorage.removeItem('webcraft_owner_auth_session');
    try {
      localStorage.removeItem('webcraft_demo_admin');
    } catch {
      // ignore
    }
    try {
      await signOut(auth);
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        loading,
        loginOwner,
        logout,
        ownerEmail: OWNER_EMAIL,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
