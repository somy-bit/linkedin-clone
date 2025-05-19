import { NextRequest, NextResponse } from 'next/server';

export interface UnlikePostRequestBody {
    userId: string;
}
import { connectDB } from '@/mangodb/db';
import { Post } from '@/mangodb/models/post';
import { auth } from '@clerk/nextjs/server';

export async function DELETE(req: NextRequest, { params }: { params: { post_id: string } }) {
    const postId = params.post_id;
    const { userId } : UnlikePostRequestBody = await req.json();

    if (!userId) {
        return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    try {
        
        await connectDB();
        auth.protect();

        const post = await Post.findById(postId)
        if(!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        await post.unlikePost(userId)
        return NextResponse.json({ message: 'Post unliked successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to unlike post' }, { status: 500 });
    }
}