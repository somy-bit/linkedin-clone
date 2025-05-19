'use client'

import React, { useRef, useState } from 'react'
import { AvatarImage, Avatar, AvatarFallback } from './ui/avatar'
import { useUser } from '@clerk/nextjs'
import { Button } from './ui/button'
import { ImageIcon, XIcon } from 'lucide-react'
import createPostAction from '@/actions/createPostAction'
import { toast } from 'sonner'

function PostForm() {

    const { user } = useUser()
    const ref= useRef<HTMLFormElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [preview,setPreview] = useState<string|null>(null)

    const handlePostAction = async(formData:FormData)=>{
        const formDataCopy = formData
        ref.current?.reset()

        const text = formDataCopy.get("postInput") as String
        if(!text){
            throw new Error("you should provide a post input")
        }

        setPreview(null)

        try{

           await createPostAction(formDataCopy)
        }catch(error){
            console.log('error craeting post',error)
        }
    }

    const handleImageChange = (event:React.ChangeEvent<HTMLInputElement>)=>{
        const file = event.target.files?.[0]
        if(file) {
            setPreview(URL.createObjectURL(file))
        }
    }

    return (
        <div className='mb-2'>
            <form ref={ref} action={
                (formData)=>{
                    const promise = handlePostAction(formData)
                    toast.promise(promise,{
                        loading: "Creating post",
                        success: "Post created",
                        error: "Error creating post"
                    })
                }
            }
            className='bg-white rounded-lg p-3 border border-gray-300'>

                <div className='flex items-center space-x-2'>
                    <Avatar>
                        <AvatarImage src={user?.imageUrl} />
                        <AvatarFallback>
                            {user?.firstName?.charAt(0)}
                            {user?.lastName?.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <input
                    
                        type="text"
                        name='postInput'
                        placeholder='start writing a post ...'
                        className='flex-1 outline-none rounded-full py-3 px-4 border border-gray-300'
                    />
                    <input ref={fileInputRef} type='file' accept='images/*' name='image' hidden onChange={handleImageChange}/>
                    <button type='submit' hidden>Post</button>
                </div>

            
                {preview && (
                    <div className='mt-3 '>
                        <img src={preview} alt='preview' className='w-full max-h-56 object-contain'/>
                    </div>
                )}
           
                <div className='flex justify-end mt-2 space-x-2'>
                    <Button variant='outline'
                    onClick={()=>fileInputRef.current?.click()}
                    type='button'>
                        <ImageIcon className='mr-2' color='currentColor' size={16}/>
                   {preview ? "change":"Add"} Image
                    </Button>

                    {preview && (
                        <Button variant='outline' type='button' onClick={()=>setPreview(null)}>
                            <XIcon className='mr-2 ' size={16} color='currentColor'/>
                            Remove Image
                        </Button>
                    )}
                </div>


            </form>
        </div>
    )
}

export default PostForm