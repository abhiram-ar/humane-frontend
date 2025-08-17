import { CombinedNotificationWithActionableUser } from "./CombinedNotiWithActionableUser";

export  type GetRecentNotificationResponse = {
  success: boolean;
  message: string;
  data: {
    noti: CombinedNotificationWithActionableUser[];
    pagination: {
      from?: string | null;
      hasmore: boolean;
    };
  };
};