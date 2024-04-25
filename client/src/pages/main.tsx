import { Heading, Image, Text } from '@chakra-ui/react';
import Lottie from 'lottie-react';
import React from 'react';
import cooking1Animation from '../assets/animations/cooking1.json';
import cooking2Animation from '../assets/animations/cooking2.json';
import { ContainerScroll } from '../components';
import { useAuth } from '../hooks/';

const Main: React.FC = () => {
  const auth = useAuth();
  return (
    <div>
      {auth.currentUser.username && <h1>Welcome {auth.currentUser.username}</h1>}
      <div>haihih</div>
      <Lottie animationData={cooking1Animation} loop={true} style={{ height: 300 }} />
      <Lottie animationData={cooking2Animation} loop={true} style={{ height: 300 }} />
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
          <Image
            src={`https://t4.ftcdn.net/jpg/03/32/75/39/360_F_332753934_tBacXEgxnVplFBRyKbCif49jh0Wz89ns.jpg`}
            alt="hero"
            height={700}
            width={1400}
            className="mx-auto h-full rounded-2xl object-cover object-left-top"
            draggable={false}
          />
        </ContainerScroll>
      </div>
    </div>
  );
};

export default Main;
