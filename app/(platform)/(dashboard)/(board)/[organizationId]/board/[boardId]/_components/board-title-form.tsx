"use client";
import { ComponentRef, RefObject, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Board } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { UpdateBoardSchema } from "@/features/boards/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useUpdateBoard } from "@/features/boards/api/use-update-board";
import { toast } from "sonner";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

interface BoardTitleFormProps {
  data: Board;
}

export const BoardTitleForm = ({
  data
}: BoardTitleFormProps) => {

  const formRef = useRef<ComponentRef<"form">>(null) as RefObject<HTMLFormElement>;

  const [isEditing, setIsEditing] = useState(false);
  const { mutate: updateBoard, isPending: isUpdatingBoard } = useUpdateBoard({ boardId: data.id, organizationId: data.organizationId });

  const enableEditing = () => {
    setIsEditing(true);
  }

  const form = useForm<z.infer<typeof UpdateBoardSchema>>({
    resolver: zodResolver(UpdateBoardSchema),
    defaultValues: {
      title: data.title
    }
  });

  const handleSubmit = (values: z.infer<typeof UpdateBoardSchema>) => {
    updateBoard({
      form: {
        title: values.title
      }
    }, {
      onSuccess({ data }) {
        form.reset();
        toast.success(`Board ${data?.title} updated successfully`);
      },
      onError() {
        toast.error("Failed to update board");
      }
    })
    setIsEditing(false);
  }

  const disabledEditing = () => {
    setIsEditing(false);
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if(e.key === "Escape") disabledEditing();
  }

  useEventListener("keydown", onKeyDown);
  useOnClickOutside(formRef, disabledEditing)

  if(isEditing){
    return (
      <Form {...form}>
        <form
          ref={formRef}
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <FormField 
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    disabled={isUpdatingBoard}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
    )
  }

  return (
    <Button
      onClick={enableEditing}
      variant="transparent"
      className="font-bold text-lg h-auto w-auto p-1 px-2"
    >
      {data.title}
    </Button>
  )
}