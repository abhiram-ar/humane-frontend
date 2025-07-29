import z from "zod";

export const sendOneToOneMessageSchema = z.object({
  to: z.string(),
  message: z.string(),
  attachment: z
    .object({
      attachmentType: z.string().nonempty(),
      attachmentKey: z.string().nonempty(),
    })
    .optional(),
});

export type SendOneToOneMessageInputDTO = z.infer<typeof sendOneToOneMessageSchema>;
