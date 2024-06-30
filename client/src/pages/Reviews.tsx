import { Box, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import ReviewCard, { Review } from '../components/community/ReviewCard.tsx';
import ReviewForm from '../components/form/ReviewForm';
import customFetch from '../utils/customFetch';

const Reviews: React.FC = () => {
    const [reviews, setReviews] = useState<Review[]>([]);

    const handleNewComment = async ( id: string, postId: string , content: string, username: string, src: string, parentReviewId: string | null) => {
        // const response = await customFetch.post(`/community/reviews/667506f3f7364781a6092dd0`, {
        //     content: content,
        //     parentReview: null,
        // });

        // if (!response.data) {
        //     console.log('Error creating new comment');
        //     return;
        // }

        const newReview: Review = {
            id: id,
            postId: '667506f3f7364781a6092dd0',
            userId: '667e21869a6c52b299ed239e',
            author: {
                username: username,
                src: src,
            },
            content: content,
            timestamp: new Date().toISOString(),
            children: [],
        };
        
        setReviews([...reviews, newReview]);
        
    };

    const handleReply = async(id: string, postId: string, content: string, username: string, src: string, parentReviewId: string | null) => {
        // const response = await customFetch.post(`/community/reviews/667506f3f7364781a6092dd0`, {
        //     content: content,
        //     parentReview: parentReviewId,
        // });

        // if (!response.data) {
        //     console.log('Error creating review');
        //     return;
        // }

        // const {_id, username, src, content: replyContent} = response.data;

        // const newReply: Review = {
        //     id: id,
        //     postId: '667506f3f7364781a6092dd0',
        //     userId: '667e21869a6c52b299ed239e',
        //     author: {
        //         username: username,
        //         src: src,
        //     },
        //     content: content,
        //     timestamp: new Date().toISOString(),
        //     children: [],
        // }
        // console.log( 'newReply', newReply);

        const addReply = (reviews: Review[]): Review[] => {
        return reviews.map((review) => {
            if (review.id === parentReviewId) {
            return {
                ...review,
                children: [...review.children
                // {
                //     id: `${Math.random()}`,
                //     postId: `1`,
                //     author: { username: 'New User', src: 'path_to_avatar.jpg' },
                //     content,
                //     timestamp: new Date().toISOString(),
                //     children: [],
                // },
                ],
            };
            }
            return {
            ...review,
            children: addReply(review.children),
            };
        });
        };
        setReviews(addReply(reviews));
    };

    const handleEdit = (reviewId: string, editedContent: string) => {
        setReviews((prevReviews) =>
        prevReviews.map((review) => (review.id === reviewId ? { ...review, content: editedContent } : review)),
        );
    };

    const handleDelete = (reviewId: string) => {
        const deletedReview = (reviews: Review[]): Review[] => {
        return reviews
            .map((review) => ({
            ...review,
            children: deletedReview(review.children),
            }))
            .filter((review) => review.id !== reviewId);
        };
        setReviews(deletedReview(reviews));
    };

    return (
        <VStack>
            <Box>
                {reviews.map((review) => (
                <ReviewCard
                    key={review.id}
                    review={review}
                    onReply={handleReply}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
                ))}
            </Box>
            <ReviewForm postId='667506f3f7364781a6092dd0' userId='667e21869a6c52b299ed239e' avatar={{ username: 'User', src: '' }} onSubmit={handleNewComment} parentReviewId={null}  />

        {/* <Box>
                    {comments.map((review) => (
                    <ReviewCard key={review.id} review={review} onReply={handleReply} />
                    ))}
                    <Box ml="5" mt="2">
                    <ReviewForm
                        onSubmit={handleNewComment}
                        avatar={{ username: 'New User', src: 'path_to_new_user_avatar.jpg' }}
                    />
                    </Box>
                </Box> */}
        </VStack>
    );
};
export default Reviews;








// const mockComments: Review[] = [
//     {
//         id: '001',
//         postId: '32420325',
//         author: {
//         username: 'Alex B',
//         src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0WU10MyuUxOw4QSiIEzWPZn3sfytEl7Z4RA&s',
//         },
//         content: 'Parent comment.',
//         timestamp: '2024-02-06T17:30:00Z',
//         children: [
//         {
//             id: '002',
//             postId: '324203235',
//             author: {
//             username: 'Bill K',
//             src: 'https://akns-images.eonline.com/eol_images/Entire_Site/2023013/rs_1024x759-230113124412-1024-Phineas-and-Ferb-perry.ct.jpg?fit=around%7C1024:759&output-quality=90&crop=1024:759;center,top',
//             },
//             content: 'First child comment',
//             timestamp: '2024-02-07T10:30:00Z',
//             children: [],
//         },
//         {
//             id: '003',
//             postId: '984203235',
//             author: {
//             username: 'Celine',
//             src: 'https://facts.net/wp-content/uploads/2023/09/22-facts-about-bubbles-the-powerpuff-girls-1694408222.jpg',
//             },
//             content: 'Second child comment',
//             timestamp: '2024-02-07T10:30:00Z',
//             children: [],
//         },
//         {
//             id: '004',
//             postId: '945603235',
//             author: {
//             username: 'Jay M',
//             src: 'https://i.scdn.co/image/ab6761610000e5eb7ac3385e1033229ea480dc9d',
//             },
//             content: 'Third child comment',
//             timestamp: '2024-02-07T10:30:00Z',
//             children: [],
//         },
//         {
//             id: '005',
//             postId: '',
//             author: {
//             username: 'Calvin',
//             src: '',
//             },
//             content: 'Forth child comment',
//             timestamp: '2024-02-08T12:45:00Z',
//             children: [],
//         },
//         ],
//     },
// ];