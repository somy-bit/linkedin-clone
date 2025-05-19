import { connectDB } from "@/mangodb/db";
import { Post } from "@/mangodb/models/post";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {

     const url = new URL(request.url);
    const pathParts= url.pathname.split("/");
    const postId = pathParts[pathParts.indexOf("posts")+1]

    try {

        await connectDB()

        const post = await Post.findById(postId)

        if (!post) {

            return NextResponse.json({ error: "post not found" }, { status: 404 })
        }

        const likes = post.likes;

        return NextResponse.json(likes)
    } catch (error) {
        return NextResponse.json({ error: "error occured while fetching the posts" }, { status: 500 })
    }

}
export interface LikePostRequestBody {
    userId: string;
}

export async function POST(request: Request) {

     const url = new URL(request.url);
    const pathParts= url.pathname.split("/");
    const postId = pathParts[pathParts.indexOf("posts")+1]


    try {
        auth.protect()
        await connectDB();

        const user = await currentUser();

        const post = await Post.findById(postId);

        if (!post) {
            return NextResponse.json({ error: "post not found" }, { status: 404 });
        }

        const { userId }: LikePostRequestBody = await request.json();

        if (!userId) {
            return NextResponse.json({ error: "userId is required" }, { status: 400 });
        }

        await post.likePost(userId);

        return NextResponse.json({ message: "Post liked"});
    } catch (error) {
        return NextResponse.json({ error: "error occured while liking the post" }, { status: 500 });
    }
}
