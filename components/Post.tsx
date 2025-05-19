'use client'

import { IPostDocument } from '@/mangodb/models/post'
import { useUser } from '@clerk/nextjs'
import React from 'react'
import { Avatar, AvatarFallback } from './ui/avatar'
import { AvatarImage } from '@radix-ui/react-avatar'
import { Badge } from './ui/badge'
import ReactTimeAgo from 'react-timeago'
import { Button } from './ui/button'
import { Trash2 } from 'lucide-react'
import deletePostAction from '@/actions/deletePostAction'
import Image from 'next/image'
import PostOptions from './PostOptions'

function Post({ post }: { post: IPostDocument }) {

    const { user } = useUser()
    const isPostOwner = user?.id === post.user.userId

    return (
        <div className='bg-white rounded-md border border-gray-300'>
            <div className='flex space-x-2 p-4'>
                <div>
                    <Avatar>
                        <AvatarImage src={post.user.imageUrl} />
                        <AvatarFallback>
                            {post.user.firstName?.charAt(0)}
                            {post.user.lastName?.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                </div>
                <div className='flex-1 justify-between flex'>
                    <div>
                        <p className='font-semibold'>
                            {post.user.firstName} {post.user.lastName} {" "}
                            {isPostOwner && (<Badge className='ml-2' variant='secondary'>Author</Badge>)}

                        </p>

                        <p className='text-xs text-gray-400'>
                            @{post.user.firstName}
                            {post.user.firstName}-{post.user.userId.toString().slice(-4)}
                        </p>

                        <p className='text-xs text-gray-400'>
                            <ReactTimeAgo date={new Date(post.createdAt)} />
                        </p>

                    </div>

                    {isPostOwner && (
                        <Button
                            variant='outline'
                            onClick={() => {
                                if (typeof post._id === 'string') {
                                    const promis = deletePostAction(post._id)
                                } else {
                                    console.error('Post ID is not a string:', post._id)
                                }
                            }}
                        >
                            <Trash2 />
                        </Button>
                    )}

                </div>
            </div>

            <div>
                <p className='px-4 pb-2 mt-2'>{post.text}</p>

                {post.imageUrl && (
                    <Image
                        className='w-full max-h-64 object-cover mx-auto'
                        width={500}
                        height={500}
                        src={post.imageUrl}
                        alt="post image"

                    />
                )}
                <PostOptions

                    post={post}

                />

            </div>
        </div>
    )
}

export default Post