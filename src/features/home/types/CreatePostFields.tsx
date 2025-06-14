import z from "zod";

export const createPostSchema = z.object({
  content: z.string().trim().nonempty("Cannot be empty").max(256, "max 256 chars"),
  visibility: z.enum(["friends", "public"]),
  poster: z
    .any()
    .optional()
    .refine(
      (file) => !file || file.length === 0 || file[0]?.type?.startsWith("image/"),
      "File must be an image",
    )
    .refine(
      (file) => !file || file.length === 0 || file[0]?.size <= 5 * 1024 * 1024,
      "Max file size is 5MB",
    ),
});
export type CreatePostFields = z.infer<typeof createPostSchema>;
