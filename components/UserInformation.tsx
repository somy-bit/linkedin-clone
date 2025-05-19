import { currentUser } from '@clerk/nextjs/server'
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs'
import { Button } from './ui/button'
import { IPost, IPostDocument } from '@/mangodb/models/post'

async function UserInformation({posts}:{posts:IPostDocument[]}) {

    const user = await currentUser()

    const firstName = user?.firstName
    const lastName = user?.lastName

    const userPosts = posts.filter((post:IPost) => post.user.userId === user?.id)

    const userComments = posts.flatMap(post=>
        post.comments?.filter((comment)=>comment.user.userId === user?.id || [])
    )

    return (
        <div className='bg-white flex flex-col items-center py-5 mr-6 border border-gray-300 justify-center rounded-lg '>
            <Avatar>
                {user?.id ? (
                    <AvatarImage src={user?.imageUrl || "https://github.com/shadcn.png"} />

                )
                    : (
                        <AvatarImage src="https://github.com/shadcn.png" />
                    )
                }
                <AvatarFallback>
                    {user?.firstName?.charAt(0)}
                    {user?.lastName?.charAt(0)}
                </AvatarFallback>

            </Avatar>

            <SignedIn>
                <div className='text-center'>
                    <p className='font-semibold'>
                        {firstName} {lastName}
                    </p>

                    <p className='text-xs'>
                        @{firstName}
                        {lastName}-{user?.id.slice(-4)}
                    </p>
                </div>
            </SignedIn>

            <SignedOut>
                <div className='text-center space-y-2'>
                    <p className='font-semibold'>You are not signed in</p>
                    <Button asChild className='bg-[#0b63c4] text-white'>
                        <SignInButton>Sign In</SignInButton>
                    </Button>
                </div>
            </SignedOut>

            <hr className='w-full border-gray-300 my-5'/>
            <div className='flex justify-between text-sm w-full px-4'>
                <p className='font-semibold text-gray-400'>Posts</p>
                <p className='text-blue-400'>{userPosts.length}</p>
            </div>
            <div className='flex justify-between text-sm w-full px-4'>
                <p className='font-semibold text-gray-400'>Comments</p>
                <p className='text-blue-400'>{userComments.length}</p>
            </div>
        </div>
    )
}

export default UserInformation