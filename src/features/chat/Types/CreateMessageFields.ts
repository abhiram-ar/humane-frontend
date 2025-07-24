import { z } from "zod";

export const createMessageSchema = z.object({
  message: z.string().trim(),
  attachment: z
    .any()
    .optional()
    .refine(
      (file) =>
        !file ||
        file.length === 0 ||
        file[0]?.type?.startsWith("image/") ||
        file[0]?.type?.startsWith("video/"),
      "File must be an image or a video",
    )
    .refine(
      (file) => !file || file.length === 0 || file[0]?.size <= 10 * 1024 * 1024,
      "Max file size is 10MB",
    ),
}).refine(
  (data) =>
    (data.message && data.message.length > 0) ||
    (data.attachment && data.attachment.length > 0),
  {
    message: "Message is required if there is no attachment",
    path: ["message"],
  }
);
export type CreateMessageFields = z.infer<typeof createMessageSchema>;