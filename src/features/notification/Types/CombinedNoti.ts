import { CommentLikesNotification } from "./CommentLikesNotification";
import { FriendReqAcceptedNotification } from "./FriendReqAcceptedNoti";
import { FriendReqNotification } from "./FriendReqNoti";
import { PostGotCommentNotification } from "./PostGotCommnetNotification";
import { PostModerationFailedNotification } from "./PostModerationFailedNotification.entity";
import { PostModerationFlaggedNotification } from "./PostModerationFlaggedNotification.entity";

export type CombinedNotification =
  | FriendReqNotification
  | FriendReqAcceptedNotification
  | PostGotCommentNotification
  | CommentLikesNotification
  | PostModerationFailedNotification
  | PostModerationFlaggedNotification;

export type CombinedNotificationType = CombinedNotification["type"];
