// import { Flex } from '@chakra-ui/react';
// import { QueryClient, useQuery } from '@tanstack/react-query';
// import Lottie from 'lottie-react';
// import { Params, useLoaderData } from 'react-router-dom';
// import { Ingredient } from '../assets/animations';
// import { ListOfMeals } from '../components';
// import { SearchBar } from '../components/ingredients/SearchBar';
// import { Specialty } from '../components/meals/Specialty';
// import customFetch from '../utils/customFetch';

// // Default values shown
// export interface Meal {
//       id: string;
//       _id: string;
//       title: string;
//       description: string;
//       image: string;
//       category: string;
//       numberOfLiked: number;
//       liked?: boolean;
//       // price: string;
//       infoLink: string;
// }

// const allMealsQuery = (params: { [key: string]: string }) => {
//       const search = params.search;
//       return {
//             queryKey: search ? ['meals', search] : ['meals'],
//             queryFn: async () => {
//                   const data = await customFetch('/meal', {
//                   params: search ? { search } : {},
//                   });
//                   return data;
//             },
//       };
// };

// export const loader =
//       (queryClient: QueryClient) =>
//       async ({ request }: { params: Params; request: Request }) => {
//             const queries: { [key: string]: string } = Object.fromEntries(new URL(request.url).searchParams.entries());
//             console.log(queries);
//             queryClient.ensureQueryData(allMealsQuery(queries));
//             return queries;
//       };

// function Meal() {
//       const params = useLoaderData();
//       const { data: queryData, status } = useQuery(allMealsQuery(params as { [key: string]: string }));
//       console.log(queryData);
//       const mealData = queryData?.data;
//       console.log(mealData);

//       return (
//             <Flex flexDir={'column'} width={'100%'} height={'100%'} alignItems={'center'}>
//                   <Specialty />
//                   <SearchBar autoCompleteLink="/meal/autocomplete" />
//                   {status === 'pending' ? (
//                   <Flex mt="5" justifyContent={'center'} alignItems={'center'} height={'100%'}>
//                         <Lottie animationData={Ingredient} loop={true} style={{ height: 600 }} />,
//                   </Flex>
//                   ) : (
//                   <div>
//                         {Object.entries(mealData).map(
//                               (entry, index) =>
//                               (entry[1] as Meal[]).length > 0 && (
//                                     <ListOfMeals
//                                           key={index + 'listMeal'}
//                                           Type={entry[0].toString()}
//                                           meals={entry[1] as Meal[]}
//                                     />
//                               ),
//                         )}
//                   </div>
//                   )}
//             </Flex>
//       );
// }

// export default Meal;

import React from 'react';
import { Flex } from '@chakra-ui/react';
import { QueryClient, useQuery } from '@tanstack/react-query';
import Lottie from 'lottie-react';
import { Params, useLoaderData } from 'react-router-dom';
import { Ingredient } from '../assets/animations';
import { ListOfMeals } from '../components';
import { SearchBar } from '../components/ingredients/SearchBar';
import { Specialty } from '../components/meals/Specialty';
import customFetch from '../utils/customFetch';

// Default values shown
export interface Meal {
    id: string;
    _id: string;
    title: string;
    description: string;
    image: string;
    category: string;
    numberOfLiked: number;
    liked?: boolean;
    // price: string;
    infoLink: string;
}

