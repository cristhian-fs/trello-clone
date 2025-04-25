"use client";

import { useEffect, useState } from "react";

import { CreateOrganizationModal } from "@/features/organizations/components/create-organization-modal";

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
    </>
  )
}