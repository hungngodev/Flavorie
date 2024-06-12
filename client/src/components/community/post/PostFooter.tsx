import { HStack, IconButton, StackProps, Text, Tooltip } from '@chakra-ui/react';
import { MessageCircle, Share2, ThumbsUp } from 'lucide-react';
import { memo } from 'react';
import { z } from 'zod';
import { ReactObject, ReviewObject } from './MockPosts';

interface PostFooterProps extends StackProps {
  reacts: z.infer<typeof ReactObject>[];
  reviews: z.infer<typeof ReviewObject>[];
  shares: string[];
  isLiked?: boolean;
}

const FooterButtons = [
  {
    name: 'Like',
    icon: ThumbsUp,
    content: [] as any[],
  },
  {
    name: 'Review',
    icon: MessageCircle,
    content: [] as any[],
  },
  {
    name: 'Share',
    icon: Share2,
    content: [] as any[],
  },
];

const PostFooter = memo<PostFooterProps>(({ reacts, reviews, shares, ...props }) => {
  FooterButtons[0].content = reacts;
  FooterButtons[1].content = reviews;
  FooterButtons[2].content = shares;

  return (
    <HStack width="100%" justifyContent="space-between" alignItems="center" {...props}>
      {FooterButtons.map((button, index) => (
        <Tooltip key={index} label={button.name} gap={2}>
          <IconButton aria-label={`${button.name}-button`} icon={<button.icon />} />
          <Text>{button.content.length}</Text>
        </Tooltip>
      ))}
    </HStack>
  );
});

export default PostFooter;
