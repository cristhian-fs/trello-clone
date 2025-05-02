import * as z from "zod";
import { AlignLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ComponentRef, RefObject, useRef, useState } from "react";

import { CardWithListTitle } from "@/types";
import { UpdateCardSchema } from "@/features/cards/schemas";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { useUpdateCard } from "@/features/cards/api/use-update-card";
import { useOrganizationId } from "@/features/organizations/hooks/use-organization-id";
import { toast } from "sonner";
import { useBoardId } from "@/features/boards/hooks/use-board-id";


interface DescriptionProps {
  data: CardWithListTitle;
}

export const Description = ({
  data
}: DescriptionProps) => {

  const [isEditing, setIsEditing] = useState(false);

  const textareaRef = useRef<ComponentRef<"textarea">>(null) as RefObject<HTMLTextAreaElement>;
  const formRef = useRef<ComponentRef<"form">>(null) as RefObject<HTMLFormElement>;

  const form = useForm<z.infer<typeof UpdateCardSchema>>({
    resolver: zodResolver(UpdateCardSchema),
    defaultValues: {
      description: data.description || ""
    }
  });
  const boardId = useBoardId();
  const organizationId = useOrganizationId();
  const { mutate: updateCard } = useUpdateCard({
    cardId: data.id,
    organizationId,
    boardId
  });

  const handleUpdateDescription = (values: z.infer<typeof UpdateCardSchema>) => {
    updateCard({form: values}, {
      onSuccess: () => {
        toast.success(`Card "${data.title}" updated successfully`);
        setIsEditing(false);
      },
      onError: () => {
        toast.error("Failed to update card");
      }
    });
  }

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => textareaRef.current?.focus());
  };

  const disableEditing = () => setIsEditing(false);

  const onKeyDown = (e: KeyboardEvent) => {
    if(e.key === "Escape") disableEditing();
  };

  useEventListener("keydown", onKeyDown);
  useOnClickOutside(formRef, disableEditing);

  return (
    <div className="flex items-start gap-x-3 w-full">
      <AlignLeft className="size-5 mt-0.5 text-neutral-700" />
      <div className="w-full">
        <p className="font-semibold text-neutral-700 mb-2">Description</p>
        {isEditing ? (
          <Form {...form}>
            <form 
              ref={formRef} 
              className="space-y-4"
              onSubmit={form.handleSubmit(handleUpdateDescription)}
            >
              <FormField 
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea 
                        {...field}
                        ref={textareaRef}
                        placeholder="Add a more detailed description"
                        rows={2}
                        className="resize-none focus-visible:ring-0 focus-visible:ring-offset-0 ring-0 focus:ring-0 outline-none shadow-sm border-ring border min-h-[78px]"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex items-center justify-start gap-x-2">
                <Button type="submit" variant="primary" size="sm">
                  Save
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={disableEditing}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        ): (
          <div
            role="button"
            onClick={enableEditing}
            className="min-h-[78px] bg-neutral-200 text-sm font-medium py-3 px-3.5 rounded-md"
          >
            {data.description || "Add a more detailed description"}
          </div>
        )}
      </div>
    </div>
  )
}

Description.Skeleton = function DescriptionSkeleton(){
  return (
    <div className="flex items-start gap-x-3 w-full">
      <Skeleton className="h-6 w-6 bg-neutral-200"/>
      <div className="w-full">
        <Skeleton className="h-6 w-24 mb-2 bg-neutral-200"/>
        <Skeleton className="w-full h-[78px] bg-neutral-200"/>
      </div>
    </div>
  )
}