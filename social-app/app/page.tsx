import CreatePost from "@/components/ui/CreatePost";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";


export default async function Home() {
  const user = await currentUser();
  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
      <div className="col-span-6">
          {user ? <CreatePost/> : null}
          
      </div>

      <div className="lg:col-span-4 hidden lg:block sticky top-20">
          WhoToFollow
      </div>
    </div>
  );
}
