import {
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  StackProps,
  Text,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import { motion, useAnimationControls } from 'framer-motion';
import { Check, Copy, MessageCircle, Share2 } from 'lucide-react';
import { memo, useEffect, useState } from 'react';
import { FaHeart } from 'react-icons/fa';
import { FaRegHeart } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuth from '../../../hooks/useAuth';
import { selectPostById, updatePost } from '../../../slices/posts/PostState';
import { likePostRequest } from '../../../slices/posts/index';
import { AppDispatch, RootState } from '../../../store/store';
import { parsePost } from '../post/types';
import ReviewExpand from '../review/ReviewExpand';
import { BasePostProps } from './types';

interface PostFooterProps extends StackProps, BasePostProps {
  // right now reacts are just a list of ids, no clear schema for reviews and shares yet
  // isLiked: boolean | undefined;
  setLoading?: (arg?: any) => void;
  isFullPage?: boolean;
  reviewIsOpen?: boolean;
  reviewOnclose?: () => void;
  reviewOnOpen?: () => void;
}

const PostFooter = memo<PostFooterProps>(
  ({ postData, postId, isFullPage, reviewIsOpen, reviewOnclose, reviewOnOpen, ...props }) => {
    const auth = useAuth();
    const { id, status } = auth.currentUser;

    const reviewModal = useDisclosure();
    const shareModal = useDisclosure();

    const dispatch = useDispatch<AppDispatch>();
    const post = postData ?? useSelector((state: RootState) => selectPostById(postId)(state));

    let location = useLocation();

    const [isLiked, setIsLiked] = useState(post?.reacts?.includes(id) ?? false);
    const [url, setUrl] = useState(
      window.location.href.includes(postId) ? window.location.href : `${window.location.href}/${postId}`,
    );

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
      console.log(url);
    }, [url, setUrl]);

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
            <Tooltip label={status === 'authenticated' ? button.name : 'Sign up now!'} gap={2}>
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
                      ? isFullPage
                        ? () => {}
                        : () => reviewOnOpen ?? reviewModal.onOpen()
                      : () => {
                          shareModal.onOpen();
                        }
                }
                _hover={{ backgroundColor: 'transparent' }}
                _active={{ backgroundColor: 'transparent' }}
                _focus={{ backgroundColor: 'transparent' }}
                isDisabled={status !== 'authenticated'}
                zIndex={3}
              />
            </Tooltip>
            {button.name !== 'Share' && <Text zIndex={2}>{button.content?.length ?? 0}</Text>}
            <ReviewExpand
              postData={postData}
              reviews={postData?.reviews}
              isOpen={reviewIsOpen ?? reviewModal.isOpen}
              onClose={reviewOnclose ?? reviewModal.onClose}
              postId={postId}
            />
            <Modal isOpen={shareModal.isOpen} onClose={shareModal.onClose}>
              {/* <ModalOverlay /> */}
              <ModalContent>
                <ModalHeader>Share your cooking!</ModalHeader>
                <ModalCloseButton />
                <ModalFooter>
                  <InputGroup>
                    <Input
                      value={url}
                      isReadOnly
                      size="lg"
                      variant="flushed"
                      focusBorderColor="blackAlpha.800"
                      color="blackAlpha.600"
                      backgroundColor="blackAlpha.50"
                      rounded="sm"
                      px={2}
                      aria-label="url-input"
                    />
                    <InputRightElement transform="translateY(5px)">
                      <IconButton
                        aria-label="copy-button"
                        icon={<Copy size="1.3em" />}
                        variant="ghost"
                        onClick={() => {
                          toast.success('Link copied !'), { position: 'top-right', icon: <Check /> };
                          navigator.clipboard.writeText(url);
                        }}
                        _hover={{ backgroundColor: 'blackAlpha.300' }}
                        _active={{ backgroundColor: 'blackAlpha.300' }}
                        _focus={{ backgroundColor: 'blackAlpha.300' }}
                      />
                    </InputRightElement>
                  </InputGroup>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </HStack>
        ))}
      </HStack>
    );
  },
);

export default PostFooter;
