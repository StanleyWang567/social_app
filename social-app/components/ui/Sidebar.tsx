import { Show, SignInButton, SignUpButton } from "@clerk/nextjs";
import React from "react";
import { Button } from "./button";
import { currentUser } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/actions/user.action";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { prisma } from "@/lib/db";
import { Link, MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardTitle } from "./card";
import { Separator } from "./separator";

async function Sidebar() {
  const authUser = await currentUser();
  if (!authUser) return <UnAuthenticatedSidebar />;
  const user = await getUserByClerkId(authUser.id); //db user
  if (!user) return null;

  console.log({ user });
  return (
    <Card className="items-center">
      <CardContent className="w-full text-center">
        <Avatar className="sm:size-5 md:size-5 lg:size-20 mx-auto">
          <AvatarImage src={user.image ?? "https://github.com/shadcn.png"} />
        </Avatar>

        <Link
          className="font-bold text-xl pt-2 hover:text-gray-500"
          href="/profile"
        >
          {user.name}
        </Link>

        <div className="text-sm pt-1 text-gray-400">{user.username}</div>
        <div className="text-md pt-3 text-gray-400 pb-2">
          {user.bio} Placeholder{" "}
        </div>

        <Separator></Separator>

        <div className="flex justify-between pb-2">
          <div>
            <div className="text-xl ">{user._count.following}</div>
            <div className="text-gray-400">Following</div>
          </div>

          <div>
            <div className="text-xl ">{user._count.followers}</div>
            <div className="text-gray-400">Followers</div>
          </div>
        </div>

        <Separator></Separator>

        <div className="flex gap-2 items-center pt-3 text-gray-400 ps-2">
          <MapPin className="w-4 h-4" />
          {user.location || "No Location"}
        </div>
        <div className="flex gap-2 items-center pt-1 text-gray-400 ps-2">
          <Link className="w-4 h-4" />
          {user.website ? <a href="{user.website}"></a> : "No website"}
        </div>
      </CardContent>
    </Card>
  );
}

export default Sidebar;

const UnAuthenticatedSidebar = () => (
  <Show when={"signed-out"}>
    <Card className="items-center">
      <CardContent className="w-full text-center">
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
      </CardContent>
    </Card>
  </Show>
);
