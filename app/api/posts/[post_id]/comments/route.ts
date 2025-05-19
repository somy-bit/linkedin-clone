import { connectDB } from "@/mangodb/db";
import { ICommentBase } from "@/mangodb/models/comment";
import { Post } from "@/mangodb/models/post";
import { IUser } from "@/types/users";
import { NextResponse } from "next/server";


export async function GET(request: Request) {

    const url = new URL(request.url);
    const pathParts = url.pathname.split("/");
    const postId = pathParts[pathParts.indexOf("posts") + 1]
    try {
        await connectDB();

        const post = await Post.findById(postId);
        if (!post) {
            return NextResponse.json({ error: "post not found" }, { status: 404 });
        }

        const comments = await post.getAllComments();
        return NextResponse.json(comments);

    } catch (error) {
        return NextResponse.json({ error: "error occured while fetching the posts" }, { status: 500 });
    }
}

export interface AddCommentRequestBody {
    user: IUser;
    text: string;
}

export async function POST(request: Request) {

    const url = new URL(request.url);
    const pathParts = url.pathname.split("/");
    const postId = pathParts[pathParts.indexOf("posts") + 1]

    try {
        await connectDB();

        const { user, text }: AddCommentRequestBody = await request.json()

        const comment: ICommentBase = {
            user,
            text
        }



        const post = await Post.findById(postId);
        if (!post) {
            return NextResponse.json({ error: "post not found" }, { status: 404 });
        }

        await post.commentOnPost(comment)




        return NextResponse.json({ message: "Comment added successfully", comment }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "error occured while adding the comment" }, { status: 500 });
    }
}