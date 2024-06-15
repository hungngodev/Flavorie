import { Post } from '../components/community/post/index';
import { MockPosts } from '../components/community/post/MockPosts';
import { Box } from '@chakra-ui/react';

const style = {
  backgroundColor: 'gray.50',
};

const Feed = () => {
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
