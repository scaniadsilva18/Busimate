// src/firebase.js
import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAnA1uTkq09kzkR_d7QOn6ecsvnyob-oic",
  authDomain: "buismate-c527b.firebaseapp.com",
  projectId: "buismate-c527b",
  storageBucket: "buismate-c527b.appspot.com",
  messagingSenderId: "212227748549",
  appId: "1:212227748549:web:23c91eeb0ca92adf4ff6ac"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Function to update user's plan
const updateUserPlan = async (userId, plan) => {
  try {
    await setDoc(doc(db, 'users', userId), {
      plan,
      planSelected: true,
      lastUpdated: serverTimestamp()
    }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error updating user plan:', error);
    return false;
  }
};

// Function to check if user has selected a plan
const checkUserPlan = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data().planSelected || false;
    }
    return false;
  } catch (error) {
    console.error('Error checking user plan:', error);
    return false;
  }
};

// Function to create or get user profile
const createUserProfile = async (userId, userData) => {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      ...userData,
      createdAt: serverTimestamp(),
      lastUpdated: serverTimestamp()
    }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error creating user profile:', error);
    return false;
  }
};

// Function to get user profile
const getUserProfile = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

// Function to get all chats for a user (poster)
const getUserChats = async (userId) => {
  try {
    // Get all posts by this user
    const postsQuery = query(collection(db, 'posts'), where('uid', '==', userId));
    const postsSnap = await getDocs(postsQuery);
    const chats = [];
    for (const postDoc of postsSnap.docs) {
      const postId = postDoc.id;
      const postData = postDoc.data();
      // Get all messages for this post
      const messagesSnap = await getDocs(collection(db, 'posts', postId, 'messages'));
      // Get unique joiners who have messaged
      const joiners = Array.from(new Set(
        messagesSnap.docs
          .map(msgDoc => msgDoc.data().sender)
          .filter(email => email && email !== postData.email)
      ));
      joiners.forEach(joinerEmail => {
        chats.push({
          id: `${postId}_${joinerEmail}`,
          name: `${postData.name || 'Untitled'} - ${joinerEmail}`,
          postId,
          joinerEmail
        });
      });
    }
    return chats;
  } catch (error) {
    console.error('Error getting user chats:', error);
    return [];
  }
};

// Export all Firebase services and helper functions
export { 
  db, 
  auth, 
  storage, 
  updateUserPlan, 
  checkUserPlan,
  createUserProfile,
  getUserProfile,
  serverTimestamp,
  // Export Firestore functions for direct use
  doc,
  setDoc,
  getDoc,
  getUserChats
};