import mongoose, { Types } from "mongoose";

enum typeItem {
  leftOver = "leftOver",
  cart = "cart",
}

export interface Item {
  itemId: Types.ObjectId;
  userId: Types.ObjectId;
  quantity: number;
  unit: string;
  type: typeItem;
}

interface ItemDocument extends Item, mongoose.Document {}
type ItemModel = mongoose.Model<ItemDocument>;
const ItemSchema = new mongoose.Schema<ItemDocument, ItemModel>(
  {
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    quantity: {
      type: Number,
      default: 1,
    },
    unit: {
      type: String,
      // required: true,
    },
    type: {
      type: String,
      enum: ["leftOver", "cart", "likedMeal"],
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
);
ItemSchema.virtual("leftOver", {
  ref: "Ingredient",
  localField: "itemId",
  foreignField: "_id",
  justOne: true,
});
ItemSchema.virtual("cart", {
  ref: "Ingredient",
  localField: "itemId",
  foreignField: "_id",
  justOne: true,
});
ItemSchema.virtual("likedMeal", {
  ref: "Meal",
  localField: "itemId",
  foreignField: "_id",
  justOne: true,
});

export default mongoose.model<ItemDocument>("Item", ItemSchema);
