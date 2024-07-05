import {
    Card,
    CardBody,
    CardBodyProps,
    CardFooter,
    CardFooterProps,
    CardHeader,
    CardHeaderProps,
    Heading,
    StackProps,
    Text,
    VStack,
} from '@chakra-ui/react';
import { forwardRef, useState } from 'react';
import { ImageSlider, PostFooter, PostHeader } from './index';
import { BasePostProps, PostObjectType } from './types';

interface PostProps extends StackProps, BasePostProps {
    postData: PostObjectType;
    headerProps?: CardHeaderProps;
    bodyProps?: CardBodyProps;
    footerProps?: CardFooterProps;
}

const Post = forwardRef<HTMLDivElement, PostProps>(
    ({ postData, headerProps, bodyProps, footerProps, postId, ...containerProps }, ref) => {
        // console.log(postData);
        // const theme = useTheme();

        // const auth = useAuth();
        // const posts = useSelector(selectPosts);
        // const post = postIndex ? posts[postIndex] : null; // Get post data from redux state
        const [loading, setLoading] = useState(false);

        return (
            <Card
                {...containerProps}
                ref={ref}
                backdropBlur={loading && 'blur(10px)'}
                pointerEvents={loading ? 'none' : 'auto'}
                opacity={loading ? 0.5 : 1}
            >
                <CardHeader paddingBottom={0} {...headerProps}>
                    <PostHeader postData={postData} postId={postData.id} setLoading={setLoading} isFullPage={false} />
                </CardHeader>

                <CardBody {...bodyProps}>
                    <VStack gap={2} alignItems="start" marginBottom={2}>
                        <Heading size="lg" fontWeight={500}>
                            {postData.header}
                        </Heading>
                        <Text>{postData.body}</Text>
                    </VStack>
                    {postData.media.length && postData.media.length > 0 ? (
                        <ImageSlider action="direct" slides={postData.media} postId={postId} postData={postData} />
                    ) : null}
                </CardBody>
                <CardFooter {...footerProps}>
                    <PostFooter postData={postData} postId={postData.id} setLoading={setLoading} />
                </CardFooter>
            </Card>
        );
    },
);

export default Post;
