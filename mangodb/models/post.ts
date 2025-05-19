import { IUser } from '@/types/users';
import mongoose,{Schema,Model,Document,models} from 'mongoose'
import { Comment,IComment, ICommentBase } from './comment';

export interface IPostBase{
    user:IUser;
    text:string;
    imageUrl?:string;
    comments?:IComment[];
    likes?:string[]
}

export interface IPost extends IPostBase,Document{
    createdAt:Date;
    updatedAt:Date;
}

interface IPostMethod{
    likePost(userId:string) : Promise<void>;
    unlikePost(userId:string) :Promise<void>;
    commentOnPost(comment:ICommentBase):Promise<void>;
    getAllComments():Promise<IComment[]>;
    removePost():Promise<void>;
}

interface IPostStatics{
    getAllPosts():Promise<IPostDocument[]>
}

export interface IPostDocument extends IPost,IPostMethod{}
interface IPostModel extends IPostStatics, Model<IPostDocument>{}

const PostSchema = new Schema<IPostDocument>({
    user:{
        userId:{type:String,required:true},
        imageUrl:{type:String,required:true},
        firstName:{type:String,required:true},
        lastName:{type:String}
    },
    text:{type:String,required:true},
    imageUrl:{type:String},
    comments:{type:[Schema.Types.ObjectId] , ref:"Comment" ,default:[]},
    likes:{type:[String]}
},{
    timestamps:true
})

PostSchema.methods.likePost = async function(userId :string){
    try{
        await this.updateOne({$addToSet: {likes:userId}})
    }catch(error){
        console.error("failed to like post")
    }
}
PostSchema.methods.unlikePost = async function(userId: string) {
    try {
        await this.updateOne({ $pull: { likes: userId } });
    } catch (error) {
        console.error("failed to unlike post");
    }
}

PostSchema.methods.removePost = async function(){
    try{

        await this.model("Post").deleteOne({_id:this._id})
    }catch(error){

        console.log("failed to remove post")
    }
}
PostSchema.methods.commentOnPost = async function(commentToAdd:ICommentBase){
    try{
        const comment = await Comment.create(commentToAdd)

        this.comments.push(comment._id)
        await this.save()

    }catch(error){
        console.error(error)
    }
}

PostSchema.methods.getAllComments = async function(){
    try{
         await this.populate({
            path:"comments",
            options:{sort :{createdAt :-1}}
         })

         return this.comments

    }catch(error){

console.error("failed to get all comments")
    }
}

PostSchema.statics.getAllPosts = async function(){
    try{
        const posts = await this.find().sort({createdAt:-1}).populate({
            path:"comments",
            option:{sort:{createdAt:-1}}
        }).lean()
        return posts.map((post:IPostDocument)=>({
            ...post,
            _id: (post._id as mongoose.Types.ObjectId).toString(),
            comments : post.comments?.map((comment:IComment)=>({
                ...comment,
                _id:(comment._id as mongoose.Types.ObjectId).toString(),
            }))
        }))
           
      
    }catch(error){
        console.error("failed to get all the posts")
    }
}

export const Post = models.Post as IPostModel || mongoose.model<IPostDocument,IPostModel>("Post",PostSchema)


