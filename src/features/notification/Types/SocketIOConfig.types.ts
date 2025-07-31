import { CombinedNotification } from "./CombinedNoti";

export interface ServerToClientEvents {
  test: (msg: string) => void;
  "push-noti": (noti: CombinedNotification) => void;
  "remove-noti": (noti: CombinedNotification) => void;
  "update-noti": (noti: CombinedNotification) => void;
  "user-rewarded": (amount: number, rewardedAt: string) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

export interface ClientToServerEvents {
  hello: () => void;
}
