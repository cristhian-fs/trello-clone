"use client"
import { Button } from "@/components/ui/button";
import { 
  Popover  ,
  PopoverClose,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { useDeleteBoard } from "@/features/boards/api/use-delete-board";
import { Board } from "@prisma/client";
import { MoreHorizontal, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface BoardOptionsProps{
  data: Board;
}

export const BoardOptions = ({ data }: BoardOptionsProps) => {

  const { mutate, isPending } = useDeleteBoard({ organizationId: data.organizationId });
  const router = useRouter();

  const handleDelete = () => mutate({ 
    param: { boardId: data.id, organizationId: data.organizationId },
  }, {
    onSuccess() {
      toast.success("Board deleted successfully");
      router.replace(`/organization/${data.organizationId}`);
    },
    onError() {
      toast.error("Failed to delete board");
    }
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="transparent"
          className="size-auto p-2"
        >
          <MoreHorizontal className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="px-0 py-3"
        side="bottom"
        align="end"
      >
        <div className="text-sm font-medium text-neutral-600 text-center pb-4">
          Board actions
        </div>
        <PopoverClose asChild>
          <Button className="size-auto p-2 absolute top-2 right-2 text-neutral-600" variant="ghost">
            <XIcon className="size-4" />
          </Button>
        </PopoverClose>
        <Button
          onClick={handleDelete}
          variant="ghost"
          disabled={isPending}
          className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
        >
          Delete this board
        </Button>
      </PopoverContent>
    </Popover>
  )
}