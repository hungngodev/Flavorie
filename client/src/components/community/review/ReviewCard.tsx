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
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { FaEllipsis } from 'react-icons/fa6';
import theme from '../../../style/theme';
import ReviewForm from './ReviewForm';
import { PersonalProps } from '../../users/InfoCard';
// import axios from "axios";
import { FaTimes } from 'react-icons/fa';
import { IoIosSend } from 'react-icons/io';
import useAuth from '../../../hooks/useAuth';
import { createReview, updateReview } from '../../../utils/reviewService';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store/store';
import { Review, ReviewObjectType } from './types';
import { BasePostProps } from '../post/types';
import { deletePost } from '../../../slices/posts/PostState';
import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteReviewRequest, editReviewRequest, createReviewRequest } from '../../../slices/reviews/index';
export interface Post {
  id: string;
  body: string;
}

interface ReviewCardProps extends BasePostProps {
  review: ReviewObjectType;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, postId }) => {
  const [showReplies, setShowReplies] = useState(false);
  const [reply, setReply] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(review.content);
  const [isAlertOpen, setAlertOpen] = useState(false);
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const auth = useAuth(); //

  const queryClient = useQueryClient();

  const dispatch = useDispatch<AppDispatch>();

  const handleReply = async (content: string, parentReviewId: string) => {
    try {
      console.log(review.postId, content);
      const response = await createReview(review.postId, content, parentReviewId);
      setReply(false);
    } catch (error) {
      console.error('Failed to create reply: ', error);
    }
  };

  const handleEdit = async ({ postId, reviewId, content }: { postId: string; reviewId: string; content: string }) => {
    if (!postId || !reviewId || auth.currentUser.status !== 'authenticated') return;
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
    if (!postId || !reviewId || auth.currentUser.status !== 'authenticated') return;
    const request = dispatch(deleteReviewRequest({ postId, reviewId })).then((res) => {
      setAlertOpen(false);
      queryClient.invalidateQueries();
    });
  };

  return (
    <Box ml="5" mt="2">
      <HStack align="start" mb="4" spacing="2">
        <Avatar name={review.author.name} src={review.author.avatar} />
        <VStack spacing="2" align="start" w="full">
          <HStack width="full">
            <Box borderWidth="1px" p="2" borderRadius="lg" bg="base.50" width="600px">
              <HStack justifyContent="space-between" alignItems="center">
                <Text fontWeight="bold" mb="2">
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
                <Box position="relative">
                  <Textarea value={editedContent} onChange={(e) => setEditedContent(e.target.value)} />
                  <Box position="absolute" bottom="1" right="0">
                    <IconButton
                      variant="normal"
                      color={theme.colors.palette_purple}
                      icon={<IoIosSend />}
                      onClick={() => {
                        console.log('here');
                        handleEdit({ postId: postId, reviewId: review.id, content: editedContent });
                      }}
                      aria-label="Save"
                    />
                  </Box>
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
                <MenuItem icon={<EditIcon />} onClick={() => setIsEditing(true)}>
                  Edit
                </MenuItem>
                <MenuItem icon={<WarningTwoIcon />}>Report</MenuItem>
                <MenuItem icon={<DeleteIcon />} onClick={() => setAlertOpen(true)}>
                  Delete
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
          <HStack width="600px" justifyContent="space-between">
            <Text fontSize="10" color="base.400" fontWeight="bold">
              {new Date(review.timestamp).toLocaleString()}
            </Text>
            <Button
              size="sm"
              color={theme.colors.palette_purple}
              fontWeight="bold"
              variant="link"
              onClick={() => setReply(!reply)}
            >
              Reply
            </Button>
          </HStack>
          {reply && (
            <Box mt="2">
              <ReviewForm postId={review.postId} onSubmit={() => handleReply} parentReviewId={review.id} />
            </Box>
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
