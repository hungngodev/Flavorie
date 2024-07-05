import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogOverlay,
    Avatar,
    Button,
    HStack,
    IconButton,
    Image,
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
import { Bookmark, Check, CircleAlert, Ellipsis, Pencil, Trash, Undo2 } from 'lucide-react';
import { memo, useEffect, useRef, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import PostFormExpand from './form/PostFormExpand';
// import parseDate from '../../../utils/parseDate';
import { useQueryClient } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import cooking from '../../../../public/images/let-him-cook.jpg';
import useAuth from '../../../hooks/useAuth';
import { deletePostRequest, selectDeleteStatus } from '../../../slices/posts/DeletePost';
import { selectHideStatus } from '../../../slices/posts/HidePost';
import { deletePost, selectPostById, updatePost } from '../../../slices/posts/PostState';
import { saveRequest, selectSaveStatus } from '../../../slices/posts/SavePost';
import { AppDispatch, RootState } from '../../../store/store';
import { parseDate } from '../../../utils/index';
import { BasePostProps, PostEditObjectType, parsePost } from './types';
interface PostHeaderProps extends BasePostProps, StackProps {
    preloadData?: PostEditObjectType;
    setLoading?: (arg?: any) => void;
    isFullPage: boolean;
}

const PostHeader = memo<PostHeaderProps>(({ postId, setLoading, postData, preloadData, isFullPage, ...props }) => {
    const auth = useAuth();
    const queryClient = useQueryClient();
    const { id, status } = auth.currentUser;
    const navigate = useNavigate();
    const cancelRef = useRef(null);

    const dispatch = useDispatch<AppDispatch>();

    const selectorPost = useSelector((state: RootState) => selectPostById(postId)(state));
    const post = postData ?? selectorPost;

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
        queryClient.invalidateQueries();
    }, [deleteStatus, saveStatus, hideStatus, postId]);

    const updateForm = useDisclosure();
    const toastModal = useDisclosure();
    return (
        <HStack width="100%" justifyContent="space-between" alignItems="center" {...props}>
            <PostFormExpand
                postId={postId}
                action="update"
                preload={preloadPost}
                isOpen={updateForm.isOpen}
                onClose={updateForm.onClose}
            />
            <HStack gap={4} alignItems="start">
                <Avatar
                    name={post?.author.name}
                    src={post?.author.avatar}
                    aria-label="user-image"
                    icon={<FaUserCircle />}
                />
                <VStack alignItems="start" height="auto" gap={0}>
                    <Text fontWeight={400} fontSize="lg">
                        {post?.author.name}
                    </Text>
                    <HStack color="blackAlpha.600">
                        <Text>{parseDate(post?.createdAt)}</Text>
                    </HStack>
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
                {status === 'authenticated' ? (
                    <MenuList zIndex="200">
                        {isFullPage && (
                            <MenuItem icon={<Undo2 />} command="⌘R" onClick={() => navigate('/community')}>
                                Return
                            </MenuItem>
                        )}
                        {isFullPage && <MenuDivider />}
                        {canUpdate && (
                            <MenuItem icon={<Pencil />} command="⌘U" onClick={updateForm.onOpen}>
                                Edit
                            </MenuItem>
                        )}

                        <MenuItem
                            icon={<Bookmark />}
                            command="⌘S"
                            onClick={() => {
                                dispatch(saveRequest({ postId })).then((res: any) => {
                                    dispatch(updatePost({ post: parsePost([res.payload.post]) }));
                                });
                                toast.success('Post saved !'), { position: 'top-right', icon: <Check /> };
                            }}
                        >
                            Save post
                        </MenuItem>
                        <MenuDivider />
                        {/* <MenuItem
              icon={<EyeOff />}
              command="⌘H"
              onClick={() => {
                dispatch(hideRequest({ postId })).then((res: any) => {
                  dispatch(updatePost({ post: parsePost([res.payload.post]) }));
                });
              }}
            >
              Hide
            </MenuItem> */}
                        <MenuItem icon={<CircleAlert />} command="⌘R" onClick={toastModal.onOpen}>
                            <Button variant="ghost" paddingInline={0} fontWeight={400}>
                                Report
                            </Button>
                            <AlertDialog
                                isCentered
                                isOpen={toastModal.isOpen}
                                leastDestructiveRef={cancelRef}
                                onClose={toastModal.onClose}
                            >
                                {' '}
                                <AlertDialogOverlay>
                                    <AlertDialogContent>
                                        <Image src={cooking} />
                                        <AlertDialogFooter>
                                            <Text>{`We will let ${post.author.name} know that he is not cooking! Meanwhile here's a meme`}</Text>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialogOverlay>
                            </AlertDialog>
                        </MenuItem>
                        {canUpdate && (
                            <MenuItem
                                icon={<Trash />}
                                command="⌘D"
                                onClick={async () => {
                                    dispatch(deletePostRequest(postId)).then(() => {
                                        dispatch(deletePost({ postId }));
                                        toast.success('Post deleted !'), { position: 'top-right', icon: <Check /> };
                                        if (isFullPage) navigate('/community');
                                    });
                                }}
                            >
                                Delete
                            </MenuItem>
                        )}
                    </MenuList>
                ) : (
                    <MenuList>
                        <MenuItem as="a" href="/login">
                            <Text width="100%" textAlign="center" color="backAlpha.700" fontWeight="semibold" size="lg">
                                Sign in and get cooking now!
                            </Text>
                        </MenuItem>
                    </MenuList>
                )}
            </Menu>
        </HStack>
    );
});
export default PostHeader;
