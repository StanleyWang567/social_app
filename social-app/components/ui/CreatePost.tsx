"use client";
import { useUser } from "@clerk/nextjs";
import React, { useState } from "react";
import { Card, CardContent } from "./card";
import { Avatar, AvatarImage } from "./avatar";
import { Textarea } from "./textarea";

function CreatePost() {
  const { user } = useUser(); //current user object.
  const [content, setContent] = useState("");
  const [imageUrl, setImage] = useState("");
  const [isPosting, setIsPosting] = useState(false); //when we click the post button, while it's posting, we will see a spin circle to indicate that it's processing.
  const [showImageUpload, setShowImageUpload] = useState(false); //when we click the photo button, we will see a drop zone component, where we can drag and drop our image.

  const handleSubmit = async () => {};
  return (
    <Card className="mb-6">
      <CardContent className="pt-6 w-full">
        <div className="space-y-4">
          <div className="flex space-x-4">
            <Avatar className="w-10 h-10">
              <AvatarImage src="https://github.com/shadcn.png" />
            </Avatar>

            <Textarea
            className="min-h-25 resize-none border-none focus-visible:ring-0 p-0 text-base" //by default textarea has a small draggable handle to stretch the box, resize-none disables that handle. 
              placeholder="what's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isPosting}
            >
              {" "}
            </Textarea>
          </div>

          {/* TODO: handle image uploads*/}

          <div>
            
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default CreatePost;
