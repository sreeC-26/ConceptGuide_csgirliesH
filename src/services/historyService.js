import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../firebase/config';

const getUserSessionsCollection = (userId) => {
  if (!userId) {
    throw new Error('User ID is required to access sessions');
  }
  return collection(db, 'users', userId, 'sessions');
};

export const saveSessionToFirebase = async (userId, sessionData) => {
  if (!sessionData?.id) {
    throw new Error('Session data must include an id');
  }

  const sessionsCollection = getUserSessionsCollection(userId);
  const sessionDocRef = doc(sessionsCollection, sessionData.id);
  await setDoc(sessionDocRef, sessionData, { merge: true });

  return sessionData.id;
};

export const fetchUserSessions = async (userId) => {
  const sessionsCollection = getUserSessionsCollection(userId);
  const snapshot = await getDocs(sessionsCollection);

  return snapshot.docs.map((docSnapshot) => ({
    id: docSnapshot.id,
    ...docSnapshot.data(),
  }));
};

export const deleteSessionFromFirebase = async (userId, sessionId) => {
  const sessionsCollection = getUserSessionsCollection(userId);
  const sessionDocRef = doc(sessionsCollection, sessionId);
  await deleteDoc(sessionDocRef);
};

export const updateSessionInFirebase = async (userId, sessionId, updates) => {
  const sessionsCollection = getUserSessionsCollection(userId);
  const sessionDocRef = doc(sessionsCollection, sessionId);
  await updateDoc(sessionDocRef, updates);
};
