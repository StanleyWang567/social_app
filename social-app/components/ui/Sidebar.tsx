import { Show, SignInButton, SignUpButton } from "@clerk/nextjs";
import React from "react";
import { Button } from "./button";
import { currentUser } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/actions/user.action";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { prisma } from "@/lib/db";
import { Link, MapPin } from "lucide-react";


async function Sidebar() {
  const authUser = await currentUser();
  if (!authUser) return <UnAuthenticatedSidebar />;
  const user = await getUserByClerkId(authUser.id); //db user
  if (!user) return null;
  

  console.log({ user });
  return (
    <div className="sticky top-20 items-center rounded-xl border-2 p-3 text-center">
      <Avatar className="size-20 mx-auto">
        <AvatarImage src="https://github.com/shadcn.png"/>
      </Avatar>

      <a className="font-bold text-xl pt-2 hover:text-gray-500" href="/profile">{user.name}</a>
      <div className="text-sm pt-1 text-gray-400">{user.username}</div>
      <div className="text-md pt-3 text-gray-400">{user.bio} Placeholder </div>
      <div className="border-b-2 pt-2"></div>
      <div className="flex justify-between pt-3 ps-3 pe-3">
        <div className="">
            <div className="text-xl ">{user._count.following}</div>
            <div className="text-sm text-gray-400">Following</div>
        </div>

        <div>
            <div className="text-xl ">{user._count.followers}</div>
            <div className="text-sm text-gray-400">Followers</div>
        </div>
      </div>
      <div className="border-b-2 pt-2"></div>
      <div className="flex gap-1 items-center pt-3 text-gray-400 ps-2"><MapPin className="w-4 h-4"/>{user.location || "No Location"}</div>
      <div className="flex gap-1 items-center pt-1 text-gray-400 ps-2"><Link className="w-4 h-4"/>{user.website ? (<a href="{user.website}"></a>) : ("No website")}</div>

    </div>
  );
}

export default Sidebar;

const UnAuthenticatedSidebar = () => (
  <Show when={"signed-out"}>
    <div className="rounded-2xl border-2 text-center p-4 ">
      <p className="font-bold text-xl"> Welcome Back </p>
      <p className="pt-10 pb-2">
        Login to access your profile and connect with others
      </p>
      <div className="pb-2">
        <SignInButton oauthFlow="popup" mode="modal">
          <Button className="w-full border border-gray-500/50 text-white bg-black/10 hover:bg-gray-800">
            Login In
          </Button>
        </SignInButton>
      </div>

      <SignUpButton oauthFlow="popup" mode="modal">
        <Button className="w-full">Sign Up</Button>
      </SignUpButton>
    </div>
  </Show>
);
