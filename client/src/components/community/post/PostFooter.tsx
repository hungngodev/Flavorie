import { HStack, IconButton, StackProps, Text, Tooltip } from '@chakra-ui/react';
import { motion, useAnimationControls } from 'framer-motion';
import { MessageCircle, Share2 } from 'lucide-react';
import { memo, useEffect, useState } from 'react';
import { FaHeart } from 'react-icons/fa';
import { FaRegHeart } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import useAuth from '../../../hooks/useAuth';
import { likePostRequest } from '../../../slices/posts/index';
import { selectPosts, updatePost, selectPostById } from '../../../slices/posts/PostState';
import { AppDispatch, RootState } from '../../../store/store';
import { parsePost } from '../post/types';
import { BasePostProps } from './types';
import ReviewExpand from '../review/ReviewExpand';
import { useDisclosure } from '@chakra-ui/react';
import { Review } from '../review/types';

interface PostFooterProps extends StackProps, BasePostProps {
  // right now reacts are just a list of ids, no clear schema for reviews and shares yet
  // isLiked: boolean | undefined;
  setLoading?: (arg?: any) => void;
}

const PostFooter = memo<PostFooterProps>(({ postData, postId, ...props }) => {
  const auth = useAuth();
  const { id } = auth.currentUser;

  const reviewModal = useDisclosure();

  const dispatch = useDispatch<AppDispatch>();
  const post = postData ?? useSelector((state: RootState) => selectPostById(postId)(state));
  const posts = useSelector(selectPosts);

  const [isLiked, setIsLiked] = useState(post?.reacts?.includes(id) ?? false);

  const likeControl = useAnimationControls();
  const likePost = () => {
    likeControl.start({ scale: [1, 1.2, 1], transition: { duration: 0.2, ease: 'easeInOut' } });
    try {
      const res = dispatch(likePostRequest(postId)).then((res: any) => {
        dispatch(updatePost({ post: parsePost([res.payload.reacts]) }));
        setIsLiked(post?.reacts?.includes(id) ?? false);
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Update content of FooterButtons based on props
  const [footerButtons, setFooterButtons] = useState([
    {
      name: 'React',
      icon: FaRegHeart,
      content: post?.reacts ?? [],
    },
    {
      name: 'Review',
      icon: MessageCircle,
      content: post?.reviews ?? [],
    },
    {
      name: 'Share',
      icon: Share2,
      content: post?.shares ?? [],
    },
  ]);

  useEffect(() => {
    setIsLiked(post?.reacts?.includes(id) ?? false);
    setFooterButtons(() => [
      {
        name: 'React',
        icon: FaRegHeart,
        content: post?.reacts ?? [],
      },
      {
        name: 'Review',
        icon: MessageCircle,
        content: post?.reviews ?? [],
      },
      {
        name: 'Share',
        icon: Share2,
        content: post?.shares ?? [],
      },
    ]);
  }, [dispatch, post, postData, auth.currentUser.id, isLiked, setIsLiked]);
  return (
    <HStack gap={4} width="100%" justifyContent="flex-start" alignItems="center" {...props}>
      {footerButtons.map((button, index) => (
        <HStack key={index} alignItems="center" gap={2} marginLeft={button.name === 'Share' ? 'auto' : 0}>
          <Tooltip label={button.name} gap={2}>
            <IconButton
              as={motion.button}
              aria-label={`${button.name}-button`}
              icon={
                button.name === 'React' ? (
                  isLiked ? (
                    <FaHeart size="1.3em" />
                  ) : (
                    <FaRegHeart size="1.3em" />
                  )
                ) : (
                  <button.icon />
                )
              }
              variant="ghost"
              isRound={true}
              animate={button.name === 'React' ? likeControl : ''}
              color={button.name === 'React' ? (isLiked ? 'red.500' : 'blackAlpha.800') : 'blackAlpha.800'}
              onClick={
                button.name === 'React'
                  ? () => likePost()
                  : button.name === 'Review'
                    ? () => reviewModal.onOpen()
                    : () => {}
              }
              _hover={{ backgroundColor: 'transparent' }}
              _active={{ backgroundColor: 'transparent' }}
              _focus={{ backgroundColor: 'transparent' }}
              zIndex={3}
            />
          </Tooltip>
          <Text zIndex={2}>{button.content?.length ?? 0}</Text>
          <ReviewExpand
            postData={postData}
            reviews={postData?.reviews}
            isOpen={reviewModal.isOpen}
            onClose={reviewModal.onClose}
            postId={postId}
          />
        </HStack>
      ))}
    </HStack>
  );
});

export default PostFooter;
