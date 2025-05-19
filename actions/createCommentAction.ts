'use server'

import { AddCommentRequestBody } from "@/app/api/posts/[post_id]/comments/route";
import { ICommentBase } from "@/mangodb/models/comment";
import { Post } from "@/mangodb/models/post";
import { IUser } from "@/types/users";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";


export default async function createCommentAction(postId: string, formData: FormData) {
   
const user = await currentUser();

const commentInput = formData.get("commentInput") as string;

if(!user?.id) 
    throw new Error("user isnot authenticated");  
if(!commentInput)
    throw new Error("there should be a comment input");
if(!postId)
    throw new Error("there should be a post id");

const userDB :IUser = {
    userId: user.id,
    imageUrl: user.imageUrl || "https://links.papareact.com/b3z",
    firstName: user.firstName || "john",
    lastName: user.lastName || "doe",
    userName: user.username || "johndoe",
}

const body :AddCommentRequestBody = {
    user: userDB,
    text: commentInput,
   
}

const post = await Post.findById(postId)

if(!post)
    throw new Error("post not found")

const comment :ICommentBase ={
    user : userDB,
    text : commentInput,
}

try{
    await post.commentOnPost(comment)
    revalidatePath("/")
    
}catch(error){
    console.log("error adding comment",error)
    
}
}