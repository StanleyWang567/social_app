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
      where: {
        authorId: userId,
      },

      orderBy: {
        createdAt: "desc", //displaying the latest posts created.
      },

      include: {
        author: {
          select: {
            name: true,
            image: true,
            username: true,
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
    console.log("Error in getPosts", error);
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

      select:{
        authorId:true,
      }
    });

    if(!post) throw new Error("Invalid postId, post doesn't exist(From toggleLike)");

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
