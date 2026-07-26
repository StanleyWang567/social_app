"use server";

import { prisma } from "@/lib/db";
import { getDbUserId } from "./user.action";

export async function getNotifications() {
  try {
    const userId = await getDbUserId();
    if (!userId) return[];

    const notifications = await prisma.notification.findMany({
      where: {
        userId: userId,
      },

      include: {
        creator: {
          select: {
            username: true,
            id: true,
            image: true,
          },
        },

        post: {
          select: {
            content: true,
            image: true,
            createdAt:true,
          },
        },

        comment: {
          select: {
            content: true,
            createdAt: true,
          },
        },
      },
    });

    return notifications;
  } catch (error) {
    console.log("Failed to fetch notifications.", error);
    throw new Error("Error fetching notifications from getNotfications.");
  }
}

export async function markNotficationsAsRead(notificationIds: string[]){
    try {
        await prisma.notification.updateMany({
            where:{
                id:{
                    in: notificationIds,
                },
            },

            data:{
                read:true,
            }

        })

        return {success:true};
    } catch (error) {
        console.log("Failed to mark notification as read.", error);
        throw new Error("Error in markNotificationsAsRead");
        
    }
}



export async function markNotficationsAsNotRead(notificationIds: string[]){
    try {
        await prisma.notification.updateMany({
            where:{
                id:{
                    in: notificationIds,
                },
            },

            data:{
                read:false,
            }

        })

        return {success:true};
    } catch (error) {
        console.log("Failed to mark notification as not read.", error);
        throw new Error("Error in markNotificationsAsNotRead");
        
    }
}