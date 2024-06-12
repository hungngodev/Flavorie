import { Card, CardBody, CardFooter, CardHeader, Text } from '@chakra-ui/react';
import React from 'react';
import { z } from 'zod';
import { PostObject } from './MockPosts';
import PostFooter from './PostFooter';
import PostHeader from './PostHeader';

interface PostProps {
  postData: z.infer<typeof PostObject>;
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
            <Text>{postData.header}</Text>
            <Text>{postData.body}</Text>
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
