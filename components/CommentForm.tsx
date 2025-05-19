'use client'


import { useUser } from '@clerk/nextjs'
import React, { useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import createCommentAction from '@/actions/createCommentAction';
import { toast } from 'sonner';

function CommentForm({postId}:{postId:string}) {

    const {user} = useUser()

    const ref = useRef<HTMLFormElement>(null);

    const createCommentActionWithPostId = createCommentAction.bind(null,postId)

    const handleCommentAction = async(formData:FormData) : Promise<void>=>{
    
        if(!user?.id){
            throw new Error("user isnot authenticated")
        } 


     const formDataCopy = formData
     ref.current?.reset()

     try{

        //server action

        await createCommentActionWithPostId(formDataCopy)

     }catch(error){
        console.log('error creating comment',error)
     }
    }

    


  return (
    <form ref={ref} action={(formData)=>{
        const promise =  handleCommentAction(formData)

        toast.promise(promise,{
            loading: "Creating comment",
            success: "Comment created",
            error: "Error creating comment"
        })
    }} 
    className='space-x-1 flex items-center'
    >
    <Avatar>
        <AvatarImage src={user?.imageUrl} />
        <AvatarFallback>
            {user?.firstName?.charAt(0)}
            {user?.lastName?.charAt(0)}
        </AvatarFallback>
    </Avatar>

    <div className='flex-1 flex bg-white border border-gray-300 rounded-full px-3 py-2'>
        <input 
        type="text"
        name='commentInput'
        placeholder='Write a comment'
        className='outline-none bg-transparent text-sm flex-1'
        />
        <button type='submit' hidden>Comment</button>
        </div>

    </form>
  )
}

export default CommentForm