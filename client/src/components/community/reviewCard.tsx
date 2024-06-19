import React, { Children, useState } from "react";
import { Avatar, Box, Button, HStack, Text, VStack} from '@chakra-ui/react';
import { PersonalProps } from "../users/InfoCard";
import ReviewForm from "../form/Review";
import theme from "../../style/theme";

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
        <Box ml="5" mt="2" >
            <HStack align= "start" mb="4" spacing="2">
                <Avatar name={review.author.username} src={review.author.src} />
                <VStack spacing="2" align="start" w="full">
                    <Box borderWidth= "1px" p="2"borderRadius="lg" borderColor={theme.colors.palette_lavender} bg={theme.colors.light_purple} width="600px">
                        <Text fontWeight="bold" mb="2">{review.author.username}</Text>
                        <Text>{review.content}</Text>
                    </Box>
                    <HStack width="600px" justifyContent="space-between">
                        <Text fontSize="10" color="base.400" fontWeight="bold">{new Date(review.timestamp).toLocaleString()}</Text>
                        <Button size="sm" color={theme.colors.palette_purple} fontWeight="bold" variant= "link" onClick={() => setReply(!reply)}>
                            Reply
                        </Button>
                    </HStack>
                        {reply && (
                            <Box mt="2">
                                <ReviewForm avatar={review.author} onSubmit={handleReply} />
                            </Box>
                        )}
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
                            color={theme.colors.palette_purple}
                            variant="link"
                            onClick={() => setShowReplies(!showReplies)}
                            >
                            {showReplies ? 'Hide replies': `Show all replies (${review.children.length-2})`}
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
