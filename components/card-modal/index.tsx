import {
  Dialog,
  DialogContent,
  DialogTitle
} from "@/components/ui/dialog";
import { useCardModal } from "@/hooks/use-card-modal";
import { useGetCard } from "@/features/cards/api/use-get-card";
import { useOrganizationId } from "@/features/organizations/hooks/use-organization-id";

import { Header } from "./header";
import { Description } from "./description";
import { Actions } from "./actions";
import { useGetCardAudits } from "@/features/cards/api/use-get-card-audits";
import { Activity } from "./activity";

export const CardModal = () => {
  const { cardModal, onClose } = useCardModal();

  const organizationId = useOrganizationId();

  const { data: card, isLoading } = useGetCard({
    organizationId,
    cardId: cardModal.id
  });

  const { data: audits } = useGetCardAudits({
    organizationId,
    cardId: cardModal.id
  })

  if(!card) return null;

  const parsedData = {
    ...card.data,
    createdAt: new Date(card.data.createdAt),
    updatedAt: new Date(card.data.updatedAt),
  }

  return (
    <Dialog open={cardModal.isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>
          {
            isLoading ? <Header.Skeleton /> : <Header data={parsedData} />
          }
          <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
            <div className="col-span-3">
              <div className="w-full space-y-6">
                {!card ? <Description.Skeleton /> : <Description data={parsedData} />}
                {!audits ? <Activity.Skeleton /> : <Activity items={audits} />}
              </div>
            </div>
            {!card ?
              <Actions.Skeleton /> : 
              <Actions data={parsedData} />
            }
          </div>
        </DialogTitle>
      </DialogContent>
    </Dialog>
  )
}