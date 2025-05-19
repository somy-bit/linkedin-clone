import { connectDB } from "@/mangodb/db";
import { IPostBase, Post } from "@/mangodb/models/post";
import { IUser } from "@/types/users";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export interface AddPostRequestBody {
    user: IUser;
    text: string;
    imageUrl?: string | null;
}

export async function POST(request: Request) {

    auth.protect()

    try {

        await connectDB();
        const { user, text, imageUrl } = await request.json() as AddPostRequestBody

        const postBody : IPostBase = {
            user,
            text,
            ...(imageUrl && {imageUrl})

        }
        const post = await Post.create(postBody)
        return NextResponse.json({message:"post was created successfully",post},{status:200})
    } catch (error) {
        return NextResponse.json({ error: "error occured while creating post" }, { status: 500 })
    }

}

export async function GET(request: Request) {

    try {
        await connectDB()

        const posts = await Post.getAllPosts()
        return NextResponse.json({ posts })
        
    } catch (error) {

        return NextResponse.json({ error: "error occured geting posts" }, { status: 500 })
    }
}