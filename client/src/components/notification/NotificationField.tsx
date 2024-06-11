import { Text, HStack, VStack, Icon, Box, StackProps, TextProps, Stack } from '@chakra-ui/react';
import React from 'react';
import { NotificationType } from '../../pages/Notification.tsx';
import { Dot } from 'lucide-react';
import parseDate from '../../utils/parseDate.tsx';

interface NotificationFieldProps extends StackProps {
  isRead: boolean;
  notification: NotificationType;
  headerProps?: TextProps;
  bodyProps?: TextProps;
}

const NotificationField: React.FC<NotificationFieldProps> = ({
  notification,
  isRead,
  headerProps,
  bodyProps,
  ...containerProps
}) => {
  const { header, body, date } = notification;
  return (
    <Stack {...containerProps}>
      {isRead ? <Icon as={Dot} boxSize={14} color="transparent" /> : <Icon as={Dot} boxSize={14} color="teal" />}
      <VStack alignItems="start">
        <Text {...headerProps}>{header}</Text>
        <Text {...bodyProps}>{body}</Text>
        <Text {...bodyProps}>{parseDate(date)}</Text>
      </VStack>
    </Stack>
  );
};
export default NotificationField;
