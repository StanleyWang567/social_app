import { getProfileByUsername, getUserLikedPosts, getUserPosts, isFollowing } from "@/actions/profile.action";
import { notFound } from "next/navigation";

export async function generateMetadata({params} : {params : {username:string}}){
    const user = await getProfileByUsername(params.username);

    if(!user) return;

    return{
        title: `${user.name ?? user.username}` //Use user.name if it exists, otherwise use user.username.
    }

}

async function ProfilePage({ params }: { params: { username: string } }) {
  const user = await getProfileByUsername(params.username);

  if(!user) notFound(); //generates a 404 page not found error. 

  const [posts,likedPosts, isCurrentUserFollowing] = await Promise.all(
    [getUserPosts(user.id),
    getUserLikedPosts(user.id),
    isFollowing(user.id),]
  );

  return <div>Profile Page</div>;
}

export default ProfilePage;
