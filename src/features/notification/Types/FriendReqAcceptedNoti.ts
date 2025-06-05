export const FRIEND_REQ_ACCEPTED_NOTIFICATION_TYPE = "friend-req.accepted";

export interface FriendReqAcceptedNotification {
  reciverId: string;
  actorId: string;
  entityId: string;
  metadata: {
    reqStatus: "ACCEPTED";
  };
  type: typeof FRIEND_REQ_ACCEPTED_NOTIFICATION_TYPE;
  id?: string;
  isRead?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
