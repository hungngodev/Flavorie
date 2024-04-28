import { AddIcon, InfoOutlineIcon } from '@chakra-ui/icons';
import { Box, Flex, IconButton, chakra } from '@chakra-ui/react';

type CardProps = {
  imgLink: string;
  title: string;
  category?: string;
  onClick?: () => void;
};
function Card({ imgLink, title, onClick }: CardProps) {
  return (
    <Flex alignItems="center" minWidth={'100%'} gap={2} justifyContent="center">
      <Flex direction="column" w={'full'} justifyContent="end" alignItems="center" mx="auto">
        <Box
          bg="gray.300"
          h={'12vw'}
          w="full"
          rounded="xl"
          shadow="md"
          bgSize="cover"
          bgPos="center"
          style={{
            backgroundImage: `url(${imgLink})`,
          }}
        ></Box>
        <Box
          w={{
            base: 10,
            md: '10vw',
          }}
          bg="white"
          _dark={{
            bg: 'gray.800',
          }}
          shadow="lg"
          rounded="lg"
          overflow="hidden"
        >
          <chakra.h4
            textAlign="center"
            fontWeight="bold"
            fontSize={'xs'}
            textTransform="uppercase"
            color="gray.800"
            _dark={{
              color: 'white',
            }}
            letterSpacing={1}
          >
            {title}
          </chakra.h4>
        </Box>
      </Flex>
      <Flex direction={'column'} gap={4}>
        <IconButton
          colorScheme="teal"
          aria-label="Call Sage"
          fontSize="10px"
          size={'xs'}
          icon={<AddIcon />}
          onClick={onClick}
        />
        <IconButton
          colorScheme="teal"
          aria-label="Call Sage"
          fontSize="15px"
          size={'xs'}
          icon={<InfoOutlineIcon />}
          onClick={onClick}
        />
      </Flex>
    </Flex>
  );
}

export default Card;
