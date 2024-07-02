import { Button, Card, CardBody, CardFooter, CardHeader, Heading, Text, VStack, Box } from '@chakra-ui/react';
import { QueryClient, useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Params, useNavigate, useParams } from 'react-router-dom';
import { ImageSlider, PostFooter, PostHeader } from '../components/community/post/index';
import { selectPosts } from '../slices/posts/PostState';
import customFetch from '../utils/customFetch';
import lottie from 'lottie-web';
import errorIllustration from '../../public/images/404-error-removebg-preview.png';

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
  const [loading, setLoading] = useState(false);

  const { postId, index } = useParams();
  const { data: queryData, status } = useQuery(postQuery(postId ?? ''));

  const post = queryData?.post ?? null;

  return status === 'pending' ? (
    <Box>Loading...</Box>
  ) : status === 'error' || !post ? (
    <div>Error</div>
  ) : (
    <Card height="auto" position="relative">
      <CardHeader paddingBottom={0}>
        <PostHeader postId={post.id} postData={post} index={index} />
      </CardHeader>

      <CardBody>
        <VStack gap={2} alignItems="start" marginBottom={2}>
          <Heading size="lg">{post.header}</Heading>
          <Text>{post.body}</Text>
        </VStack>
        {post.media.length > 0 && <ImageSlider action="direct" slides={post.media} postId={postId} />}
      </CardBody>
      <CardFooter>
        <PostFooter postId={post.id} postData={post} index={index} />
      </CardFooter>
    </Card>
  );
};
export default FullPost;
