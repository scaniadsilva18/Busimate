import React, { useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { doc, updateDoc, increment, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase';

const LikeButton = ({ postId, initialLikes = 0, likedByUser = false, currentUser }) => {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(likedByUser);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    if (loading || !currentUser) return;
    setLoading(true);
    try {
      const postRef = doc(db, 'posts', postId);
      if (liked) {
        await updateDoc(postRef, {
          likes: increment(-1),
          likedBy: arrayRemove(currentUser.uid)
        });
        setLikes(likes - 1);
      } else {
        await updateDoc(postRef, {
          likes: increment(1),
          likedBy: arrayUnion(currentUser.uid)
        });
        setLikes(likes + 1);
      }
      setLiked(!liked);
    } catch (err) {
      console.error('Error updating like:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tooltip title={liked ? 'Unlike' : 'Like'}>
      <span>
        <IconButton onClick={handleLike} color={liked ? 'error' : 'default'} disabled={loading}>
          {liked ? <Favorite /> : <FavoriteBorder />}
        </IconButton>
        <span style={{ fontSize: 14, verticalAlign: 'middle' }}>{likes}</span>
      </span>
    </Tooltip>
  );
};

export default LikeButton;
