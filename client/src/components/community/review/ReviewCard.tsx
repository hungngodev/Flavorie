import { Avatar, Box, Button, HStack, Text, VStack } from '@chakra-ui/react';
import React, { useState } from 'react';
import { ReviewCardProps } from './types';

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const [showReplies, setShowReplies] = useState(false);

  return (
    <Box ml="5" mt="2" mb="2">
      <HStack gap={4} alignItems="start">
        <Avatar name={review.author.name} src={review.author.avatar} />
        <Box borderWidth="1px" px="4" py="1" borderRadius="lg" backgroundColor="blackAlpha.50">
          <Text fontWeight="bold">{review.author.name}</Text>
          <Text mb="2">{review.content}</Text>
        </Box>
      </HStack>
      {review.children.length > 0 && (
        <Button size="sm" variant="link" onClick={() => setShowReplies(!showReplies)}>
          {showReplies ? 'Hide replies' : `Show replies (${review.children.length})`}
        </Button>
      )}
      {showReplies && (
        <VStack gap={6} align="start" pl="4">
          {review.children.map((reply) => (
            <ReviewCard key={reply.id} review={reply} />
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default ReviewCard;
