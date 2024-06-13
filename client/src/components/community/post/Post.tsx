import { Box, Card, CardBody, CardFooter, CardHeader, Text, Heading } from '@chakra-ui/react';
import React from 'react';
import { PostObjectType } from './MockPosts';
import PostFooter from './PostFooter';
import PostHeader from './PostHeader';
import MediaGrid from './MediaGrid';
interface PostProps {
  postData: PostObjectType;
  isDisplayed?: boolean;
}

const Post: React.FC<PostProps> = ({ postData, isDisplayed, ...props }) => {
  return (
    <>
      {isDisplayed && (
        <Card {...props}>
          <CardHeader>
            <PostHeader
              avatar={postData.author.avatar}
              author={postData.author.name}
              date={postData.date}
              privacy={postData.privacy}
              location={postData.location}
            />
          </CardHeader>
          <CardBody>
            <Box>
              <Heading>{postData.header}</Heading>
              <Text>{postData.body}</Text>
            </Box>
            <MediaGrid mediaData={postData.media} isLoaded={true} />
          </CardBody>
          <CardFooter>
            <PostFooter reacts={postData.reacts} reviews={postData.reviews} shares={postData.shares} />
          </CardFooter>
        </Card>
      )}
    </>
  );
};

export default Post;
