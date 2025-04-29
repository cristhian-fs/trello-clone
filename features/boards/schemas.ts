import * as z from "zod";

export const CreateBoardSchema = z.object({
  title: z.string().min(3, {
    message: "Minimum 3 characters required",
  }),
  image: z.string()
});

export const UpdateBoardSchema = z.object({
  title: z.string().min(3,{
    message: "Minimum 3 characters required",
  })
})