import {
  AspectRatio,
  Box,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  Image,
  Text,
  VStack,
} from '@chakra-ui/react';
import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import lottie from 'lottie-web';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Params, useLocation, useParams } from 'react-router-dom';
import errorIllustration from '../../public/images/404-error-removebg-preview.png';
import dumbCatLoaderAnimation from '../assets/animations/dumb-cat-loader.json';
import { ImageSlider, PostFooter, PostHeader } from '../components/community/post/index';
import { PostObjectType, parsePost } from '../components/community/post/types';
import { selectDeleteStatus } from '../slices/posts/DeletePost';
import { selectLikeStatus } from '../slices/posts/LikePost';
import { selectUpdateStatus } from '../slices/posts/UpdatePost';
import customFetch from '../utils/customFetch';

const postQuery = (postId: string) => {
  return {
    queryKey: ['community-post', postId],
    queryFn: async () => {
      const request = await customFetch.get(`/community/post/${postId}`);
      console.log(request);
      return request.data;
    },
  };
};

export const loader =
  (queryClient: QueryClient) =>
  async ({ params }: { params: Params }) => {
    queryClient.ensureQueryData(postQuery(params.postId ?? ''));
    return null;
  };

const FullPost = () => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState<PostObjectType | null>(null);

  const animationRef = useRef<HTMLDivElement>(null);

  const { postId } = useParams();
  const { data: queryData, status, fetchStatus } = useQuery<any>(postQuery(postId ?? ''));

  const deleteStatus = useSelector(selectDeleteStatus);
  const updateStatus = useSelector(selectUpdateStatus);
  const likeStatus = useSelector(selectLikeStatus);

  useEffect(() => {
    console.log(queryData);
    if (status === 'success') {
      setPost(parsePost([queryData?.post])[0]);
    }
  }, [queryData, status, fetchStatus]);

  useEffect(() => {
    queryClient.invalidateQueries();
  }, [deleteStatus, updateStatus, likeStatus]);

  useEffect(() => {
    lottie.loadAnimation({
      animationData: dumbCatLoaderAnimation,
      autoplay: true,
      container: animationRef.current!,
      loop: true,
      renderer: 'svg',
    });
  }, [status]);

  return status === 'pending' ? (
    <Box
      marginInline="auto"
      maxWidth={{ base: '80dvw', md: '70dvw', lg: '60dvw' }}
      marginBlock={4}
      ref={animationRef}
      id="animation-container"
    ></Box>
  ) : status === 'error' || !post ? (
    <AspectRatio marginInline="auto" maxWidth={{ base: '100%', md: '90%', lg: '85%' }} ratio={4 / 3}>
      <Image src={errorIllustration} alt="error-image" />
    </AspectRatio>
  ) : (
    <Card
      height="auto"
      position="relative"
      backdropBlur={loading && 'blur(13px)'}
      pointerEvents={loading ? 'none' : 'auto'}
      opacity={loading ? 0.5 : 1}
    >
      <CardHeader paddingBottom={0}>
        <PostHeader isFullPage={true} postId={postId ?? post.id ?? ''} postData={post} setLoading={setLoading} />
      </CardHeader>

      <CardBody>
        <VStack gap={2} alignItems="start" marginBottom={2}>
          <Heading size="lg">{post.header}</Heading>
          <Text>{post.body}</Text>
        </VStack>
        {post.media && post.media.length > 0 && (
          <ImageSlider action="direct" slides={post.media} postId={postId ?? post.id ?? ''} />
        )}
      </CardBody>
      <CardFooter>
        <PostFooter postId={postId ?? post.id ?? ''} postData={post} />
      </CardFooter>
    </Card>
  );
};
export default FullPost;
