"use client"

import Link from "next/link";
import Image from "next/image";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { useGetUnsplashImages } from "../api/use-get-unsplash-images";
import { CreateBoardSchema } from "../schemas";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCreateBoard } from "../api/use-create-board";
import { useOrganizationId } from "@/features/organizations/hooks/use-organization-id";
import { toast } from "sonner";

export const CreateBoardForm = () => {
  const { data: images} = useGetUnsplashImages();
  const organizationId = useOrganizationId();
  const { mutate: createBoard, isPending } = useCreateBoard();

  const form = useForm<z.infer<typeof CreateBoardSchema>>({
    resolver: zodResolver(CreateBoardSchema),
    defaultValues: {
      image: "",
      title: "",
    }
  });

  const handleSubmit = (values: z.infer<typeof CreateBoardSchema>) => {
    const { image, title } = values;

    const selectedImage = images?.find((img) => img.id === image);

    if (!selectedImage) {
      console.error("Selected image not found!");
      return;
    }

    const finalString = `${selectedImage.id}|${selectedImage.urls.thumb}|${selectedImage.urls.full}|${selectedImage.links.html}|${selectedImage.user.name}`;

    createBoard({ form: { title, image: finalString }, param: { organizationId } }, {
      onSuccess: () => {
        toast.success("Board created successfully");
      },
      onError(error) {
        toast.error(error.message);
      },
    });
  }

  return (
    <div className="relative">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField 
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                  <FormLabel>Choose an image</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="grid grid-cols-3 gap-2"
                  >
                    {images?.map((image) => (
                      <FormItem key={image.id}>
                        <FormLabel
                          className={cn(
                            "relative aspect-video rounded-md overflow-hidden cursor-pointer group",
                            field.value === image.id && "ring-2 ring-primary"
                          )}
                        >
                          <FormControl>
                            <RadioGroupItem 
                              value={image.id} 
                              className="hidden" 
                            />
                          </FormControl>
                          <Image
                            src={image.urls.thumb}
                            alt={image.alt_description || ""}
                            className="object-cover size-full"
                            fill
                          />
                          <Link
                            href={image.links.html}
                            target="_blank"
                            className="opacity-0 group-hover:opacity-100 absolute bottom-0 w-full text-[10px] truncate text-white hover:underline p-1 bg-black/50"
                          >
                            {image.user.name}
                          </Link>
                          {field.value === image.id && (
                            <div className="absolute inset-0 size-full z-10 bg-black/50 flex items-center justify-center">
                              <CheckIcon className="size-4 text-white" />
                            </div>
                          )}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField 
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Board title</FormLabel>
                <FormControl>
                  <Input 
                    {...field}
                    disabled={isPending}
                    placeholder="Board title"
                    type="text"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button 
            variant="primary" 
            type="submit" 
            className="w-full"
            disabled={isPending}
          >
            Create
          </Button>
        </form>
      </Form>
    </div>
  )
}