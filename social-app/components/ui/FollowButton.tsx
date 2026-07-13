"use client";
import { toggleFollow } from '@/actions/user.action';
import React, { useState } from 'react'
import { Button } from './button';
import toast from 'react-hot-toast';

function FollowButton( {userId}:{userId:string}) {

    const[isLoading, setLoading] = useState(false);
    const handleFollow = async () => {
        setLoading(true);

        try {
            await toggleFollow(userId);
            toast.success("user followed successfully.");
            
        } catch (error) {
            console.log("error following user.");
            
        }
    }

  return (
    <Button size="sm" variant={'secondary'} onClick={handleFollow} disabled={isLoading} className="w-20">
        Follow
    </Button>
  )
}

export default FollowButton
