"use server"

import { getDbUserId } from "@/actions/user.action"
import { prisma } from "@/lib/db";

export async function getNotifications(){
    try {
        const userId = await getDbUserId();
        if(!userId) return;

        const notifications = await prisma.notification.findMany({
            where:{
                userId:userId,
            },

            include:{
                creator:{
                    select:{
                        id:true,
                        name:true,
                        username:true,
                        image:true,
                    }
                },

                post:{
                    select:{
                        id:true,
                        content:true,
                        image:true,
                    }
                },

                comment:{
                    select:{
                        id:true,
                        content:true,
                        createdAt:true,
                    }
                }
            },

            orderBy:{
                createdAt:"desc",
            }
        });

        return notifications;
        
    } catch (error) {
        console.log("Error fetching notifications.", error);
        throw new Error("Failed to fetch notifications from getNotifications");
        
    }
}


export async function markAsRead(){
    
}


