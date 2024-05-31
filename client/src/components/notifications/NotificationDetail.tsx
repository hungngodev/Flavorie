import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import useNotification from "../../hooks/useNotification";
import { Box, Heading, VStack, Text} from "@chakra-ui/react";

const NotificationDetail: React.FC = () => {
    const {id} = useParams()
    const {notificationDetail, fetchNotificationById} = useNotification()

    useEffect(() => {
        if (id){
            fetchNotificationById(id)
        }
    }, [id, fetchNotificationById])

    

    return (
        <Box p={4} maxW="md" mx="auto" bg="gray.50" borderRadius="md" boxShadow="md">
        {notificationDetail ? (
            <>
                <Heading size="lg" mb={4} textAlign="center">
                    {notificationDetail.message.title}
                </Heading>
                <VStack spacing={4} align="stretch">
                    <Text>{JSON.stringify(notificationDetail.message.data, null, 2)}</Text>
                </VStack>
            </>
        ) : (
            <Heading size="md" textAlign="center">Loading...</Heading>
        )}
    </Box>
    )
}
export default NotificationDetail