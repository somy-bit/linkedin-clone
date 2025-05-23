import { IUser } from "../../types/users";
import mongoose,{Schema,Document,models} from 'mongoose' 

export interface ICommentBase{
    user:IUser;
    text:string;
}

export interface IComment extends Document,ICommentBase{
    createdAt:Date;
    updatedAt:Date;
}

const commentSchema = new Schema<IComment>({
    user:{
        userId:{type:String,required:true},
        imageUrl:{type:String,required:true},
        firstName:{type:String,required:true},
        lastName:{type:String},
        userName:{type:String}
    },
    text:{type:String,required:true}

},{
    timestamps:true
})

export const Comment =models.Comment || mongoose.model<IComment>("Comment",commentSchema)