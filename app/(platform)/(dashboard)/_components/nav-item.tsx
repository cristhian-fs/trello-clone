"use client";

import { cn } from "@/lib/utils";
import { useRouter, usePathname } from "next/navigation";

import { Activity, CreditCard, Layout, Settings } from "lucide-react"

import { 
  AccordionContent,
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export type Organization = {
  id: string;
  slug: string;
  image: string;
  name: string;
}

interface NavItemProps {
  isExpanded: boolean;
  isActive: boolean;
  organization: Organization;
  onExpand: (id: string) => void;
}

export const NavItem = ({
  isExpanded,
  isActive,
  onExpand,
  organization
}:NavItemProps) => {

  const router = useRouter();
  const pathname = usePathname();


  const routes = [
    {
      label: "Boards",
      icon: <Layout className="size-4 mr-2" />,
      href: `/organization/${organization.id}`
    },
    {
      label: "Activity",
      icon: <Activity className="size-4 mr-2" />,
      href: `/organization/${organization.id}/activity`
    },
    {
      label: "Settings",
      icon: <Settings className="size-4 mr-2" />,
      href: `/organization/${organization.id}/settings`
    },
    {
      label: "Billing",
      icon: <CreditCard className="size-4 mr-2" />,
      href: `/organization/${organization.id}/billing`
    },
  ];

  const onClick = (href: string) => {
    router.push(href);
  }

  return (
    <AccordionItem value={organization.id} className="border-none">
      <AccordionTrigger
        onClick={() => onExpand(organization.id)}
        className={cn(
          "flex items-center gap-x-2 p-1.5 text-neutral-700 rounded-md hover:bg-neutral-500/10 transition text-start no-underline hover:no-underline",
          isActive && !isExpanded && "bg-sky-500/10 text-sky-700"
        )}
      >
        <div className="flex items-center gap-x-2">
          <Avatar className="size-7">
            <AvatarImage src={organization.image || ""} />
            <AvatarFallback>{organization.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="font-medium text-sm">{organization.name}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pt-1 text-neutral-700">
        {routes.map((route) => (
          <Button 
            key={route.href}
            size="sm"
            onClick={() => onClick(route.href)}
            className={cn(
              "w-full font-normal justify-start pl-10 mb-1 has-[>svg]:pl-10",
              pathname === route.href && "bg-sky-500/10 text-sky-700"
            )}
            variant="ghost"
          >
            {route.icon}
            {route.label}
          </Button>
        ))}
      </AccordionContent>
    </AccordionItem>
  )
};

NavItem.Skeleton = function SkeletonNavItem(){
  return (
    <div className="flex items-center gap-x-2">
      <div className="size-10 relative shrink-0">
        <Skeleton className="size-full absolute"/>
      </div>
      <Skeleton className="h-10 w-full"/>
    </div>
  )
}