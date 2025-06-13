import z from "zod";

export const commentSchema = z.object({ content: z.string().trim().nonempty() });
export type commentFields = z.infer<typeof commentSchema>;
