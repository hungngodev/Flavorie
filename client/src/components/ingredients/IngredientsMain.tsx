import { Heading, Text, VStack } from '@chakra-ui/react';
import { Pagination } from '@nextui-org/pagination';
import { useState } from 'react';
import { Category, Ingredient } from '../../layouts/IngredientLayout';
import theme from '../../style/theme';
import IngredientLine from './IngredientLine';
// import { Previous, Paginator, PageGroup, Page, Next, generatePages } from 'chakra-paginator';

type IngredientsMainProps = {
    data: Category;
    addFunction: (ingredientData: Ingredient) => void;
};

export function IngredientsMain({ addFunction, data }: IngredientsMainProps) {
    const [page, setPage] = useState(1);
    const size = 3;
    const dataToRender = data.results.slice((page - 1) * size, page * size);

    return (
        <VStack
            spacing={0}
            overflowX={'hidden'}
            width={'95%'}
            height={'120%'}
            marginBottom={'5vh'}
            position="relative"
            zIndex={0}
            justifyContent={'space-around'}
        >
            {/* <Hero title="" boldTitle={data.categoryName.toUpperCase()} /> */}
            <Heading mt="4" mb="4" fontSize="60" fontWeight="bold" color={theme.colors.palette_purple}>
                {data.categoryName.toUpperCase()}
            </Heading>
            <VStack width={'100%'} height={'100%'} mb="4">
                {dataToRender.map((subCategory, index) => (
                    <IngredientLine
                        key={index + subCategory.queryKey}
                        index={index}
                        subCategory={subCategory}
                        addFunction={addFunction}
                    />
                ))}
            </VStack>
            <div className="flex h-[100px] flex-wrap items-center gap-10">
                <Pagination
                    showControls
                    onChange={(page) => setPage(page)}
                    total={Math.ceil(data.results.length / size)}
                    color="primary"
                    initialPage={page}
                />
            </div>
            <Text color="gray.500" fontSize={'1.2rem'} mt="6">
                {data.totalNumberOfIngredients} Ingredients
            </Text>
        </VStack>
    );
}

export default IngredientsMain;
