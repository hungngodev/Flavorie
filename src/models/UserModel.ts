import mongoose, { Types } from 'mongoose';
import bcrypt from 'bcrypt';
import { Ingredient } from './IngredientsModel.ts';
import { Meal } from './MealModel.ts';
export interface User extends mongoose.Document {
    name: string;
    email: string;
    password: string;
    lastName: string;
    location: string;
    role: string;
    avatar: string;
    avatarFileName: string;
    avatarPublicId: string;
    preferences: string[];
    allergy: string[];
    diet: string;
    leftOver: Types.DocumentArray<Ingredient>;
    mealCooking: Types.DocumentArray<Meal>;
    cart: Types.DocumentArray<Ingredient>;
    statistic: string[];
}
type UserModel = mongoose.Model<User>;
const UserSchema = new mongoose.Schema<User, UserModel>({
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
        default: 'lastName',
    },
    location: {
        type: String,
        default: 'my city',
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    avatar: String,
    avatarFileName: String,
    avatarPublicId: String,
    preferences: {
        type: [String],
        default: [],
    },
    allergy: {
        type: [String],
        default: [],
    },
    diet: {
        type: String,
        default: 'none',
    },
    leftOver: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ingredient'
    }],
    mealCooking: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Meal'
    }],
    cart: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ingredient'
    }],
    statistic: {
        type: [String],
        default: [],
    },
});

UserSchema.methods.toJSON = function () {
    let obj = this.toObject();
    delete obj.password;
    return obj;
};

UserSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});
export default mongoose.model<User, UserModel>('User', UserSchema);
