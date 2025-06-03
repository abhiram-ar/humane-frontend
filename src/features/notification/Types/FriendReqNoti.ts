export const FRIEND_REQ_NOTIFICATION_TYPE = "friend-req";
export type FriendReqStatus = "ACCEPTED" | "PENDING" | "DECLINED";

export interface FriendReqNotification {
  type: typeof FRIEND_REQ_NOTIFICATION_TYPE;
  id: string;
  isRead: boolean;
  updatedAt: string;
  friendshipId: string;
  reciverId: string;
  requesterId: string;
  createdAt: string;
  status: FriendReqStatus;
}
