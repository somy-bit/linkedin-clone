import {
    BlobServiceClient,StorageSharedKeyCredential,BlobSASPermissions,generateBlobSASQueryParameters
} from '@azure/storage-blob'


export const containerName="posts"

const accountName = process.env.AZURE_STORAGE_NAME
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY

if(!accountName || !accountKey){
    throw new Error("you should define a connection url")
}

const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey)

const blobServiceClient = new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net`,
    sharedKeyCredential)

  export   async function generateSASToken(){
        const containerClient = blobServiceClient.getContainerClient(containerName)
        const permission = new BlobSASPermissions()
        permission.read = true
        permission.write = true
        permission.create = true
        permission.delete = true

        const expiryDate = new Date()
        expiryDate.setMinutes(expiryDate.getMinutes() + 30)

        const sasToken = generateBlobSASQueryParameters({
            containerName,
            permissions: permission,
            expiresOn: expiryDate
        }, sharedKeyCredential).toString()

        return sasToken

    }