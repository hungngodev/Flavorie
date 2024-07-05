import { DeleteIcon, EditIcon, WarningTwoIcon } from '@chakra-ui/icons';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Avatar,
  Box,
  Button,
  HStack,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Textarea,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { FaEllipsis } from 'react-icons/fa6';
import cooking from '../../../../public/images/let-him-cook.jpg';
import theme from '../../../style/theme';
import ReviewForm from './ReviewForm';
// import axios from "axios";
import { useQueryClient } from '@tanstack/react-query';
import { FaTimes } from 'react-icons/fa';
import { IoIosSend } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import useAuth from '../../../hooks/useAuth';
import {
  createReviewRequest,
  deleteReviewRequest,
  editReviewRequest,
  selectCreateReviewStatus,
  selectDeleteReviewStatus,
  selectEditReviewStatus,
} from '../../../slices/reviews/index';
import { AppDispatch } from '../../../store/store';
import { parseDate } from '../../../utils/index';
import { ReviewCardProps } from './types';

const ReviewCard: React.FC<ReviewCardProps> = ({ review, postId }) => {
  console.log(postId);
  const auth = useAuth(); //
  const { id, status } = auth.currentUser;
  const [showReplies, setShowReplies] = useState(false);
  const [reply, setReply] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(review.content);
  const [isAlertOpen, setAlertOpen] = useState(false);
  const [canEdit, setCanEdit] = useState(id === review.author.id);
  const [loading, setLoading] = useState(false);
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const editStatus = useSelector(selectEditReviewStatus);
  const deleteStatus = useSelector(selectDeleteReviewStatus);
  const createStatus = useSelector(selectCreateReviewStatus);

  const alertModal = useDisclosure();
  const queryClient = useQueryClient();

  const dispatch = useDispatch<AppDispatch>();

  const handleReply = async (content: string, parentReviewId: string) => {
    try {
      console.log(review.postId, content);
      // const response = await createReview(review.postId, content, parentReviewId);
      const request = dispatch(
        createReviewRequest({ postId: review.postId, content, parentReview: parentReviewId }),
      ).then((res) => {
        setReply(false);
      });
    } catch (error) {
      console.error('Failed to create reply: ', error);
    }
  };

  const handleEdit = async ({ postId, reviewId, content }: { postId: string; reviewId: string; content: string }) => {
    if (!postId || !reviewId || status !== 'authenticated') return;
    console.log('here');
    if (isEditing) {
      try {
        const request = dispatch(editReviewRequest({ postId, reviewId, content })).then((res) => {
          queryClient.invalidateQueries();
        });
        setIsEditing(false);
      } catch (error) {
        console.error('Failed to edit review: ', error);
      }
    } else {
      setIsEditing(true);
    }
  };

  const handleDelete = async ({ postId, reviewId }: { postId: string; reviewId: string }) => {
    if (!postId || !reviewId || status !== 'authenticated') return;
    const request = dispatch(deleteReviewRequest({ postId, reviewId })).then((res) => {
      setAlertOpen(false);
      queryClient.invalidateQueries();
    });
  };

  const handleKeyDownReply = (event: React.KeyboardEvent) => {
    console.log('clicked');
    if (editedContent === '') {
      return;
    }
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevents adding a new line in the textarea
      handleEdit({ postId: postId, reviewId: review.id, content: editedContent }); // Triggers form submit
    }
  };

  useEffect(() => {
    setLoading(deleteStatus === 'loading' || editStatus === 'loading' || createStatus === 'loading');
  }, [editStatus, deleteStatus, createStatus]);

  return (
    <Box
      ml="5"
      mt="2"
      maxWidth="100%"
      rounded="lg"
      backdropBlur={loading && 'blur(13px)'}
      pointerEvents={loading ? 'none' : 'auto'}
      opacity={loading ? 0.5 : 1}
    >
      <HStack align="start" mb="4" spacing="2">
        <Avatar name={review.author.name} src={review.author.avatar} />
        <VStack spacing="2" align="start" w="full">
          <HStack width="full">
            <Box borderWidth="1px" p="2" borderRadius="lg" bg="base.50" width="600px">
              <HStack justifyContent="space-between" alignItems="center">
                <Text fontWeight="semibold" mb="2">
                  {review.author.name}
                </Text>
                {isEditing && (
                  <IconButton
                    variant="normal"
                    color={theme.colors.palette_purple}
                    icon={<FaTimes />}
                    size="sm"
                    onClick={() => {
                      setIsEditing(false);
                      setEditedContent(review.content);
                    }}
                    aria-label="Cancel"
                  />
                )}
              </HStack>
              {isEditing ? (
                <Box position="relative" width="100%">
                  <Textarea
                    value={editedContent}
                    onKeyDown={(e) => handleKeyDownReply(e)}
                    onChange={(e) => setEditedContent(e.target.value)}
                    sx={{
                      '::file-selector-button': {
                        display: 'none',
                      },
                    }}
                  />

                  <IconButton
                    position="absolute"
                    bottom="1"
                    right="0"
                    variant="normal"
                    color={theme.colors.palette_purple}
                    icon={<IoIosSend />}
                    onClick={() => {
                      console.log('here');
                      handleEdit({ postId: postId, reviewId: review.id, content: editedContent });
                    }}
                    isDisabled={editedContent.length === 0}
                    aria-label="Save"
                    zIndex={4}
                  />
                </Box>
              ) : (
                <Text>{review.content}</Text>
              )}
            </Box>

            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Options"
                borderRadius="full"
                icon={<FaEllipsis />}
                variant="ghost"
              />
              <MenuList>
                {canEdit && status === 'authenticated' && (
                  <MenuItem icon={<EditIcon />} onClick={() => setIsEditing(true)}>
                    Edit
                  </MenuItem>
                )}
                <MenuItem icon={<WarningTwoIcon />}>
                  Report
                  <AlertDialog
                    isCentered
                    isOpen={alertModal.isOpen}
                    leastDestructiveRef={cancelRef}
                    onClose={alertModal.onClose}
                  >
                    {' '}
                    <AlertDialogOverlay>
                      <AlertDialogContent>
                        <Image src={cooking} />
                        <AlertDialogFooter>
                          <Text>{`We will let ${review.author.name} know that he is not cooking! Meanwhile here's a meme`}</Text>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialogOverlay>
                  </AlertDialog>
                </MenuItem>
                {canEdit && status === 'authenticated' && (
                  <MenuItem icon={<DeleteIcon />} onClick={() => setAlertOpen(true)}>
                    Delete
                  </MenuItem>
                )}
              </MenuList>
            </Menu>
          </HStack>
          <HStack width="600px" justifyContent="space-between">
            <Text fontSize="10" color="base.400" fontWeight="bold">
              {parseDate(review.timestamp)}
            </Text>
            {status === 'authenticated' && (
              <Button
                size="sm"
                color={theme.colors.palette_purple}
                fontWeight="bold"
                variant="link"
                onClick={() => setReply(!reply)}
              >
                Reply
              </Button>
            )}
          </HStack>
          {reply && (
            <ReviewForm action="edit" postId={review.postId} onSubmit={() => handleReply} parentReviewId={review.id} />
          )}
        </VStack>
      </HStack>
      {review.children.length > 0 && (
        <Box ml="8">
          {review.children.slice(0, 2).map((childReview: any) => (
            <ReviewCard postId={postId} key={childReview.id} review={childReview} />
          ))}
          {review.children.length > 2 && (
            <Box ml="20">
              <Button
                size="sm"
                color={theme.colors.palette_purple}
                variant="link"
                onClick={() => setShowReplies(!showReplies)}
              >
                {showReplies ? 'Hide replies' : `Show all replies (${review.children.length - 2})`}
              </Button>
            </Box>
          )}
          {showReplies &&
            review.children
              .slice(2)
              .map((childReview: any) => <ReviewCard postId={postId} key={childReview.id} review={childReview} />)}
        </Box>
      )}
      <AlertDialog isOpen={isAlertOpen} leastDestructiveRef={cancelRef} onClose={() => setAlertOpen(false)}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Comment?
            </AlertDialogHeader>

            <AlertDialogBody>Are you sure to delete this comment?</AlertDialogBody>

            <AlertDialogFooter>
              <Button variant="outline" ref={cancelRef} onClick={() => setAlertOpen(false)}>
                No
              </Button>
              <Button ml={2} onClick={() => handleDelete({ postId: postId, reviewId: review.id })}>
                Yes
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default ReviewCard;
