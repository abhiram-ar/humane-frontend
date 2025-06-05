export const FRIEND_REQ_NOTIFICATION_TYPE = "friend-req";
export const FriendReqStatus = {
  ACCEPTED: "ACCEPTED",
  PENDING: "PENDING",
  DECLINED: "DECLINED",
} as const;

export interface FriendReqNotification {
  reciverId: string;
  actorId: string;
  entityId: string;
  metadata: {
    reqStatus: (typeof FriendReqStatus)[keyof typeof FriendReqStatus];
  };
  type: typeof FRIEND_REQ_NOTIFICATION_TYPE;
  id: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}
