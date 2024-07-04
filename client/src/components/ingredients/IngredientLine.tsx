import { HStack, Heading, IconButton, VStack } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import { Ingredient, SubCategory } from '../../pages/Ingredient';
import theme from '../../style/theme';
import IngredientCard from './Card';

interface IngredientLineProps {
    index: number;
    subCategory: SubCategory;
    addFunction: (ingredient: Ingredient) => void;
}

export default function IngredientLine({ subCategory, index, addFunction }: IngredientLineProps) {
    const scrollRefs = useRef<HTMLDivElement | null>();
    const [currentView, setCurrentView] = useState<number>(0);
    const size = 7;
    // const view = 7;
    function scroll(direction: 'left' | 'right') {
        // const scrollRef = scrollRefs.current;
        // if (scrollRef) {
        //   if (direction === 'left') {
        //     scrollRef.scrollTo({
        //       left: scrollRef.scrollLeft - distance,
        //       behavior: 'smooth',
        //     });
        //   } else {
        //     scrollRef.scrollTo({
        //       left: scrollRef.scrollLeft + distance,
        //       behavior: 'smooth',
        //     });
        //   }
        // }
        if (direction === 'left') {
            if (currentView === 0) return;
            setCurrentView(currentView - 1);
        }
        if (direction === 'right') {
            if (currentView === size) return;
            setCurrentView(currentView + 1);
        }
    }
    const subCategoryToView = subCategory.ingredients.slice(currentView * size, (currentView + 1) * size);
    return (
        <VStack width="100%" alignItems={'start'} mt="2">
            <HStack justifyContent={'space-between'} width="95%">
                <Heading
                    as="h1"
                    size="4xl"
                    noOfLines={1}
                    fontSize={'1.5rem'}
                    fontFamily={theme.fonts}
                    fontWeight="bold"
                    color="gray.700"
                >
                    {subCategory.queryKey.charAt(0).toUpperCase() + subCategory.queryKey.slice(1)}
                </Heading>
                <HStack gap={2}>
                    <IconButton
                        icon={<ChevronLeftIcon />}
                        aria-label="left"
                        onClick={() => scroll('left')}
                        variant="solid"
                        color="white"
                        bg={theme.colors.palette_indigo}
                        size="xs"
                        height="50%"
                    />
                    <IconButton
                        icon={<ChevronRightIcon />}
                        aria-label="left"
                        onClick={() => scroll('right')}
                        variant="solid"
                        color="white"
                        bg={theme.colors.palette_indigo}
                        size="xs"
                        height="50%"
                    />
                </HStack>
            </HStack>
            <HStack width={'95%'} justifyContent={'center'} alignItems={'center'}>
                <HStack
                    spacing={6}
                    overflowY={'hidden'}
                    overflowX={'auto'}
                    width={'100%'}
                    height={'23vh'}
                    alignItems={'start'}
                    ref={(el) => (scrollRefs.current = el as HTMLDivElement)}
                    className="no-scroll-bar"
                >
                    <AnimatePresence>
                        {subCategoryToView.map((ingredient, innerIndex) => (
                            <motion.div
                                key={ingredient.id + innerIndex * index}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 260,
                                    damping: 20,
                                    delay: 0.002 + innerIndex / 30,
                                }}
                            >
                                <IngredientCard
                                    key={ingredient.id + innerIndex * index}
                                    id={ingredient.id}
                                    imgLink={ingredient.image}
                                    title={ingredient.name}
                                    category={ingredient.category}
                                    height="7vw"
                                    width="12vw"
                                    onClick={() => {
                                        addFunction(ingredient);
                                    }}
                                    amount={ingredient.amount}
                                    unitShort={ingredient.unitShort}
                                    nutrition={ingredient.nutrition}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </HStack>
            </HStack>
        </VStack>
    );
}
