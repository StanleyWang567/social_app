import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";


export default async function Home() {
  return (
    <div>
      {" "}
      Hello Home
      <header className="flex justify-end items-center p-4 gap-4 h-16">
        <Show when="signed-out">
          

        </Show>
      </header>
    </div>
  );
}
