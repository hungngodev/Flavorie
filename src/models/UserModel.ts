import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

export interface User {
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
    statistic: string[];
}
interface UserDocument extends User, mongoose.Document { };
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
    allergy: [{
        type: String,
        enum: ["Dairy", "Egg", "Gluten", "Grain", "Peanut", "Seafood", "Sesame", "Shellfish", "Soy", "Sulfite", "Tree Nut", "Wheat"],
    }],
    diet: [
        {
            type: String,
            enum: ["Gluten Free", "Ketogenic", "Vegetarian", "Lacto-Vegetarian", "Ovo-Vegetarian", "Vegan", "Pescetarian", "Paleo", "Primal", "Whole30", "Low FODMAP"],
        }
    ],
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


export default mongoose.model<UserDocument, UserModel>('User', UserSchema);
