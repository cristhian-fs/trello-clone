"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useLocalStorage } from "usehooks-ts";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion } from "@/components/ui/accordion";
import { useGetOrganization } from "@/features/organizations/api/use-get-organization";
import { useOrganizationId } from "@/features/organizations/hooks/use-organization-id";
import { useGetOrganizations } from "@/features/organizations/api/use-get-organizations";
import { NavItem, type Organization } from "./nav-item";

interface SidebarProps {
  storageKey?: string;
}

export const Sidebar = ({ storageKey = "t-sidebar-state" }:SidebarProps) => {

  const [expanded, setExpanded] = useLocalStorage<Record<string, any>>(
    storageKey, 
    {}
  );

  // get the orgazination id from url
  const organizationId = useOrganizationId();

  // get the current org
  const { data: currentOrg, isLoading: isCurrentOrgLoading } = useGetOrganization({ organizationId })
  // get the organizations
  const { data: organizations, isLoading: isOrganizationsLoading } = useGetOrganizations();

  const defaultAccordionValue: string[] = Object.keys(expanded)
    .reduce((acc: string[], key: string) =>{
      if(expanded[key]){
        acc.push(key)
      }
      return acc;
    }, []);

  const onExpand = (id: string) => {
    setExpanded((curr) => ({
      ...curr,
      [id]: !expanded[id]
    }))
  }

  if(isCurrentOrgLoading || isOrganizationsLoading) return (
    <>
      <div className="flex items-center justify-between mb-2">
        <Skeleton className="h-10 w-[50%]" />
        <Skeleton className="h-10 w-10" />
      </div>
      <div className="space-y-2">
        <NavItem.Skeleton />
        <NavItem.Skeleton />
        <NavItem.Skeleton />
      </div>
    </>
  )

  return (
    <>
    <div className="font-medium text-xs flex items-center mb-1">
      <span className="pl-4">Workspaces</span>
      <Button 
        asChild 
        type="button" 
        size="icon" 
        variant="ghost" 
        className="ml-auto"
      >
        <Link href="/select-org">
          <Plus className="size-4"/>
        </Link>
      </Button>
    </div>
    <Accordion
      type="multiple"
      defaultValue={defaultAccordionValue}
      className="space-y-2"
    >
      {organizations?.map((organization) => (
        <NavItem 
          key={organization.id}
          isActive={organization.id === currentOrg?.id}
          isExpanded={expanded[organization.id]}
          organization={organization as Organization}
          onExpand={onExpand}
        />
      ))}
    </Accordion>
    </>
    
  )
}