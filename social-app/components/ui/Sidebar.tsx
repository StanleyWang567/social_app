import { Show, SignInButton, SignUpButton } from "@clerk/nextjs";
import React from "react";
import { Button } from "./button";
import { currentUser } from "@clerk/nextjs/server";

async function Sidebar() {
  const authUser = await currentUser();
  if (!authUser) return <UnAuthenticatedSidebar />;
  return (
    <div>
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
        <SignInButton>
          <Button className="w-full border border-gray-500/50 text-white bg-black hover:bg-gray-800">
            Login In
          </Button>
        </SignInButton>
      </div>

      <SignUpButton>
        <Button className="w-full">Sign Up</Button>
      </SignUpButton>
    </div>
  </Show>
);
