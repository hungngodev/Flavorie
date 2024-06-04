import mongoose, { Types } from 'mongoose';

enum typeItem {
    leftOver = 'leftOver',
    cart = 'cart',
}
enum typeStatus {
    pending = 'pending',
    completed = 'completed',
}
export interface Item {
    itemId: Types.ObjectId;
    userId: Types.ObjectId;
    quantity: number;
    unit: string;
    type: typeItem;
    status: typeStatus;
}

interface ItemDocument extends Item, mongoose.Document { };
type ItemModel = mongoose.Model<ItemDocument>;
const ItemSchema = new mongoose.Schema<ItemDocument, ItemModel>({
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'Ingredient'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    quantity: {
        type: Number,
        required: true,
    },
    unit: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['leftOver', 'cart', 'likedMeal'],
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'completed'],
        required: true,
    },

}, {
    timestamps: true,
});


export default mongoose.model<ItemDocument>('Item', ItemSchema);