import ListofMeals from '../components/meals/ListofMeals';

interface Meal {
  title: string;
  image: string;
  category: string;
  price: string;
  infoLink: string;
}
interface MealType {
  [key: string]: {
  meals: Meal[];
  typeName: string;
  }
}

function generateMockData(
  numCategories: number,
  numMealPerType: number): MealType {
  const mockData: MealType = {};

  for (let i = 1; i <= numCategories; i++) {
    const categoryKey = `resultType${i}`;
    const categoryName = `Meal type ${i}`;
    mockData[categoryKey] = { 
      meals: [],
      typeName: categoryName,};

      
    for (let k = 1; k <= numMealPerType; k++) {
      const meal: Meal = {
        title: `Meal ${k + (i - 1) * numMealPerType}`,
        image: `https://source.unsplash.com/random/600x400${Math.random()}`,
        category: `Category${i}`,
        price: '$',
        infoLink: 'https://www.google.com',
      };
      mockData[categoryKey].meals.push(meal)
    }
      
  }

  return mockData;
}

const mockData = generateMockData(3, 6);

export default function Meal() {
  return (
    <div>
      {Object.keys(mockData).map((categoryKey, index) => (
        <ListofMeals key={index} Type={mockData[categoryKey].typeName} meals={mockData[categoryKey].meals} />
      ))}
    </div>
  );
}
