"use server";

import { prisma } from "@/lib/db";
import { getDbUserId } from "./user.action";
import { revalidatePath } from "next/cache";
import toast from "react-hot-toast";

export async function createPost(content: string, imageUrl: string) {
  try {
    const userId = await getDbUserId();

    if (!userId) throw new Error("User not authenticated");

    const post = await prisma.post.create({
      data: {
        content,
        image: imageUrl,
        authorId: userId,
      }, //content, equivalent to content:content.
    });
    revalidatePath("/");
    return { success: true, post };
  } catch (error) {
    console.log("Failed to create post:", error);
    return { success: false, error: "Failed to create post" };
  }
}

export async function getPosts() {
  try {
    const userId = await getDbUserId();
    if (!userId) return [];

    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc", //displaying the latest posts created.
      },

      include: {
        author: {
          select: {
            name: true,
            image: true,
            username: true,
            id:true,
          },
        },

        comments: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                image: true,
                name: true,
              },
            },
          },

          orderBy: {
            createdAt: "asc", //displaying the neweset comments.
          },
        },

        likes: {
          select: {
            userId: true, //to check if we already liked the post or no.
          },
        },

        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    return posts;
  } catch (error) {
    console.log("Error in getPosts: ", error);
    throw new Error("Failed to fetch posts");
  }
}

export async function toggleLike(postId: string) {
  try {
    const userId = await getDbUserId();

    if (!userId) return;

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },

      select: {
        authorId: true,
      },
    });

    if (!post)
      throw new Error("Invalid postId, post doesn't exist(From toggleLike)");

    const alreadyLiked = await prisma.like.findUnique({
      where: {
        userId_postId: {
          postId: postId,
          userId: userId,
        },
      },
    });

    if (alreadyLiked) {
      //dislike
      await prisma.like.delete({
        where: {
          userId_postId: {
            userId: userId,
            postId: postId,
          },
        },
      });
    } else {
      //like
      await prisma.$transaction([
        prisma.like.create({
          data: {
            userId: userId,
            postId: postId,
          },
        }),

        prisma.notification.create({
          data: {
            type: "LIKE",
            userId: post.authorId, //person who will receive the notification.
            creatorId: userId, //person who liked
          },
        }),
      ]);
    }

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.log("Error in toggleLike", error);
    throw new Error("Failed to like/dislike post.");
  }
}


export async function createComment(postId: string, content: string) {
  try {
    const userId = await getDbUserId();
    if (!userId) return;

    if (!content) throw new Error("Content is required.");

    const post = await prisma.post.findFirst({
      where: {
        id: postId,
      },
    });

    if (!post) throw new Error("Post id doesn't exist.");

    
    const [comment] = await prisma.$transaction(async (tx) => {
      const newComment = await tx.comment.create({
        data: {
          authorId: userId,
          content: content,
          postId: postId,
        },
      });

      if (post.authorId !== userId) {
        await tx.notification.create({
          data: {
            userId: post.authorId,
            creatorId: userId,
            type: "COMMENT",
            commentId:newComment.id,
            postId,
          },
        });
      }

      return [newComment];
    });
    



    revalidatePath(`/`);
    return {success:true, comment};
  } catch (error) {
    console.log("Error in createComment: ", error);
    throw new Error("Failed to create comment.");
  }
}



export async function deletePost(postId:string){
  try {
    const userId = await getDbUserId();
    if(!userId) return;

    if(postId===userId){
      throw new Error("You cannot delete a post that doesn't belong to you.");
    }

    else{
      await prisma.post.delete({
        where:{
          id:postId
        }
      })
    }

    revalidatePath("/");
    return {success:true}

  } catch (error) {
    console.log("Error from deletePost: ", error);
    return { success: false, error: "Failed to delete post" };
    
  }
  
}
