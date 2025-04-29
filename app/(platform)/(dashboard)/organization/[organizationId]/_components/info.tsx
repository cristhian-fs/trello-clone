"use client";

import { CreditCard } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

import { useGetOrganization } from "@/features/organizations/api/use-get-organization";
import { useOrganizationId } from "@/features/organizations/hooks/use-organization-id";

export const Info = () => {
  const organizationId = useOrganizationId();
  const { data: organization, isLoading: isLoadingOrganization } = useGetOrganization({ organizationId });

  if(isLoadingOrganization){
    return (
      <Info.Skeleton />
    )
  }

  if(!organization){
    return (
      <p>Organization not found</p>
    )
  }

  return (
    <div className="flex items-center gap-x-4">
      <Avatar className="size-[60px]">
        <AvatarImage src={organization.image || ""} />
        <AvatarFallback>{organization.name.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="space-y-1">
        <p className="font-semibold text-xl">
          {organization.name}
        </p>
        <div className="flex items-center text-xs text-muted-foreground">
          <CreditCard className="size-3 mr-1"/>
          Free
        </div>
      </div>
    </div>
  )
}

Info.Skeleton = function SkeletonInfo(){
  return (
    <div className="flex items-center gap-x-4">
      <div className="h-[60px] w-[60px] relative">
        <Skeleton className="w-full h-full absolute"/>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-10 w-[200px]"/>
        <div className="flex items-center">
          <Skeleton className="size-4 mr-2" />
          <Skeleton className="h-4 w-[100px]" />
        </div>
      </div>
    </div>
  )
}