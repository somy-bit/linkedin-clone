import { IPostDocument } from '@/mangodb/models/post'
import React from 'react'
import Post from './Post'

function PostFeeds({ posts }: { posts: IPostDocument[] }) {
    return (
        <div className='space-y-2 pb-20'>{
            posts.map((post,index) => (
                <Post
                    post={post}
                    key={index}
                />

            ))
        }
        </div>
    )
}

export default PostFeeds