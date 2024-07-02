import {
  Avatar,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  StackProps,
  Text,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import { Bookmark, CircleAlert, Ellipsis, EyeOff, History, Pencil, Trash } from 'lucide-react';
import { memo, useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import PostFormExpand from './form/PostFormExpand';
// import parseDate from '../../../utils/parseDate';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import { deleteRequest, selectDeleteStatus } from '../../../slices/posts/DeletePost';
import { hideRequest, selectHideStatus } from '../../../slices/posts/HidePost';
import { deletePost, selectPosts, updatePost } from '../../../slices/posts/PostState';
import { saveRequest, selectSaveStatus } from '../../../slices/posts/SavePost';
import { AppDispatch } from '../../../store/store';
import { BasePostProps, PostEditObjectType, parsePost } from './types';

interface PostHeaderProps extends BasePostProps, StackProps {
  preloadData?: PostEditObjectType;
  setLoading?: (arg?: any) => void;
  isFullPage: boolean;
}

const PostHeader = memo<PostHeaderProps>(
  ({ postIndex, postId, setLoading, postData, preloadData, isFullPage, ...props }) => {
    const auth = useAuth();
    const { id } = auth.currentUser;
    const navigate = useNavigate();

    const dispatch = useDispatch<AppDispatch>();

    const post = postData ?? useSelector(selectPosts)[postIndex];

    const deleteStatus: string = useSelector(selectDeleteStatus);
    const saveStatus: string = useSelector(selectSaveStatus);
    const hideStatus: string = useSelector(selectHideStatus);

    const [canUpdate, setCanUpdate] = useState(post?.author.id === id);
    const [preloadPost, setPreloadPost] = useState<PostEditObjectType>(
      preloadData ?? {
        header: post?.header ?? '',
        body: post?.body ?? '',
        privacy: post?.privacy ?? 'public',
        location: post?.location ?? '',
        media: [],
        savedPreviewMedia: post?.media ?? [],
      },
    );

    useEffect(() => {
      setPreloadPost(() => ({
        header: post?.header ?? '',
        body: post?.body ?? '',
        privacy: post?.privacy ?? 'public',
        location: post?.location ?? '',
        media: [],
        savedPreviewMedia: post?.media ?? [],
      }));
      setCanUpdate(post?.author.id === id);
    }, [dispatch, auth.currentUser.id, post]);

    useEffect(() => {
      if (
        (deleteStatus === 'loading' || saveStatus === 'loading' || hideStatus === 'loading') &&
        postId === post.id &&
        setLoading
      ) {
        setLoading(() => true);
      }
      if (
        (deleteStatus === 'succeeded' || saveStatus === 'succeeded' || hideStatus === 'succeeded') &&
        postId === post.id &&
        setLoading
      ) {
        setLoading(() => false);
      }
    }, [deleteStatus, saveStatus, hideStatus, postId]);

    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
      <HStack width="100%" justifyContent="space-between" alignItems="center" {...props}>
        <PostFormExpand
          postIndex={postIndex}
          postId={postId}
          action="update"
          preload={preloadPost}
          isOpen={isOpen}
          onClose={onClose}
        />
        <HStack gap={4} alignItems="start">
          <Avatar name={post?.author.name} src={post?.author.avatar} aria-label="user-image" icon={<FaUserCircle />} />
          <VStack alignItems="start" height="auto" gap={0}>
            <Text fontWeight="semibold" fontSize="lg">
              {post?.author.name}
            </Text>
          </VStack>
        </HStack>
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<Ellipsis />}
            aria-label="post-options"
            variant="ghost"
            isRound={true}
            fontSize="2xl"
          />
          <MenuList zIndex="200">
            {isFullPage && (
              <MenuItem icon={<Pencil />} command="⌘U" onClick={() => navigate('/community')}>
                Return
              </MenuItem>
            )}
            {canUpdate && (
              <MenuItem icon={<Pencil />} command="⌘U" onClick={onOpen}>
                Update post
              </MenuItem>
            )}

            <MenuItem
              icon={<Bookmark />}
              command="⌘S"
              onClick={() => {
                dispatch(saveRequest({ postId })).then((res: any) => {
                  dispatch(updatePost({ postIndex: postIndex, post: parsePost([res.payload.post]) }));
                });
              }}
            >
              Save post
            </MenuItem>
            <MenuDivider />
            <MenuItem icon={<History />} command="⌘E">
              See edit history
            </MenuItem>
            <MenuItem
              icon={<EyeOff />}
              command="⌘H"
              onClick={() => {
                dispatch(hideRequest({ postId })).then((res: any) => {
                  dispatch(updatePost({ postIndex: postIndex, post: parsePost([res.payload.post]) }));
                });
              }}
            >
              Hide
            </MenuItem>
            <MenuItem icon={<CircleAlert />} command="⌘R">
              Report
            </MenuItem>
            {canUpdate && (
              <MenuItem
                icon={<Trash />}
                command="⌘D"
                onClick={async () => {
                  dispatch(deleteRequest(postId)).then(() => {
                    dispatch(deletePost({ postId }));
                    if (isFullPage) navigate('/community');
                  });
                }}
              >
                Delete
              </MenuItem>
            )}
          </MenuList>
        </Menu>
      </HStack>
    );
  },
);
export default PostHeader;
