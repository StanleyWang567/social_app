"use client";

import { getNotifications, markNotficationsAsNotRead, markNotficationsAsRead } from '@/actions/notifications.action';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import NotificationSkeletion from '@/components/ui/NotificationSkeletion';
import { NOTFOUND } from 'dns';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

type Notifications = Awaited <ReturnType<typeof getNotifications>>
type Notification = Notifications[number];

function NotificationsPage() {
    const [notifications,setNotfications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const data = await getNotifications();
                setNotfications(data);

                //const unreadIds = data.filter(n => !n.read).map(n=>n.id);
                //if(unreadIds.length>0) await markNotficationsAsRead(unreadIds);

                const readIds = data.filter(n => n.read).map(n=>n.id);
                if(readIds.length>0) await markNotficationsAsNotRead(readIds);
                
            } catch (error) {
                toast.error("Failed to fetch notifications.");
            } finally{
                setIsLoading(false);
            }
        }

        fetchNotifications();
    }, [])

    if(isLoading) return <NotificationSkeletion/>

  return (
    <div>
        <Card>
            <CardHeader className='flex justify-between'>
                <h3 className='font-bold text-lg'>
                    Notifications
                </h3>

                <div>
                    {notifications.filter((n) => !n.read).length} unread
                </div>
            </CardHeader>

            <CardContent>
                {
                    notifications.map((notification)=> (
                        <div key={notification.id}>
                            
                        </div>
                    ))
                }

            </CardContent>
            
        </Card>
      
    </div>
  )
}

export default NotificationsPage;
