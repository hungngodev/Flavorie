import { Box } from '@chakra-ui/react';
import { useState } from 'react';
import { z } from 'zod';
import { MockPosts } from '../components/community/post/MockPosts';
import { Post } from '../components/community/post/index';

const style = {
  backgroundColor: 'gray.50',
};

const FeedRequest = z.object({
  page: z.number().optional(),
  limits: z.number().optional(),
});
type FeedRequestType = z.infer<typeof FeedRequest>;
const Feed = () => {
  const [page, setPage] = useState(1);
  // useEffect(() => {
  //   const generateFeed = async () => {
  //     const request: FeedRequestType = { page: page, limits: 20 };
  //     const newsfeedDocuments = await customFetch.get('/community/newsfeed', { data: request });
  //   };
  // }, []);
  return (
    <Box
      width="100%"
      height="100%"
      overflow="auto"
      backgroundColor="blackAlpha.50"
      paddingX={{ base: 0, lg: '10%', xl: '20%' }}
    >
      {MockPosts.map((post) => (
        <Post key={post.id} postData={post} isDisplayed />
      ))}
    </Box>
  );
};
export default Feed;
