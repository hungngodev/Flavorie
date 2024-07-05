import {
    AspectRatio,
    Avatar,
    Box,
    Card,
    CardBody,
    CardHeader,
    HStack,
    Heading,
    IconButton,
    Image,
    Link,
    Text,
    VStack,
    useTheme,
} from '@chakra-ui/react';
import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query';
import { useVirtualizer } from '@tanstack/react-virtual';
import lottie from 'lottie-web';
import { SendHorizontal } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import errorIllustration from '../../public/images/404-error-removebg-preview.png';
import dumbCatLoaderAnimation from '../assets/animations/dumb-cat-loader.json';
import Post from '../components/community/post/Post';
import PostFormCard from '../components/community/post/form/PostFormCard';
import { PostObjectType, PostResponseObjectType, parsePost } from '../components/community/post/types';
import useAuth from '../hooks/useAuth';
import '../index.css';
import { selectPostCreateStatus } from '../slices/posts/CreatePost';
import { selectPostEditStatus } from '../slices/posts/EditPost';
import { getFeed, selectPosts } from '../slices/posts/PostState';
import { selectSaveStatus } from '../slices/posts/SavePost';
import { selectDeleteReviewStatus } from '../slices/reviews';
import { AppDispatch } from '../store/store';
import customFetch from '../utils/customFetch';
import parseDate from '../utils/parseDate';

const userPostQuery = (userId: string) => {
    return {
        queryKey: ['user-posts', userId],
        queryFn: async () => {
            const request = await customFetch.get(`/community/post/user`);
            return request.data;
        },
    };
};

const fetchFeed = async ({
    pageParam = 1,
}: {
    pageParam: number;
}): Promise<{ data: PostResponseObjectType[]; currentPage: number; nextPage: number | null }> => {
    const fetch = await customFetch.get(`/community/feed?page=${pageParam}&limit=5`);
    return {
        data: fetch.data.posts,
        currentPage: pageParam,
        nextPage: pageParam + 1,
    };
};

