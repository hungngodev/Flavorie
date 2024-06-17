import { HStack, IconButton, Link, StackProps, Text, Tooltip } from '@chakra-ui/react';
import { MessageCircle, Share2, ThumbsUp } from 'lucide-react';
import { memo, useEffect, useState } from 'react';
import { z } from 'zod';
import { useAuth } from '../../../hooks/index';
import { ReactObject, ReviewObject } from './MockPosts';

interface PostFooterProps extends StackProps {
  reacts: z.infer<typeof ReactObject>[];
  reviews: z.infer<typeof ReviewObject>[];
  shares: string[];
  isLiked?: boolean;
}

const PostFooter = memo<PostFooterProps>(({ reacts, reviews, shares, ...props }) => {
  const auth = useAuth();
  const [visible, setVisible] = useState(auth.currentUser.status === 'authenticated');

  useEffect(() => {
    setVisible(auth.currentUser.status === 'authenticated');
  }, [auth.currentUser.status]);

  // Update content of FooterButtons based on props
  const FooterButtons = [
    {
      name: 'Like',
      icon: ThumbsUp,
      content: reacts ?? [],
    },
    {
      name: 'Review',
      icon: MessageCircle,
      content: reviews ?? [],
    },
    {
      name: 'Share',
      icon: Share2,
      content: shares ?? [],
    },
  ];

  return (
    <HStack gap={4} width="100%" justifyContent="flex-start" alignItems="center" {...props}>
      {visible ? (
        FooterButtons.map((button, index) => (
          <HStack key={index} alignItems="center" gap={0} marginLeft={button.name === 'Share' ? 'auto' : 0}>
            <Tooltip label={button.name} gap={2}>
              <IconButton aria-label={`${button.name}-button`} icon={<button.icon />} variant="ghost" isRound={true} />
            </Tooltip>
            <Text>{button.content?.length ?? 0}</Text>
          </HStack>
        ))
      ) : (
        <Text textAlign="center">
          Don't have an account?{' '}
          <Link href="/login" color="teal" textDecoration="underline">
            Create one
          </Link>{' '}
          and get connected!
        </Text>
      )}
    </HStack>
  );
});

export default PostFooter;
