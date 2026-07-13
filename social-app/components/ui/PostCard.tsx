"use client"

import { getPosts, toggleLike } from '@/actions/post.action';
import { getDbUserId } from '@/actions/user.action';
import { useUser } from '@clerk/nextjs';
import React, { useState } from 'react'

type Posts = Awaited<ReturnType<typeof getPosts>>
type Post = Posts[number]

function PostCard({post, dbUserId}:{post:Post, dbUserId:string | null}) {
  const {user} = useUser();
  const [newComment, setComment] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasLiked, setHasLiked] = useState(post.likes.some(like => like.userId === dbUserId)); //check if current user has liked the post or no. If current userId exist in this post's like's userId, then the user has liked the post. 
  const [optimisticLikes, setOptimisticLikes] = useState(post._count.likes);

  const handleLike = async () => { //toggling the like button.
    if (isLiking) return;

    try {
      setIsLiking(true);
      setHasLiked(prev => !prev); //this just inverts the current state of hasLiked. 
      setOptimisticLikes(prev => prev + (hasLiked ? -1 : 1)); //if user hasLiked, then it's a dislike operation, we display prev-1 likes. 
      await toggleLike(post.id);
      
    } catch (error) {
      setOptimisticLikes(post._count.likes);
      setHasLiked(false);
      
    } finally{
      setIsLiking(false);
    }
  };

  const handleAddComment = async () => {};

  const handleDeleteComment = async () => {};

  
  return (
    <div>
      Postcard
    </div>
  )
}

export default PostCard
