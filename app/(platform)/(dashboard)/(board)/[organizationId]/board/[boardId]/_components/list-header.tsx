"use client";
import { useRef, useState, ComponentRef, RefObject } from "react";
import * as z from "zod";
import { toast } from "sonner";
import { List } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

import { UpdateListSchema } from "@/features/lists/schemas";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUpdateList } from "@/features/lists/api/use-update-list";
import { useOrganizationId } from "@/features/organizations/hooks/use-organization-id";
import { useBoardId } from "@/features/boards/hooks/use-board-id";
import { ListOptions } from "./list-options";

interface ListHeaderProps {
  data: List;
}

export const ListHeader = ({ data }: ListHeaderProps) => {

  const formRef = useRef<ComponentRef<"form">>(null) as RefObject<HTMLFormElement>;
  const [isEditing, setIsEditing] = useState(false);

  const organizationId = useOrganizationId();
  const boardId = useBoardId();

  const { mutate: updateList, isPending: isUpdatingList } = useUpdateList({
    boardId,
    organizationId,
    listId: data.id
  });

  const form = useForm<z.infer<typeof UpdateListSchema>>({
    resolver: zodResolver(UpdateListSchema),
    defaultValues: {
      title: data.title
    }
  });

  const handleUpdate = (values: z.infer<typeof UpdateListSchema>) => {
    updateList({
      form: {
        title: values.title
      }
    }, {
      onSuccess: () => {
        toast.success(`List ${values.title} updated successfully`);
        disableEditing();
        form.reset();
      },
      onError: () => {
        toast.error("Failed to update list");
      }
    })
  }

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => form.setFocus("title"));
  }

  const disableEditing = () => {
    setIsEditing(false);
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if(e.key === "Escape") {
      form.handleSubmit(handleUpdate)
    };
  }

  useEventListener("keydown", onKeyDown);
  useOnClickOutside(formRef, disableEditing);

  return (
    <div className="pt-2 px-2 text-sm font-semibold flex justify-between items-start gap-x-2">
      {isEditing ? (
        <Form {...form}>
          <form
            ref={formRef}
            onSubmit={form.handleSubmit(handleUpdate)}
            className="w-full"
          >
            <FormField 
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isUpdatingList}
                      className="text-sm px-[7px] py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition truncate bg-transparent focus:bg-white w-full shadow-none"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
      ): (
        <div
          onClick={enableEditing}
          className="w-full text-sm px-2.5 py-1 h-7 font-medium border-transparent"
        >
          {data.title}
        </div>
      )}
      <ListOptions 
        onAddCard={() => {}}
        data={data}
      />
    </div>
  )
}