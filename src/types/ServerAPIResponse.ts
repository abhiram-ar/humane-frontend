export type ServerAPIResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};
