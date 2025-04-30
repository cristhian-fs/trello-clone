import * as z from "zod";

export const CreateCardSchema = z.object({
  title: z.string({
    required_error: "Title is required",
    invalid_type_error: "Title must be a string",
  }).min(2, {
    message: "Minimum 2 characters required",
  }),
});