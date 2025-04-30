"use client"

import { useState, 
  useRef, 
  ComponentRef,
  RefObject
} from "react";

import * as z from "zod";
import { PlusIcon, XIcon } from "lucide-react"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { CreateListSchema } from "@/features/lists/schemas";
import { ListWrapper } from "./list-wrapper"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateList } from "@/features/lists/api/use-create-list";
import { useOrganizationId } from "@/features/organizations/hooks/use-organization-id";
import { useBoardId } from "@/features/boards/hooks/use-board-id";
import { toast } from "sonner";

export const ListForm = () => {

  const organizationId = useOrganizationId();
  const boardId = useBoardId();
  const formRef = useRef<ComponentRef<"form">>(null) as RefObject<HTMLFormElement>;

  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<z.infer<typeof CreateListSchema>>({
    resolver: zodResolver(CreateListSchema),
    defaultValues: {
      title: ""
    }
  })

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => form.setFocus("title"));
  };

  const disableEditing = () => [
    setIsEditing(false)
  ]

  const onKeyDown = (e: KeyboardEvent) => {
    if(e.key === "Escape") disableEditing();
  }

  useEventListener("keydown", onKeyDown);
  useOnClickOutside(formRef, disableEditing);

  const { mutate, isPending } = useCreateList({
    organizationId,
    boardId
  })

  const handleCreateList = (values: z.infer<typeof CreateListSchema>) => {
    mutate({ form: values }, {
      onSuccess: () => {
        form.reset();
        toast.success("List created successfully");
        disableEditing();
      },
      onError: (error) => {
        toast.error(error.message);
      }
    });
    disableEditing();
  }

  if(isEditing){
    return (
      <ListWrapper>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleCreateList)}
            ref={formRef}
            className="w-full p-3 rounded-md bg-white space-y-4 shadow-md"
          >
            <FormField 
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="text-sm px-2 py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition focus-visible:ring-1 focus-visible:ring-ring/50 focus-visible:outline-1"
                      {...field}
                      placeholder="Enter list title..." 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-1">
              <Button 
                type="submit"
                variant="primary"
                disabled={isPending}
              >
                Add list
              </Button>
              <Button variant="ghost" type="button" onClick={disableEditing}>
                <XIcon className="size-5" />
              </Button>
            </div>
          </form>
        </Form>
      </ListWrapper>
    )
  }
  return (
    <ListWrapper>
      <button
        onClick={enableEditing}
        className="w-full rounded-md bg-white hover:bg-white/50 transition p-3 flex items-center font-medium text-sm"
      >
        <PlusIcon className="size-4 mr-2" />
        Add a list
      </button>
    </ListWrapper>
  )
}