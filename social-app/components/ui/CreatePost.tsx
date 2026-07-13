"use client";
import { useUser } from "@clerk/nextjs";
import React, { useState } from "react";
import { Card, CardContent } from "./card";
import { Avatar, AvatarImage } from "./avatar";
import { Textarea } from "./textarea";
import { Button } from "./button";
import { Image, Loader2Icon, Send } from "lucide-react";
import { create } from "domain";
import { createPost } from "@/actions/post.action";
import toast from "react-hot-toast";
import { currentUser } from "@clerk/nextjs/server";

function CreatePost() {
  const { user } = useUser(); //current CLERK user object, not prisma user object.
  const [content, setContent] = useState("");
  const [imageUrl, setImage] = useState("");
  const [isPosting, setIsPosting] = useState(false); //when we click the post button, while it's posting, we will see a spin circle to indicate that it's processing.
  const [showImageUpload, setShowImageUpload] = useState(false); //when we click the photo button, we will see a drop zone component, where we can drag and drop our image.

  const handleSubmit = async () => {
    console.log("handling posting...");
    if (!content.trim() && imageUrl) return;

    setIsPosting(true);
    try {
      const result = await createPost(content, imageUrl); //result is an object containing both success and post
      if (result.success) {
        toast.success("Post Created Successfully!");
        setContent("");
        setImage("");
        setShowImageUpload(false); //resetting the variables
      }
    } catch (error) {
      toast.error("Failed to create post.");
      console.log("Error from creating post.", error);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6 w-full">
        <div className="space-y-4">
          <div className="flex space-x-4">
            <Avatar className="w-10 h-10">
              <AvatarImage
                src={user?.imageUrl ?? "https://github.com/shadcn.png"}
              />
            </Avatar>

            <Textarea
              className="min-h-25 resize-none border-none focus-visible:ring-0 p-2 text-base" //by default textarea has a small draggable handle to stretch the box, resize-none disables that handle.
              placeholder="what's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isPosting}
            ></Textarea>
          </div>

          {/* TODO: handle image uploads*/}

          <div className="flex justify-between border-t pt-4">
            <div className="flex text-center items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowImageUpload(!showImageUpload)}
                disabled={isPosting}
              >
                <Image />
                Photo
              </Button>
            </div>

            <div className="flex">
              <Button
                onClick={handleSubmit}
                disabled={(!content.trim() && !imageUrl) || isPosting}
              >
                {isPosting ? (
                  <>
                    <Loader2Icon className="size-4 mr-2 animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <Send />
                    Post
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default CreatePost;
