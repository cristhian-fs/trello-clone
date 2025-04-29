import { atom, useAtom } from "jotai";

const mobileSidebarOpenState = atom(false);

export const useMobileSidebar = () => {
  const [isOpen, setIsOpen] = useAtom(mobileSidebarOpenState);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
  
  return {
    isOpen,
    onOpen,
    onClose
  };
}