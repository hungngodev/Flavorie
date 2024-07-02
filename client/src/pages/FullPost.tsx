import { Box, Card, CardBody, CardFooter, CardHeader, Heading, Text, VStack } from '@chakra-ui/react';
import { QueryClient, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Params, useLocation, useParams } from 'react-router-dom';
import { ImageSlider, PostFooter, PostHeader } from '../components/community/post/index';
import { PostEditObjectType } from '../components/community/post/types';
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
  const [loading, setLoading] = useState(false);

  const { postId } = useParams();
  const { data: queryData, status } = useQuery(postQuery(postId ?? ''));
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const index = parseInt(searchParams.get('index') ?? '-1');

  const post = queryData?.post ?? null;

  const [preloadPost, setPreloadPost] = useState<PostEditObjectType>({
    header: post?.header ?? '',
    body: post?.body ?? '',
    privacy: post?.privacy ?? 'public',
    location: post?.location ?? '',
    media: [],
    savedPreviewMedia: post?.media ?? [],
  });

  useEffect(() => {
    setPreloadPost(() => ({
      header: post?.header ?? '',
      body: post?.body ?? '',
      privacy: post?.privacy ?? 'public',
      location: post?.location ?? '',
      media: [],
      savedPreviewMedia: post?.media ?? [],
    }));
  }, [postId, post]);

  return status === 'pending' ? (
    <Box>Loading...</Box>
  ) : status === 'error' || !post || index === -1 ? (
    <div>Error</div>
  ) : (
    <Card height="auto" position="relative">
      <CardHeader paddingBottom={0}>
        <PostHeader isFullPage={true} preloadData={preloadPost} postId={post.id} postIndex={index} />
      </CardHeader>

      <CardBody>
        <VStack gap={2} alignItems="start" marginBottom={2}>
          <Heading size="lg">{post.header}</Heading>
          <Text>{post.body}</Text>
        </VStack>
        {post.media.length > 0 && (
          <ImageSlider postIndex={index} action="direct" slides={post.media} postId={postId ?? ''} />
        )}
      </CardBody>
      <CardFooter>
        <PostFooter postId={post.id} postIndex={index} />
      </CardFooter>
    </Card>
  );
};
export default FullPost;
