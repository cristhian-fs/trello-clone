"use client";

import { List } from "@prisma/client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, XIcon } from "lucide-react";
import { useCopyList } from "@/features/lists/api/use-copy-list";
import { useOrganizationId } from "@/features/organizations/hooks/use-organization-id";
import { toast } from "sonner";
import { useDeleteList } from "@/features/lists/api/use-delete-list";

interface ListOptionsProps {
  data: List;
  onAddCard: () => void;
}

export const ListOptions = ({
  data,
  onAddCard
}: ListOptionsProps) => {

  const organizationId = useOrganizationId();
  const { mutate: copyList, isPending: isCopyingList } = useCopyList({
    boardId: data.boardId,
    organizationId,
    listId: data.id
  });

  const { mutate: deleteList, isPending: isDeletingList } = useDeleteList({
    boardId: data.boardId,
    organizationId,
    listId: data.id
  });

  const handleCopyList = () => {
    copyList({ 
      param: { 
        boardId: data.boardId, 
        organizationId, 
        listId: data.id 
      } 
    }, {
      onSuccess: () => {
        toast.success("List copied successfully");
      },
      onError: () => {
        toast.error(`Failed to copy ${data.title} list`);
      }
    })
  }

  const handleDeleteList = () => {
    deleteList({ 
      param: { 
        boardId: data.boardId, 
        organizationId, 
        listId: data.id 
      } 
    }, {
      onSuccess: () => {
        toast.success("List deleted successfully");
      },
      onError: () => {
        toast.error(`Failed to delete ${data.title} list`);
      }
    })
  }


  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="size-auto p-2" variant="ghost">
          <MoreHorizontal className="size-4"/>
        </Button> 
      </PopoverTrigger>
      <PopoverContent className="px-0 py-3" side="bottom" align="start">
        <div className="text-sm font-medium text-center text-neutral-600 pb-4">List actions</div>
        <PopoverClose asChild>
          <Button 
            className="size-auto p-2 absolute top-2 right-2 text-neutral-600" 
            variant="ghost"
          >
            <XIcon className="size-4"/>
          </Button>
        </PopoverClose>
        <Button 
          onClick={onAddCard}
          className="rounded-none w-full h-auto px-5 py-2 justify-start font-normal text-sm"
          variant="ghost"
        >
          Add card...
        </Button>
        <Button 
          onClick={handleCopyList}
          disabled={isCopyingList}
          className="rounded-none w-full h-auto px-5 py-2 justify-start font-normal text-sm"
          variant="ghost"
        >
          Copy list
        </Button>
        <Button 
          onClick={handleDeleteList}
          disabled={isDeletingList}
          className="rounded-none w-full h-auto px-5 py-2 justify-start font-normal text-sm"
          variant="ghost"
        >
          Delete list
        </Button>
      </PopoverContent>
    </Popover>
  )
}