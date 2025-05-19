import { IPostDocument } from '@/mangodb/models/post'
import React from 'react'
import { Avatar,AvatarFallback, AvatarImage } from './ui/avatar'
import ReactTimeAgo from 'react-timeago'

function CommentFeed({ post }: { post: IPostDocument }) {


    return (
        <div className='space-y-2 mt-3'>
            {post.comments?.map((comment) => (

                <div key={String(comment._id)} className='flex space-x-1'>
                    <Avatar>
                        <AvatarImage src={comment.user.imageUrl} />
                        <AvatarFallback>
                            {comment.user.firstName?.charAt(0)}
                            {comment.user.lastName?.charAt(0)}
                        </AvatarFallback>
                    </Avatar>

                    <div className='bg-gray-100 px-4 py-2 rounded-md w-full sm:w-auto md:min-w-[300px]'>
                        <div className='flex justify-between'>
                            <div >
                                <p className='font-semibold'>{comment.user.firstName} {comment.user.lastName}</p>
                                <p className='text-xs text-gray-400 '>
                                    @{comment.user.firstName}
                                    {comment.user.firstName}-{comment.user.userId.toString().slice(-4)}
                                </p>
                            </div>

                            <p className='text-xs text-gray-400'>
                                <ReactTimeAgo date={new Date(comment.createdAt)} />
                            </p>
                        </div>
                        <p className='mt-3 text-sm'>{comment.text}</p>
                    </div>
                </div>

            ))}
        </div>
    )
}

export default CommentFeed