export type GetPresignedURLResponse = {
  success: boolean;
  message: string;
  data: {
    preSignedURL: string;
  };
};
