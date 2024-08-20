import bcrypt from "bcrypt";
import mongoose, { Types } from "mongoose";

export interface User {
  name: string;
  email: string;
  password: string;
  lastName: string;
  city: string;
  country: string;
  location: string;
  role: string;
  description: string;
  avatar: string;
  avatarFileName: string;
  avatarPublicId: string;
  savedPost: Types.DocumentArray<Types.ObjectId>;
  //   hidenPosts: Types.DocumentArray<Types.ObjectId>;
  preferences: string[];
  allergy: string[];
  diet: string[];
  statistic: string[];
  points: number;
}

interface UserDocument extends User, mongoose.Document {}
export type UserModel = mongoose.Model<UserDocument>;
const UserSchema = new mongoose.Schema<UserDocument, UserModel>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: String,
  lastName: {
    type: String,
    default: "lastName",
  },
  city: {
    type: String,
    default: "my city",
  },
  country: {
    type: String,
    default: "US",
  },
  description: {
    type: String,
    default: "A cute cook",
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  savedPost: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  //   hidenPosts: [
  //     {
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: "Post",
  //     },
  //   ],
  avatar: String,
  avatarFileName: String,
  avatarPublicId: String,
  preferences: {
    type: [String],
    default: [],
  },
  allergy: [
    {
      type: String,
      enum: [
        "Dairy",
        "Egg",
        "Gluten",
        "Grain",
        "Peanut",
        "Seafood",
        "Sesame",
        "Shellfish",
        "Soy",
        "Sulfite",
        "Tree Nut",
        "Wheat",
      ],
    },
  ],
  diet: [
    {
      type: String,
      enum: [
        "Gluten Free",
        "Ketogenic",
        "Vegetarian",
        "Lacto-Vegetarian",
        "Ovo-Vegetarian",
        "Vegan",
        "Pescetarian",
        "Paleo",
        "Primal",
        "Whole30",
        "Low FODMAP",
      ],
    },
  ],
  statistic: {
    type: [String],
    default: [],
  },
  points: {
    type: Number,
    default: 0,
  },
});

UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

export default mongoose.model<UserDocument, UserModel>("User", UserSchema);
