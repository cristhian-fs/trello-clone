import { atom, useAtom } from "jotai";

type CardModal = {
  isOpen: boolean;
  id?: string;
}

const cardModalStore = atom<CardModal>({
  isOpen: false,
  id: undefined
});

export const useCardModal = () => {
  const [cardModal, setCardModalStore] = useAtom(cardModalStore);

  const onOpen = (id: string) => setCardModalStore({
    isOpen: true,
    id
  });
  const onClose = () => setCardModalStore({
    isOpen: false,
    id: undefined
  });
  
  return {
    cardModal,
    onOpen,
    onClose
  };
}