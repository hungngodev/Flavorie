import { Heading, Text } from '@chakra-ui/react';
import Lottie from 'lottie-react';
import React from 'react';
import cooking1Animation from '../assets/animations/cooking1.json';
import cooking2Animation from '../assets/animations/cooking2.json';
import { ContainerScroll, StickyScrollReveal } from '../components';
import { useAuth } from '../hooks/';

const content = [
  {
    title: 'Collaborative Editing',
    description:
      'Work together in real time with your team, clients, and stakeholders. Collaborate on documents, share ideas, and make decisions quickly. With our platform, you can streamline your workflow and increase productivity.',
    content: <Lottie animationData={cooking1Animation} loop={true} style={{ height: 300 }} />,
  },
  {
    title: 'Real time changes',
    description:
      'See changes as they happen. With our platform, you can track every modification in real time. No more confusion about the latest version of your project. Say goodbye to the chaos of version control and embrace the simplicity of real-time updates.',
    content: <Lottie animationData={cooking2Animation} loop={true} style={{ height: 300 }} />,
  },
  {
    title: 'Version control',
    description:
      "Experience real-time updates and never stress about version control again. Our platform ensures that you're always working on the most recent version of your project, eliminating the need for constant manual updates. Stay in the loop, keep your team aligned, and maintain the flow of your work without any interruptions.",
    content: (
      <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(to_bottom_right,var(--orange-500),var(--yellow-500))] text-white">
        Version control
      </div>
    ),
  },
  {
    title: 'Running out of content',
    description:
      "Experience real-time updates and never stress about version control again. Our platform ensures that you're always working on the most recent version of your project, eliminating the need for constant manual updates. Stay in the loop, keep your team aligned, and maintain the flow of your work without any interruptions.",
    content: (
      <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] text-white">
        Running out of content
      </div>
    ),
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
              Plan your meal <br />
              <Text as={'span'} color={'green.400'}>
                so you don't have to
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
