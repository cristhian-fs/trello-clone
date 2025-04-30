import * as z from "zod";

export const CreateListSchema = z.object({
  title: z.string({
    required_error: "Title is required",
    invalid_type_error: "Title must be a string",
  }).min(2, {
    message: "Minimum 2 characters required",
  }),
});

export const UpdateListSchema = z.object({
  title: z.string().min(2, {
    message: "Minimum 2 characters required",
  })
})

export const UpdateListOrder = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      order: z.number(),
      createdAt: z.union([z.string(), z.date()]).transform(val => new Date(val)),
      updatedAt: z.union([z.string(), z.date()]).transform(val => new Date(val)),
    })
  ),
})

export const UpdateCardsOrder = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      order: z.number(),
      listId: z.string(),
      createdAt: z.union([z.string(), z.date()]).transform(val => new Date(val)),
      updatedAt: z.union([z.string(), z.date()]).transform(val => new Date(val)),
    })
  )
})