export const conversationTypes = {
  ONE_TO_ONE: "one-to-one",
  GROUP: "group",
} as const;

export type BaseConverstion = {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  participants: {
    userId: string;
    joinedAt: Date;
    lastOpenedAt: Date;
    clearedAt?: Date;
  }[];
};

export type OneToOneConversation = BaseConverstion & {
  type: typeof conversationTypes.ONE_TO_ONE;
};

export type GroupConversation = BaseConverstion & {
  type: typeof conversationTypes.GROUP;
  groupName: string; // only for groups
  groupPicKey?: string; // only for groups
};

export type Conversation = OneToOneConversation | GroupConversation;
