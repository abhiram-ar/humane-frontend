import { CombinedNotification } from "./CombinedNoti";

export type BasicUserDetails = {
  id: string;
  firstName: string;
  lastName?: string | null;
  avatarURL?: string | null;
};

export type ActionableUser = {
  actionableUser?: BasicUserDetails;
};

export type CombinedNotificationWithActionableUser = CombinedNotification & ActionableUser;
