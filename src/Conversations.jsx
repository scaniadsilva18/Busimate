import React, { useEffect, useState } from 'react';
import { auth, db } from './firebase';
import { collection, query, where, onSnapshot, getDocs } from 'firebase/firestore';
import Navbar from './Navbar';
import Message from './Message';

const Conversations = () => {
  const [conversations, setConversations] = useState([]);
  const [user, setUser] = useState(null);
  const [activeConv, setActiveConv] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(setUser);
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) return;
    // Only show posts where the current user is the poster
    const q = query(collection(db, 'posts'), where('uid', '==', user.uid));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // For each post, get unique joiners who have messaged
      const convs = [];
      for (const post of posts) {
        const messagesSnap = await getDocs(collection(db, 'posts', post.id, 'messages'));
        const joiners = Array.from(new Set(
          messagesSnap.docs
            .map(msgDoc => msgDoc.data().sender)
            .filter(email => email && email !== post.email)
        ));
        joiners.forEach(joinerEmail => {
          convs.push({
            postId: post.id,
            postTitle: post.name || 'Untitled',
            joinerEmail,
          });
        });
      }
      setConversations(convs);
      if (convs.length > 0 && !activeConv) setActiveConv(convs[0]);
    });
    return () => unsubscribe();
  }, [user]);

  return (
    <div>
      <Navbar />
      <div style={{padding: 40, textAlign: 'center', color: '#222', fontSize: '1.2rem'}}>
        <h2>Your Conversations</h2>
        {conversations.length === 0 ? (
          <div>No conversations found.</div>
        ) : (
          <div style={{display: 'flex', justifyContent: 'center', gap: 40}}>
            <ul style={{listStyle: 'none', padding: 0, minWidth: 320, textAlign: 'left'}}>
              {conversations.map((conv, idx) => (
                <li key={conv.postId + conv.joinerEmail + idx} style={{margin: '16px 0'}}>
                  <button
                    style={{
                      background: activeConv === conv ? '#ece5dd' : 'transparent',
                      border: 'none',
                      color: '#128c7e',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                      width: '100%',
                      padding: '8px 0',
                    }}
                    onClick={() => setActiveConv(conv)}
                  >
                    {conv.postTitle} - {conv.joinerEmail}
                  </button>
                </li>
              ))}
            </ul>
            <div style={{flex: 1, minWidth: 400, maxWidth: 600}}>
              {activeConv && (
                <Message postId={activeConv.postId} joinerEmail={activeConv.joinerEmail} hideNavbar />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Conversations;