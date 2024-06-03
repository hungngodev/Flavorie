import mongoose from 'mongoose';
export interface Post extends mongoose.Document {

}
type PostModel = mongoose.Model<Post>;
const PostSchema = new mongoose.Schema<Post, PostModel>({

}, {
    timestamps: true,
});


export default mongoose.model<Post, PostModel>('Post', PostSchema);
