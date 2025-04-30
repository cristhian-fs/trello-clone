"use client";

import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { useGetOrganizations } from "../api/use-get-organizations"
import { OrganizationLinkButton } from "./organization-link-button";
import { useOrganizationId } from "../hooks/use-organization-id";
import { useGetOrganization } from "../api/use-get-organization";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown } from "lucide-react";

export const OrganizationSwitcher = () => {

  const organizationId = useOrganizationId();

  const { data: currentOrganization, isLoading: isCurrentOrganizationLoading } = useGetOrganization({ organizationId })
  const { data: organizations } = useGetOrganizations();

  if(isCurrentOrganizationLoading) return null

  if(!currentOrganization || !organizations) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="w-full justify-between has-[>svg]:px-2 has-[>svg]:shrink py-2 h-auto"
        >
          <div className="flex items-center justify-start gap-2">
            <Avatar>
              <AvatarImage src={currentOrganization.data.image || ""} />
              <AvatarFallback>{currentOrganization.data.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <p className="text-sm text-foreground">{currentOrganization.data.name}</p>
          </div>
          <ChevronsUpDown className="size-4 text-muted-foreground"/>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-[284px]" align="end">
        {organizations?.map((organization) => (
          <DropdownMenuItem asChild key={organization.id}>
            <OrganizationLinkButton
              id={organization.id}
              name={organization.name}
              image={organization.image || ""}
            />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}