import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogHeader,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { useCreateOrganizationModal } from "../store/use-create-organization-modal";
import { CreateOrganizationSchema } from "../schemas";
import { Button } from "@/components/ui/button";
import { useCreateOrganization } from "../api/use-create-organization";
import { toast } from "sonner";

export const CreateOrganizationModal = () => {
  const [open, setOpen] = useCreateOrganizationModal();

  const form = useForm<z.infer<typeof CreateOrganizationSchema>>({
    resolver: zodResolver(CreateOrganizationSchema),
    defaultValues: {
      name: "",
      slug: ""
    }
  });

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\s+/g, "-").toLowerCase();

    form.setValue("slug", raw);
  };

  const onClose = () => {
    setOpen(false)
    form.reset();
  }

  const { mutate, isPending } = useCreateOrganization();

  const handleSubmit = (values: z.infer<typeof CreateOrganizationSchema>) => {
    mutate(
      { form: values },
      {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
          if (error.field) {
            form.setError(error.field as keyof typeof values, {
              message: error.message,
            });
          } else{
            toast.error(error.message);
          }
        },
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create an organization</DialogTitle>
          <DialogDescription>
            to continue to trello-clone
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="flex flex-col w-full gap-4"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FormField
              control={form.control} 
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization name</FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      type="text" 
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control} 
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      type="text" 
                      disabled={isPending}
                      onChange={handleSlugChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button 
                variant="ghost" 
                disabled={isPending}
                onClick={onClose}
                type="button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
              >
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}