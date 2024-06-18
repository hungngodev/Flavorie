import React, { Children, useState } from "react";
import { Avatar, Box, Button, HStack, Text, VStack} from '@chakra-ui/react';
import { PersonalProps } from "../users/InfoCard";
// import ReviewForm from "../form/Review";

export interface Review {
    id: string;
    author: PersonalProps['avatar'];
    content: string;
    timestamp: string;
    children: Review[];    
}

interface ReviewCardProps {
    review: Review;
    onReply: (content: string, parentReviewId: string) => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, onReply }) => {
    const [showReplies, setShowReplies] = useState(false);
    const [reply, setReply] = useState(false);

    const handleReply = (content: string) => {
        onReply(content, review.id);
        setReply(false);
    };

    return (
        <Box ml="5" mt="2">
            <HStack align= "start" mb="4">
                <Avatar name={review.author.username} src={review.author.src} />
                <VStack>
                    <Box borderWidth= "1px" p="2"borderRadius="lg" bg="base.50" width="600px">
                        <Text fontWeight="bold" mb="2">{review.author.username}</Text>
                        <Text>{review.content}</Text>
                    </Box>
                    <HStack width="600px" justifyContent="space-between">
                        <Text fontSize="10" color="gray.500">{new Date(review.timestamp).toLocaleString()}</Text>
                        <Button size="sm" variant= "link" onClick={() => setReply(!reply)}>
                            Reply
                        </Button>
                        {reply && (
                            <Box mt="2">
                                {/* <ReviewForm onSubmit={handleReply} /> */}
                            </Box>
                        )}
                    </HStack>
                </VStack>
            </HStack>
            {review.children.length > 0 && (
                <Box ml="8">
                    {review.children.slice(0, 2).map((childReview) => (
                        <ReviewCard key={childReview.id} review={childReview} onReply={onReply} />
                    ))}
                    {review.children.length > 2 && (
                        <Box ml="20">
                            <Button size="sm"
                            variant="link"
                            onClick={() => setShowReplies(!showReplies)}
                            >
                            {showReplies ? 'Hide replies': `Show all replies (${review.children.length})`}
                            </Button>
                        </Box>
                    )}
                    {showReplies && review.children.slice(2).map((childReview) => (
                        <ReviewCard key={childReview.id} review={childReview} onReply={onReply} />
                        ))}
                </Box>
            )}
        </Box>
    )
};

export default ReviewCard;
