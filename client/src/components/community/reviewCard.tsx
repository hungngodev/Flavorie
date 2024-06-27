import React, { Children, useState } from "react";
import {
    Avatar,
    Box,
    Button,
    HStack,
    Input,
    Text,
    Textarea,
    VStack,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    IconButton,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
} from '@chakra-ui/react';
import { PersonalProps } from "../users/InfoCard";
import ReviewForm from "../form/Review";
import theme from "../../style/theme";
import { FaEllipsis } from 'react-icons/fa6';
import { EditIcon, DeleteIcon, WarningTwoIcon } from "@chakra-ui/icons";
import axios from "axios";
import { FaTimes } from "react-icons/fa";
import { MdOutlineCancel } from 'react-icons/md';
import { IoIosSend } from 'react-icons/io';

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
    onEdit: (reviewId: string, editedContent: string) => void;
    onDelete: (reviewId: string) => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, onReply, onEdit, onDelete }) => {
    const [showReplies, setShowReplies] = useState(false);
    const [reply, setReply] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(review.content);
    const [isAlertOpen, setAlertOpen] = useState(false);
    const cancelRef = React.useRef<HTMLButtonElement>(null);

    const handleReply = async (content: string) => {
        try {
            const response = await axios.post(`/api/community/reviews`, { content, parentReview: review.id });
            onReply(response.data, review.id);
            setReply(false);
        } catch (error) {
            console.error('Failed to create reply: ', error);
        }
    };
    const handleEdit = async () => {
        if (isEditing) {
            try {
                await axios.put(`/api/community/reviews/${review.id}`, { content: editedContent });
                onEdit(review.id, editedContent);
                setIsEditing(false);
            } catch (error) {
                console.error("Failed to edit review: ", error);
            }
        } else {
            setIsEditing(true);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/community/reviews/${review.id}`);
            onDelete(review.id);
            console.log("Review is deleted.", review.id);
        } catch (error) {
            console.error("Failed to delete review: ", error);
        } finally {
            setAlertOpen(false);
        }
    };

    return (
        <Box ml="5" mt="2" >
            <HStack align= "start" mb="4" spacing="2">
                <Avatar name={review.author.username} src={review.author.src} />
                <VStack spacing="2" align="start" w="full">
                    <HStack width="full">
                        <Box borderWidth= "1px" p="2"borderRadius="lg" bg="base.50" width="600px">
                            <HStack justifyContent="space-between" alignItems="center">
                                <Text fontWeight="bold" mb="2">{review.author.username}</Text>
                                {isEditing  && (
                                    <IconButton variant="normal" color={theme.colors.palette_purple} icon={<FaTimes />} size="sm" onClick={() => { setIsEditing(false); setEditedContent(review.content); }} aria-label="Cancel" />
                                )}
                            </HStack>
                            {isEditing ? (
                                <Box position="relative">
                                    
                                    <Textarea value={editedContent} onChange={(e) => setEditedContent(e.target.value)} />
                                    <Box position="absolute" bottom="1" right="0">
                                        <IconButton variant="normal" color={theme.colors.palette_purple} icon={<IoIosSend />} onClick={handleEdit} aria-label="Save"/>
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
                                <MenuItem icon={<WarningTwoIcon />}>
                                    Report
                                </MenuItem>
                                <MenuItem icon={<DeleteIcon />} onClick={() => setAlertOpen(true)}>
                                    Delete
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    </HStack>
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
                        <ReviewCard key={childReview.id} review={childReview} onReply={onReply} onEdit={onEdit} onDelete={onDelete} />
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
                        <ReviewCard key={childReview.id} review={childReview} onReply={onReply}  onEdit={onEdit} onDelete={onDelete} />
                        ))}
                </Box>
            )}
            <AlertDialog
                isOpen={isAlertOpen}
                leastDestructiveRef={cancelRef}
                onClose={() => setAlertOpen(false)}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Delete Comment?
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Are you sure to delete this comment?
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button variant="outline" ref={cancelRef} onClick={() => setAlertOpen(false)}>
                                No
                            </Button>
                            <Button onClick={handleDelete} ml={2}>
                                Yes
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Box>
    )
};

export default ReviewCard;
