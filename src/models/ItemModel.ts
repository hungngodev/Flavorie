import mongoose, { Types } from 'mongoose';

enum typeItem {
    leftOver = 'leftOver',
    cart = 'cart',
}

export interface Item {
    itemId: Types.ObjectId;
    userId: Types.ObjectId;
    quantity: number;
    unit: string;
    type: typeItem;
}

interface ItemDocument extends Item, mongoose.Document { };
type ItemModel = mongoose.Model<ItemDocument>;
const ItemSchema = new mongoose.Schema<ItemDocument, ItemModel>({
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ingredient'
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

}, {
    timestamps: true,
});


export default mongoose.model<ItemDocument>('Item', ItemSchema);