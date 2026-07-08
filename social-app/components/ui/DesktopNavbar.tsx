import { currentUser } from "@clerk/nextjs/server";
import React from "react";
import ModeToggle from "./mode-toggle";
import { Button } from "./button";
import Link from "next/link";
import { Bell, House, LogIn, NotebookPen, User } from "lucide-react";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

async function DesktopNavbar() {
  const user = await currentUser();
  console.log("user is here:", user);
  {
    /*Need home notification and profile.   md-block ensures it only displays on medium or larger screens.*/
  }
  return (
    <div className="hidden md:flex gap-5 text-center items-center">
      <ModeToggle />
      <Show when="signed-in">
        <Link
          href="/home"
          className="rounded-xl p-2 flex gap-2 items-center hover:bg-gray-700"
        >
          {" "}
          <House className="w-5 h-5" />
          Home{" "}
        </Link>
        <Link
          href="/home"
          className="rounded-xl p-2 flex gap-2 items-center hover:bg-gray-700"
        >
          {" "}
          <Bell className="w-5 h-5" />
          Notifications{" "}
        </Link>
        <Link
          href="/home"
          className="rounded-xl p-2 flex gap-2 items-center hover:bg-gray-700"
        >
          {" "}
          <User className="w-5 h-5" />
          Profile{" "}
        </Link>
        <UserButton />
      </Show>

      <Show when="signed-out">
        <SignInButton>
          <Button variant="outline">
            <LogIn />
            Sign in
          </Button>
        </SignInButton>

        <SignUpButton>
          <Button variant="outline">
            <NotebookPen />
            Register
          </Button>
        </SignUpButton>
      </Show>
    </div>
  );
}

export default DesktopNavbar;
