import { atom, useAtom } from "jotai";

const modalState = atom(false);

export const useCreateOrganizationModal = () => {
  return useAtom(modalState);
}