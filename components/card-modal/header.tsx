import { Layout } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { CardWithListTitle } from "@/types"

import { Skeleton } from "../ui/skeleton"
import { Form, FormControl, FormField, FormItem } from "../ui/form"
import { UpdateCardSchema } from "@/features/cards/schemas";
import { Input } from "../ui/input";
import { useUpdateCard } from "@/features/cards/api/use-update-card";
import { useOrganizationId } from "@/features/organizations/hooks/use-organization-id";
import { toast } from "sonner";
import { useBoardId } from "@/features/boards/hooks/use-board-id";

interface HeaderProps {
  data: CardWithListTitle
}

export const Header = ({ data }: HeaderProps) => {

  const form = useForm<z.infer<typeof UpdateCardSchema>>({
    resolver: zodResolver(UpdateCardSchema),
    defaultValues: {
      title: data.title
    }
  });

  const boardId = useBoardId();
  const organizationId = useOrganizationId();
  const { mutate: updateCard } = useUpdateCard({
    organizationId,
    cardId: data.id,
    boardId
  });

  const handleNameUpdate = (values: z.infer<typeof UpdateCardSchema>) => {
    updateCard({
      form: values
    }, {
      onSuccess: ({data}) => {
        toast.success(`Card name change to "${data?.title}"`);
      },
      onError: () => {
        toast.error("Failed to update card name");
      }
    });
  }

  return (
    <div className="flex items-start gap-x-3 mb-6 w-full">
      <Layout className="size-5 mt-2 text-neutral-700" />
      <div className="w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleNameUpdate)}>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      className="font-semibold text-xl md:text-xl px-1 text-neutral-700 bg-transparent border-transparent relative -left-1.5 w-[95%] focus-visible:bg-white focus-visible:border-input mb-0.5 focus-visible:ring-[1px] truncate shadow-none"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
        <p className="text-sm text-muted-foreground">in list <span className="underline">{data.list.title}</span></p>
      </div>
    </div>
  )
}

Header.Skeleton = function HeaderSkeleton(){
  return (
    <div className="flex items-start gap-x-3 mb-6">
      <Skeleton className="size-6 mt-1 bg-neutral-200" />
      <div>
        <Skeleton className="w-24 h-6 mb-1 bg-neutral-200" />
        <Skeleton className="w-12 h-6 bg-neutral-200" />
      </div>
    </div>
  )
}