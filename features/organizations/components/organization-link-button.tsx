import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface OrganizationLinkButtonProps {
  id: string;
  image: string;
  name: string;
}

export const OrganizationLinkButton = ({ 
  id,
  image,
  name
 }: OrganizationLinkButtonProps) => {
  return (
    <Button 
      variant="ghost" 
      asChild
      className="w-full justify-between has-[>svg]:px-2 py-2 h-auto"
    >
      <Link href={`/organization/${id}`}>
        <div className="flex items-center justify-start gap-2">
          <Avatar>
            <AvatarImage src={image || ""} />
            <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <p className="text-sm text-foreground">{name}</p>
        </div>
        <ChevronRight className="size-4"/>
      </Link>
    </Button>
  )
}