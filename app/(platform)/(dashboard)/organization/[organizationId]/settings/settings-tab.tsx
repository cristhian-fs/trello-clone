import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useGetOrganization } from "@/features/organizations/api/use-get-organization"
import { useOrganizationId } from "@/features/organizations/hooks/use-organization-id"
import { XIcon } from "lucide-react"

export const SettingsTab = () => {
  
  const organizationId = useOrganizationId();
  const { data: organization, isLoading: isOrganizationLoading } = useGetOrganization({ organizationId });

  if(isOrganizationLoading || !organization) return null

  return (
    <Card className="border-0 shadow-none bg-transparent rounded-none border-l border-border h-full">
      <CardHeader>
          <CardTitle className="text-2xl md:text-3xl">Settings</CardTitle>
          <CardDescription>Manage organization settings</CardDescription>
        </CardHeader>
      <CardContent className="flex flex-col">
        <h2 className="text-lg md:text-2xl">Organization Profile</h2>
        <Separator className="mt-2"/>
        <div className="flex items-center justify-start gap-2 mt-4">
          <Avatar className="size-10">
            <AvatarImage src={organization.image || ""} />
            <AvatarFallback>{organization.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <p className="text-base text-foreground">{organization.name}</p>
        </div>
        <h2 className="text-lg md:text-2xl mt-8">Danger zone</h2>
        <Separator className="mt-2"/>
        <div className="flex mt-4 items-center justify-start gap-2">
          <Button
            variant="destructive"
            className="uppercase cursor-pointer border-red-500 border border-solid bg-transparent hover:bg-destructive/10 text-destructive"
          >
            <XIcon />
            Leave organization
          </Button>
          <Button
            variant="destructive"
            className="uppercase cursor-pointer border-red-500 border border-solid bg-transparent hover:bg-destructive/10 text-destructive"
          >
            <XIcon />
            Delete organization
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}