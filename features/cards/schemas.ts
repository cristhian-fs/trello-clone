import * as z from "zod";

export const CreateCardSchema = z.object({
  title: z.string({
    required_error: "Title is required",
    invalid_type_error: "Title must be a string",
  }).min(2, {
    message: "Minimum 2 characters required",
  }),
});

export const UpdateCardSchema = z.object({
  description: z.optional(
      z.string({
      required_error: "Description is required",
      invalid_type_error: "Description must be a string",
    }).min(3, {
      message: "Minimum 3 characters required",
    })
  ),
  title: z.optional(
    z.string({
      required_error: "Title is required",
      invalid_type_error: "Title must be a string",
    }).min(2,{
      message: "Title is too short"
    })
  )
})