import { FRIEND_REQ_ACCEPTED_NOTIFICATION_TYPE, FriendReqAcceptedNotification } from "./FriendReqAcceptedNoti";
import { FRIEND_REQ_NOTIFICATION_TYPE, FriendReqNotification } from "./FriendReqNoti";

export type CombinedNotificationType = typeof FRIEND_REQ_NOTIFICATION_TYPE | typeof FRIEND_REQ_ACCEPTED_NOTIFICATION_TYPE
export type CombinedNotification = FriendReqNotification | FriendReqAcceptedNotification
