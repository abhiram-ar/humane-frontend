export type DeleteCommentResponse = {
  data: {
    comment: {
      id: string;
      createdAt: string;
      updatedAt: string;
      authorId: string;
      postId: string;
      content: string;
    };
  };
};
