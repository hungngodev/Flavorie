import { Heading, Text } from '@chakra-ui/react';
import Lottie from 'lottie-react';
import React from 'react';
import { Cooking, Ingredient, LiveVideo, Scanning, Sharing } from '../assets/animations';

import { ContainerScroll, StickyScrollReveal } from '../components';
import { useAuth } from '../hooks';

const content = [
  {
    title: 'Browsing your recipes',
    description:
      'Browse through your recipes with ease. Our platform allows you to search, filter, and organize your recipes in a way that makes sense to you. Say goodbye to the days of endless scrolling and hello to a more efficient way of finding your favorite recipes.',
    content: (
      <Lottie
        animationData={Cooking}
        style={{ height: 300 }}
        interactivity={{
          mode: 'scroll',
          actions: [
            {
              visibility: [0, 0.2],
              type: 'stop',
              frames: [0],
            },
            {
              visibility: [0.2, 0.8],
              type: 'seek',
              frames: [0, 100],
            },
            {
              visibility: [0.8, 1],
              type: 'stop',
              frames: [100],
            },
          ],
        }}
      />
    ),
  },
  {
    title: 'Choosing your ingredients',
    description:
      'Choose your ingredients wisely. Our platform provides you with a variety of options to choose from, ensuring that you always have the freshest ingredients at your disposal. Say goodbye to the days of running out of ingredients and hello to a more organized way of cooking.',
    content: <Lottie animationData={Ingredient} loop={true} style={{ height: 300 }} />,
  },
  {
    title: 'Upload your receipts or your fridge',
    description:
      'Upload your receipts or your fridge. Our platform allows you to upload your receipts or take a picture of your fridge, so you always know what ingredients you have on hand. Say goodbye to the days of guessing and hello to a more accurate way of planning your meals.',
    content: <Lottie animationData={Scanning} loop={true} style={{ height: 300 }} />,
  },
  {
    title: 'Share with community',
    description:
      'Share with the community. Our platform allows you to share your recipes with the community, so you can inspire others to cook delicious meals. Say goodbye to the days of cooking alone and hello to a more social way of cooking.',
    content: <Lottie animationData={Sharing} loop={true} style={{ height: 300 }} />,
  },
  {
    title: 'Live video cooking',
    description:
      'Live video cooking. Our platform allows you to watch live cooking videos, so you can learn new recipes and techniques. Say goodbye to the days of watching cooking shows and hello to a more interactive way of learning.',
    content: <Lottie animationData={LiveVideo} loop={true} style={{ height: 300 }} />,
  },
];

const Main: React.FC = () => {
  const auth = useAuth();
  return (
    <div>
      {auth.currentUser.username && <h1>Welcome {auth.currentUser.username}</h1>}
      <div className="flex flex-col overflow-hidden">
        <ContainerScroll
          titleComponent={
            <Heading fontWeight={600} fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }} lineHeight={'110%'}>
              Explore
              <br />
              <Text as={'span'} color={'green.400'}>
                Our Features
              </Text>
            </Heading>
          }
        >
          <StickyScrollReveal content={content} />
        </ContainerScroll>
      </div>
    </div>
  );
};

export default Main;
