"use client";

import { useEffect, useState } from "react";

import { CreateOrganizationModal } from "@/features/organizations/components/create-organization-modal";
import { CardModal } from "./card-modal/index";

export const Modals = () => {

  // Prevent hydration erros
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true)
  }, [])

  if(!mounted) return null;

  return (
    <>
      <CreateOrganizationModal />
      <CardModal />
    </>
  )
}