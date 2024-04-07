import express, {Request, Response} from 'express';
// const router = Router();
import { getAllMeals } from '../controllers/mealController.ts';

const router = express.Router();

router.get('/search', async (req, res) => {
    const {ingredients} = req.query;
    if (!ingredients || typeof ingredients !== 'string') {
        return res.status(400).json({message: "Ingredients required"})
    } else {
        try {
            const recipes = await getAllMeals(ingredients.split(','))
            return res.json(recipes)
        } catch(error) {
            return res.status(500).json({message: `${error}`})
        }
    }
    
})

export default router;