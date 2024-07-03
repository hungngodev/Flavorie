import { Avatar, Box, Button, HStack, Text, VStack } from '@chakra-ui/react';
import React, { useState } from 'react';
import { ReviewCardProps } from './types';

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const [showReplies, setShowReplies] = useState(false);

  return (
    <Box ml="5" mt="2" mb="2">
      <HStack>
        <Avatar name={review.author.username} src={review.author.src} />
        <Box borderWidth="1px" p="2" borderRadius="lg" bg="base.50">
          <Text fontWeight="bold" mb="2">
            {review.author.username}
          </Text>
          <Text mb="2">{review.content}</Text>
        </Box>
      </HStack>
      {review.children.length > 0 && (
        <Button size="sm" variant="link" onClick={() => setShowReplies(!showReplies)}>
          {showReplies ? 'Hide replies' : `Show replies (${review.children.length})`}
        </Button>
      )}
      {showReplies && (
        <VStack spacing="4" align="start" pl="4">
          {review.children.map((reply) => (
            <ReviewCard key={reply.id} review={reply} />
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default ReviewCard;
