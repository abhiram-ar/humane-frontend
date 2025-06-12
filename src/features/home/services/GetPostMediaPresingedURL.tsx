import { api } from "@/lib/axios";

export type GetPostMediaPresingedURL = {
  message: string;
  data: { preSignedURL: string; key: string };
};

export const getPostMediaPresignedURL = async (file: File) => {
  const res = await api.post<GetPostMediaPresingedURL>("/api/v1/post/pre-signed-url/posterKey", {
    fileName: file.name,
    fileType: file.type,
  });
  return res.data.data;
};
