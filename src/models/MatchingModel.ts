import mongoose from 'mongoose';
export interface Matching extends mongoose.Document {
    mapIngredients: Map<string, mongoose.Types.ObjectId>;
    progress: number;
    name: string;
}
type MatchingModel = mongoose.Model<Matching>;
const MatchingSchema = new mongoose.Schema<Matching, MatchingModel>({
    mapIngredients: {
        type: Map,
        of: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ingredient'
        }
    },
    progress: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
});


export default mongoose.model<Matching, MatchingModel>('Matching', MatchingSchema);
