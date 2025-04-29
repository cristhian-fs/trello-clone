"use client"

import { LoadingScreen } from "@/components/loading-screen";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator} from "@/components/ui/separator"

import { useGetOrganizations } from "@/features/organizations/api/use-get-organizations";
import { useCreateOrganizationModal } from "@/features/organizations/store/use-create-organization-modal";
import { OrganizationLinkButton } from "@/features/organizations/components/organization-link-button";

const SelectOrgPage = () => {

  const { data, isLoading } = useGetOrganizations();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_open, setOpen] = useCreateOrganizationModal();

  if(isLoading){
    return <LoadingScreen />
  }

  return ( 
    <Card className="w-full max-w-[400px]">
      <CardHeader>
        <CardTitle>Select and organization</CardTitle>
        <CardDescription>to continue to trello-clone</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {data && data?.map((organization) => (
            <OrganizationLinkButton 
              key={organization.id}
              id={organization.id}
              name={organization.name}
              image={organization.image || ""}
            />
          ))}
        </div>
        <Separator />
        <Button onClick={() => setOpen(true)} className="w-full" variant="outline">
          Create a new organization
        </Button>
      </CardContent>
    </Card>
  );
}
 
export default SelectOrgPage;