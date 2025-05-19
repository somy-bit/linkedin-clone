import { connectDB } from "@/mangodb/db";
import { Post } from "@/mangodb/models/post";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function GET(request:Request,{params}:{params:{post_id:string}}){

    try{
        await connectDB()

        const post = await Post.findById(params.post_id)

        if(!post){
            return NextResponse.json({error:"post not found"},{status:404})
        }

        return NextResponse.json(post)

    }catch(error){
        return NextResponse.json({error:"error occuerd while fetching the post"},{status:500})
    }
}

export interface DeletePostRequestBody{
    userId:string;
}

export async function DELETE(request: Request, { params }: { params: { post_id: string } }) {

    

    try {
        auth.protect();
        await connectDB();

        const user = await currentUser();

        const post =await Post.findById(params.post_id);

        if(!post){
            return NextResponse.json({error:"post not found"},{status:404})
        }

        if(post.user.userId !== user?.id){
            throw new Error ("post doesnot belong to the user")
        }

        await post.removePost();

        return NextResponse.json({ message: "post deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "error occurred while deleting the post" }, { status: 500 });
    }
}