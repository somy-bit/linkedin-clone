import mongoose from 'mongoose'

const connectionString = `mongodb+srv://${process.env.MANGODB_USERNAME}:${process.env.MANGODB_PASSWORD}@linked123.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000`

if(!connectionString){
    throw new Error("you should define a connection url")
}

export const connectDB= async()=>{
    if(mongoose.connection?.readyState >= 1){

        console.log("already connected to mongodb")
        return
    }

    try{
        console.log('conecting to mongodb ....')
        await mongoose.connect(connectionString)
    }catch(error){
        console.error("error connecting mongodb",error)
    }
}

