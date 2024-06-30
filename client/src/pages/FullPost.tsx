import { Button, Card, CardBody, CardFooter, CardHeader, Heading, Text, VStack } from '@chakra-ui/react';
import { QueryClient, useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { Params, useNavigate, useParams } from 'react-router-dom';
import { ImageSlider, PostFooter, PostHeader } from '../components/community/post/index';
import { selectPosts } from '../slices/posts/PostState';
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
  const { postId } = useParams();
  const { data: queryData, status } = useQuery(postQuery(postId ?? ''));
  const posts = useSelector(selectPosts);

  const navigate = useNavigate();

  const post = queryData?.post ? queryData?.post : posts.find((post) => post.id === postId);
  console.log(post);
  console.log(postId);
  console.log(posts);

  const index = posts.findIndex((post) => {
    console.log(post.id, postId);
    return post.id === postId;
  });
  console.log(index);
  return status === 'pending' ? (
    <div>Loading...</div>
  ) : status === 'error' || index === -1 || !post ? (
    <div>Error</div>
  ) : (
    <Card
      height="auto"
      // ref={ref}
      position="relative"
      // backdropBlur={loading && 'blur(10px)'}
      // pointerEvents={loading ? 'none' : 'auto'}
      // opacity={loading ? 0.5 : 1}
    >
      <Button width="auto" marginLeft="auto" onClick={() => navigate(-1)}>
        Return
      </Button>
      <CardHeader paddingBottom={0}>
        <PostHeader postId={post.id} index={index} />
      </CardHeader>

      <CardBody>
        <VStack gap={2} alignItems="start" marginBottom={2}>
          <Heading size="lg">{post.header}</Heading>
          <Text>{post.body}</Text>
        </VStack>
        {post.media.length > 0 && <ImageSlider action="direct" slides={post.media} postId={postId} />}
      </CardBody>
      <CardFooter>
        <PostFooter index={index} postId={post.id} />
      </CardFooter>
    </Card>
  );
};
export default FullPost;
{
  /* <Card
  marginBlock={4}
  {...containerProps}
  height="auto"
  ref={ref}
  position="relative"
  backdropBlur={loading && 'blur(10px)'}
  pointerEvents={loading ? 'none' : 'auto'}
  opacity={loading ? 0.5 : 1}
>
  <CardHeader paddingBottom={0} {...headerProps}>
    <PostHeader postId={post.id} index={index} setLoading={setLoading} />
  </CardHeader>

  <CardBody {...bodyProps}>
    <VStack gap={2} alignItems="start" marginBottom={2}>
      <Heading size="lg">{post.header}</Heading>
      <Text>{post.body}</Text>
    </VStack>
    {post.media.length > 0 && <ImageSlider action="direct" slides={post.media} postId={postId} />}
  </CardBody>
  <CardFooter {...footerProps}>
    <PostFooter index={index} postId={post.id} setLoading={setLoading} />
  </CardFooter>
</Card>; */
}
