import { Button } from "@/components/ui/button";
import ModeToggle from "@/components/ui/mode-toggle";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      {" "}
      Hello Home
      <header className="flex justify-end items-center p-4 gap-4 h-16">
        <Show when="signed-out">
          

          <ModeToggle/>
        </Show>
      </header>
    </div>
  );
}
