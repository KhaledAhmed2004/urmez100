import { INotification } from './notification.interface';
import { Notification } from './notification.model';
import { User } from '../user/user.model';
import { pushNotificationHelper } from './pushNotificationHelper';

export const sendNotifications = async (data: Partial<INotification>): Promise<any> => {
  const user = await User.findById(data?.userId);

  // Extract raw token strings from the deviceTokens sub-document array.
  const tokens = Array.isArray(user?.deviceTokens)
    ? user!.deviceTokens.map(entry => entry?.token).filter(Boolean) as string[]
    : [];

  if (tokens.length > 0) {
    const message = {
      notification: {
        title: data?.title || 'Notification',
        body: data?.subtitle || data?.title || '',
      },
      tokens,
    };

    try {
      await pushNotificationHelper.sendPushNotifications(message);
    } catch (error) {
      console.error('Failed to send push notification:', error);
    }
  }

  return { success: true };
};

