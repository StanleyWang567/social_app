"use client";

import {
  createComment,
  deletePost,
  getPosts,
  toggleLike,
} from "@/actions/post.action";
import { getDbUserId } from "@/actions/user.action";
import { useUser } from "@clerk/nextjs";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Card, CardContent } from "./card";
import Link from "next/link";
import { Avatar, AvatarImage } from "./avatar";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageCircle } from "lucide-react";
import { Button } from "./button";
import { DeleteAlertDialog } from "./DeleteAlertDialog";

type Posts = Awaited<ReturnType<typeof getPosts>>;
type Post = Posts[number];

function PostCard({ post, dbUserId }: { post: Post; dbUserId: string | null }) {
  const { user } = useUser();
  const [newComment, setComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasLiked, setHasLiked] = useState(
    post.likes.some((like) => like.userId === dbUserId),
  ); //check if current user has liked the post or no. If current userId exist in this post's like's userId, then the user has liked the post.
  const [optimisticLikes, setOptimisticLikes] = useState(post._count.likes);

  const handleLike = async () => {
    //toggling the like button.
    if (isLiking) return;

    try {
      setIsLiking(true);
      setHasLiked((prev) => !prev); //this just inverts the current state of hasLiked.
      setOptimisticLikes((prev) => prev + (hasLiked ? -1 : 1)); //if user hasLiked, then it's a dislike operation, we display prev-1 likes.
      await toggleLike(post.id);
    } catch (error) {
      setOptimisticLikes(post._count.likes);
      setHasLiked(false);
    } finally {
      setIsLiking(false);
      //await createComment(post.id, post.comment);
    }
  };

  const handleAddComment = async () => {
    if (isCommenting || !newComment.trim()) return;

    try {
      setIsCommenting(true);
      const result = await createComment(post.id, newComment);

      if (result?.success) {
        toast.success("Commnent posted successfully");
        setComment("");
      }
    } catch (error) {
      toast.error("Failed to add comment.");
    } finally {
      setIsCommenting(false);
    }
  };

  const handleDeleteComment = async () => {
    if (isDeleting) return;
    try {
      const result = await deletePost(post.id);

      if (result?.success) {
        toast.success("Successfully deleted post.");
      } else {
        throw new Error(result?.error);
      }

      return;
    } catch (error) {
      toast.error("Failed to delete post.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-2 sm:p-4">
        <div className="space-y-6">
          <div className="flex space-x-4">
            <Link href={`/profile/${post.author.username}`}>
              <Avatar className="sm:size-5 md:size-5 lg:size-10">
                <AvatarImage
                  src={post.author.image ?? "https://github.com/shadcn.png"}
                />
              </Avatar>
            </Link>

            <div className="flex flex-wrap gap-4 items-center">
              <p className="font-bold text-base">{post.author.name}</p>

                <p className="font-light text-gray-400">
                @{post.author.username}
              </p>


              <p className="font-light text-gray-400">
                {formatDistanceToNow(new Date(post.createdAt))} ago
              </p>
              

              <div className="w-full">{post.content}</div>
            </div>

            <div className="ml-auto pb-2">
              {dbUserId === post.author.id && (
              <DeleteAlertDialog
                isDeleting={isDeleting}
                onDelete={handleDeleteComment}
              />
            )}
            </div>
            
          </div>

          <div>
            <img src={post.image ?? ""} />{" "}
          </div>

          <div className="flex gap-5 items-center text-center">
            <Button
              className="flex gap-1 bg-none"
              onClick={handleLike}
              disabled={isLiking}
            >
              <Heart className="size-4 text-gray-400" /> {post._count.likes}
            </Button>

            <Button
              className="flex gap-1 bg-none"
              onClick={handleAddComment}
              disabled={isCommenting}
            >
              <MessageCircle className="size-4 text-gray-400" />{" "}
              {post._count.comments}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default PostCard;
