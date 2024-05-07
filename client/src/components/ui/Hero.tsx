import { Heading, Text } from '@chakra-ui/react';

type HeroProps = {
  title: string;
  boldTitle: string;
};
export default function Hero({ title, boldTitle }: HeroProps) {
  return (
    <Heading fontWeight={600} fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }} lineHeight={'110%'}>
      {title}
      <Text as={'span'} color={'green.400'}>
        {boldTitle}
      </Text>
    </Heading>
  );
}
