'use server'

import { Post } from "@/mangodb/models/post";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export default async function deletePostAction(postId: string) {

    const user = await currentUser()

    if(!user?.id){

        throw new Error("user isnot authenticated") 
    }

    const post = await Post.findById(postId)

    if(!post){

        throw new Error("post not found")
    }
    if(post.user.userId !== user.id){
        throw new Error("you are not authorized to delete this post")
    }

    try{
        await post.removePost()
        revalidatePath("/")
    }catch(error){
        console.log("error deleting post",error)
        throw new Error("error deleting post")
    }
}