const mealData = {
    randomMeals: [
        {
            _id: '666e47a2c853ec80ce6c3e24',
            id: 660884,
            title: 'Spare Ribs',
            image: 'https://img.spoonacular.com/recipes/660884-556x370.jpg',
            category: ' ',
            description:
                'You can never have too many main course recipes, so give Spare Ribs a try. For <b>$2.03 per serving</b>, this recipe <b>covers 23%</b> of your daily requirements of vitamins and minerals. One serving contains <b>773 calories</b>, <b>35g of protein</b>, and <b>59g of fat</b>. This recipe serves 3. From preparation to the plate, this recipe takes around <b>45 minutes</b>. It is a good option if you\'re following a <b>gluten free and dairy free</b> diet. This recipe from Foodista has 3 fans. Head to the store and pick up oil, clear honey, five-spice powder, and a few other things to make it today. With a spoonacular <b>score of 53%</b>, this dish is pretty good. Similar recipes are <a href="https://spoonacular.com/recipes/sweet-temptation-ribs-tamarind-glazed-spare-ribs-391730">Sweet Temptation Ribs: Tamarind-Glazed Spare Ribs</a>, <a href="https://spoonacular.com/recipes/spare-ribs-1386553">Spare Ribs</a>, and <a href="https://spoonacular.com/recipes/spare-ribs-83079">Spare Ribs</a>.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '666f00bce5a858bcad5046d0',
            id: 769533,
            title: 'chettinad egg curry',
            image: 'https://img.spoonacular.com/recipes/769533-556x370.jpg',
            category: ' Indian,Asian',
            description:
                'The recipe chettinad egg curry can be made <b>in roughly 30 minutes</b>. One portion of this dish contains approximately <b>8g of protein</b>, <b>15g of fat</b>, and a total of <b>208 calories</b>. This recipe serves 4 and costs $1.29 per serving. It is a <b>budget friendly</b> recipe for fans of Indian food. It is brought to you by spoonacular user <a href="/profile/swasthi">swasthi</a>. If you have coriander leaves, pepper, cinnamon stick, and a few other ingredients on hand, you can make it. It is a good option if you\'re following a <b>gluten free, dairy free, lacto ovo vegetarian, and whole 30</b> diet. It works well as a hor d\'oeuvre. If you like this recipe, take a look at these similar recipes: <a href="https://spoonacular.com/recipes/chettinad-egg-curry-1229419">chettinad egg curry</a>, <a href="https://spoonacular.com/recipes/chettinad-curry-eggs-127912">Chettinad Curry Eggs</a>, and <a href="https://spoonacular.com/recipes/muttai-paniyaram-chettinad-egg-paniyaram-628809">Muttai Paniyaram – Chettinad Egg Paniyaram</a>.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '666a97936582319a8a272ea8',
            id: 663545,
            title: 'Tomatillo Turkey Chili',
            image: 'https://img.spoonacular.com/recipes/663545-556x370.jpg',
            category: 'super bowl American',
            description:
                'You can never have too many main course recipes, so give Tomatillo Turkey Chili a try. One portion of this dish contains around <b>29g of protein</b>, <b>8g of fat</b>, and a total of <b>301 calories</b>. For <b>$1.74 per serving</b>, this recipe <b>covers 25%</b> of your daily requirements of vitamins and minerals. This recipe serves 6. It will be a hit at your <b>The Super Bowl</b> event. This recipe is liked by 3 foodies and cooks. It is a <b>rather inexpensive</b> recipe for fans of American food. This recipe from Foodista requires ground cumin, jalapeno peppers, salt and pepper, and chicken broth. From preparation to the plate, this recipe takes about <b>45 minutes</b>. It is a good option if you\'re following a <b>gluten free and dairy free</b> diet. Overall, this recipe earns a <b>solid spoonacular score of 69%</b>. If you like this recipe, you might also like recipes such as <a href="https://spoonacular.com/recipes/tomatillo-turkey-chili-1377627">Tomatillo Turkey Chili</a>, <a href="https://spoonacular.com/recipes/chicken-tomatillo-chili-108096">Chicken Tomatillo Chili</a>, and <a href="https://spoonacular.com/recipes/tomatillo-pork-chili-695383">Tomatillo & Pork Chili</a>.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '666e8f15c853ec80ce6f2d9b',
            id: 658701,
            title: 'Roasted Vegetable Tart (Gluten Free, Dairy Free, Vegan)',
            image: 'https://img.spoonacular.com/recipes/658701-556x370.jpg',
            category: ' ',
            description:
                'Roasted Vegetable Tart (Gluten Free, Dairy Free, Vegan) is a <b>gluten free and lacto ovo vegetarian</b> recipe with 6 servings. One portion of this dish contains roughly <b>5g of protein</b>, <b>6g of fat</b>, and a total of <b>174 calories</b>. For <b>82 cents per serving</b>, this recipe <b>covers 17%</b> of your daily requirements of vitamins and minerals. 4 people have tried and liked this recipe. Head to the store and pick up kosher salt, non-dairy alternative, roma tomato, and a few other things to make it today. From preparation to the plate, this recipe takes roughly <b>45 minutes</b>. It is brought to you by Foodista. With a spoonacular <b>score of 93%</b>, this dish is great. If you like this recipe, you might also like recipes such as <a href="https://spoonacular.com/recipes/gluten-free-vegan-walnut-and-oat-brownies-vegan-gluten-free-grain-free-flourless-dairy-free-no-refined-sugar-1356583">Gluten-Free Vegan Walnut and Oat Brownies (Vegan, Gluten-Free, Grain-Free, Flourless, Dairy-Free, No Refined Sugar)</a>, <a href="https://spoonacular.com/recipes/gluten-free-vegan-walnut-and-oat-brownies-vegan-gluten-free-grain-free-flourless-dairy-free-no-refined-sugar-1191427">Gluten-Free Vegan Walnut and Oat Brownies (Vegan, Gluten-Free, Grain-Free, Flourless, Dairy-Free, No Refined Sugar)</a>, and <a href="https://spoonacular.com/recipes/gluten-free-vegan-walnut-and-oat-brownies-vegan-gluten-free-grain-free-flourless-dairy-free-no-refined-sugar-617963">Gluten-Free Vegan Walnut and Oat Brownies (Vegan, Gluten-Free, Grain-Free, Flourless, Dairy-Free, No Refined Sugar)</a>.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '666d2f24b8ed437e5b34a028',
            id: 645722,
            title: 'Grilled Ginger Miso Chicken',
            image: 'https://img.spoonacular.com/recipes/645722-556x370.jpg',
            category: "father's day,4th of july,summer ",
            description:
                'Grilled Ginger Miso Chicken is a <b>gluten free, dairy free, and ketogenic</b> recipe with 4 servings. This main course has <b>688 calories</b>, <b>50g of protein</b>, and <b>49g of fat</b> per serving. For <b>$2.12 per serving</b>, this recipe <b>covers 24%</b> of your daily requirements of vitamins and minerals. If you have green onions, sake, ginger root, and a few other ingredients on hand, you can make it. 5 people were glad they tried this recipe. It is brought to you by Foodista. It will be a hit at your <b>The Fourth Of July</b> event. From preparation to the plate, this recipe takes roughly <b>45 minutes</b>. All things considered, we decided this recipe <b>deserves a spoonacular score of 59%</b>. This score is solid. Users who liked this recipe also liked <a href="https://spoonacular.com/recipes/ginger-grilled-chicken-and-radishes-with-miso-scallion-dressing-1648739">Ginger-Grilled Chicken and Radishes with Miso-Scallion Dressing</a>, <a href="https://spoonacular.com/recipes/ginger-miso-grilled-asparagus-1304749">Ginger-Miso Grilled Asparagus</a>, and <a href="https://spoonacular.com/recipes/grilled-avocados-with-ginger-miso-743666">Grilled Avocados with Ginger Miso</a>.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '666e8e2bc853ec80ce6eb8a8',
            id: 659285,
            title: 'Satay Beef Balls',
            image: 'https://img.spoonacular.com/recipes/659285-556x370.jpg',
            category: ' ',
            description:
                'Satay Beef Balls requires roughly <b>45 minutes</b> from start to finish. Watching your figure? This dairy free recipe has <b>249 calories</b>, <b>15g of protein</b>, and <b>18g of fat</b> per serving. This recipe serves 6 and costs 68 cents per serving. It is brought to you by Foodista. 5 people have tried and liked this recipe. A mixture of spring onion, glove garlic, ground beef, and a handful of other ingredients are all it takes to make this recipe so delicious. Not a lot of people really liked this main course. Overall, this recipe earns a <b>not so excellent spoonacular score of 39%</b>. Users who liked this recipe also liked <a href="https://spoonacular.com/recipes/beef-satay-590696">Beef Satay</a>, <a href="https://spoonacular.com/recipes/beef-satay-344214">Beef Satay</a>, and <a href="https://spoonacular.com/recipes/beef-satay-1660317">Beef Satay</a>.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '666d2f21b8ed437e5b330f59',
            id: 641461,
            title: 'Deviled Eggs With Crab',
            image: 'https://img.spoonacular.com/recipes/641461-556x370.jpg',
            category: ' American',
            description:
                'Deviled Eggs With Crab requires roughly <b>45 minutes</b> from start to finish. One serving contains <b>120 calories</b>, <b>10g of protein</b>, and <b>8g of fat</b>. This gluten free, pescatarian, and ketogenic recipe serves 6 and costs <b>$1.09 per serving</b>. A mixture of mayonnaise, salt and pepper, hardboiled eggs, and a handful of other ingredients are all it takes to make this recipe so flavorful. 97 people were impressed by this recipe. It is a <b>reasonably priced</b> recipe for fans of American food. It works well as a hor d\'oeuvre. It is brought to you by Foodista. All things considered, we decided this recipe <b>deserves a spoonacular score of 38%</b>. This score is not so amazing. <a href="https://spoonacular.com/recipes/crab-deviled-eggs-1396283">Crab Deviled Eggs</a>, <a href="https://spoonacular.com/recipes/deviled-eggs-with-crab-1396279">Deviled Eggs With Crab</a>, and <a href="https://spoonacular.com/recipes/crab-deviled-eggs-476709">Crab Deviled Eggs</a> are very similar to this recipe.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '666e8e2ac853ec80ce6e8e00',
            id: 650255,
            title: 'Lobster Macaroni and Cheese',
            image: 'https://img.spoonacular.com/recipes/650255-556x370.jpg',
            category: ' American',
            description:
                'Lobster Macaroni and Cheese is a <b>pescatarian</b> main course. One serving contains <b>800 calories</b>, <b>34g of protein</b>, and <b>49g of fat</b>. This recipe serves 6. For <b>$3.81 per serving</b>, this recipe <b>covers 25%</b> of your daily requirements of vitamins and minerals. It is brought to you by Foodista. A mixture of elbow macaroni pasta, cups cheese, flour, and a handful of other ingredients are all it takes to make this recipe so tasty. This recipe is typical of American cuisine. 2 people have made this recipe and would make it again. From preparation to the plate, this recipe takes approximately <b>45 minutes</b>. With a spoonacular <b>score of 47%</b>, this dish is solid. Similar recipes include <a href="https://spoonacular.com/recipes/lobster-macaroni-and-cheese-1614057">Lobster Macaroni and Cheese</a>, <a href="https://spoonacular.com/recipes/lobster-macaroni-and-cheese-188501">Lobster Macaroni and Cheese</a>, and <a href="https://spoonacular.com/recipes/lobster-macaroni-and-cheese-1577599">Lobster Macaroni and Cheese</a>.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '666d2d5ab8ed437e5b2c8fb2',
            id: 638488,
            title: 'Chicken-Tortilla Chip Soup',
            image: 'https://img.spoonacular.com/recipes/638488-556x370.jpg',
            category: 'fall,winter ',
            description:
                'Chicken-Tortilla Chip Soup could be just the <b>gluten free, dairy free, fodmap friendly, and whole 30</b> recipe you\'ve been looking for. For <b>$1.09 per serving</b>, you get a main course that serves 8. One portion of this dish contains around <b>24g of protein</b>, <b>3g of fat</b>, and a total of <b>137 calories</b>. 11 person have tried and liked this recipe. Head to the store and pick up carrots, cilantro, bouillon cubes, and a few other things to make it today. It can be enjoyed any time, but it is especially good for <b>Autumn</b>. From preparation to the plate, this recipe takes about <b>45 minutes</b>. It is brought to you by Foodista. Taking all factors into account, this recipe <b>earns a spoonacular score of 58%</b>, which is good. <a href="https://spoonacular.com/recipes/tortilla-chip-crusted-chicken-with-queso-sauce-1562207">Tortilla Chip Crusted Chicken with Queso Sauce</a>, <a href="https://spoonacular.com/recipes/cheese-tortilla-chip-chicken-enchilada-chilaquiles-1014028">Cheese Tortilla Chip Chicken Enchilada Chilaquiles</a>, and <a href="https://spoonacular.com/recipes/garden-of-eatin-tortilla-chip-chicken-strips-83735">Garden Of Eatin’ Tortilla Chip Chicken Strips</a> are very similar to this recipe.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '666efeece5a858bcad502149',
            id: 643362,
            title: 'French Onion Marsala Soup',
            image: 'https://img.spoonacular.com/recipes/643362-556x370.jpg',
            category: 'fall,winter Mediterranean,French,European',
            description:
                'French Onion Marsala Soup is a Mediterranean main course. One serving contains <b>515 calories</b>, <b>19g of protein</b>, and <b>34g of fat</b>. This recipe serves 4. For <b>$2.4 per serving</b>, this recipe <b>covers 14%</b> of your daily requirements of vitamins and minerals. This recipe from Foodista requires salt and pepper, olive oil, thyme, and swiss cheese. From preparation to the plate, this recipe takes around <b>45 minutes</b>. <b>Autumn</b> will be even more special with this recipe. 8 people have made this recipe and would make it again. With a spoonacular <b>score of 43%</b>, this dish is solid. Users who liked this recipe also liked <a href="https://spoonacular.com/recipes/french-onion-soup-topped-french-bread-pizzas-and-salad-with-dijon-vinaigrette-312082">French Onion Soup Topped French Bread Pizzas and Salad with Dijon Vinaigrette</a>, <a href="https://spoonacular.com/recipes/crockpot-french-onion-soup-with-cheesy-french-toast-685740">Crockpot French Onion Soup with Cheesy French Toast</a>, and <a href="https://spoonacular.com/recipes/crockpot-french-onion-soup-with-cheesy-french-toast-1320489">Crockpot French Onion Soup with Cheesy French Toast</a>.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '666f0155e5a858bcad514127',
            id: 662551,
            title: 'Sweet Potato and Celery Soup',
            image: 'https://img.spoonacular.com/recipes/662551-556x370.jpg',
            category: 'fall,winter ',
            description:
                'Sweet Potato and Celery Soup takes roughly <b>45 minutes</b> from beginning to end. One portion of this dish contains about <b>1g of protein</b>, <b>2g of fat</b>, and a total of <b>57 calories</b>. For <b>20 cents per serving</b>, you get a hor d\'oeuvre that serves 12. This recipe from Foodista has 2 fans. If you have olive oil, celery, basil, and a few other ingredients on hand, you can make it. It will be a hit at your <b>Autumn</b> event. It is a good option if you\'re following a <b>gluten free, dairy free, paleolithic, and lacto ovo vegetarian</b> diet. With a spoonacular <b>score of 81%</b>, this dish is outstanding. <a href="https://spoonacular.com/recipes/celery-root-fennel-and-sweet-potato-soup-with-almond-parsley-12641">Celery Root, Fennel, And Sweet Potato Soup With Almond Parsley</a>, <a href="https://spoonacular.com/recipes/sweet-potato-celery-and-apple-salad-11919">Sweet Potato, Celery, And Apple Salad</a>, and <a href="https://spoonacular.com/recipes/carrot-celery-potato-cream-soup-516568">Carrot, Celery & Potato Cream Soup</a> are very similar to this recipe.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '666d2f1db8ed437e5b315e1d',
            id: 646317,
            title: 'Harvest Hash',
            image: 'https://img.spoonacular.com/recipes/646317-556x370.jpg',
            category: ' ',
            description:
                'If you have about <b>45 minutes</b> to spend in the kitchen, Harvest Hash might be an outstanding <b>gluten free, dairy free, paleolithic, and primal</b> recipe to try. One serving contains <b>494 calories</b>, <b>9g of protein</b>, and <b>36g of fat</b>. For <b>$1.62 per serving</b>, this recipe <b>covers 15%</b> of your daily requirements of vitamins and minerals. This recipe serves 4. 2 people were impressed by this recipe. If you have sweet potato, kosher salt, evoo, and a few other ingredients on hand, you can make it. It works well as a side dish. It is brought to you by Foodista. With a spoonacular <b>score of 36%</b>, this dish is not so awesome. <a href="https://spoonacular.com/recipes/harvest-hash-1401367">Harvest Hash</a>, <a href="https://spoonacular.com/recipes/harvest-hash-1438249">Harvest Hash</a>, and <a href="https://spoonacular.com/recipes/heavenly-harvest-hash-615820">Heavenly Harvest Hash</a> are very similar to this recipe.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '666d2f73b8ed437e5b3655fc',
            id: 661925,
            title: 'Strawberry-Mango Quinoa Salad',
            image: 'https://img.spoonacular.com/recipes/661925-556x370.jpg',
            category: ' ',
            description:
                'Need a <b>gluten free and lacto ovo vegetarian hor d\'oeuvre</b>? Strawberry-Mango Quinoa Salad could be an awesome recipe to try. This recipe serves 4. One serving contains <b>354 calories</b>, <b>8g of protein</b>, and <b>17g of fat</b>. For <b>$1.87 per serving</b>, this recipe <b>covers 21%</b> of your daily requirements of vitamins and minerals. 41 person were impressed by this recipe. This recipe from Foodista requires cucumber, cream, mango, and strawberries. From preparation to the plate, this recipe takes about <b>45 minutes</b>. All things considered, we decided this recipe <b>deserves a spoonacular score of 97%</b>. This score is tremendous. Similar recipes are <a href="https://spoonacular.com/recipes/strawberry-mango-quinoa-salad-1578467">Strawberry-Mango Quinoa Salad</a>, <a href="https://spoonacular.com/recipes/strawberry-mango-quinoa-salad-1588251">Strawberry-Mango Quinoa Salad</a>, and <a href="https://spoonacular.com/recipes/strawberry-mango-chopped-spinach-quinoa-salad-with-sesame-lime-vinaigrette-1469287">Strawberry & Mango Chopped Spinach Quinoa Salad with Sesame-Lime Vinaigrette</a>.',
            source: 'spoonacular',
            numberOfLiked: 1,
            liked: {
                _id: '66815a1b787fce659f043ade',
                itemId: '666d2f73b8ed437e5b3655fc',
                userId: {
                    savedPost: [],
                    _id: '6646dc265106c9e7632164b9',
                    name: 'hungngo1607@gmail.com',
                    email: 'hungngo1607@gmail.com',
                    lastName: 'lastName',
                    location: 'my city',
                    role: 'user',
                    preferences: [],
                    allergy: [],
                    diet: [],
                    mealCooking: [],
                    cart: [],
                    statistic: [],
                    leftOver: [],
                    __v: 0,
                },
                quantity: 1,
                type: 'likedMeal',
                createdAt: '2024-06-30T13:14:03.810Z',
                updatedAt: '2024-06-30T13:14:03.810Z',
                __v: 0,
                likedMeal: {
                    _id: '666d2f73b8ed437e5b3655fc',
                    title: 'Strawberry-Mango Quinoa Salad',
                    imageUrl: 'https://img.spoonacular.com/recipes/661925-556x370.jpg',
                    allIngredients: [
                        '66254ec1de4729f9b4e674f3',
                        '665030f51f0b300ad1efa392',
                        '66502f331f0b300ad1ef98e6',
                        '6656da91c70e5874845b99e1',
                        '6656da99c70e5874845b9aba',
                        '6628774b1672f75fb7c06763',
                        '6629d911a4c95127604b49d4',
                        '66254eb8de4729f9b4e66510',
                        '66254eb8de4729f9b4e66510',
                        '6628549aaa5852cf1cbd5409',
                        '6650317e1f0b300ad1efb4a3',
                        '6625506ade4729f9b4e729c9',
                        '662877051672f75fb7c05305',
                        '6628540caa5852cf1cbcb14d',
                    ],
                    amount: {
                        cucumbers: '3/4 cup cucumber',
                        'mint leaves': '2 tablespoons chopped fresh mint',
                        honey: '1 T. honey',
                        'juice of lime': '2 T. lime juice',
                        'lime rind': '1/2 t. lime zest',
                        mangos: '1/2 mango',
                        'olive oil': '1/4 c. olive oil',
                        capsicum: 'pepper',
                        quinoa: '1 c. quinoa, well rinsed',
                        'table salt': 'salt',
                        'natural yogurt': '1 T. sour cream (or plain yogurt can be subbed)',
                        strawberry: '1 1/2 cups strawberries, hulled and quartered',
                        'purified water': '1 1/2 c. water',
                    },
                    tags: ['gluten free', 'lacto ovo vegetarian', 'vegetarian', 'glutenFree', 'veryHealthy'],
                    source: 'spoonacular',
                    analyzeInstruction: [
                        {
                            name: '',
                            steps: [
                                {
                                    length: {
                                        number: 15,
                                        unit: 'minutes',
                                    },
                                    number: 1,
                                    step: 'Prepare the quinoa: In a medium saucepan combine the quinoa, water and 1/4 t. salt. Bring to a boil, reduce heat to low, cover and simmer until the liquid is just absorbed, about 15 minutes.',
                                    ingredients: [
                                        {
                                            id: 20035,
                                            name: 'quinoa',
                                            localizedName: 'quinoa',
                                            image: 'https://spoonacular.com/cdn/ingredients_100x100/uncooked-quinoa.png',
                                            _id: '666d2f73b8ed437e5b3655ff',
                                        },
                                        {
                                            id: 14412,
                                            name: 'water',
                                            localizedName: 'water',
                                            image: 'https://spoonacular.com/cdn/ingredients_100x100/water.png',
                                            _id: '666d2f73b8ed437e5b365600',
                                        },
                                        {
                                            id: 2047,
                                            name: 'salt',
                                            localizedName: 'salt',
                                            image: 'https://spoonacular.com/cdn/ingredients_100x100/salt.jpg',
                                            _id: '666d2f73b8ed437e5b365601',
                                        },
                                    ],
                                    equipment: [
                                        {
                                            id: 404669,
                                            name: 'sauce pan',
                                            localizedName: 'sauce pan',
                                            image: 'https://spoonacular.com/cdn/equipment_100x100/sauce-pan.jpg',
                                            _id: '666d2f73b8ed437e5b365602',
                                        },
                                    ],
                                    _id: '666d2f73b8ed437e5b3655fe',
                                },
                                {
                                    length: {
                                        number: 20,
                                        unit: 'minutes',
                                    },
                                    number: 2,
                                    step: 'Spread the cooked quinoa out on a baking sheet to cool for about 20 minutes.In a large bowl whisk together lime juice, zest, honey, sour cream and olive oil.',
                                    ingredients: [
                                        {
                                            id: 20137,
                                            name: 'cooked quinoa',
                                            localizedName: 'cooked quinoa',
                                            image: 'https://spoonacular.com/cdn/ingredients_100x100/cooked-quinoa.png',
                                            _id: '666d2f73b8ed437e5b365604',
                                        },
                                        {
                                            id: 9160,
                                            name: 'lime juice',
                                            localizedName: 'lime juice',
                                            image: 'https://spoonacular.com/cdn/ingredients_100x100/lime-juice.png',
                                            _id: '666d2f73b8ed437e5b365605',
                                        },
                                        {
                                            id: 1056,
                                            name: 'sour cream',
                                            localizedName: 'sour cream',
                                            image: 'https://spoonacular.com/cdn/ingredients_100x100/sour-cream.jpg',
                                            _id: '666d2f73b8ed437e5b365606',
                                        },
                                        {
                                            id: 4053,
                                            name: 'olive oil',
                                            localizedName: 'olive oil',
                                            image: 'https://spoonacular.com/cdn/ingredients_100x100/olive-oil.jpg',
                                            _id: '666d2f73b8ed437e5b365607',
                                        },
                                        {
                                            id: 0,
                                            name: 'spread',
                                            localizedName: 'spread',
                                            image: '',
                                            _id: '666d2f73b8ed437e5b365608',
                                        },
                                        {
                                            id: 19296,
                                            name: 'honey',
                                            localizedName: 'honey',
                                            image: 'https://spoonacular.com/cdn/ingredients_100x100/honey.png',
                                            _id: '666d2f73b8ed437e5b365609',
                                        },
                                    ],
                                    equipment: [
                                        {
                                            id: 404727,
                                            name: 'baking sheet',
                                            localizedName: 'baking sheet',
                                            image: 'https://spoonacular.com/cdn/equipment_100x100/baking-sheet.jpg',
                                            _id: '666d2f73b8ed437e5b36560a',
                                        },
                                        {
                                            id: 404661,
                                            name: 'whisk',
                                            localizedName: 'whisk',
                                            image: 'https://spoonacular.com/cdn/equipment_100x100/whisk.png',
                                            _id: '666d2f73b8ed437e5b36560b',
                                        },
                                        {
                                            id: 404783,
                                            name: 'bowl',
                                            localizedName: 'bowl',
                                            image: 'https://spoonacular.com/cdn/equipment_100x100/bowl.jpg',
                                            _id: '666d2f73b8ed437e5b36560c',
                                        },
                                    ],
                                    _id: '666d2f73b8ed437e5b365603',
                                },
                                {
                                    number: 3,
                                    step: 'Add the cooled quinoa, strawberries, mango, cucumber and mint. Toss well to combine and season with salt &amp; pepper.',
                                    ingredients: [
                                        {
                                            id: 9316,
                                            name: 'strawberries',
                                            localizedName: 'strawberries',
                                            image: 'https://spoonacular.com/cdn/ingredients_100x100/strawberries.png',
                                            _id: '666d2f73b8ed437e5b36560e',
                                        },
                                        {
                                            id: 11206,
                                            name: 'cucumber',
                                            localizedName: 'cucumber',
                                            image: 'https://spoonacular.com/cdn/ingredients_100x100/cucumber.jpg',
                                            _id: '666d2f73b8ed437e5b36560f',
                                        },
                                        {
                                            id: 1002030,
                                            name: 'pepper',
                                            localizedName: 'pepper',
                                            image: 'https://spoonacular.com/cdn/ingredients_100x100/pepper.jpg',
                                            _id: '666d2f73b8ed437e5b365610',
                                        },
                                        {
                                            id: 20035,
                                            name: 'quinoa',
                                            localizedName: 'quinoa',
                                            image: 'https://spoonacular.com/cdn/ingredients_100x100/uncooked-quinoa.png',
                                            _id: '666d2f73b8ed437e5b365611',
                                        },
                                        {
                                            id: 9176,
                                            name: 'mango',
                                            localizedName: 'mango',
                                            image: 'https://spoonacular.com/cdn/ingredients_100x100/mango.jpg',
                                            _id: '666d2f73b8ed437e5b365612',
                                        },
                                        {
                                            id: 2064,
                                            name: 'mint',
                                            localizedName: 'mint',
                                            image: 'https://spoonacular.com/cdn/ingredients_100x100/mint.jpg',
                                            _id: '666d2f73b8ed437e5b365613',
                                        },
                                        {
                                            id: 2047,
                                            name: 'salt',
                                            localizedName: 'salt',
                                            image: 'https://spoonacular.com/cdn/ingredients_100x100/salt.jpg',
                                            _id: '666d2f73b8ed437e5b365614',
                                        },
                                    ],
                                    equipment: [],
                                    _id: '666d2f73b8ed437e5b36560d',
                                },
                                {
                                    number: 4,
                                    step: 'Serve immediately.',
                                    ingredients: [],
                                    equipment: [],
                                    _id: '666d2f73b8ed437e5b365615',
                                },
                            ],
                            _id: '666d2f73b8ed437e5b3655fd',
                        },
                    ],
                    id: '661925',
                    videoLink: 'https://www.foodista.com/recipe/K2BYJP76/strawberry-mango-quinoa-salad',
                    description:
                        'Need a <b>gluten free and lacto ovo vegetarian hor d\'oeuvre</b>? Strawberry-Mango Quinoa Salad could be an awesome recipe to try. This recipe serves 4. One serving contains <b>354 calories</b>, <b>8g of protein</b>, and <b>17g of fat</b>. For <b>$1.87 per serving</b>, this recipe <b>covers 21%</b> of your daily requirements of vitamins and minerals. 41 person were impressed by this recipe. This recipe from Foodista requires cucumber, cream, mango, and strawberries. From preparation to the plate, this recipe takes about <b>45 minutes</b>. All things considered, we decided this recipe <b>deserves a spoonacular score of 97%</b>. This score is tremendous. Similar recipes are <a href="https://spoonacular.com/recipes/strawberry-mango-quinoa-salad-1578467">Strawberry-Mango Quinoa Salad</a>, <a href="https://spoonacular.com/recipes/strawberry-mango-quinoa-salad-1588251">Strawberry-Mango Quinoa Salad</a>, and <a href="https://spoonacular.com/recipes/strawberry-mango-chopped-spinach-quinoa-salad-with-sesame-lime-vinaigrette-1469287">Strawberry & Mango Chopped Spinach Quinoa Salad with Sesame-Lime Vinaigrette</a>.',
                    price: '1.8733000000000002',
                    readyInMinutes: '45',
                    servings: 4,
                    dishTypes: [
                        'side dish',
                        'antipasti',
                        'salad',
                        'starter',
                        'snack',
                        'appetizer',
                        'antipasto',
                        "hor d'oeuvre",
                    ],
                    __v: 0,
                    numberOfLiked: 1,
                },
                id: '66815a1b787fce659f043ade',
            },
        },
        {
            _id: '666a95a06582319a8a248c96',
            id: 643150,
            title: 'Fluffy frittata with spinach',
            image: 'https://img.spoonacular.com/recipes/643150-556x370.jpg',
            category: ' ',
            description:
                'If you have about <b>45 minutes</b> to spend in the kitchen, Fluffy frittata with spinach might be an outstanding <b>gluten free, primal, and ketogenic</b> recipe to try. One portion of this dish contains about <b>20g of protein</b>, <b>20g of fat</b>, and a total of <b>281 calories</b>. For <b>$1.48 per serving</b>, this recipe <b>covers 26%</b> of your daily requirements of vitamins and minerals. This recipe serves 4. It is brought to you by Foodista. Head to the store and pick up ricotta cheese, salt, nutmeg, and a few other things to make it today. It works well as a budget friendly main course. 7 people have made this recipe and would make it again. Overall, this recipe earns a <b>solid spoonacular score of 72%</b>. Similar recipes include <a href="https://spoonacular.com/recipes/fluffy-bacon-cheese-frittata-147451">Fluffy Bacon-Cheese Frittata</a>, <a href="https://spoonacular.com/recipes/fluffy-gluten-free-spinach-cheese-biscuits-682018">Fluffy Gluten Free Spinach Cheese Biscuits</a>, and <a href="https://spoonacular.com/recipes/fluffy-light-yummy-spinach-blue-cheese-souffle-427654">Fluffy, Light & Yummy: Spinach & Blue Cheese Souffle</a>.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '666d2f23b8ed437e5b34680c',
            id: 639646,
            title: 'Classic Wedge Salad',
            image: 'https://img.spoonacular.com/recipes/639646-556x370.jpg',
            category: ' ',
            description:
                'Classic Wedge Salad could be just the <b>gluten free</b> recipe you\'ve been looking for. One serving contains <b>450 calories</b>, <b>11g of protein</b>, and <b>42g of fat</b>. This recipe serves 4. For <b>$1.59 per serving</b>, this recipe <b>covers 14%</b> of your daily requirements of vitamins and minerals. A mixture of pepper, scallions, onion powder, and a handful of other ingredients are all it takes to make this recipe so yummy. This recipe from Foodista has 3 fans. Only a few people really liked this hor d\'oeuvre. From preparation to the plate, this recipe takes about <b>45 minutes</b>. With a spoonacular <b>score of 42%</b>, this dish is solid. <a href="https://spoonacular.com/recipes/classic-wedge-salad-591083">Classic Wedge Salad</a>, <a href="https://spoonacular.com/recipes/classic-wedge-salad-1027434">Classic Wedge Salad</a>, and <a href="https://spoonacular.com/recipes/classic-wedge-salad-1124376">Classic Wedge Salad</a> are very similar to this recipe.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '666e8e2bc853ec80ce6eefa0',
            id: 639644,
            title: 'Classic Vanilla-Orange Sugar Cookies',
            image: 'https://img.spoonacular.com/recipes/639644-556x370.jpg',
            category: 'christmas ',
            description:
                'Classic Vanilla-Orange Sugar Cookies is a dessert that serves 24. One portion of this dish contains roughly <b>3g of protein</b>, <b>13g of fat</b>, and a total of <b>221 calories</b>. For <b>39 cents per serving</b>, this recipe <b>covers 4%</b> of your daily requirements of vitamins and minerals. It is brought to you by Foodista. Only a few people made this recipe, and 7 would say it hit the spot. It will be a hit at your <b>Christmas</b> event. If you have egg yolk, salt, egg, and a few other ingredients on hand, you can make it. It is a good option if you\'re following a <b>lacto ovo vegetarian</b> diet. From preparation to the plate, this recipe takes around <b>45 minutes</b>. Taking all factors into account, this recipe <b>earns a spoonacular score of 18%</b>, which is not so amazing. Try <a href="https://spoonacular.com/recipes/vanilla-bean-orange-zest-sugar-cookies-967119">Vanilla Bean Orange Zest Sugar Cookies</a>, <a href="https://spoonacular.com/recipes/blood-orange-bourbon-smash-with-spicy-vanilla-sugar-628221">Blood Orange Bourbon Smash with Spicy Vanilla Sugar</a>, and <a href="https://spoonacular.com/recipes/classic-sugar-cookies-595721">Classic Sugar Cookies</a> for similar recipes.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '6680f1f75e72de001b315d95',
            id: 644488,
            title: 'German Rhubarb Cake with Meringue',
            image: 'https://img.spoonacular.com/recipes/644488-556x370.jpg',
            category: "spring,mother's day German,European",
            description:
                'German Rhubarb Cake with Meringue requires around <b>45 minutes</b> from start to finish. For <b>57 cents per serving</b>, this recipe <b>covers 6%</b> of your daily requirements of vitamins and minerals. One serving contains <b>201 calories</b>, <b>5g of protein</b>, and <b>4g of fat</b>. This recipe serves 12. <b>Mother\'s Day</b> will be even more special with this recipe. A mixture of roasted almonds, baking powder, sugar, and a handful of other ingredients are all it takes to make this recipe so scrumptious. 15 people were glad they tried this recipe. It works well as a dessert. It is a good option if you\'re following a <b>dairy free and lacto ovo vegetarian</b> diet. It is brought to you by Foodista. It is a <b>very reasonably priced</b> recipe for fans of European food. Overall, this recipe earns a <b>not so outstanding spoonacular score of 37%</b>. If you like this recipe, you might also like recipes such as <a href="https://spoonacular.com/recipes/german-rhubarb-cake-with-meringue-1200527">German Rhubarb Cake with Meringue</a>, <a href="https://spoonacular.com/recipes/rhubarb-meringue-cake-381275">Rhubarb Meringue Cake</a>, and <a href="https://spoonacular.com/recipes/rhubarb-meringue-tart-72822">Rhubarb Meringue Tart</a>.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '666efee0e5a858bcad4fc452',
            id: 1021260,
            title: 'Simple Protein Pancakes',
            image: 'https://img.spoonacular.com/recipes/1021260-556x370.jpg',
            category: ' ',
            description:
                'Simple Protein Pancakes is a breakfast that serves 5. One portion of this dish contains around <b>13g of protein</b>, <b>3g of fat</b>, and a total of <b>146 calories</b>. For <b>56 cents per serving</b>, this recipe <b>covers 10%</b> of your daily requirements of vitamins and minerals. From preparation to the plate, this recipe takes around <b>20 minutes</b>. This recipe from Pink When requires almond milk, baking powder, greek yogurt, and premier protein. 3 people were glad they tried this recipe. It is a good option if you\'re following a <b>gluten free</b> diet. Overall, this recipe earns a <b>not so tremendous spoonacular score of 38%</b>. Try <a href="https://spoonacular.com/recipes/simple-protein-pancakes-1497419">Simple Protein Pancakes</a>, <a href="https://spoonacular.com/recipes/simple-protein-pancakes-1368793">Simple Protein Pancakes</a>, and <a href="https://spoonacular.com/recipes/simple-protein-pancakes-1641917">Simple Protein Pancakes</a> for similar recipes.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '666d2f1db8ed437e5b3197e1',
            id: 632213,
            title: 'Almost Guilt Free Mac and Cheese',
            image: 'https://img.spoonacular.com/recipes/632213-556x370.jpg',
            category: ' American',
            description:
                'Forget going out to eat or ordering takeout every time you crave American food. Try making Almost Guilt Free Mac and Cheese at home. For <b>$2.72 per serving</b>, this recipe <b>covers 31%</b> of your daily requirements of vitamins and minerals. One portion of this dish contains about <b>38g of protein</b>, <b>31g of fat</b>, and a total of <b>585 calories</b>. This recipe serves 8. This recipe is liked by 4 foodies and cooks. From preparation to the plate, this recipe takes roughly <b>45 minutes</b>. Only a few people really liked this main course. If you have cellantani pasta, flour, goat cheese, and a few other ingredients on hand, you can make it. It is brought to you by Foodista. With a spoonacular <b>score of 68%</b>, this dish is good. If you like this recipe, you might also like recipes such as <a href="https://spoonacular.com/recipes/almost-guilt-free-mac-and-cheese-1395389">Almost Guilt Free Mac and Cheese</a>, <a href="https://spoonacular.com/recipes/guilt-free-mac-n-cheese-402121">Guilt-Free Mac \'n\' Cheese</a>, and <a href="https://spoonacular.com/recipes/guilt-free-no-bake-cheesecake-high-protein-gluten-free-1305549">Guilt-Free No-Bake Cheesecake {high protein, gluten-free}</a>.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '666d2d5cb8ed437e5b2d418c',
            id: 634753,
            title: 'Beer Can Chicken, Country Style Vegetables with Roasted Garlic',
            image: 'https://img.spoonacular.com/recipes/634753-556x370.jpg',
            category: "father's day ",
            description:
                'Beer Can Chicken, Country Style Vegetables with Roasted Garlic could be just the <b>gluten free and dairy free</b> recipe you\'ve been looking for. This recipe serves 4 and costs $5.66 per serving. This main course has <b>818 calories</b>, <b>46g of protein</b>, and <b>45g of fat</b> per serving. 2 people were impressed by this recipe. Head to the store and pick up paprika, salt, chilli flakes, and a few other things to make it today. <b>Father\'s Day</b> will be even more special with this recipe. From preparation to the plate, this recipe takes around <b>45 minutes</b>. It is brought to you by Foodista. Overall, this recipe earns an <b>awesome spoonacular score of 81%</b>. Users who liked this recipe also liked <a href="https://spoonacular.com/recipes/braised-country-style-pork-ribs-roasted-vegetables-and-gravy-522816">Braised country style pork ribs, roasted vegetables and gravy</a>, <a href="https://spoonacular.com/recipes/maple-glazed-chicken-with-roasted-country-vegetables-315705">Maple Glazed Chicken with Roasted Country Vegetables</a>, and <a href="https://spoonacular.com/recipes/beer-braised-country-style-pork-ribs-375953">Beer-Braised Country-Style Pork Ribs</a>.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '666e4633c853ec80ce6b7488',
            id: 658967,
            title: 'Saffron Chicken Tikka',
            image: 'https://img.spoonacular.com/recipes/658967-556x370.jpg',
            category: ' Indian,Asian',
            description:
                'Saffron Chicken Tikka could be just the <b>gluten free</b> recipe you\'ve been looking for. This recipe serves 3. One portion of this dish contains about <b>25g of protein</b>, <b>4g of fat</b>, and a total of <b>160 calories</b>. For <b>$1.65 per serving</b>, this recipe <b>covers 14%</b> of your daily requirements of vitamins and minerals. A few people made this recipe, and 34 would say it hit the spot. It works well as a main course. It is brought to you by Foodista. This recipe is typical of Indian cuisine. A mixture of chicken breasts, salt, chillies, and a handful of other ingredients are all it takes to make this recipe so flavorful. From preparation to the plate, this recipe takes around <b>45 minutes</b>. All things considered, we decided this recipe <b>deserves a spoonacular score of 61%</b>. This score is solid. Users who liked this recipe also liked <a href="https://spoonacular.com/recipes/saffron-marinated-chicken-skewers-kesari-malai-tikka-198909">Saffron-Marinated Chicken Skewers (Kesari Malai Tikka)</a>, <a href="https://spoonacular.com/recipes/chicken-tikka-how-to-make-chicken-tikka-in-oven-1200159">chicken tikka , how to make chicken tikkan in oven</a>, and <a href="https://spoonacular.com/recipes/chicken-tikka-how-to-make-chicken-tikka-in-oven-1242313">chicken tikka , how to make chicken tikkan in oven</a>.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '666e42ddc853ec80ce68f2b6',
            id: 639267,
            title: 'Chocolate-Date Cake with Chocolate Sticky Toffee Glaze',
            category: ' ',
            description:
                'Chocolate-Date Cake with Chocolate Sticky Toffee Glaze might be just the dessert you are searching for. This recipe serves 21 and costs 94 cents per serving. One serving contains <b>282 calories</b>, <b>3g of protein</b>, and <b>13g of fat</b>. 15 people found this recipe to be scrumptious and satisfying. If you have water, salt, butter, and a few other ingredients on hand, you can make it. It is brought to you by Foodista. From preparation to the plate, this recipe takes around <b>45 minutes</b>. Overall, this recipe earns a <b>rather bad spoonacular score of 22%</b>. Users who liked this recipe also liked <a href="https://spoonacular.com/recipes/chocolate-date-cake-with-chocolate-sticky-toffee-glaze-56667">Chocolate-date Cake With Chocolate Sticky Toffee Glaze</a>, <a href="https://spoonacular.com/recipes/sticky-toffee-date-cake-with-brown-sugar-caramel-sauce-481995">Sticky Toffee Date Cake with Brown Sugar Caramel Sauce</a>, and <a href="https://spoonacular.com/recipes/sticky-toffee-chocolate-fig-pudding-cake-496904">Sticky Toffee & Chocolate Fig Pudding Cake</a>.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '666d2f1cb8ed437e5b30c05e',
            id: 652591,
            title: 'Mummy Meatballs with Spaghetti',
            image: 'https://img.spoonacular.com/recipes/652591-556x370.jpg',
            category: 'halloween ',
            description:
                'Mummy Meatballs with Spaghetti is a main course that serves 16. For <b>$1.36 per serving</b>, this recipe <b>covers 20%</b> of your daily requirements of vitamins and minerals. One serving contains <b>531 calories</b>, <b>24g of protein</b>, and <b>9g of fat</b>. Not a lot of people made this recipe, and 2 would say it hit the spot. A mixture of parmesan cheese, bread crumbs, egg, and a handful of other ingredients are all it takes to make this recipe so scrumptious. It will be a hit at your <b>Halloween</b> event. It is brought to you by Foodista. From preparation to the plate, this recipe takes around <b>45 minutes</b>. Taking all factors into account, this recipe <b>earns a spoonacular score of 59%</b>, which is pretty good. Try <a href="https://spoonacular.com/recipes/spooky-eats-mummy-dogs-and-mummy-cookies-569193">Spooky Eats: Mummy-Dogs and Mummy Cookies</a>, <a href="https://spoonacular.com/recipes/chicken-meatballs-for-spaghetti-and-meatballs-136475">Chicken Meatballs For Spaghetti and Meatballs</a>, and <a href="https://spoonacular.com/recipes/spaghetti-and-meatballs-405270">Spaghetti and Meatballs</a> for similar recipes.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '6681446dc731f95b07cb34d9',
            id: 636363,
            title: 'Brussels Sprouts In Honey Butter With Chili Flakes',
            image: 'https://img.spoonacular.com/recipes/636363-556x370.jpg',
            category: 'super bowl American',
            description:
                'If you have around <b>45 minutes</b> to spend in the kitchen, Brussels Sprouts In Honey Butter With Chili Flakes might be a great <b>gluten free, lacto ovo vegetarian, and primal</b> recipe to try. This recipe makes 6 servings with <b>66 calories</b>, <b>3g of protein</b>, and <b>2g of fat</b> each. For <b>67 cents per serving</b>, this recipe <b>covers 13%</b> of your daily requirements of vitamins and minerals. If you have brussels sprouts, sea salt, sprinkle of chili flakes, and a few other ingredients on hand, you can make it. It will be a hit at your <b>The Super Bowl</b> event. Not a lot of people made this recipe, and 9 would say it hit the spot. This recipe is typical of American cuisine. It works well as a side dish. It is brought to you by Foodista. All things considered, we decided this recipe <b>deserves a spoonacular score of 55%</b>. This score is solid. Try <a href="https://spoonacular.com/recipes/sweet-chili-brussels-sprouts-541761">Sweet Chili Brussels Sprouts</a>, <a href="https://spoonacular.com/recipes/brussels-sprouts-with-balsamic-honey-622083">Brussels Sprouts with Balsamic Honey</a>, and <a href="https://spoonacular.com/recipes/brussels-sprouts-with-balsamic-honey-748923">Brussels Sprouts with Balsamic Honey</a> for similar recipes.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '666a97936582319a8a272ece',
            id: 645647,
            title: 'Grilled Chicken Hunter Style',
            image: 'https://img.spoonacular.com/recipes/645647-556x370.jpg',
            category: "father's day,4th of july,summer ",
            description:
                'Grilled Chicken Hunter Style might be a good recipe to expand your main course recipe box. One serving contains <b>732 calories</b>, <b>84g of protein</b>, and <b>38g of fat</b>. This recipe serves 4. For <b>$4.67 per serving</b>, this recipe <b>covers 41%</b> of your daily requirements of vitamins and minerals. It is a good option if you\'re following a <b>gluten free and primal</b> diet. It can be enjoyed any time, but it is especially good for <b>The Fourth Of July</b>. 2 people were glad they tried this recipe. A mixture of romano cheese, mushrooms, bell pepper, and a handful of other ingredients are all it takes to make this recipe so flavorful. It is brought to you by Foodista. From preparation to the plate, this recipe takes around <b>45 minutes</b>. Taking all factors into account, this recipe <b>earns a spoonacular score of 81%</b>, which is amazing. If you like this recipe, take a look at these similar recipes: <a href="https://spoonacular.com/recipes/hunter-style-chicken-74368">Hunter-style Chicken</a>, <a href="https://spoonacular.com/recipes/chicken-chasseur-hunter-style-chicken-with-creamy-polenta-with-gruyere-and-parmesan-1602495">Chicken Chasseur (Hunter-Style Chicken) with Creamy Polenta with Gruyere and Parmesan</a>, and <a href="https://spoonacular.com/recipes/chicken-chasseur-hunter-style-chicken-with-creamy-polenta-with-gruyere-and-parmesan-1230479">Chicken Chasseur (Hunter-Style Chicken) with Creamy Polenta with Gruyere and Parmesan</a>.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '666d2f1cb8ed437e5b30c0bc',
            id: 649817,
            title: 'Lemon White Wine Chicken over Linguini',
            image: 'https://img.spoonacular.com/recipes/649817-556x370.jpg',
            category: ' ',
            description:
                'Lemon White Wine Chicken over Linguini might be a good recipe to expand your main course recipe box. This recipe serves 2. For <b>$5.14 per serving</b>, this recipe <b>covers 36%</b> of your daily requirements of vitamins and minerals. One serving contains <b>824 calories</b>, <b>66g of protein</b>, and <b>29g of fat</b>. Head to the store and pick up al dente grain linguini, olive oil, pecorino cheese, and a few other things to make it today. 2 people have made this recipe and would make it again. It is brought to you by Foodista. From preparation to the plate, this recipe takes around <b>45 minutes</b>. Overall, this recipe earns a <b>solid spoonacular score of 72%</b>. If you like this recipe, you might also like recipes such as <a href="https://spoonacular.com/recipes/lemon-white-wine-chicken-over-linguini-1384137">Lemon White Wine Chicken over Linguini</a>, <a href="https://spoonacular.com/recipes/asparagus-white-wine-and-crme-frache-linguini-38223">Asparagus, White Wine And Crème Fraîche Linguini</a>, and <a href="https://spoonacular.com/recipes/lemon-and-white-wine-chicken-583617">Lemon and White Wine Chicken</a>.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '666ef930e5a858bcad4db285',
            id: 645821,
            title: 'Grilled Potato Skins',
            image: 'https://img.spoonacular.com/recipes/645821-556x370.jpg',
            category: "father's day,4th of july,summer ",
            description:
                'If you have approximately <b>1 hour and 15 minutes</b> to spend in the kitchen, Grilled Potato Skins might be an outstanding <b>gluten free</b> recipe to try. For <b>52 cents per serving</b>, you get a hor d\'oeuvre that serves 12. One serving contains <b>195 calories</b>, <b>6g of protein</b>, and <b>10g of fat</b>. 5 people have tried and liked this recipe. This recipe from Foodista requires cream, bacon, finely-chopped ham, and butter. It will be a hit at your <b>The Fourth Of July</b> event. All things considered, we decided this recipe <b>deserves a spoonacular score of 30%</b>. This score is rather bad. <a href="https://spoonacular.com/recipes/grilled-potato-skins-120644">Grilled Potato Skins</a>, <a href="https://spoonacular.com/recipes/grilled-bbq-potato-skins-147905">Grilled BBQ Potato Skins</a>, and <a href="https://spoonacular.com/recipes/grilled-vegetable-potato-skins-446707">Grilled Vegetable Potato Skins</a> are very similar to this recipe.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '666f00bee5a858bcad50890b',
            id: 632071,
            title: 'All American Sloppy Joes',
            image: 'https://img.spoonacular.com/recipes/632071-556x370.jpg',
            category: ' American',
            description:
                'The recipe All American Sloppy Joes could satisfy your American craving in roughly <b>45 minutes</b>. This recipe serves 4 and costs $1.82 per serving. Watching your figure? This dairy free recipe has <b>507 calories</b>, <b>25g of protein</b>, and <b>28g of fat</b> per serving. A couple people made this recipe, and 37 would say it hit the spot. It works well as a budget friendly main course. This recipe from Foodista requires shallots, burger buns, garlic cloves, and ground beef. Taking all factors into account, this recipe <b>earns a spoonacular score of 64%</b>, which is solid. Try <a href="https://spoonacular.com/recipes/sloppy-chori-joes-chorizo-sloppy-joes-472129">Sloppy Chori-Joes (Chorizo Sloppy Joes)</a>, <a href="https://spoonacular.com/recipes/mushy-joes-sloppy-joes-meatless-cousin-meatless-monday-603187">Mushy Joes (Sloppy Joes Meatless Cousin) (Meatless Monday)</a>, and <a href="https://spoonacular.com/recipes/mushy-joes-sloppy-joes-meatless-cousin-meatless-monday-1334583">Mushy Joes (Sloppy Joes Meatless Cousin) (Meatless Monday)</a> for similar recipes.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '666d2f0bb8ed437e5b2ef232',
            id: 657579,
            title: 'Quick Chicken Enchilada Soup',
            image: 'https://img.spoonacular.com/recipes/657579-556x370.jpg',
            category: 'fall,winter Mexican',
            description:
                'If you have approximately <b>45 minutes</b> to spend in the kitchen, Quick Chicken Enchilada Soup might be a super <b>gluten free</b> recipe to try. One serving contains <b>646 calories</b>, <b>34g of protein</b>, and <b>25g of fat</b>. This recipe serves 4 and costs $2.34 per serving. 92 people found this recipe to be yummy and satisfying. It is a <b>rather cheap</b> recipe for fans of Mexican food. <b>Autumn</b> will be even more special with this recipe. It is brought to you by Foodista. Head to the store and pick up cheese, milk, enchilada sauce, and a few other things to make it today. It works well as a main course. All things considered, we decided this recipe <b>deserves a spoonacular score of 76%</b>. This score is solid. Similar recipes are <a href="https://spoonacular.com/recipes/quick-dinner-ideas-cheesy-chicken-enchilada-soup-929217">Quick Dinner Ideas: Cheesy Chicken Enchilada Soup</a>, <a href="https://spoonacular.com/recipes/quick-and-easy-pressure-cooker-chicken-enchilada-soup-1193815">Quick and Easy Pressure Cooker Chicken Enchilada Soup</a>, and <a href="https://spoonacular.com/recipes/quick-and-easy-pressure-cooker-chicken-enchilada-soup-616244">Quick and Easy Pressure Cooker Chicken Enchilada Soup</a>.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '666e8f15c853ec80ce6f2ecd',
            id: 663931,
            title: 'Tuna Mexi Melts',
            image: 'https://img.spoonacular.com/recipes/663931-556x370.jpg',
            category: ' ',
            description:
                'Need a <b>pescatarian main course</b>? Tuna Mexi Melts could be an awesome recipe to try. This recipe serves 6. For <b>$2.7 per serving</b>, this recipe <b>covers 28%</b> of your daily requirements of vitamins and minerals. One serving contains <b>626 calories</b>, <b>34g of protein</b>, and <b>36g of fat</b>. It is brought to you by Foodista. 9 people were glad they tried this recipe. A mixture of jalapeno, your picante, cumin, and a handful of other ingredients are all it takes to make this recipe so yummy. From preparation to the plate, this recipe takes around <b>45 minutes</b>. All things considered, we decided this recipe <b>deserves a spoonacular score of 69%</b>. This score is solid. Similar recipes include <a href="https://spoonacular.com/recipes/homemade-mexi-melts-854873">Homemade Mexi-Melts</a>, <a href="https://spoonacular.com/recipes/seared-ahi-tuna-sea-steak-over-mexi-asian-salsa-89271">Seared Ahi Tuna Sea Steak over Mexi-Asian Salsa</a>, and <a href="https://spoonacular.com/recipes/tuna-melts-89365">Tuna Melts</a>.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
    ],
    sideMeals: [
        {
            _id: '665d5539577ac4d3c370f498',
            id: 638088,
            title: 'Chicken Farfalle with Low-Fat Alfredo Sauce',
            image: 'https://img.spoonacular.com/recipes/638088-556x370.jpg',
            category: ' Mediterranean,Italian,European',
            description:
                'Chicken Farfalle with Low-Fat Alfredo Sauce might be a good recipe to expand your main course recipe box. One serving contains <b>674 calories</b>, <b>43g of protein</b>, and <b>9g of fat</b>. For <b>$1.98 per serving</b>, this recipe <b>covers 27%</b> of your daily requirements of vitamins and minerals. This recipe serves 4. This recipe from Foodista has 7 fans. It is an <b>affordable</b> recipe for fans of Mediterranean food. Head to the store and pick up flour, butter, skim milk, and a few other things to make it today. From preparation to the plate, this recipe takes roughly <b>45 minutes</b>. Taking all factors into account, this recipe <b>earns a spoonacular score of 88%</b>, which is spectacular. Users who liked this recipe also liked <a href="https://spoonacular.com/recipes/chicken-farfalle-with-low-fat-alfredo-sauce-1632341">Chicken Farfalle with Low-Fat Alfredo Sauce</a>, <a href="https://spoonacular.com/recipes/low-fat-alfredo-sauce-624428">Low Fat Alfredo Sauce</a>, and <a href="https://spoonacular.com/recipes/almost-low-fat-chicken-alfredo-bake-with-bite-574307">Almost Low Fat Chicken Alfredo Bake with Bite</a>.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '666ef458e5a858bcad4b3ccf',
            id: 647679,
            title: 'Hyderabadi baghara Baingan',
            image: 'https://img.spoonacular.com/recipes/647679-556x370.jpg',
            category: ' ',
            description:
                'Hyderabadi baghara Baingan might be just the side dish you are searching for. This recipe serves 4 and costs $1.24 per serving. One portion of this dish contains roughly <b>7g of protein</b>, <b>7g of fat</b>, and a total of <b>169 calories</b>. 2 people have tried and liked this recipe. A mixture of jaggeryns, onion, garlic, and a handful of other ingredients are all it takes to make this recipe so tasty. It is brought to you by Foodista. From preparation to the plate, this recipe takes around <b>45 minutes</b>. It is a good option if you\'re following a <b>gluten free, dairy free, lacto ovo vegetarian, and vegan</b> diet. Overall, this recipe earns a <b>solid spoonacular score of 75%</b>. Try <a href="https://spoonacular.com/recipes/bagara-baingan-how-to-make-hyderabadi-bagara-baingan-488105">bagara baingan , how to make hyderabadi bagara baingan</a>, <a href="https://spoonacular.com/recipes/dum-ke-baingan-how-to-make-hyderabadi-dum-ke-baingan-486757">dum ke baingan , how to make hyderabadi dum ke baingan</a>, and <a href="https://spoonacular.com/recipes/bagara-baingan-hyderabadi-bagara-baingan-600348">Bagara Baingan – Hyderabadi bagara baingan</a> for similar recipes.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '665d575d577ac4d3c3724356',
            id: 636732,
            title: 'Cajun Lobster Pasta',
            image: 'https://img.spoonacular.com/recipes/636732-556x370.jpg',
            category: ' Creole,Cajun',
            description:
                'Cajun Lobster Pasta could be just the <b>gluten free and primal</b> recipe you\'ve been looking for. For <b>$5.4 per serving</b>, this recipe <b>covers 45%</b> of your daily requirements of vitamins and minerals. One serving contains <b>684 calories</b>, <b>35g of protein</b>, and <b>50g of fat</b>. This recipe serves 1. 2 people have made this recipe and would make it again. This recipe is typical of Cajun cuisine. From preparation to the plate, this recipe takes approximately <b>45 minutes</b>. A mixture of garlic powder, bell pepper, lemon pepper, and a handful of other ingredients are all it takes to make this recipe so yummy. It is brought to you by Foodista. It works well as a main course. Taking all factors into account, this recipe <b>earns a spoonacular score of 76%</b>, which is pretty good. <a href="https://spoonacular.com/recipes/cajun-lobster-pasta-1396967">Cajun Lobster Pasta</a>, <a href="https://spoonacular.com/recipes/cajun-lobster-pasta-1614055">Cajun Lobster Pasta</a>, and <a href="https://spoonacular.com/recipes/red-lobster-cajun-chicken-pasta-138824">Red Lobster Cajun Chicken Pasta</a> are very similar to this recipe.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '6680f1f75e72de001b314909',
            id: 642085,
            title: 'Easy Roasted Vegetables',
            image: 'https://img.spoonacular.com/recipes/642085-556x370.jpg',
            category: ' ',
            description:
                'Easy Roasted Vegetables is a <b>gluten free, dairy free, lacto ovo vegetarian, and whole 30</b> recipe with 4 servings. One portion of this dish contains about <b>9g of protein</b>, <b>4g of fat</b>, and a total of <b>358 calories</b>. For <b>$1.28 per serving</b>, this recipe <b>covers 30%</b> of your daily requirements of vitamins and minerals. 3 people have tried and liked this recipe. This recipe from Foodista requires butternut squash, paprika, salt & pepper, and olive oil. It works well as a side dish. From preparation to the plate, this recipe takes around <b>45 minutes</b>. All things considered, we decided this recipe <b>deserves a spoonacular score of 94%</b>. This score is spectacular. Similar recipes include <a href="https://spoonacular.com/recipes/easy-roasted-vegetables-379674">Easy Roasted Vegetables</a>, <a href="https://spoonacular.com/recipes/easy-roasted-vegetables-1378833">Easy Roasted Vegetables</a>, and <a href="https://spoonacular.com/recipes/easy-roasted-summer-vegetables-590293">Easy Roasted Summer Vegetables</a>.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '665a72f4a7da0532eecfc14a',
            id: 640827,
            title: 'Crispy Pineapple Fritters',
            image: 'https://img.spoonacular.com/recipes/640827-556x370.jpg',
            category: ' ',
            description:
                'Crispy Pineapple Fritters requires about <b>45 minutes</b> from start to finish. This recipe serves 12 and costs 36 cents per serving. One portion of this dish contains roughly <b>3g of protein</b>, <b>16g of fat</b>, and a total of <b>234 calories</b>. A few people really liked this hor d\'oeuvre. It is brought to you by Foodista. 13 people were impressed by this recipe. Head to the store and pick up panko breadcrumbs, milk, cornstarch, and a few other things to make it today. It is a good option if you\'re following a <b>lacto ovo vegetarian</b> diet. Overall, this recipe earns a <b>rather bad spoonacular score of 29%</b>. Similar recipes include <a href="https://spoonacular.com/recipes/crispy-pineapple-fritters-1557601">Crispy Pineapple Fritters</a>, <a href="https://spoonacular.com/recipes/crispy-pineapple-fritters-1524251">Crispy Pineapple Fritters</a>, and <a href="https://spoonacular.com/recipes/crispy-corn-fritters-163050">Crispy Corn Fritters</a>.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '666a95a26582319a8a25280b',
            id: 649795,
            title: 'Lemon Squares',
            image: 'https://img.spoonacular.com/recipes/649795-556x370.jpg',
            category: ' ',
            description:
                'Lemon Squares might be a good recipe to expand your side dish recipe box. For <b>27 cents per serving</b>, this recipe <b>covers 2%</b> of your daily requirements of vitamins and minerals. Watching your figure? This gluten free, lacto ovo vegetarian, and fodmap friendly recipe has <b>145 calories</b>, <b>2g of protein</b>, and <b>13g of fat</b> per serving. This recipe serves 8. From preparation to the plate, this recipe takes roughly <b>45 minutes</b>. This recipe from Foodista requires butter, powdered sugar, sugar, and lemon peel. 2 people have made this recipe and would make it again. With a spoonacular <b>score of 9%</b>, this dish is improvable. Users who liked this recipe also liked <a href="https://spoonacular.com/recipes/easy-lemon-bars-lemon-squares-1084214">Easy Lemon Bars (Lemon Squares)</a>, <a href="https://spoonacular.com/recipes/easy-lemon-bars-lemon-squares-1449673">Easy Lemon Bars (Lemon Squares)</a>, and <a href="https://spoonacular.com/recipes/lemon-squares-243451">Lemon Squares</a>.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '666a95a36582319a8a257561',
            id: 646512,
            title: 'Salmon Caesar Salad',
            image: 'https://img.spoonacular.com/recipes/646512-556x370.jpg',
            category: ' American',
            description:
                'The recipe Salmon Caesar Salad could satisfy your American craving in roughly <b>45 minutes</b>. One portion of this dish contains around <b>27g of protein</b>, <b>29g of fat</b>, and a total of <b>393 calories</b>. For <b>$3.01 per serving</b>, you get a main course that serves 2. It is brought to you by Foodista. 12 people were glad they tried this recipe. Head to the store and pick up parmesan cheese, lemon juice, paprika, and a few other things to make it today. It is a good option if you\'re following a <b>gluten free, primal, pescatarian, and ketogenic</b> diet. Taking all factors into account, this recipe <b>earns a spoonacular score of 94%</b>, which is great. Users who liked this recipe also liked <a href="https://spoonacular.com/recipes/salmon-caesar-salad-418441">Salmon Caesar Salad</a>, <a href="https://spoonacular.com/recipes/salmon-caesar-salad-521731">Salmon Caesar Salad</a>, and <a href="https://spoonacular.com/recipes/salmon-caesar-salad-1189903">Salmon Caesar Salad</a>.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '6681519428b309e897eefd21',
            id: 654225,
            title: 'Oven Roasted Pears With Blackberry Sauce',
            image: 'https://img.spoonacular.com/recipes/654225-556x370.jpg',
            category: ' ',
            description:
                'The recipe Oven Roasted Pears With Blackberry Sauce can be made <b>in approximately 45 minutes</b>. One portion of this dish contains roughly <b>4g of protein</b>, <b>11g of fat</b>, and a total of <b>341 calories</b>. This gluten free recipe serves 10 and costs <b>$1.36 per serving</b>. Only a few people made this recipe, and 3 would say it hit the spot. It works well as a side dish. Head to the store and pick up butter, blackberries, confectioners sugar, and a few other things to make it today. It is brought to you by Foodista. Taking all factors into account, this recipe <b>earns a spoonacular score of 29%</b>, which is not so great. Users who liked this recipe also liked <a href="https://spoonacular.com/recipes/roasted-pears-in-pecan-sauce-417233">Roasted Pears in Pecan Sauce</a>, <a href="https://spoonacular.com/recipes/roasted-pears-with-caramel-sauce-464760">Roasted Pears with Caramel Sauce</a>, and <a href="https://spoonacular.com/recipes/salt-roasted-pears-with-caramel-sauce-142631">Salt-Roasted Pears with Caramel Sauce</a>.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '666bd42404a8f740be2d316d',
            id: 651987,
            title: 'Mini Zucchini Bites (Cuadritos De Calabacin)',
            image: 'https://img.spoonacular.com/recipes/651987-556x370.jpg',
            category: ' ',
            description:
                'Mini Zucchini Bites (Cuadritos De Calabacin) requires around <b>45 minutes</b> from start to finish. For <b>94 cents per serving</b>, you get a side dish that serves 12. One portion of this dish contains roughly <b>13g of protein</b>, <b>18g of fat</b>, and a total of <b>316 calories</b>. This recipe is liked by 2 foodies and cooks. It is brought to you by Foodista. Head to the store and pick up bacon, salt& pepper, zucchini, and a few other things to make it today. All things considered, we decided this recipe <b>deserves a spoonacular score of 28%</b>. This score is not so amazing. Try <a href="https://spoonacular.com/recipes/sopa-de-calabacin-y-guajolote-zucchini-and-turkey-soup-105450">Sopa De Calabacin Y Guajolote (Zucchini and Turkey Soup)</a>, <a href="https://spoonacular.com/recipes/mini-zucchini-cheese-bites-557232">Mini Zucchini Cheese Bites</a>, and <a href="https://spoonacular.com/recipes/meatball-mini-bites-345729">Meatball Mini Bites</a> for similar recipes.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '666d2f0bb8ed437e5b2eceaa',
            id: 657723,
            title: 'Radish and Watercress Salad',
            image: 'https://img.spoonacular.com/recipes/657723-556x370.jpg',
            category: ' ',
            description:
                'Need a <b>gluten free, dairy free, paleolithic, and lacto ovo vegetarian hor d\'oeuvre</b>? Radish and Watercress Salad could be an outstanding recipe to try. This recipe serves 1 and costs $1.04 per serving. One serving contains <b>276 calories</b>, <b>2g of protein</b>, and <b>28g of fat</b>. 2 people have made this recipe and would make it again. Head to the store and pick up salt, garlic powder, radishes, and a few other things to make it today. From preparation to the plate, this recipe takes approximately <b>45 minutes</b>. It is brought to you by Foodista. With a spoonacular <b>score of 36%</b>, this dish is not so outstanding. Try <a href="https://spoonacular.com/recipes/radish-and-watercress-salad-169936">Radish and Watercress Salad</a>, <a href="https://spoonacular.com/recipes/watercress-onion-and-radish-salad-96460">Watercress, Onion, and Radish Salad</a>, and <a href="https://spoonacular.com/recipes/refreshing-daikon-radish-and-watercress-salad-13763">Refreshing Daikon Radish And Watercress Salad</a> for similar recipes.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '666e498ac853ec80ce6da468',
            id: 715421,
            title: 'Cheesy Chicken Enchilada Quinoa Casserole',
            image: 'https://img.spoonacular.com/recipes/715421-556x370.jpg',
            category: 'fall,winter Mexican',
            description:
                'Cheesy Chicken Enchilada Quinoa Casserole might be just the <b>Mexican</b> recipe you are searching for. One serving contains <b>594 calories</b>, <b>34g of protein</b>, and <b>24g of fat</b>. This gluten free recipe serves 4 and costs <b>$2.62 per serving</b>. A mixture of corn, pepper, canned tomatoes, and a handful of other ingredients are all it takes to make this recipe so delicious. From preparation to the plate, this recipe takes approximately <b>30 minutes</b>. It will be a hit at your <b>Autumn</b> event. Plenty of people made this recipe, and 9912 would say it hit the spot. It works well as an affordable main course. It is brought to you by Pink When. With a spoonacular <b>score of 97%</b>, this dish is amazing. If you like this recipe, you might also like recipes such as <a href="https://spoonacular.com/recipes/cheesy-chicken-enchilada-quinoa-casserole-1317125">Cheesy Chicken Enchilada Quinoa Casserole</a>, <a href="https://spoonacular.com/recipes/cheesy-chicken-enchilada-quinoa-casserole-1340231">Cheesy Chicken Enchilada Quinoa Casserole</a>, and <a href="https://spoonacular.com/recipes/cheesy-chicken-enchilada-quinoa-casserole-1280325">Cheesy Chicken Enchilada Quinoa Casserole</a>.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '665a72f4a7da0532eecfc0e2',
            id: 651202,
            title: 'Mashed Cauliflower',
            image: 'https://img.spoonacular.com/recipes/651202-556x370.jpg',
            category: ' ',
            description:
                'Mashed Cauliflower is a <b>gluten free and primal</b> recipe with 6 servings. This side dish has <b>196 calories</b>, <b>10g of protein</b>, and <b>13g of fat</b> per serving. For <b>$2.11 per serving</b>, this recipe <b>covers 18%</b> of your daily requirements of vitamins and minerals. 2 people were glad they tried this recipe. Head to the store and pick up nutmeg, chicken broth, bell pepper, and a few other things to make it today. From preparation to the plate, this recipe takes about <b>45 minutes</b>. It is brought to you by Foodista. Overall, this recipe earns a <b>solid spoonacular score of 53%</b>. Similar recipes include <a href="https://spoonacular.com/recipes/another-mock-mashed-potatoes-mashed-cauliflower-low-carb-112049">Another Mock Mashed Potatoes (mashed Cauliflower)-low Carb</a>, <a href="https://spoonacular.com/recipes/another-mock-mashed-potatoes-mashed-cauliflower-low-carb-1532827">Another Mock Mashed Potatoes (mashed Cauliflower)-low Carb</a>, and <a href="https://spoonacular.com/recipes/mashed-cauliflower-1469507">Mashed Cauliflower</a>.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '666f01a4e5a858bcad51c492',
            id: 644604,
            title: 'Ginger Molasses Rounds',
            image: 'https://img.spoonacular.com/recipes/644604-556x370.jpg',
            category: ' ',
            description:
                'Ginger Molasses Rounds requires approximately <b>45 minutes</b> from start to finish. Watching your figure? This lacto ovo vegetarian recipe has <b>485 calories</b>, <b>4g of protein</b>, and <b>24g of fat</b> per serving. For <b>49 cents per serving</b>, this recipe <b>covers 7%</b> of your daily requirements of vitamins and minerals. This recipe serves 6. This recipe is liked by 4 foodies and cooks. This recipe from Foodista requires baking soda, salt, sugar, and molasses. It works well as a side dish. With a spoonacular <b>score of 22%</b>, this dish is not so tremendous. If you like this recipe, take a look at these similar recipes: <a href="https://spoonacular.com/recipes/ginger-molasses-rounds-1432599">Ginger Molasses Rounds</a>, <a href="https://spoonacular.com/recipes/ginger-molasses-rounds-1379673">Ginger Molasses Rounds</a>, and <a href="https://spoonacular.com/recipes/spice-molasses-rounds-raw-gluten-free-vegan-dairy-free-soy-1236189">Spice Molasses Rounds (raw, Gluten-free, Vegan, Dairy-free, Soy</a>.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '666d2f1db8ed437e5b31610e',
            id: 716267,
            title: 'Soft Chin Chin',
            image: 'https://img.spoonacular.com/recipes/716267-556x370.jpg',
            category: ' ',
            description:
                'Soft Chin Chin takes about <b>45 minutes</b> from beginning to end. This recipe serves 4. One serving contains <b>568 calories</b>, <b>11g of protein</b>, and <b>23g of fat</b>. For <b>56 cents per serving</b>, this recipe <b>covers 14%</b> of your daily requirements of vitamins and minerals. It is a good option if you\'re following a <b>lacto ovo vegetarian</b> diet. 204 people were glad they tried this recipe. It is brought to you by Afrolems. Many people really liked this side dish. If you have egg, oil, butter/margarine, and a few other ingredients on hand, you can make it. Taking all factors into account, this recipe <b>earns a spoonacular score of 57%</b>, which is pretty good. Similar recipes include <a href="https://spoonacular.com/recipes/almond-and-olive-faux-bulgur-salad-550827">Almond and Olive “Faux-Bulgur” Salad</a>, <a href="https://spoonacular.com/recipes/soft-caramels-1359861">Soft Caramels</a>, and <a href="https://spoonacular.com/recipes/soft-polenta-411470">Soft Polenta</a>.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '666efc8fe5a858bcad4f80a1',
            id: 635226,
            title: 'Blackberry Peach Betty',
            image: 'https://img.spoonacular.com/recipes/635226-556x370.jpg',
            category: ' ',
            description:
                'Blackberry Peach Betty takes roughly <b>45 minutes</b> from beginning to end. This recipe serves 8 and costs 99 cents per serving. One serving contains <b>245 calories</b>, <b>2g of protein</b>, and <b>2g of fat</b>. Not a lot of people made this recipe, and 2 would say it hit the spot. It works well as a side dish. A mixture of peach pie filling, ground cinnamon, ¼ - sugar, and a handful of other ingredients are all it takes to make this recipe so delicious. It is brought to you by Foodista. All things considered, we decided this recipe <b>deserves a spoonacular score of 16%</b>. This score is rather bad. If you like this recipe, take a look at these similar recipes: <a href="https://spoonacular.com/recipes/blackberry-peach-betty-1364611">Blackberry Peach Betty</a>, <a href="https://spoonacular.com/recipes/blackberry-and-apple-brown-betty-597249">Blackberry and Apple Brown Betty</a>, and <a href="https://spoonacular.com/recipes/blackberry-brown-betty-with-pecan-crumble-744353">Blackberry Brown Betty with Pecan Crumble</a>.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
    ],
    mainMeals: [
        {
            _id: '666a97916582319a8a264c9d',
            id: 634873,
            title: 'Best Baked Macaroni and Cheese',
            image: 'https://img.spoonacular.com/recipes/634873-556x370.jpg',
            category: ' American',
            description:
                'Best Baked Macaroni and Cheese might be just the <b>American</b> recipe you are searching for. This recipe serves 12. This main course has <b>579 calories</b>, <b>26g of protein</b>, and <b>33g of fat</b> per serving. For <b>$1.76 per serving</b>, this recipe <b>covers 19%</b> of your daily requirements of vitamins and minerals. It is brought to you by Foodista. 80 people found this recipe to be yummy and satisfying. Head to the store and pick up kosher salt, bread, elbow macaroni, and a few other things to make it today. From preparation to the plate, this recipe takes roughly <b>45 minutes</b>. With a spoonacular <b>score of 61%</b>, this dish is solid. Users who liked this recipe also liked <a href="https://spoonacular.com/recipes/baked-macaroni-cheese-139360">Baked Macaroni & Cheese</a>, <a href="https://spoonacular.com/recipes/baked-macaroni-and-cheese-215144">Baked Macaroni and Cheese</a>, and <a href="https://spoonacular.com/recipes/baked-macaroni-and-cheese-303824">Baked Macaroni and Cheese</a>.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '666e42dbc853ec80ce6852e7',
            id: 638409,
            title: 'Chicken Verde Enchilada Casserole',
            image: 'https://img.spoonacular.com/recipes/638409-556x370.jpg',
            category: 'fall,winter Mexican',
            description:
                'Chicken Verde Enchilada Casserole requires approximately <b>45 minutes</b> from start to finish. For <b>$2.83 per serving</b>, this recipe <b>covers 27%</b> of your daily requirements of vitamins and minerals. This recipe serves 6. One portion of this dish contains around <b>35g of protein</b>, <b>27g of fat</b>, and a total of <b>537 calories</b>. It is a <b>rather cheap</b> recipe for fans of Mexican food. This recipe from Foodista has 13 fans. If you have guacamole, green onions, olive oil, and a few other ingredients on hand, you can make it. <b>Autumn</b> will be even more special with this recipe. It works well as a main course. It is a good option if you\'re following a <b>gluten free</b> diet. All things considered, we decided this recipe <b>deserves a spoonacular score of 58%</b>. This score is solid. Similar recipes include <a href="https://spoonacular.com/recipes/chicken-verde-enchilada-casserole-1376715">Chicken Verde Enchilada Casserole</a>, <a href="https://spoonacular.com/recipes/verde-chicken-enchilada-casserole-1031653">Verde Chicken Enchilada Casserole</a>, and <a href="https://spoonacular.com/recipes/chicken-enchilada-verde-dip-604535">Chicken Enchilada Verde Dip</a>.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '665d575d577ac4d3c37290a1',
            id: 663987,
            title: 'Turkey and Sausage Boulettes',
            image: 'https://img.spoonacular.com/recipes/663987-556x370.jpg',
            category: ' ',
            description:
                'Turkey and Sausage Boulettes requires roughly <b>45 minutes</b> from start to finish. For <b>$2.56 per serving</b>, you get a main course that serves 6. One portion of this dish contains approximately <b>35g of protein</b>, <b>30g of fat</b>, and a total of <b>484 calories</b>. Not a lot of people made this recipe, and 5 would say it hit the spot. It is brought to you by Foodista. Head to the store and pick up oil, egg, sausage meat, and a few other things to make it today. Overall, this recipe earns a <b>good spoonacular score of 60%</b>. If you like this recipe, you might also like recipes such as <a href="https://spoonacular.com/recipes/shrimp-boulettes-244617">Shrimp Boulettes</a>, <a href="https://spoonacular.com/recipes/ragot-de-boulettes-et-de-pattes-de-cochon-or-so-it-will-have-you-believe-551323">Ragoût de boulettes et de pattes de cochon – Or so it will have you believe…</a>, and <a href="https://spoonacular.com/recipes/marys-cajun-beef-pork-boulettes-with-brown-sauce-245038">Mary\'s Cajun Beef & Pork Boulettes with Brown Sauce</a>.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '666d2f24b8ed437e5b34a097',
            id: 641842,
            title: 'Easy Beef Bourguignon',
            image: 'https://img.spoonacular.com/recipes/641842-556x370.jpg',
            category: ' ',
            description:
                'Easy Beef Bourguignon requires roughly <b>45 minutes</b> from start to finish. This dairy free recipe serves 4 and costs <b>$3.78 per serving</b>. One serving contains <b>428 calories</b>, <b>32g of protein</b>, and <b>21g of fat</b>. Head to the store and pick up beef chuck, rosemary, red wine, and a few other things to make it today. 6 people have tried and liked this recipe. Not a lot of people really liked this main course. It is brought to you by Foodista. With a spoonacular <b>score of 82%</b>, this dish is spectacular. Try <a href="https://spoonacular.com/recipes/easy-beef-bourguignon-862944">Easy Beef Bourguignon</a>, <a href="https://spoonacular.com/recipes/easy-beef-bourguignon-1147547">Easy Beef Bourguignon</a>, and <a href="https://spoonacular.com/recipes/easy-beef-bourguignon-1530389">Easy Beef Bourguignon</a> for similar recipes.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '666d2f0bb8ed437e5b2ef2c6',
            id: 655174,
            title: 'Peach, Ham and Feta Salad with Fruity Olive Oil Dressing',
            image: 'https://img.spoonacular.com/recipes/655174-556x370.jpg',
            category: ' ',
            description:
                'You can never have too many main course recipes, so give Peach, Ham and Feta Salad with Fruity Olive Oil Dressing a try. This recipe serves 4. One portion of this dish contains roughly <b>15g of protein</b>, <b>22g of fat</b>, and a total of <b>387 calories</b>. For <b>$3.08 per serving</b>, this recipe <b>covers 18%</b> of your daily requirements of vitamins and minerals. From preparation to the plate, this recipe takes roughly <b>45 minutes</b>. 3 people found this recipe to be flavorful and satisfying. It is a good option if you\'re following a <b>gluten free</b> diet. A mixture of cider apple vinegar, peaches, mesclun leaves, and a handful of other ingredients are all it takes to make this recipe so scrumptious. It is brought to you by Foodista. Overall, this recipe earns a <b>solid spoonacular score of 59%</b>. Try <a href="https://spoonacular.com/recipes/grilled-vegetable-salad-with-olive-oil-and-feta-541543">Grilled Vegetable Salad with Olive Oil and Feta</a>, <a href="https://spoonacular.com/recipes/parsley-salad-with-olive-oil-dressing-654707">Parsley Salad With Olive Oil Dressing</a>, and <a href="https://spoonacular.com/recipes/broccoli-salad-with-feta-olive-oil-fried-almonds-currants-56087">Broccoli Salad With Feta, Olive-oil-fried Almonds & Currants</a> for similar recipes.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '666d2f23b8ed437e5b341094',
            id: 634320,
            title: 'Barbecued Pulled Beef Sandwiches',
            image: 'https://img.spoonacular.com/recipes/634320-556x370.jpg',
            category: ' ',
            description:
                'Barbecued Pulled Beef Sandwiches requires about <b>45 minutes</b> from start to finish. For <b>$2.71 per serving</b>, this recipe <b>covers 26%</b> of your daily requirements of vitamins and minerals. This recipe serves 6. Watching your figure? This dairy free recipe has <b>766 calories</b>, <b>37g of protein</b>, and <b>33g of fat</b> per serving. 5 people were glad they tried this recipe. It works well as a rather inexpensive main course. Head to the store and pick up bacon, hawaiian rolls, olive oil, and a few other things to make it today. It is brought to you by Foodista. All things considered, we decided this recipe <b>deserves a spoonacular score of 53%</b>. This score is pretty good. <a href="https://spoonacular.com/recipes/barbecued-beef-sandwiches-425271">Barbecued Beef Sandwiches</a>, <a href="https://spoonacular.com/recipes/barbecued-beef-sandwiches-425278">Barbecued Beef Sandwiches</a>, and <a href="https://spoonacular.com/recipes/barbecued-beef-sandwiches-425289">Barbecued Beef Sandwiches</a> are very similar to this recipe.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '666d2f1eb8ed437e5b3231bc',
            id: 652919,
            title: 'Nachos Grande',
            image: 'https://img.spoonacular.com/recipes/652919-556x370.jpg',
            category: ' Mexican',
            description:
                'Nachos Grande might be just the hor d\'oeuvre you are searching for. This recipe makes 4 servings with <b>642 calories</b>, <b>21g of protein</b>, and <b>34g of fat</b> each. For <b>$2.05 per serving</b>, this recipe <b>covers 27%</b> of your daily requirements of vitamins and minerals. It is brought to you by Foodista. 2 people were glad they tried this recipe. Only a few people really liked this Mexican dish. A mixture of chili, paprika to garnish, onion, and a handful of other ingredients are all it takes to make this recipe so tasty. It is a good option if you\'re following a <b>gluten free and lacto ovo vegetarian</b> diet. From preparation to the plate, this recipe takes roughly <b>45 minutes</b>. Taking all factors into account, this recipe <b>earns a spoonacular score of 58%</b>, which is solid. Users who liked this recipe also liked <a href="https://spoonacular.com/recipes/nachos-grande-1632297">Nachos Grande</a>, <a href="https://spoonacular.com/recipes/el-grande-burritos-159104">El Grande Burritos</a>, and <a href="https://spoonacular.com/recipes/burrito-grande-160240">Burrito Grande</a>.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '666d2f0bb8ed437e5b2ef2f3',
            id: 642332,
            title: 'Eggs Florentine',
            image: 'https://img.spoonacular.com/recipes/642332-556x370.jpg',
            category: ' ',
            description:
                'Eggs Florentine might be a good recipe to expand your main course collection. This recipe makes 4 servings with <b>433 calories</b>, <b>22g of protein</b>, and <b>25g of fat</b> each. For <b>$2.12 per serving</b>, this recipe <b>covers 31%</b> of your daily requirements of vitamins and minerals. Head to the store and pick up water, cayenne pepper, spinach, and a few other things to make it today. This recipe from Foodista has 37 fans. From preparation to the plate, this recipe takes approximately <b>45 minutes</b>. It is a good option if you\'re following a <b>lacto ovo vegetarian</b> diet. Taking all factors into account, this recipe <b>earns a spoonacular score of 83%</b>, which is super. Similar recipes include <a href="https://spoonacular.com/recipes/eggs-florentine-78314">Eggs Florentine</a>, <a href="https://spoonacular.com/recipes/eggs-florentine-1219131">Eggs Florentine</a>, and <a href="https://spoonacular.com/recipes/eggs-florentine-1372597">Eggs Florentine</a>.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '666a95a36582319a8a2573a7',
            id: 658418,
            title: 'Roast Chicken with Apples and Rosemary',
            image: 'https://img.spoonacular.com/recipes/658418-556x370.jpg',
            category: ' ',
            description:
                'Need a <b>gluten free, dairy free, paleolithic, and primal main course</b>? Roast Chicken with Apples and Rosemary could be a super recipe to try. One portion of this dish contains around <b>35g of protein</b>, <b>30g of fat</b>, and a total of <b>513 calories</b>. This recipe serves 8. For <b>$2.36 per serving</b>, this recipe <b>covers 22%</b> of your daily requirements of vitamins and minerals. If you have apples, onions, garlic, and a few other ingredients on hand, you can make it. 7 people have made this recipe and would make it again. From preparation to the plate, this recipe takes roughly <b>45 minutes</b>. It is brought to you by Foodista. Overall, this recipe earns a <b>good spoonacular score of 75%</b>. Try <a href="https://spoonacular.com/recipes/roast-chicken-with-apples-and-rosemary-1323195">Roast Chicken with Apples and Rosemary</a>, <a href="https://spoonacular.com/recipes/roast-chicken-with-apples-and-rosemary-1352353">Roast Chicken with Apples and Rosemary</a>, and <a href="https://spoonacular.com/recipes/roast-chicken-with-apples-and-rosemary-1356885">Roast Chicken with Apples and Rosemary</a> for similar recipes.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '665a72f5a7da0532eed01ea8',
            id: 661948,
            title: 'Strip steak with roasted cherry tomatoes and vegetable mash',
            image: 'https://img.spoonacular.com/recipes/661948-556x370.jpg',
            category: "valentine's day,father's day ",
            description:
                'Strip steak with roasted cherry tomatoes and vegetable mash might be just the main course you are searching for. Watching your figure? This gluten free, primal, and ketogenic recipe has <b>903 calories</b>, <b>56g of protein</b>, and <b>66g of fat</b> per serving. This recipe serves 4. For <b>$7.97 per serving</b>, this recipe <b>covers 38%</b> of your daily requirements of vitamins and minerals. This recipe from Foodista has 3 fans. If you have rosemary, olive oil, garlic, and a few other ingredients on hand, you can make it. It is perfect for <b>valentin day</b>. From preparation to the plate, this recipe takes around <b>45 minutes</b>. Taking all factors into account, this recipe <b>earns a spoonacular score of 78%</b>, which is good. Similar recipes are <a href="https://spoonacular.com/recipes/coffee-rubbed-ny-strip-steak-with-berry-sauce-parsnip-mash-628498">Coffee-Rubbed NY Strip Steak with Berry Sauce & Parsnip Mash</a>, <a href="https://spoonacular.com/recipes/new-york-strip-steak-lavished-with-tomatoes-and-olives-725612">New York Strip Steak Lavished with Tomatoes and Olives</a>, and <a href="https://spoonacular.com/recipes/steak-fajitas-with-grilled-onions-peppers-and-roasted-cherry-tomatoes-with-chimichurri-sauce-555679">Steak Fajitas with Grilled Onions, Peppers, and Roasted Cherry Tomatoes with Chimichurri Sauce</a>.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '666e8f17c853ec80ce6fdd12',
            id: 665294,
            title: 'Whole Wheat No-Yeast Pizza with Roasted Garlic, Sweet Potatoes, and Onions',
            image: 'https://img.spoonacular.com/recipes/665294-556x370.jpg',
            category: ' Mediterranean,Italian,European',
            description:
                'Whole Wheat No-Yeast Pizza with Roasted Garlic, Sweet Potatoes, and Onions is a main course that serves 3. One serving contains <b>678 calories</b>, <b>27g of protein</b>, and <b>15g of fat</b>. For <b>$4.87 per serving</b>, this recipe <b>covers 43%</b> of your daily requirements of vitamins and minerals. A few people made this recipe, and 12 would say it hit the spot. It is a good option if you\'re following a <b>lacto ovo vegetarian</b> diet. If you have thyme, foil, sweet potatoes, and a few other ingredients on hand, you can make it. It is brought to you by Foodista. From preparation to the plate, this recipe takes around <b>45 minutes</b>. It is a <b>pretty expensive</b> recipe for fans of Mediterranean food. Overall, this recipe earns a <b>tremendous spoonacular score of 97%</b>. Try <a href="https://spoonacular.com/recipes/roasted-garlic-spinach-tomato-whole-wheat-pizza-626484">Roasted Garlic, Spinach & Tomato Whole Wheat Pizza</a>, <a href="https://spoonacular.com/recipes/roasted-sweet-potatoes-with-onions-779036">Roasted Sweet Potatoes With Onions</a>, and <a href="https://spoonacular.com/recipes/roasted-sweet-potatoes-and-onions-163580">Roasted Sweet Potatoes and Onions</a> for similar recipes.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '665d5538577ac4d3c3709c9b',
            id: 636199,
            title: 'Broccoli Oatmeal Breakfast Casserole',
            image: 'https://img.spoonacular.com/recipes/636199-556x370.jpg',
            category: 'fall,winter,christmas ',
            description:
                'Broccoli Oatmeal Breakfast Casserole is a main course that serves 4. One portion of this dish contains around <b>13g of protein</b>, <b>11g of fat</b>, and a total of <b>269 calories</b>. For <b>61 cents per serving</b>, this recipe <b>covers 20%</b> of your daily requirements of vitamins and minerals. It can be enjoyed any time, but it is especially good for <b>Christmas</b>. This recipe is liked by 2 foodies and cooks. A mixture of baking powder, broccoli florets, salt, and a handful of other ingredients are all it takes to make this recipe so flavorful. It is a good option if you\'re following a <b>gluten free and lacto ovo vegetarian</b> diet. From preparation to the plate, this recipe takes roughly <b>45 minutes</b>. It is brought to you by Foodista. All things considered, we decided this recipe <b>deserves a spoonacular score of 59%</b>. This score is pretty good. Similar recipes are <a href="https://spoonacular.com/recipes/broccoli-oatmeal-breakfast-casserole-1381179">Broccoli Oatmeal Breakfast Casserole</a>, <a href="https://spoonacular.com/recipes/broccoli-and-cheese-breakfast-casserole-521474">Broccoli and Cheese Breakfast Casserole</a>, and <a href="https://spoonacular.com/recipes/broccoli-leek-breakfast-casserole-29457">Broccoli & Leek Breakfast Casserole</a>.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '666a95a36582319a8a257e56',
            id: 1098393,
            title: 'Mardi Gras Shrimp Étouffée',
            image: 'https://img.spoonacular.com/recipes/1098393-556x370.jpg',
            category: ' ',
            description:
                'Mardi Gras Shrimp Étouffée takes around <b>1 hour and 30 minutes</b> from beginning to end. One portion of this dish contains about <b>40g of protein</b>, <b>20g of fat</b>, and a total of <b>420 calories</b>. For <b>$5.35 per serving</b>, this recipe <b>covers 25%</b> of your daily requirements of vitamins and minerals. This recipe serves 4. This recipe from Foodista has 7 fans. Head to the store and pick up tomato, chicken broth, celery stalks, and a few other things to make it today. It works well as an expensive main course. Taking all factors into account, this recipe <b>earns a spoonacular score of 62%</b>, which is pretty good. Users who liked this recipe also liked <a href="https://spoonacular.com/recipes/mardi-gras-shrimp-touffe-1383647">Mardi Gras Shrimp Étouffée</a>, <a href="https://spoonacular.com/recipes/mardi-gras-shrimp-touffe-1380259">Mardi Gras Shrimp Étouffée</a>, and <a href="https://spoonacular.com/recipes/mardi-gras-shrimp-touffe-1378913">Mardi Gras Shrimp Étouffée</a>.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '665d575d577ac4d3c3728edb',
            id: 636400,
            title: 'Buffalo "Chicken" Wrap With Cheddar-Ranch & Roasted Peppers',
            image: 'https://img.spoonacular.com/recipes/636400-556x370.jpg',
            category: ' ',
            description:
                'If you want to add more <b>ketogenic</b> recipes to your repertoire, Buffalo "Chicken" Wrap With Cheddar-Ranch & Roasted Peppers might be a recipe you should try. This recipe serves 1 and costs $38.93 per serving. One serving contains <b>4288 calories</b>, <b>342g of protein</b>, and <b>302g of fat</b>. Only a few people really liked this main course. It is brought to you by Foodista. If you have mayo, cream, snack stick of extra sharp cheddar, and a few other ingredients on hand, you can make it. 2 people were impressed by this recipe. From preparation to the plate, this recipe takes approximately <b>45 minutes</b>. All things considered, we decided this recipe <b>deserves a spoonacular score of 77%</b>. This score is pretty good. Users who liked this recipe also liked <a href="https://spoonacular.com/recipes/buffalo-chicken-wrap-with-cheddar-ranch-roasted-peppers-1409185">Buffalo "Chicken" Wrap With Cheddar-Ranch & Roasted Peppers</a>, <a href="https://spoonacular.com/recipes/slow-cooker-cheddar-buffalo-chicken-sandwiches-with-ranch-dressing-491831">Slow Cooker Cheddar Buffalo Chicken Sandwiches with Ranch Dressing</a>, and <a href="https://spoonacular.com/recipes/crunchy-stuffed-buffalo-chicken-breasts-with-ranch-roasted-potatoes-iowa-girl-eats-1286987">Crunchy Stuffed Buffalo Chicken Breasts with Ranch Roasted Potatoes - Iowa Girl Eats</a>.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '665a72f4a7da0532eecfc0f1',
            id: 715438,
            title: 'Mexican Casserole',
            image: 'https://img.spoonacular.com/recipes/715438-556x370.jpg',
            category: 'fall,winter Mexican',
            description:
                'The recipe Mexican Casserole could satisfy your Mexican craving in about <b>1 hour and 5 minutes</b>. This main course has <b>581 calories</b>, <b>48g of protein</b>, and <b>21g of fat</b> per serving. This recipe serves 6 and costs $2.63 per serving. It is brought to you by Pink When. 503 people were impressed by this recipe. It will be a hit at your <b>Autumn</b> event. A mixture of cheddar cheese, monterrey jack, salsa, and a handful of other ingredients are all it takes to make this recipe so scrumptious. It is a good option if you\'re following a <b>gluten free</b> diet. Overall, this recipe earns a <b>spectacular spoonacular score of 88%</b>. Try <a href="https://spoonacular.com/recipes/mexican-casserole-1620683">Mexican Casserole</a>, <a href="https://spoonacular.com/recipes/mexican-casserole-513196">Mexican Casserole</a>, and <a href="https://spoonacular.com/recipes/mexican-casserole-703344">Mexican Casserole</a> for similar recipes.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '666d2f21b8ed437e5b330ec4',
            id: 1039293,
            title: 'Pulled Pork Nachos',
            image: 'https://img.spoonacular.com/recipes/1039293-556x370.jpg',
            category: ' American',
            description:
                'Pulled Pork Nachos requires roughly <b>8 hours and 10 minutes</b> from start to finish. One serving contains <b>352 calories</b>, <b>19g of protein</b>, and <b>16g of fat</b>. For <b>$1.63 per serving</b>, you get a hor d\'oeuvre that serves 8. This recipe from Pink When requires nacho chips, cream, pork rub, and pork shoulder. Only a few people really liked this American dish. 6 people were glad they tried this recipe. It is a good option if you\'re following a <b>gluten free</b> diet. All things considered, we decided this recipe <b>deserves a spoonacular score of 63%</b>. This score is solid. Similar recipes include <a href="https://spoonacular.com/recipes/pulled-pork-nachos-1589123">Pulled Pork Nachos</a>, <a href="https://spoonacular.com/recipes/pulled-pork-nachos-498935">Pulled Pork Nachos</a>, and <a href="https://spoonacular.com/recipes/pulled-pork-nachos-687166">Pulled Pork Nachos</a>.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '666ef7cbe5a858bcad4cd082',
            id: 637690,
            title: 'Cheesy Turkey Meatballs',
            image: 'https://img.spoonacular.com/recipes/637690-556x370.jpg',
            category: ' ',
            description:
                'Cheesy Turkey Meatballs might be just the main course you are searching for. This recipe makes 4 servings with <b>465 calories</b>, <b>37g of protein</b>, and <b>12g of fat</b> each. For <b>$2.67 per serving</b>, this recipe <b>covers 26%</b> of your daily requirements of vitamins and minerals. Not a lot of people made this recipe, and 6 would say it hit the spot. Head to the store and pick up cheddar, salt, pepper, and a few other things to make it today. From preparation to the plate, this recipe takes approximately <b>45 minutes</b>. It is brought to you by Foodista. Overall, this recipe earns a <b>good spoonacular score of 67%</b>. <a href="https://spoonacular.com/recipes/cheesy-turkey-meatballs-1213105">Cheesy Turkey Meatballs</a>, <a href="https://spoonacular.com/recipes/cheesy-turkey-meatballs-543207">Cheesy Turkey Meatballs</a>, and <a href="https://spoonacular.com/recipes/cheesy-pizza-turkey-meatballs-539282">Cheesy Pizza Turkey Meatballs</a> are very similar to this recipe.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '666e44dac853ec80ce6a82bf',
            id: 659109,
            title: 'Salmon Quinoa Risotto',
            image: 'https://img.spoonacular.com/recipes/659109-556x370.jpg',
            category: ' Mediterranean,Italian,European',
            description:
                'Salmon Quinoa Risotto might be just the main course you are searching for. One serving contains <b>437 calories</b>, <b>25g of protein</b>, and <b>20g of fat</b>. This recipe serves 4. For <b>$3.83 per serving</b>, this recipe <b>covers 43%</b> of your daily requirements of vitamins and minerals. Head to the store and pick up quinoa, poached salmon, olive oil, and a few other things to make it today. It is a good option if you\'re following a <b>gluten free, dairy free, and pescatarian</b> diet. It is a <b>rather expensive</b> recipe for fans of Mediterranean food. 3 people found this recipe to be yummy and satisfying. From preparation to the plate, this recipe takes roughly <b>45 minutes</b>. It is brought to you by Foodista. Overall, this recipe earns an <b>outstanding spoonacular score of 94%</b>. Similar recipes include <a href="https://spoonacular.com/recipes/salmon-quinoa-risotto-1360771">Salmon Quinoa Risotto</a>, <a href="https://spoonacular.com/recipes/salmon-quinoa-risotto-1288579">Salmon Quinoa Risotto</a>, and <a href="https://spoonacular.com/recipes/quinoa-risotto-with-salmon-and-kale-15276">Quinoa Risotto With Salmon And Kale</a>.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '666d2d5cb8ed437e5b2d434a',
            id: 633668,
            title: 'Baked Lemon~Lime Chicken Wings',
            image: 'https://img.spoonacular.com/recipes/633668-556x370.jpg',
            category: ' American',
            description:
                'Baked Lemon~Lime Chicken Wings might be just the hor d\'oeuvre you are searching for. This recipe serves 4. One serving contains <b>725 calories</b>, <b>34g of protein</b>, and <b>43g of fat</b>. For <b>$2.19 per serving</b>, this recipe <b>covers 17%</b> of your daily requirements of vitamins and minerals. 5 people were impressed by this recipe. Only a few people really liked this American dish. It is a good option if you\'re following a <b>gluten free and dairy free</b> diet. If you have cilantro, honey, ground pepper, and a few other ingredients on hand, you can make it. It is brought to you by Foodista. From preparation to the plate, this recipe takes about <b>45 minutes</b>. All things considered, we decided this recipe <b>deserves a spoonacular score of 39%</b>. This score is rather bad. If you like this recipe, you might also like recipes such as <a href="https://spoonacular.com/recipes/chile-lime-chicken-wings-baked-1124125">Chile Lime Chicken Wings (Baked)</a>, <a href="https://spoonacular.com/recipes/tequila-lime-baked-chicken-wings-718888">Tequila Lime Baked Chicken Wings</a>, and <a href="https://spoonacular.com/recipes/baked-honey-lime-chicken-wings-112348">Baked Honey-Lime Chicken Wings</a>.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '666f019de5a858bcad51872b',
            id: 1165787,
            title: 'Instant Pot Chili Mac',
            image: 'https://img.spoonacular.com/recipes/1165787-556x370.jpg',
            category: 'super bowl American',
            description:
                'Forget going out to eat or ordering takeout every time you crave American food. Try making Instant Pot Chili Mac at home. One portion of this dish contains approximately <b>39g of protein</b>, <b>20g of fat</b>, and a total of <b>565 calories</b>. This recipe serves 6 and costs $2.54 per serving. Only a few people made this recipe, and 2 would say it hit the spot. It works well as a rather inexpensive main course. It is brought to you by Pink When. Head to the store and pick up chicken broth, cayenne pepper, garlic powder, and a few other things to make it today. It can be enjoyed any time, but it is especially good for <b>The Super Bowl</b>. From preparation to the plate, this recipe takes around <b>14 minutes</b>. All things considered, we decided this recipe <b>deserves a spoonacular score of 74%</b>. This score is pretty good. If you like this recipe, you might also like recipes such as <a href="https://spoonacular.com/recipes/instant-pot-chili-mac-1596675">Instant Pot Chili Mac</a>, <a href="https://spoonacular.com/recipes/instant-pot-chili-mac-1128995">Instant Pot Chili Mac</a>, and <a href="https://spoonacular.com/recipes/instant-pot-chili-mac-1405175">Instant Pot Chili Mac</a>.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '666a97936582319a8a272beb',
            id: 732255,
            title: 'Cheesy Cowboy Quesadillas',
            image: 'https://img.spoonacular.com/recipes/732255-556x370.jpg',
            category: ' Mexican',
            description:
                'You can never have too many hor d\'oeuvre recipes, so give Cheesy Cowboy Quesadillas a try. This recipe serves 4. For <b>$1.31 per serving</b>, this recipe <b>covers 21%</b> of your daily requirements of vitamins and minerals. Watching your figure? This gluten free recipe has <b>516 calories</b>, <b>27g of protein</b>, and <b>28g of fat</b> per serving. If you have bell pepper, cheese, black beans, and a few other ingredients on hand, you can make it. A couple people really liked this Mexican dish. 15 people were glad they tried this recipe. It is brought to you by Pink When. From preparation to the plate, this recipe takes around <b>10 minutes</b>. Taking all factors into account, this recipe <b>earns a spoonacular score of 60%</b>, which is pretty good. Similar recipes are <a href="https://spoonacular.com/recipes/cowboy-quesadillas-1219581">Cowboy Quesadillas</a>, <a href="https://spoonacular.com/recipes/cowboy-quesadillas-271129">Cowboy Quesadillas</a>, and <a href="https://spoonacular.com/recipes/cheesy-quesadillas-270504">Cheesy Quesadillas</a>.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '666e42dcc853ec80ce68ad6a',
            id: 640803,
            title: 'Crispy Buttermilk Fried Chicken',
            image: 'https://img.spoonacular.com/recipes/640803-556x370.jpg',
            category: ' Southern',
            description:
                'You can never have too many Southern recipes, so give Crispy Buttermilk Fried Chicken a try. This recipe serves 6 and costs 67 cents per serving. One portion of this dish contains roughly <b>16g of protein</b>, <b>26g of fat</b>, and a total of <b>363 calories</b>. This recipe is liked by 53 foodies and cooks. A mixture of buttermilk, flour, salt, and a handful of other ingredients are all it takes to make this recipe so tasty. It works best as a main course, and is done in about <b>45 minutes</b>. It is brought to you by Foodista. With a spoonacular <b>score of 41%</b>, this dish is solid. If you like this recipe, take a look at these similar recipes: <a href="https://spoonacular.com/recipes/crispy-buttermilk-fried-chicken-912357">Crispy Buttermilk Fried Chicken</a>, <a href="https://spoonacular.com/recipes/crispy-buttermilk-fried-chicken-32074">Crispy Buttermilk Fried Chicken</a>, and <a href="https://spoonacular.com/recipes/crispy-buttermilk-herb-fried-chicken-1632345">Crispy Buttermilk-herb fried chicken</a>.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '666d2beeb197b634bdb4d982',
            id: 640141,
            title: 'Corned Beef Ribs With Brown Sugar and Mustard Glaze',
            image: 'https://img.spoonacular.com/recipes/640141-556x370.jpg',
            category: ' ',
            description:
                'Corned Beef Ribs With Brown Sugar and Mustard Glaze might be just the main course you are searching for. This recipe makes 4 servings with <b>927 calories</b>, <b>50g of protein</b>, and <b>43g of fat</b> each. For <b>$5.95 per serving</b>, this recipe <b>covers 54%</b> of your daily requirements of vitamins and minerals. This recipe from Foodista requires beer, brown sugar, dijon mustard, and carrots. Only a few people made this recipe, and 6 would say it hit the spot. It is a good option if you\'re following a <b>dairy free</b> diet. From preparation to the plate, this recipe takes roughly <b>45 minutes</b>. Taking all factors into account, this recipe <b>earns a spoonacular score of 94%</b>, which is awesome. If you like this recipe, take a look at these similar recipes: <a href="https://spoonacular.com/recipes/corned-beef-ribs-with-brown-sugar-and-mustard-glaze-1635841">Corned Beef Ribs With Brown Sugar and Mustard Glaze</a>, <a href="https://spoonacular.com/recipes/corned-beef-with-marmalade-mustard-glaze-17073">Corned Beef With Marmalade-Mustard Glaze</a>, and <a href="https://spoonacular.com/recipes/corned-beef-with-blackberry-mustard-glaze-527528">Corned Beef with Blackberry Mustard Glaze</a>.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '666e44dac853ec80ce6a869b',
            id: 636415,
            title: 'Buffalo Chicken Pizza',
            image: 'https://img.spoonacular.com/recipes/636415-556x370.jpg',
            category: ' Mediterranean,Italian,European',
            description:
                'You can never have too many Mediterranean recipes, so give Buffalo Chicken Pizzan a try. This recipe serves 6. For <b>$3.92 per serving</b>, this recipe <b>covers 11%</b> of your daily requirements of vitamins and minerals. One serving contains <b>2351 calories</b>, <b>15g of protein</b>, and <b>250g of fat</b>. 2 people were impressed by this recipe. From preparation to the plate, this recipe takes roughly <b>45 minutes</b>. Only a few people really liked this main course. Head to the store and pick up bell pepper, butter, chicken breast in water, and a few other things to make it today. It is brought to you by Foodista. All things considered, we decided this recipe <b>deserves a spoonacular score of 36%</b>. This score is rather bad. Similar recipes are <a href="https://spoonacular.com/recipes/buffalo-chicken-pizza-1260901">Buffalo Chicken PIzza</a>, <a href="https://spoonacular.com/recipes/buffalo-chicken-pizza-1570345">Buffalo Chicken Pizza</a>, and <a href="https://spoonacular.com/recipes/buffalo-chicken-pizza-1290783">Buffalo Chicken Pizza</a>.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '666e42dcc853ec80ce68ab60',
            id: 633595,
            title: 'Baked Eggs With Asparagus and Sun Dried Tomatoes',
            image: 'https://img.spoonacular.com/recipes/633595-556x370.jpg',
            category: ' ',
            description:
                'Need a <b>gluten free and primal main course</b>? Baked Eggs With Asparagus and Sun Dried Tomatoes could be a super recipe to try. This recipe serves 2 and costs $2.23 per serving. One portion of this dish contains approximately <b>21g of protein</b>, <b>7g of fat</b>, and a total of <b>178 calories</b>. If you have spinach, quark, sun tomato, and a few other ingredients on hand, you can make it. It is brought to you by Foodista. Not a lot of people made this recipe, and 3 would say it hit the spot. From preparation to the plate, this recipe takes around <b>45 minutes</b>. All things considered, we decided this recipe <b>deserves a spoonacular score of 38%</b>. This score is not so outstanding. Similar recipes are <a href="https://spoonacular.com/recipes/creamy-baked-eggs-with-asparagus-and-sun-dried-tomatoes-530611">Creamy Baked Eggs with Asparagus and Sun Dried Tomatoes</a>, <a href="https://spoonacular.com/recipes/baked-eggs-with-garlic-kale-and-sun-dried-tomatoes-537955">Baked Eggs with Garlic Kale and Sun-dried Tomatoes</a>, and <a href="https://spoonacular.com/recipes/baked-eggs-with-garlic-kale-and-sun-dried-tomatoes-1241145">Baked Eggs with Garlic Kale and Sun-dried Tomatoes</a>.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '666d2f0bb8ed437e5b2ecff8',
            id: 658506,
            title: 'Roasted Beet, Fig and Orange Salad',
            image: 'https://img.spoonacular.com/recipes/658506-556x370.jpg',
            category: ' ',
            description:
                'Roasted Beet, Fig and Orange Salad requires approximately <b>45 minutes</b> from start to finish. This gluten free, lacto ovo vegetarian, and primal recipe serves 1 and costs <b>$10.62 per serving</b>. This main course has <b>885 calories</b>, <b>26g of protein</b>, and <b>33g of fat</b> per serving. 2 people were impressed by this recipe. Head to the store and pick up baby spinach, beets, extra virgin olive oil, and a few other things to make it today. It is brought to you by Foodista. Taking all factors into account, this recipe <b>earns a spoonacular score of 86%</b>, which is outstanding. Similar recipes are <a href="https://spoonacular.com/recipes/roasted-beet-fig-and-orange-salad-1409193">Roasted Beet, Fig and Orange Salad</a>, <a href="https://spoonacular.com/recipes/roasted-beet-and-berry-salad-with-raspberry-fig-vinaigrette-763914">Roasted Beet and Berry Salad with Raspberry-Fig Vinaigrette</a>, and <a href="https://spoonacular.com/recipes/roasted-beet-and-orange-salad-846118">Roasted Beet and Orange Salad</a>.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '666e47a2c853ec80ce6c3e24',
            id: 660884,
            title: 'Spare Ribs',
            image: 'https://img.spoonacular.com/recipes/660884-556x370.jpg',
            category: ' ',
            description:
                'You can never have too many main course recipes, so give Spare Ribs a try. For <b>$2.03 per serving</b>, this recipe <b>covers 23%</b> of your daily requirements of vitamins and minerals. One serving contains <b>773 calories</b>, <b>35g of protein</b>, and <b>59g of fat</b>. This recipe serves 3. From preparation to the plate, this recipe takes around <b>45 minutes</b>. It is a good option if you\'re following a <b>gluten free and dairy free</b> diet. This recipe from Foodista has 3 fans. Head to the store and pick up oil, clear honey, five-spice powder, and a few other things to make it today. With a spoonacular <b>score of 53%</b>, this dish is pretty good. Similar recipes are <a href="https://spoonacular.com/recipes/sweet-temptation-ribs-tamarind-glazed-spare-ribs-391730">Sweet Temptation Ribs: Tamarind-Glazed Spare Ribs</a>, <a href="https://spoonacular.com/recipes/spare-ribs-1386553">Spare Ribs</a>, and <a href="https://spoonacular.com/recipes/spare-ribs-83079">Spare Ribs</a>.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '666efc8fe5a858bcad4fa8c9',
            id: 716342,
            title: 'Chicken Suya',
            image: 'https://img.spoonacular.com/recipes/716342-556x370.jpg',
            category: ' ',
            description:
                'The recipe Chicken Suya can be made <b>in roughly 45 minutes</b>. This recipe serves 1 and costs $1.67 per serving. One serving contains <b>564 calories</b>, <b>44g of protein</b>, and <b>35g of fat</b>. This recipe from Afrolems requires suya spice, chicken, chilli powder, and seasoning cubes. It works well as a main course. 56 people have made this recipe and would make it again. It is a good option if you\'re following a <b>gluten free, dairy free, whole 30, and ketogenic</b> diet. Overall, this recipe earns a <b>solid spoonacular score of 79%</b>. If you like this recipe, you might also like recipes such as <a href="https://spoonacular.com/recipes/suya-nigerian-chicken-skewers-113497">Suya (Nigerian Chicken Skewers)</a>, <a href="https://spoonacular.com/recipes/suya-swordfish-6571">Suya Swordfish</a>, and <a href="https://spoonacular.com/recipes/i-aint-chicken-chicken-crispy-roasted-chicken-breasts-with-orange-and-cardamom-1224321">I Ain\'t Chicken Chicken: Crispy Roasted Chicken Breasts with Orange and Cardamom</a>.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '666e9822685fc01089043cbf',
            id: 654959,
            title: 'Pasta With Tuna',
            image: 'https://img.spoonacular.com/recipes/654959-556x370.jpg',
            category: ' ',
            description:
                'Pasta With Tunan is a <b>pescatarian</b> main course. This recipe serves 4. For <b>$1.68 per serving</b>, this recipe <b>covers 28%</b> of your daily requirements of vitamins and minerals. One serving contains <b>423 calories</b>, <b>24g of protein</b>, and <b>10g of fat</b>. 2 people have made this recipe and would make it again. This recipe from Foodista requires flour, parsley, non-fat milk, and parmesan cheese. From preparation to the plate, this recipe takes around <b>45 minutes</b>. All things considered, we decided this recipe <b>deserves a spoonacular score of 92%</b>. This score is amazing. <a href="https://spoonacular.com/recipes/pasta-and-tuna-salad-ensalada-de-pasta-y-atn-226303">Pastan and Tuna Salad (Ensalada de Pasta y Atún)</a>, <a href="https://spoonacular.com/recipes/tuna-pasta-565100">Tuna Pasta</a>, and <a href="https://spoonacular.com/recipes/tuna-pasta-89136">Tuna Pasta</a> are very similar to this recipe.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '666d2f71b8ed437e5b3532d5',
            id: 648524,
            title: "Jean's Seafood Gumbo",
            category: ' Creole,Cajun',
            description:
                'Forget going out to eat or ordering takeout every time you crave Cajun food. Try making Jean\'s Seafood Gumbo at home. One serving contains <b>524 calories</b>, <b>68g of protein</b>, and <b>19g of fat</b>. This recipe serves 9 and costs $5.32 per serving. 6 people were impressed by this recipe. This recipe from Foodista requires thyme, salt, tomato paste, and peppers. It works well as a pricey main course. From preparation to the plate, this recipe takes around <b>45 minutes</b>. It is a good option if you\'re following a <b>dairy free</b> diet. With a spoonacular <b>score of 87%</b>, this dish is tremendous. Users who liked this recipe also liked <a href="https://spoonacular.com/recipes/jeans-seafood-gumbo-1394357">Jean\'s Seafood Gumbo</a>, <a href="https://spoonacular.com/recipes/seafood-gumbo-12109">Seafood Gumbo</a>, and <a href="https://spoonacular.com/recipes/seafood-gumbo-332787">Seafood Gumbo</a>.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
    ],
    dessertMeals: [
        {
            _id: '666d2bf0b197b634bdb61884',
            id: 637624,
            title: 'Cheesecake Ice-Cream With Mango Syrup',
            image: 'https://img.spoonacular.com/recipes/637624-556x370.jpg',
            category: ' ',
            description:
                'If you have about <b>45 minutes</b> to spend in the kitchen, Cheesecake Ice-Cream With Mango Syrup might be a spectacular <b>gluten free and lacto ovo vegetarian</b> recipe to try. For <b>$1.27 per serving</b>, you get a dessert that serves 10. One serving contains <b>304 calories</b>, <b>8g of protein</b>, and <b>11g of fat</b>. 18 people were impressed by this recipe. Head to the store and pick up condensed milk, milk, water, and a few other things to make it today. It is brought to you by Foodista. Taking all factors into account, this recipe <b>earns a spoonacular score of 42%</b>, which is good. Try <a href="https://spoonacular.com/recipes/mango-chili-ice-cream-best-lick-2008-ice-cream-contest-entr-58729">Mango Chili Ice Cream Best Lick! 2008 Ice Cream Contest Entr</a>, <a href="https://spoonacular.com/recipes/patriotic-ice-cream-sandwiches-with-red-velvet-shortbread-stars-cheesecake-ice-cream-497575">Patriotic Ice Cream Sandwiches, with Red Velvet Shortbread Stars & Cheesecake Ice Cream</a>, and <a href="https://spoonacular.com/recipes/cherry-cheesecake-ice-cream-best-lick-2008-ice-cream-contes-70731">Cherry Cheesecake Ice Cream Best Lick! 2008 Ice Cream Contes</a> for similar recipes.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '665d575a577ac4d3c371a994',
            id: 632660,
            title: 'Apricot Glazed Apple Tart',
            image: 'https://img.spoonacular.com/recipes/632660-556x370.jpg',
            category: ' ',
            description:
                'Apricot Glazed Apple Tart is a <b>lacto ovo vegetarian</b> dessert. One portion of this dish contains about <b>6g of protein</b>, <b>35g of fat</b>, and a total of <b>658 calories</b>. For <b>$1.59 per serving</b>, this recipe <b>covers 12%</b> of your daily requirements of vitamins and minerals. This recipe serves 4. From preparation to the plate, this recipe takes around <b>45 minutes</b>. 3 people found this recipe to be flavorful and satisfying. If you have apples, cinnamon, sugar, and a few other ingredients on hand, you can make it. It is brought to you by Foodista. Overall, this recipe earns a <b>not so awesome spoonacular score of 33%</b>. <a href="https://spoonacular.com/recipes/tarte-aux-abricots-glazed-french-apricot-tart-with-almonds-124725">Tarte Aux Abricots - Glazed French Apricot Tart With Almonds</a>, <a href="https://spoonacular.com/recipes/apricot-apple-glazed-gammon-513531">Apricot & Apple Glazed Gammon</a>, and <a href="https://spoonacular.com/recipes/apricot-apple-glazed-gammon-1250583">Apricot & Apple Glazed Gammon</a> are very similar to this recipe.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '666e44dbc853ec80ce6add82',
            id: 993462,
            title: 'Captain America Shield Cookies',
            image: 'https://img.spoonacular.com/recipes/993462-556x370.jpg',
            category: ' ',
            description:
                'Captain America Shield Cookies is a <b>dairy free</b> dessert. This recipe serves 12. For <b>$1.09 per serving</b>, this recipe <b>covers 4%</b> of your daily requirements of vitamins and minerals. One portion of this dish contains roughly <b>3g of protein</b>, <b>14g of fat</b>, and a total of <b>318 calories</b>. 6 people were impressed by this recipe. This recipe from Pink When requires pre-made sugar cookies, coconut oil, cake fondant, and cake fondant. From preparation to the plate, this recipe takes approximately <b>45 minutes</b>. With a spoonacular <b>score of 19%</b>, this dish is rather bad. <a href="https://spoonacular.com/recipes/captain-america-m-m-sugar-cookies-612431">Captain America M&M Sugar Cookies</a>, <a href="https://spoonacular.com/recipes/americas-test-kitchen-chocolate-chip-cookies-626421">America\'s Test Kitchen Chocolate Chip Cookies</a>, and <a href="https://spoonacular.com/recipes/captain-and-coke-1753433">Captain and Coke</a> are very similar to this recipe.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '666e42ddc853ec80ce68f27e',
            id: 636768,
            title: 'Cake with wine and olive oil',
            image: 'https://img.spoonacular.com/recipes/636768-556x370.jpg',
            category: ' ',
            description:
                'You can never have too many dessert recipes, so give Cake with wine and olive oil a try. This recipe serves 10. For <b>58 cents per serving</b>, this recipe <b>covers 4%</b> of your daily requirements of vitamins and minerals. One portion of this dish contains around <b>4g of protein</b>, <b>11g of fat</b>, and a total of <b>286 calories</b>. This recipe is liked by 14 foodies and cooks. This recipe from Foodista requires cake flour, sachet yeast, yolk, and sugar. It is a good option if you\'re following a <b>dairy free</b> diet. From preparation to the plate, this recipe takes roughly <b>45 minutes</b>. Taking all factors into account, this recipe <b>earns a spoonacular score of 21%</b>, which is not so outstanding. Try <a href="https://spoonacular.com/recipes/olive-oil-cornmeal-cake-with-blueberry-and-red-wine-sauce-1566849">Olive Oil- Cornmeal Cake With Blueberry And Red Wine Sauce</a>, <a href="https://spoonacular.com/recipes/olive-oil-cornmeal-cake-with-blueberry-and-red-wine-sauce-68315">Olive Oil- Cornmeal Cake With Blueberry And Red Wine Sauce</a>, and <a href="https://spoonacular.com/recipes/date-and-olive-oil-wine-crackers-129807">Date and Olive Oil Wine Crackers</a> for similar recipes.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '666e48fac853ec80ce6c9995',
            id: 716347,
            title: '90 Second Cookie in a Bowl',
            image: 'https://img.spoonacular.com/recipes/716347-556x370.jpg',
            category: ' ',
            description:
                'You can never have too many dessert recipes, so give 90 Second Cookie in a Bowl a try. This recipe serves 1 and costs 85 cents per serving. One serving contains <b>469 calories</b>, <b>6g of protein</b>, and <b>22g of fat</b>. 5 people found this recipe to be flavorful and satisfying. It is brought to you by Afrolems. Head to the store and pick up egg yolk, sugar, coconut, and a few other things to make it today. From preparation to the plate, this recipe takes around <b>45 minutes</b>. Overall, this recipe earns a <b>not so spectacular spoonacular score of 25%</b>. If you like this recipe, you might also like recipes such as <a href="https://spoonacular.com/recipes/christmas-cookie-bowl-382756">Christmas Cookie Bowl</a>, <a href="https://spoonacular.com/recipes/easy-one-bowl-choc-chip-cookie-cups-1426821">Easy one-bowl choc chip cookie cups</a>, and <a href="https://spoonacular.com/recipes/pink-cookie-dragon-fruit-smoothie-bowl-972774">Pink Cookie Dragon Fruit Smoothie Bowl</a>.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '666e47a2c853ec80ce6c7af5',
            id: 649056,
            title: 'Korean Honey Citron Tea Cheesecake',
            image: 'https://img.spoonacular.com/recipes/649056-556x370.jpg',
            category: ' Korean,Asian',
            description:
                'Korean Honey Citron Tea Cheesecake requires roughly <b>45 minutes</b> from start to finish. One portion of this dish contains approximately <b>6g of protein</b>, <b>27g of fat</b>, and a total of <b>454 calories</b>. For <b>$1.22 per serving</b>, this recipe <b>covers 7%</b> of your daily requirements of vitamins and minerals. This recipe serves 8. This recipe from Foodista requires water, cream cheese, lemon juice, and sugar. It works well as an affordable dessert. 58 people were impressed by this recipe. This recipe is typical of Korean cuisine. With a spoonacular <b>score of 26%</b>, this dish is not so tremendous. If you like this recipe, you might also like recipes such as <a href="https://spoonacular.com/recipes/a-visit-to-the-charleston-tea-plantation-iced-tea-with-honey-lemon-ginger-ice-cubes-495571">A Visit to the Charleston Tea Plantation + Iced Tea with Honey Lemon Ginger Ice Cubes</a>, <a href="https://spoonacular.com/recipes/korean-chilli-sesame-honey-chicken-1089523">Korean chilli, sesame & honey chicken</a>, and <a href="https://spoonacular.com/recipes/tartelettes-au-citron-53422">Tartelettes Au Citron</a>.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '666e42ddc853ec80ce68f400',
            id: 635231,
            title: 'Blackberry Pie Bars',
            image: 'https://img.spoonacular.com/recipes/635231-556x370.jpg',
            category: ' ',
            description:
                'Blackberry Pie Bars is a dessert that serves 6. One serving contains <b>632 calories</b>, <b>11g of protein</b>, and <b>16g of fat</b>. For <b>$1.65 per serving</b>, this recipe <b>covers 17%</b> of your daily requirements of vitamins and minerals. 5 people found this recipe to be tasty and satisfying. It is a good option if you\'re following a <b>lacto ovo vegetarian</b> diet. It is brought to you by Foodista. If you have salt, lemon zest, walnuts, and a few other ingredients on hand, you can make it. From preparation to the plate, this recipe takes roughly <b>45 minutes</b>. Overall, this recipe earns a <b>pretty good spoonacular score of 47%</b>. <a href="https://spoonacular.com/recipes/blackberry-pie-bars-571308">Blackberry Pie Bars</a>, <a href="https://spoonacular.com/recipes/blackberry-pie-bars-799139">Blackberry Pie Bars</a>, and <a href="https://spoonacular.com/recipes/blackberry-pie-bars-507798">Blackberry Pie Bars</a> are very similar to this recipe.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '666f0311e5a858bcad524f4a',
            id: 636333,
            title: 'Brownie Pudding',
            image: 'https://img.spoonacular.com/recipes/636333-556x370.jpg',
            category: ' American',
            description:
                'The recipe Brownie Pudding can be made <b>in around 45 minutes</b>. For <b>$6.38 per serving</b>, you get a dessert that serves 1. One portion of this dish contains roughly <b>54g of protein</b>, <b>128g of fat</b>, and a total of <b>3254 calories</b>. If you have oil, water, vanilla, and a few other ingredients on hand, you can make it. 2 people were glad they tried this recipe. It is brought to you by Foodista. This recipe is typical of American cuisine. It is a good option if you\'re following a <b>lacto ovo vegetarian</b> diet. Taking all factors into account, this recipe <b>earns a spoonacular score of 83%</b>, which is awesome. Similar recipes include <a href="https://spoonacular.com/recipes/brownie-pudding-507782">Brownie Pudding</a>, <a href="https://spoonacular.com/recipes/brownie-pudding-437251">Brownie Pudding</a>, and <a href="https://spoonacular.com/recipes/brownie-pudding-298274">Brownie Pudding</a>.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '666e44b9c853ec80ce69cdba',
            id: 642648,
            title: 'Favorite Moist Chocolate Cake',
            image: 'https://img.spoonacular.com/recipes/642648-556x370.jpg',
            category: ' ',
            description:
                'Favorite Moist Chocolate Cake might be just the dessert you are searching for. This recipe serves 12 and costs $1.02 per serving. One portion of this dish contains roughly <b>7g of protein</b>, <b>25g of fat</b>, and a total of <b>403 calories</b>. This recipe is liked by 147 foodies and cooks. From preparation to the plate, this recipe takes roughly <b>45 minutes</b>. Head to the store and pick up oil, heavy cream, bittersweet chocolate, and a few other things to make it today. It is brought to you by Foodista. With a spoonacular <b>score of 44%</b>, this dish is good. If you like this recipe, take a look at these similar recipes: <a href="https://spoonacular.com/recipes/favorite-moist-chocolate-cake-1520147">Favorite Moist Chocolate Cake</a>, <a href="https://spoonacular.com/recipes/favorite-moist-chocolate-cake-1355675">Favorite Moist Chocolate Cake</a>, and <a href="https://spoonacular.com/recipes/moist-chocolate-cake-373086">Moist Chocolate Cake</a>.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '666ef7d0e5a858bcad4d6bbc',
            id: 636766,
            title: 'Cake with lemon, rosewater and pistachios',
            image: 'https://img.spoonacular.com/recipes/636766-556x370.jpg',
            category: ' ',
            description:
                'Cake with lemon, rosewater and pistachios might be just the dessert you are searching for. This lacto ovo vegetarian recipe serves 12 and costs <b>68 cents per serving</b>. One portion of this dish contains about <b>6g of protein</b>, <b>18g of fat</b>, and a total of <b>325 calories</b>. 30 people found this recipe to be flavorful and satisfying. A mixture of natural yoghurt, baking powder, salt, and a handful of other ingredients are all it takes to make this recipe so yummy. From preparation to the plate, this recipe takes around <b>45 minutes</b>. It is brought to you by Foodista. Overall, this recipe earns a <b>pretty good spoonacular score of 41%</b>. If you like this recipe, take a look at these similar recipes: <a href="https://spoonacular.com/recipes/lemon-ginger-cake-with-pistachios-188808">Lemon-Ginger Cake with Pistachios</a>, <a href="https://spoonacular.com/recipes/yellow-lemon-cake-with-candied-lemons-and-pistachios-60493">Yellow Lemon Cake With Candied Lemons And Pistachios</a>, and <a href="https://spoonacular.com/recipes/rosewater-raspberry-sponge-cake-1084668">Rosewater & raspberry sponge cake</a>.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '666d2f25b8ed437e5b350473',
            id: 640625,
            title: 'Creamy Chocolate Pudding With Coconut Whipped Cream',
            image: 'https://img.spoonacular.com/recipes/640625-556x370.jpg',
            category: ' ',
            description:
                'If you want to add more <b>gluten free, dairy free, and fodmap friendly</b> recipes to your collection, Creamy Chocolate Pudding With Coconut Whipped Cream might be a recipe you should try. One serving contains <b>844 calories</b>, <b>25g of protein</b>, and <b>69g of fat</b>. This recipe serves 2. For <b>$3.14 per serving</b>, this recipe <b>covers 18%</b> of your daily requirements of vitamins and minerals. 5 people have made this recipe and would make it again. A mixture of coconut milk, chocolate chips, chocolate shavings, and a handful of other ingredients are all it takes to make this recipe so scrumptious. Only a few people really liked this dessert. From preparation to the plate, this recipe takes about <b>45 minutes</b>. It is brought to you by Foodista. Overall, this recipe earns a <b>good spoonacular score of 65%</b>. Try <a href="https://spoonacular.com/recipes/chocolate-pudding-with-espresso-whipped-cream-54998">Chocolate Pudding with Espresso Whipped Cream</a>, <a href="https://spoonacular.com/recipes/chocolate-pudding-with-espresso-whipped-cream-629056">Chocolate Pudding with Espresso Whipped Cream</a>, and <a href="https://spoonacular.com/recipes/chocolate-stout-pudding-with-beer-whipped-cream-483811">Chocolate Stout Pudding with Beer Whipped Cream</a> for similar recipes.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '666d2f09b8ed437e5b2df28d',
            id: 645479,
            title: 'Green Monster Ice Pops',
            image: 'https://img.spoonacular.com/recipes/645479-556x370.jpg',
            category: 'halloween ',
            description:
                'Need a <b>gluten free and dairy free dessert</b>? Green Monster Ice Pops could be an amazing recipe to try. This recipe serves 6. One portion of this dish contains approximately <b>2g of protein</b>, <b>6g of fat</b>, and a total of <b>109 calories</b>. For <b>76 cents per serving</b>, this recipe <b>covers 9%</b> of your daily requirements of vitamins and minerals. It will be a hit at your <b>Halloween</b> event. Head to the store and pick up honey, banana, baby spinach, and a few other things to make it today. This recipe is liked by 19 foodies and cooks. It is brought to you by Foodista. From preparation to the plate, this recipe takes approximately <b>3 hours</b>. With a spoonacular <b>score of 85%</b>, this dish is great. If you like this recipe, take a look at these similar recipes: <a href="https://spoonacular.com/recipes/go-green-ice-pops-83217">Go Green Ice Pops</a>, <a href="https://spoonacular.com/recipes/green-ice-pops-1235291">Green Ice Pops</a>, and <a href="https://spoonacular.com/recipes/green-ice-pops-544620">Green Ice Pops</a>.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '666e8f18c853ec80ce702ce7',
            id: 657482,
            title: 'Quad-Chocolate Cookies',
            image: 'https://img.spoonacular.com/recipes/657482-556x370.jpg',
            category: ' ',
            description:
                'Quad-Chocolate Cookies takes approximately <b>45 minutes</b> from beginning to end. This recipe serves 4 and costs $1.96 per serving. This dessert has <b>1044 calories</b>, <b>15g of protein</b>, and <b>49g of fat</b> per serving. Head to the store and pick up vanilla, salt, butter, and a few other things to make it today. 2 people were impressed by this recipe. It is brought to you by Foodista. Taking all factors into account, this recipe <b>earns a spoonacular score of 47%</b>, which is good. Users who liked this recipe also liked <a href="https://spoonacular.com/recipes/chocolate-quad-256798">Chocolate Quad</a>, <a href="https://spoonacular.com/recipes/triple-stuffed-m-m-chocolate-chip-cookies-toffee-cookies-peanut-butter-cup-cookies-593065">Triple Stuffed M&M Chocolate Chip Cookies, Toffee Cookies & Peanut Butter Cup Cookies</a>, and <a href="https://spoonacular.com/recipes/triple-stuffed-m-m-chocolate-chip-cookies-toffee-cookies-peanut-butter-cup-cookies-1189337">Triple Stuffed M&M Chocolate Chip Cookies, Toffee Cookies & Peanut Butter Cup Cookies</a>.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '665a72f2a7da0532eecf1c96',
            id: 653352,
            title: 'Nutella Brownies',
            image: 'https://img.spoonacular.com/recipes/653352-556x370.jpg',
            category: ' American',
            description:
                'The recipe Nutella Brownies can be made <b>in roughly 45 minutes</b>. This recipe serves 18. One serving contains <b>200 calories</b>, <b>2g of protein</b>, and <b>11g of fat</b>. For <b>30 cents per serving</b>, this recipe <b>covers 3%</b> of your daily requirements of vitamins and minerals. 2 people were impressed by this recipe. It works well as an inexpensive dessert. This recipe is typical of American cuisine. If you have butter, salt, nutella, and a few other ingredients on hand, you can make it. It is a good option if you\'re following a <b>lacto ovo vegetarian</b> diet. It is brought to you by Foodista. All things considered, we decided this recipe <b>deserves a spoonacular score of 13%</b>. This score is rather bad. Users who liked this recipe also liked <a href="https://spoonacular.com/recipes/nutella-brownies-629794">Nutella Brownies</a>, <a href="https://spoonacular.com/recipes/nutella-brownies-679392">Nutella Brownies</a>, and <a href="https://spoonacular.com/recipes/nutella-brownies-1456319">Nutella Brownies</a>.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
        {
            _id: '666e44b9c853ec80ce69ce19',
            id: 664408,
            title: 'Vegan Chocolate Banana Pie',
            image: 'https://img.spoonacular.com/recipes/664408-556x370.jpg',
            category: ' ',
            description:
                'Vegan Chocolate Banana Pie is a dessert that serves 6. One portion of this dish contains around <b>3g of protein</b>, <b>17g of fat</b>, and a total of <b>345 calories</b>. For <b>$1.09 per serving</b>, this recipe <b>covers 7%</b> of your daily requirements of vitamins and minerals. 23 people were impressed by this recipe. If you have pie crust, cornstarch-mixed, chocolate-melted in a bain marie, and a few other ingredients on hand, you can make it. From preparation to the plate, this recipe takes around <b>45 minutes</b>. It is brought to you by Foodista. With a spoonacular <b>score of 37%</b>, this dish is rather bad. Users who liked this recipe also liked <a href="https://spoonacular.com/recipes/vegan-banana-pie-cup-668303">Vegan Banana Pie Cup</a>, <a href="https://spoonacular.com/recipes/vegan-banana-pie-cup-1205165">Vegan Banana Pie Cup</a>, and <a href="https://spoonacular.com/recipes/white-chocolate-banana-cream-pie-pie-party-1205541">White Chocolate Banana Cream Pie { Pie Party}</a>.',
            source: 'spoonacular',
            numberOfLiked: 0,
        },
    ],
    suggestedMeals: [],
};

const allMealsQuery = (params: { [key: string]: string }) => {
    const search = params.search;
    return {
        queryKey: search ? ['meals', search] : ['meals'],
        queryFn: async () => {
            const data = await customFetch('/meal', {
                params: search ? { search } : {},
            });
            return data;
        },
    };
};

export const loader =
    (queryClient: QueryClient) =>
    async ({ request }: { params: Params; request: Request }) => {
        const queries: { [key: string]: string } = Object.fromEntries(new URL(request.url).searchParams.entries());
        console.log(queries);
        queryClient.ensureQueryData(allMealsQuery(queries));
        return queries;
    };

function Meal() {
    const params = useLoaderData();
//     const { data: queryData, status } = useQuery(allMealsQuery(params as { [key: string]: string }));
//     console.log(queryData);
    // const mealData = queryData?.data;
    // console.log(mealData);

    return (
        <Flex flexDir={'column'} width={'100%'} height={'100%'} alignItems={'center'}>
            <Specialty />
            <SearchBar autoCompleteLink="/meal/autocomplete" />
            {status === 'pending' ? (
                <Flex justifyContent={'center'} alignItems={'center'} height={'100%'}>
                    <Lottie animationData={Ingredient} loop={true} style={{ height: 600 }} />,
                </Flex>
            ) : (
                <div>
                    {Object.entries(mealData).map(
                        (entry, index) =>
                            (entry[1] as Meal[]).length > 0 && (
                                <ListOfMeals
                                    key={index + 'listMeal'}
                                    Type={entry[0].toString()}
                                    meals={entry[1] as Meal[]}
                                />
                            ),
                    )}
                </div>
            )}
        </Flex>
    );
}

export default Meal;
