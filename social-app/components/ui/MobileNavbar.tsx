"use client";
import { Show, SignInButton, SignOutButton, useAuth, UserButton } from "@clerk/nextjs";
import React, { useState } from "react";
import ModeToggle from "./mode-toggle";
import Link from "next/link";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";
import { Button } from "./button";
import { Bell, House, LogOut, Rows3, User } from "lucide-react";

function MobileNavbar() {
  const [showSidebar, setSidebar] = useState(false);
  const isSigned = useAuth();

  {
    /* Home, Notification, Profile, Logout*/
  }
  return (
    <div className="md:hidden">
      <div className="flex gap-3">
        <ModeToggle />
        <Sheet>
          <SheetTrigger
            render={
              <Button variant="outline" size="icon">
                <Rows3 />
              </Button>
            }
          />
          <SheetContent>
            <SheetHeader className="text-center">
              <SheetTitle className="text-2xl font-bold">Menu</SheetTitle>
              <SheetDescription></SheetDescription>
            </SheetHeader>
            <div className="grid flex-1 auto-rows-min gap-6 px-4">
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

                <SignOutButton>
                  <div className="rounded-xl p-2 flex gap-2 items-center hover:bg-gray-700">
                    <LogOut className="w-5 h-5" />
                    <p> Logout </p>
                  </div>
                </SignOutButton>
              </Show>

              <Show when="signed-out">
                <SignInButton>
                  <Button>Sign in</Button>
                </SignInButton>
              </Show>
            </div>
            <SheetFooter></SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

export default MobileNavbar;
