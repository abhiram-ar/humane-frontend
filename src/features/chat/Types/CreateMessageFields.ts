import { z } from "zod";

export const createMessageSchema = z.object({
  message: z.string().trim().nonempty(),
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
});
export type CreateMessageFields = z.infer<typeof createMessageSchema>;