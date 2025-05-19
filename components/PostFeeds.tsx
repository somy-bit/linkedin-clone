import { IPostDocument } from '@/mangodb/models/post'
import React from 'react'
import Post from './Post'

function PostFeeds({ posts }: { posts: IPostDocument[] }) {
    return (
        <div className='space-y-2 pb-20'>{
            posts.map((post) => (
                <Post
                    post={post}
                    key={(post._id as string | number).toString()}
                />

            ))
        }
        </div>
    )
}

export default PostFeeds