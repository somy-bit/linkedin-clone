'use server'

import { AddPostRequestBody } from "@/app/api/posts/route"
import { containerName, generateSASToken } from "@/lib/generateSASToken.ts"
import { connectDB } from "@/mangodb/db"
import { Post } from "@/mangodb/models/post"
import { IUser } from "@/types/users"
import { BlobServiceClient } from "@azure/storage-blob"
import { auth, currentUser } from "@clerk/nextjs/server"
import { randomUUID } from "crypto"
import { revalidatePath } from "next/cache"

export default async function createPostAction(formData: FormData) {

    const user = await currentUser()

    if (!user) {
        throw new Error("user isnot authenticated")
    }

    const post = formData.get("postInput") as string
    const image = formData.get("image") as File

    let image_Url: string;

    if (!post) {
        throw new Error("there should be a post input")
    }

    const userDB: IUser = {
        userId: user.id,
        imageUrl: user.imageUrl || "https://links.papareact.com/b3z",
        firstName: user.firstName || "john",
        lastName: user.lastName || "doe",
        userName: user.username || "johndoe",
    }

    try {
        if (image.size > 1) {

            console.log("uploading image to cloudinary")
            const accountName = process.env.AZURE_STORAGE_NAME
            const sasToken = await generateSASToken()

            const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net?${sasToken}`)
            const containerClient = blobServiceClient.getContainerClient(containerName)

            const timeStamp = new Date().getTime()
            const fileName = `${randomUUID()}_${timeStamp}.png`

            const blockBlobClient = containerClient.getBlockBlobClient(fileName)

            const imageBuffer = await image.arrayBuffer()

            const res = await blockBlobClient.uploadData(imageBuffer)

            console.log("image was uploaded successfully", res)

            image_Url = res._response.request.url
            const body: AddPostRequestBody = {
                user: userDB,
                text: post,
                imageUrl: image_Url,
            }
            
            await Post.create(body)



        } else {
            const body: AddPostRequestBody = {
                user: userDB,
                text: post,
            }
            
            await Post.create(body)
        }
    } catch (error) {
        console.error("error creating post", error)
    }

    revalidatePath("/")
}