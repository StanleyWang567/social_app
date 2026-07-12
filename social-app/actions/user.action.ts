"use server";
//holds all the server side db tasks
import { prisma } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function syncUser() {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) return;
    //check if user exists
    const existingUser = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (existingUser) return existingUser;

    const dbUser = await prisma.user.create({
      data: {
        clerkId: userId,
        name: `${user.firstName || ""} ${user.lastName || ""}`,
        username:
          user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
        email: user.emailAddresses[0].emailAddress,
        image: user.imageUrl,
      },
    });

    return dbUser;
  } catch (error) {
    console.log("Error in syncUser", error);
  }
}

export async function getUserByClerkId(clerkId: string) {
  //returns the User object from db.
  return prisma.user.findUnique({
    where: {
      clerkId, //clerkId: clerkId, finds the corresponding user with the specific clerkId.
    },
    include: {
      //count the number of followers, following, and posts.
      _count: {
        select: {
          followers: true,
          following: true,
          posts: true,
        },
      },
    },
  });
}

export async function getDbUserId() {
  const { userId: clerkId } = await auth(); //assigns the value of userId to clerkId
  if (!clerkId) throw new Error("Unauthorized");

  const user = await getUserByClerkId(clerkId);

  if (!user) throw new Error("User not found");

  return user.id;
}

export async function getRandomUsers() {
  try {
    const userId = await getDbUserId();

    //get 3 random users excluding ourselves and users that are we are following already.
    const randomUsers = await prisma.user.findMany({
      where: {
        AND: [
          { NOT: { id: userId } },
          { NOT: { followers: { some: { followerId: userId } } } },
        ],
      },
      select:{
        id: true,
        name: true,
        username:true,
        image:true,
        _count:{
          select:{
            followers:true,
          }
          
        }
      },
      take:3, 
    });

    return randomUsers;
  } catch (error) {
    console.log("error fetching random users.");
    return [];
  }
}
