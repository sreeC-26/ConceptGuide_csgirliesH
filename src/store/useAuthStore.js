import { create } from 'zustand';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../firebase/config';

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  
  setUser: (user) => set({ user, loading: false }),
  setLoading: (loading) => set({ loading }),
  
  signIn: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  signUp: async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  signOut: async () => {
    try {
      await firebaseSignOut(auth);
      // Clear app store history when user logs out
      const { useAppStore } = await import('./useAppStore');
      useAppStore.getState().reset();
      useAppStore.setState((state) => ({
        ...state,
        history: {
          sessions: [],
          currentSessionId: null,
        },
        currentSessionId: null,
        reviewMode: false,
        reviewAnalysis: null,
        qaData: null,
      }));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
}));

// Listen to auth state changes
onAuthStateChanged(auth, async (user) => {
  useAuthStore.getState().setUser(user);
  // Sync history when user state changes (login/logout)
  if (user?.uid) {
    // Dynamically import to avoid circular dependency
    const { useAppStore } = await import('./useAppStore');
    useAppStore.getState().syncSessionsFromFirebase();
  } else {
    // Clear history on logout
    const { useAppStore } = await import('./useAppStore');
    useAppStore.getState().reset();
    useAppStore.setState((state) => ({
      ...state,
      history: {
        sessions: [],
        currentSessionId: null,
      },
      currentSessionId: null,
      reviewMode: false,
      reviewAnalysis: null,
      qaData: null,
    }));
  }
});

