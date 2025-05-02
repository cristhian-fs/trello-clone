"use client"

import { CardWithListTitle } from "@/types"
import { Skeleton } from "../ui/skeleton"
import { Button } from "../ui/button"
import { Copy, TrashIcon } from "lucide-react"
import { useCopyCard } from "@/features/cards/api/use-copy-card"
import { useOrganizationId } from "@/features/organizations/hooks/use-organization-id"
import { useBoardId } from "@/features/boards/hooks/use-board-id"
import { useDeleteCard } from "@/features/cards/api/use-delete-card"
import { toast } from "sonner"
import { useCardModal } from "@/hooks/use-card-modal"

interface ActionsProps {
  data: CardWithListTitle
}
export const Actions = ({data }: ActionsProps) => {

  const organizationId = useOrganizationId();
  const boardId = useBoardId();
  const { onClose } = useCardModal();

  const { mutate: copyCard, isPending: isCopyingCard } = useCopyCard({
    boardId,
    organizationId,
    cardId: data.id
  });

  const { mutate: deleteCard, isPending: isDeletingCard } = useDeleteCard({
    boardId,
    cardId: data.id,
    organizationId
  });

  const handleCopyCard = () => {
    copyCard({
      param:{
        cardId: data.id,
        organizationId
      },
    }, {
      onSuccess(){
        toast.success("Card copied successfully");
        onClose();
      },
      onError(error){
        toast.error(error.message.toString());
      }
    })
  }

  const handleDeleteCard = () => {
    deleteCard({ param: {
      cardId: data.id,
      organizationId
    }}, {
      onSuccess(){
        toast.success("Card deleted successfully");
        onClose();
      },
      onError(){
        toast.error("Failed to delete card");
      }
    })
  }

  return (
    <div className="space-y-2 mt-2">
      <p className="text-xs font-semibold">Actions</p>
      <Button
        variant="gray"
        className="w-full justif-start"
        size="inline"
        onClick={handleCopyCard}
        disabled={isCopyingCard}
      >
        <Copy className="size-4 mr-2"/>
        Copy
      </Button>
      <Button
        variant="gray"
        className="w-full justif-start"
        size="inline"
        onClick={handleDeleteCard}
        disabled={isDeletingCard}
      >
        <TrashIcon className="size-4 mr-2"/>
        Delete
      </Button>
    </div>
  )
}

Actions.Skeleton = function ActionsSkeleton(){
  return (
    <div className="space-y-2 mt-2">
      <Skeleton className="w-20 h-4 bg-neutral-200"/>
      <Skeleton className="w-full h-8 bg-neutral-200"/>
      <Skeleton className="w-20 h-8 bg-neutral-200"/>
    </div>
  );
};