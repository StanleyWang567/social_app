"use client";

import {
  getNotifications,
  markNotficationsAsRead,
} from "@/actions/notifications.action";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { NotificationsSkeleton } from "@/components/ui/NotificationSkeletion";
import { MessageCircle, ThumbsUp, UserPlus } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";

type Notifications = Awaited<ReturnType<typeof getNotifications>>;
type Notification = Notifications[number];

function NotificationsPage() {
  const [notifications, setNotfications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications();
        setNotfications(data);

        const unreadIds = data.filter(n => !n.read).map(n=>n.id);
        if(unreadIds.length>0) await markNotficationsAsRead(unreadIds);

        //const readIds = data.filter((n) => n.read).map((n) => n.id);
        //if (readIds.length > 0) await markNotficationsAsNotRead(readIds);
      } catch (error) {
        toast.error("Failed to fetch notifications.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (isLoading) return <NotificationsSkeleton  />;

  return (
    <div>
      <Card>
        <CardHeader className="flex justify-between pb-1 border-gray-700 border-b">
          <h3 className="font-bold text-lg">Notifications</h3>

          <div>{notifications.filter((n) => !n.read).length} unread</div>
        </CardHeader>

        <CardContent>
          {notifications.length === 0 ? (
            <div>There is no notifications.</div>
          ) : (
            <div>
              {notifications.map((notification) => (
                <div key={notification.id} className="p-1">
                  <div className="flex gap-3 border-b border-gray-700 pb-2">
                    <Avatar>
                      <AvatarImage src={notification.creator.image || ""} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>

                    <div>
                      {notification.type === "LIKE" ? (
                        <ThumbsUp className="size-5 text-green-400" />
                      ) : notification.type === "COMMENT" ? (
                        <MessageCircle className="size-5 text-blue-400" />
                      ) : (
                        <UserPlus className="size-5 text-red-400" />
                      )}
                    </div>

                    <div className="w-full">
                      <div>
                        {notification.creator.username} has{" "}
                        {notification.type === "FOLLOW"
                          ? "started following you"
                          : notification.type === "LIKE"
                            ? "liked your post"
                            : "commented on your post"}
                      </div>

                      {
                        notification.post && (<div className="pt-2 pb-2 space-y-3"> {notification.post.image && (<Image src={notification.post.image || ""} alt={"post image"}/>)}
                        <div className="p-2 rounded-xl bg-gray-400/10 text-gray-400">{notification.post.content}</div>

                            {notification.comment && (<div className="p-2 rounded-xl bg-gray-400/10">{notification.comment.content}</div>)}
                        </div>)
                      }

                      <div className="text-gray-500">
                        {formatDistanceToNow(new Date(notification.createdAt))}{" "}
                        ago
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default NotificationsPage;
