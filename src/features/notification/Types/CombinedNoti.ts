import { FriendReqAcceptedNotification } from "./FriendReqAcceptedNoti";
import { FriendReqNotification } from "./FriendReqNoti";
import { PostGotCommentNotification } from "./PostGotCommnetNotification";

export type CombinedNotification =
  | FriendReqNotification
  | FriendReqAcceptedNotification
  | PostGotCommentNotification;

export type CombinedNotificationType = CombinedNotification["type"];
