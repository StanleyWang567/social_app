"use client";

import {
  createComment,
  deletePost,
  getPosts,
  toggleLike,
} from "@/actions/post.action";
import { getDbUserId } from "@/actions/user.action";
import { SignInButton, SignUpButton, useUser } from "@clerk/nextjs";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Card, CardContent } from "./card";
import Link from "next/link";
import { Avatar, AvatarImage } from "./avatar";
import { formatDistanceToNow } from "date-fns";
import { Heart, Loader2Icon, MessageCircle, Send } from "lucide-react";
import { Button } from "./button";
import { DeleteAlertDialog } from "./DeleteAlertDialog";
import { Separator } from "@base-ui/react";

type Posts = Awaited<ReturnType<typeof getPosts>>;
type Post = Posts[number];

function PostCard({ post, dbUserId }: { post: Post; dbUserId: string | null }) {
  const { user } = useUser();
  const [addComment, setAddComment] = useState(false);
  const [newComment, setComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasLiked, setHasLiked] = useState(
    post.likes.some((like) => like.userId === dbUserId),
  ); //check if current user has liked the post or no. If current userId exist in this post's like's userId, then the user has liked the post.
  const [optimisticLikes, setOptimisticLikes] = useState(post._count.likes); //it's called optimistic because it expects the server req will success.
  const [optimisticComments, setOptimisticComments] = useState(
    post._count.comments,
  );
  const [showComments, setShowComments] = useState(true);

  const handleLike = async () => {
    //toggling the like button.
    if (isLiking) return;

    const previousHasLiked = hasLiked;

    try {
      setIsLiking(true);
      setHasLiked((prev) => !prev); //this just inverts the current state of hasLiked.
      setOptimisticLikes((prev) => prev + (hasLiked ? -1 : 1)); //if user hasLiked, then it's a dislike operation, we display prev-1 likes.
      await toggleLike(post.id);
    } catch (error) {
      //if error occurs, we reverse changes made by the opstimistic like.
      setOptimisticLikes(post._count.likes);
      setHasLiked(previousHasLiked);
    } finally {
      setIsLiking(false);
      //await createComment(post.id, post.comment);
    }
  };

  const handleAddComment = async () => {
    if (isCommenting || !newComment.trim()) return;

    const oldCommentCount = optimisticComments;

    try {
      setIsCommenting(true);
      setOptimisticComments((prev) => prev + 1);
      const result = await createComment(post.id, newComment);

      if (result?.success) {
        toast.success("Commnent posted successfully");
        setComment("");
      }
    } catch (error) {
      toast.error("Failed to add comment.");
      setOptimisticComments(oldCommentCount);
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
        <div className="space-y-3">
          <div className="flex space-x-4">
            <Link href={`/profile/${post.author.username}`}>
              <Avatar className="sm:size-5 md:size-5 lg:size-10">
                <AvatarImage
                  src={post.author.image || "https://github.com/shadcn.png"}
                />
              </Avatar>
            </Link>

            <div className="flex flex-wrap space-x-4 space-y-2 items-center">
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

          {/*Like and comment button*/}
          {post.image && post.image !== "" && (
            <div>
              <img src={post.image} />
            </div>
          )}

          <div className="items-center text-center  pb-5 border-b">
            {user ? (
              <div className="flex gap-3">
                {" "}
                <Button
                  className="flex gap-1 bg-none border-2 border-gray"
                  onClick={handleLike}
                  disabled={isLiking}
                  variant="ghost"
                >
                  {hasLiked ? (
                    <Heart className="size-4 text-gray-400 fill-current" />
                  ) : (
                    <Heart className="size-4 text-gray-400" />
                  )}
                  {optimisticLikes}
                </Button>
                <Button
                  className={`flex gap-1 bg-none border-2 border-gray`}
                  onClick={() => setAddComment(!addComment)}
                  disabled={isCommenting}
                  variant="ghost"
                >
                  <MessageCircle
                    className={`size-4 text-gray-400 ${addComment ? "text-blue-500 fill-blue-500" : ""}`}
                  />{" "}
                  {optimisticComments}
                </Button>
              </div>
            ) : (
              <div>
                {" "}
                <SignInButton oauthFlow="popup" mode="modal">
                  <Button className="w-full border border-gray-500/50 text-white bg-black/10 hover:bg-gray-800">
                    Login In
                  </Button>
                </SignInButton>{" "}
                <SignUpButton oauthFlow="popup" mode="modal">
                  <Button className="w-full">Sign Up</Button>
                </SignUpButton>
              </div>
            )}
          </div>

          {/*Add Comment*/}
          {addComment && (
            <div>
              <div className="flex gap-3 pb-2 w-full overflow-visible">
                <Avatar className="w-10 h-10 shrink-0">
                  <AvatarImage
                    src={user?.imageUrl || "https://github.com/shadcn.png"}
                  />
                </Avatar>

                <textarea
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full min-h-25 border-none p-2 rounded-xl resize-none bg-secondary"
                />
              </div>

              <div className="flex w-full">
                <Button
                  className="ml-auto"
                  onClick={handleAddComment}
                  disabled={isCommenting}
                >
                  {isCommenting ? (
                    <>
                      <Loader2Icon className="size-4 mr-2 animate-spin" />
                      Commenting...
                    </>
                  ) : (
                    <>
                      <Send />
                      Comment
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/*Comment section*/}
          {addComment && (
            <div>
              <div className="space-y-4">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="p-2 rounded-xl">
                    <div className="flex space-x-4 space-y-2">
                      <Link href={`/profile/${comment.author.username}`}>
                        <Avatar className="sm:size-5 md:size-5 lg:size-10">
                          <AvatarImage
                            src={
                              comment.author.image ||
                              "https://github.com/shadcn.png"
                            }
                          />
                        </Avatar>
                      </Link>

                      <div className="flex flex-wrap space-x-4 items-center">
                        <p className="font-bold text-base">
                          {comment.author.name}
                        </p>

                        <p className="font-light text-gray-400">
                          @{comment.author.username}
                        </p>

                        <p className="font-light text-gray-400">
                          {formatDistanceToNow(new Date(comment.createdAt))} ago
                        </p>

                        <div className="w-full">{comment.content}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default PostCard;
