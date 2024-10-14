import { Avatar, Box, Container, Flex, Heading, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import Hero from './Hero';

interface Props {
    children: React.ReactNode;
}

const Testimonial = (props: Props) => {
    const { children } = props;

    return <Box>{children}</Box>;
};

const TestimonialContent = (props: Props) => {
    const { children } = props;

    return (
        <Stack
            bg={useColorModeValue('white', 'gray.800')}
            boxShadow={'lg'}
            p={8}
            rounded={'xl'}
            align={'center'}
            pos={'relative'}
            _after={{
                content: `""`,
                w: 0,
                h: 0,
                borderLeft: 'solid transparent',
                borderLeftWidth: 16,
                borderRight: 'solid transparent',
                borderRightWidth: 16,
                borderTop: 'solid',
                borderTopWidth: 16,
                borderTopColor: useColorModeValue('white', 'gray.800'),
                pos: 'absolute',
                bottom: '-16px',
                left: '50%',
                transform: 'translateX(-50%)',
            }}
        >
            {children}
        </Stack>
    );
};

const TestimonialHeading = (props: Props) => {
    const { children } = props;

    return (
        <Heading as={'h3'} fontSize={'xl'}>
            {children}
        </Heading>
    );
};

const TestimonialText = (props: Props) => {
    const { children } = props;

    return (
        <Text textAlign={'center'} color={useColorModeValue('gray.600', 'gray.400')} fontSize={'sm'}>
            {children}
        </Text>
    );
};

const TestimonialAvatar = ({ src, name, title }: { src: string; name: string; title: string }) => {
    return (
        <Flex align={'center'} mt={8} direction={'column'}>
            <Avatar src={src} mb={2} />
            <Stack spacing={-1} align={'center'}>
                <Text fontWeight={600}>{name}</Text>
                <Text fontSize={'sm'} color={useColorModeValue('gray.600', 'gray.400')}>
                    {title}
                </Text>
            </Stack>
        </Flex>
    );
};

export default function WithSpeechBubbles() {
    return (
        <Box>
            <Container maxW={'7xl'} py={16} as={Stack} spacing={12}>
                <Stack spacing={0} align={'center'}>
                    <Hero title="" boldTitle="Our Client Speak" />
                </Stack>
                <Stack direction={{ base: 'column', md: 'row' }} spacing={{ base: 10, md: 4, lg: 10 }}>
                    <Testimonial>
                        <TestimonialContent>
                            <TestimonialHeading>Intuitive Design</TestimonialHeading>
                            <TestimonialText>
                                “The design of Flavorie really satisfied my OCD, this treatment is better my therapy.”
                            </TestimonialText>
                        </TestimonialContent>
                        <TestimonialAvatar
                            src={'https://wallpapers-clan.com/wp-content/uploads/2022/07/funny-cat-9.jpg'}
                            name={'Jennifer Quach'}
                            title={'CEO @ OCD Corporation'}
                        />
                    </Testimonial>
                    <Testimonial>
                        <TestimonialContent>
                            <TestimonialHeading>Efficient Collaborating</TestimonialHeading>
                            <TestimonialText>"I'm thrilled watching the Flavorie team in total chaos."</TestimonialText>
                        </TestimonialContent>
                        <TestimonialAvatar
                            src={
                                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGVJiKcTzUq_vQE6L5DtlpdWA_dEd6ApyVVA&s'
                            }
                            name={'Khoa Thien Le'}
                            title={'Angel Investor @ RisingStars'}
                        />
                    </Testimonial>
                    <Testimonial>
                        <TestimonialContent>
                            <TestimonialHeading>Mindblowing Service</TestimonialHeading>
                            <TestimonialText>
                                "Flavorie saves my wallet from dying of DoorDash orders and unknown expiring
                                ingredients. "
                            </TestimonialText>
                        </TestimonialContent>
                        <TestimonialAvatar
                            src={
                                'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/c2047868-eb3f-45a9-84ac-a12510bfedd9/dffyhn4-46435934-6190-41c1-af0d-8a3f01d36e1a.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2MyMDQ3ODY4LWViM2YtNDVhOS04NGFjLWExMjUxMGJmZWRkOVwvZGZmeWhuNC00NjQzNTkzNC02MTkwLTQxYzEtYWYwZC04YTNmMDFkMzZlMWEucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.aITSRWznS7RYgbZJ3iAv6WEmR02Ypc_rRgt4gbyKv6U'
                            }
                            name={'Phuong Cao'}
                            title={'CTO @ One Member Corporation'}
                        />
                    </Testimonial>
                </Stack>
            </Container>
        </Box>
    );
}
