import { getPosts } from "@/actions/post.action";
import { getDbUserId } from "@/actions/user.action";
import PostCard from "@/components/ui/PostCard";
import CreatePost from "@/components/ui/CreatePost";
import WhoToFollow from "@/components/ui/WhoToFollow";
import { prisma } from "@/lib/db";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const user = await currentUser();
  const userId = await getDbUserId();
  const posts = await getPosts(); 
  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
      <div className="col-span-6">
        {user ? <CreatePost /> : null}
        <div className="space-y-6">
          {posts && posts.map((post) => (
            <PostCard key={post.id} post={post} dbUserId={userId}></PostCard>
          ))}
        </div>
      </div>

      <div className="lg:col-span-4 hidden lg:block sticky top-20">
        <WhoToFollow />
      </div>
    </div>
  );
}
