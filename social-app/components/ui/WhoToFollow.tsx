import { getRandomUsers } from "@/actions/user.action";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Avatar, AvatarImage } from "./avatar";
import { Separator } from "./separator";
import { Button } from "./button";

async function WhoToFollow() {
  const users = await getRandomUsers();

  if (!users)
    return null; //what happens when user is unauthenticated(aka:not logged in).
  else {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Who To Follow:</CardTitle>
        </CardHeader>

        <CardContent>
          {users.map((user) => (
            <div key={user.id} className="flex gap-2 items-center w-full">
              <Avatar className="sm:size-5 md:size-5 lg:size-13">
                <AvatarImage
                  src={user.image ?? "https://github.com/shadcn.png"}
                />
              </Avatar>

              <div>
                <div className="text-base hover:text-gray-500">
                  {user.name}
                </div>

                <div className="text-sm text-gray-400">
                  @{user.username}
                </div>

                <div className="text-sm text-gray-400">{user._count.followers} followers</div>
              </div>

              <div className="ml-auto">
                <Button variant="secondary">Follow</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }
}

export default WhoToFollow;
