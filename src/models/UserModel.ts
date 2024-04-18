import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
export interface User extends mongoose.Document {
    name: string;
    email: string;
    password: string;
    lastName: string;
    location: string;
    role: string;
    avatar: string;
    avatarPublicId: string;
    preferences: string[];
    allergy: string[];
    diet: string;
    leftOver: string[];
    mealCooking: string[];
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
    leftOver: {
        type: [String],
        default: [],
    },
    mealCooking: {
        type: [String],
        default: [],
    },
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
