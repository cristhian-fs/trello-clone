"use client";

import { PlusIcon, XIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod";

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CreateCardSchema } from "@/features/cards/schemas"
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateCard } from "@/features/cards/api/use-create-card";
import { useOrganizationId } from "@/features/organizations/hooks/use-organization-id";
import { useBoardId } from "@/features/boards/hooks/use-board-id";
import { toast } from "sonner";
import { ComponentRef, KeyboardEventHandler, RefObject, useRef } from "react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

interface CardFormProps {
  isEditing: boolean
  listId: string
  enableEditing: () => void
  disableEditing: () => void
}

export const CardForm = ({
  listId,
  disableEditing,
  isEditing,
  enableEditing
}: CardFormProps) => {

  const organizationId = useOrganizationId();
  const boardId = useBoardId();

  const formRef = useRef<ComponentRef<"form">>(null) as RefObject<HTMLFormElement>;

  const form = useForm<z.infer<typeof CreateCardSchema>>({
    resolver: zodResolver(CreateCardSchema),
    defaultValues:{
      title: ""
    }
  });

  const { mutate: createCard, isPending } = useCreateCard({ listId, organizationId, boardId });

  const handleCreateCard = (values: z.infer<typeof CreateCardSchema>) => {
    createCard({
      form: values,
    }, {
      onSuccess: () => {
        form.reset();
        toast.success("Card created successfully");
        disableEditing();
      },
      onError: (error) => {
        toast.error(error.message);
      }
    })
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if(e.key === "Escape") disableEditing();
  }

  useEventListener("keydown", onKeyDown);
  useOnClickOutside(formRef, disableEditing);

  const onTextareakeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if(e.key === "Enter" && !e.shiftKey){
      e.preventDefault();
      form.handleSubmit(handleCreateCard)();
    }
  }

  if(isEditing){
    return (
      <div className="pt-2 px-2">
        <Form {...form}>
          <form 
            ref={formRef}
            className="m-1 py-0.5 space-y-4"
            onSubmit={form.handleSubmit(handleCreateCard)}
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <Label 
                    htmlFor="title"
                    className="text-xs font-semibold text-neutral-700"
                  >
                    Title
                  </Label>
                  <FormControl>
                    <Textarea
                      onKeyDown={onTextareakeyDown}
                      {...field}
                      rows={2}
                      className="resize-none focus-visible:ring-0 focus-visible:ring-offset-0 ring-0 focus:ring-0 outline-none shadow-sm border-ring border"
                      placeholder="Enter a title for this card..."
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
                Add card
              </Button>
              <Button onClick={disableEditing} size="sm" variant="ghost">
                <XIcon className="size-5"/>
              </Button>
            </div>
          </form>
        </Form>
      </div>
    )
  }

  return (
    <div className="pt-2 px-2">
      <Button
        onClick={enableEditing}
        className="h-auto px-2 py-1.5 w-full justify-start text-muted-foreground text-sm"
        size="sm"
        variant="ghost"
      >
        <PlusIcon className="size-4 mr-2" />
        Add a card
      </Button>
    </div>
  )
}