const Feed = () => {
    const saveStatus: string = useSelector(selectSaveStatus);
    const deleteStatus: string = useSelector(selectDeleteReviewStatus);
    const createStatus: string = useSelector(selectPostCreateStatus);
    const editStatus: string = useSelector(selectPostEditStatus);

    const theme = useTheme();
    const navigate = useNavigate();
    const [userPost, setUserPost] = useState<PostObjectType[]>([]);
    const [savedPost, setSavedPost] = useState<PostObjectType[]>([]);
    const parentRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<HTMLDivElement>(null);

    const dispatch = useDispatch<AppDispatch>();
    const posts = useSelector(selectPosts);

    const auth = useAuth();
    const { id } = auth.currentUser;

    const queryClient = useQueryClient();

    const { data: queryData, status: queryStatus, fetchStatus } = useQuery<any>(userPostQuery(id));

    useEffect(() => {
        if (queryStatus === 'success' && queryData) {
            setUserPost(parsePost(queryData?.userList.map((item: any) => ({ ...item, review: [], media: [] }))));
            setSavedPost(parsePost(queryData?.savedList.map((item: any) => ({ ...item, review: [], media: [] }))));
        }
    }, [queryData, queryStatus, fetchStatus]);

    useEffect(() => {
        if (
            saveStatus === 'succeeded' ||
            deleteStatus === 'succeeded' ||
            createStatus === 'succeeded' ||
            editStatus === 'succeeded'
        ) {
            queryClient.invalidateQueries();
        }
    }, [saveStatus, deleteStatus, createStatus, editStatus]);

    const { data, error, status, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ['newsfeed'],
        queryFn: fetchFeed,
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage.nextPage,
    });

    const scrollVirtualizer = useVirtualizer({
        count: posts.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 200,
        gap: 30,
        getItemKey: (index) => posts[index]?.id,
        measureElement: (element, entry, instance) => {
            console.log(entry);
            const direction = instance.scrollDirection;
            if (instance.isScrolling && direction && direction === 'backward') {
                const indexKey = Number(element.getAttribute('data-index'));
                const cacheMeasurement = instance.measurementsCache[indexKey].size;
                return Math.max(cacheMeasurement, element.getBoundingClientRect().height);
            }

            return element.getBoundingClientRect().height;
        },
    });

    useEffect(() => {
        const [lastItem] = [...scrollVirtualizer.getVirtualItems()].reverse();

        if (!lastItem) {
            return;
        }

        if (lastItem.index >= posts.length - 1 && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [hasNextPage, fetchNextPage, posts, isFetchingNextPage, scrollVirtualizer.getVirtualItems()]);

    useEffect(() => {
        const updateFeed = async () => {
            if (status === 'success' && data) {
                const postload = data?.pages.flatMap((page) => parsePost(page.data));
                await dispatch(getFeed({ posts: postload }));
            }
        };

        updateFeed();
    }, [data, fetchNextPage, status, fetchNextPage, dispatch]);

    useEffect(() => {
        lottie.loadAnimation({
            animationData: dumbCatLoaderAnimation,
            autoplay: true,
            container: animationRef.current!,
            loop: true,
            renderer: 'svg',
        });
    }, [isFetchingNextPage]);

    return (
        <HStack w="100%" h="100%" alignItems="start" backgroundColor="blackAlpha.50" gap={2} px={4}>
            {auth.currentUser.status === 'authenticated' && queryStatus === 'success' && (
                <VStack maxHeight="90dvh" maxWidth="20%" gap={6} marginBlock={4}>
                    <Card width="100%" maxHeight="40dvh" boxShadow="lg">
                        <CardHeader>
                            {' '}
                            <Heading size="md" fontWeight="semibold" color={theme.colors.palette_purple}>
                                Your recent cookings
                            </Heading>
                        </CardHeader>
                        <CardBody maxHeight="40dvh" overflow="auto">
                            {userPost.length > 0 ? (
                                userPost.map((post) => (
                                    <Box
                                        mb={4}
                                        boxShadow="sm"
                                        backgroundColor="blackAlpha.50"
                                        rounded="md"
                                        p={2}
                                        width="100%"
                                    >
                                        <HStack mb={2} width="100%">
                                            <Avatar size="sm" src={post.author.avatar} name={post.author.name} />
                                            <VStack color="blackAlpha.600" gap={0} alignItems="start">
                                                <Text fontSize="sm" fontWeight="semibold" m={0}>
                                                    {post?.author.name}
                                                </Text>
                                                <Text fontSize="sm">{parseDate(post?.createdAt)}</Text>
                                            </VStack>

                                            <IconButton
                                                onClick={() => navigate(`/community/${post.id}`)}
                                                marginLeft="auto"
                                                size="sm"
                                                isRound={true}
                                                aria-label="redirect-post-button"
                                                icon={<SendHorizontal />}
                                                color="blackAlpha.700"
                                                backgroundColor="transparent"
                                                _hover={{ backgroundColor: 'transparent' }}
                                            />
                                        </HStack>
                                        <Link href={`/community/${post.id}`} _hover={{ textDecoration: 'none' }}>
                                            <Heading size="sm" color="blackAlpha.700" mb={2}>
                                                {post.header}
                                            </Heading>
                                            <Text size="md" color="blackAlpha.600" noOfLines={1}>
                                                {post.body}
                                            </Text>
                                        </Link>
                                    </Box>
                                ))
                            ) : (
                                <Text>Oops nothing here, share your cooking now!</Text>
                            )}
                        </CardBody>
                    </Card>
                    <Card width="100%" maxHeight="40dvh" boxShadow="lg">
                        <CardHeader>
                            {' '}
                            <Heading size="md" fontWeight="semibold" color={theme.colors.palette_purple}>
                                Your saved cookings
                            </Heading>
                        </CardHeader>
                        <CardBody maxHeight="40dvh" overflow="auto">
                            {savedPost.length > 0 ? (
                                savedPost.map((post) => (
                                    <Box
                                        mb={4}
                                        boxShadow="sm"
                                        backgroundColor="blackAlpha.50"
                                        rounded="md"
                                        p={2}
                                        width="100%"
                                    >
                                        <HStack mb={2} width="100%">
                                            <Avatar size="sm" src={post.author.avatar} name={post.author.name} />
                                            <VStack color="blackAlpha.600" gap={0} alignItems="start">
                                                <Text fontSize="sm" fontWeight="semibold" m={0}>
                                                    {post?.author.name}
                                                </Text>
                                                <Text fontSize="sm">{parseDate(post?.createdAt)}</Text>
                                            </VStack>

                                            <IconButton
                                                onClick={() => navigate(`/community/${post.id}`)}
                                                marginLeft="auto"
                                                size="sm"
                                                isRound={true}
                                                aria-label="redirect-post-button"
                                                icon={<SendHorizontal />}
                                                color="blackAlpha.700"
                                                backgroundColor="transparent"
                                                _hover={{ backgroundColor: 'transparent' }}
                                            />
                                        </HStack>
                                        <Link href={`/community/${post.id}`} _hover={{ textDecoration: 'none' }}>
                                            <Heading size="sm" color="blackAlpha.700" mb={2}>
                                                {post.header}
                                            </Heading>
                                            <Text size="md" color="blackAlpha.600" noOfLines={1}>
                                                {post.body}
                                            </Text>
                                        </Link>
                                    </Box>
                                ))
                            ) : (
                                <Text>No cookings saved yet, let's make some!</Text>
                            )}
                        </CardBody>
                    </Card>
                </VStack>
            )}

            <Box
                flex={1}
                marginInline="auto"
                ref={parentRef}
                maxWidth={{ base: '80%', md: '70%', lg: '65%' }}
                height="100%"
                overflow="auto"
                // paddingX={{ base: 0, lg: '10%', xl: '20%' }}
                id="parentRef"
                style={{ scrollBehavior: 'smooth', scrollbarWidth: 'none' }}
            >
                <PostFormCard />

                <Box width="100%" position="relative" height={`${scrollVirtualizer.getTotalSize()}px`}>
                    {scrollVirtualizer.getVirtualItems().map((virtualItem) => {
                        // const isLoaderRow = virtualItem.index > posts.length - 1;
                        const post = posts[virtualItem.index];
                        return post ? (
                            <Post
                                ref={scrollVirtualizer.measureElement}
                                data-index={virtualItem.index}
                                position="absolute"
                                top={0}
                                transform={`translateY(${virtualItem.start}px)`}
                                h="auto"
                                key={virtualItem.key}
                                postData={post}
                                marginInline="auto"
                                width="100%"
                                postId={post.id}
                            />
                        ) : null;
                    })}
                </Box>
                {isFetchingNextPage && !isError && hasNextPage && !error && (
                    <Box
                        marginInline="auto"
                        maxWidth={{ base: '50dvw', md: '40dvw', lg: '30dvw' }}
                        marginBlock={4}
                        ref={animationRef}
                        id="animation-container"
                    />
                )}
                {(error || isError || !hasNextPage) && !isFetchingNextPage && (
                    <AspectRatio marginInline="auto" maxWidth={{ base: '100%', md: '90%', lg: '85%' }} ratio={4 / 3}>
                        <Image src={errorIllustration} alt="error-image" />
                    </AspectRatio>
                )}
            </Box>
        </HStack>
    );
};

export default Feed;
