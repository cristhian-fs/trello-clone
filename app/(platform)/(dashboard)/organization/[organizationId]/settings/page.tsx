"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton";

import { useGetOrganization } from "@/features/organizations/api/use-get-organization";
import { useOrganizationId } from "@/features/organizations/hooks/use-organization-id";
import { Button } from "@/components/ui/button";
import { Cog, UserIcon } from "lucide-react";
import { MembersTab } from "./members-tab";
import { SettingsTab } from "./settings-tab";

const SettingsPage = () => {

  const organizationId = useOrganizationId();
  const { data, isLoading } = useGetOrganization({ organizationId });

  if(isLoading) {
    return (
      <Skeleton className="w-full h-[320px]" />
    )
  }

  if(!data){
    return null
  }

  return (
    <div className="w-full">
      <Tabs className="flex flex-col md:flex-row h-full rounded-md border border-border min-h-[320px] max-h-[400px]" orientation="vertical" defaultValue="members">
        <div className="p-4 md:p-8 flex flex-col items-start gap-y-4">
          <div className="flex items-center justify-start gap-2">
            <Avatar>
              <AvatarImage src={data.image || ""} />
              <AvatarFallback>{data.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <p className="text-sm text-foreground">{data.name}</p>
          </div>
          <TabsList className="bg-transparent flex flex-col gap-y-2 h-auto p-0">
            <TabsTrigger value="members" asChild>
              <Button
                variant="ghost"
                className="w-full"
              >
                <UserIcon className="size-4"/>
                Members
              </Button>
            </TabsTrigger>
            <TabsTrigger value="settings" asChild>
              <Button
                variant="ghost"
                className="w-full"
              >
                <Cog className="size-4"/>
                Settings
              </Button>
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="members">
          <MembersTab />
        </TabsContent>
        <TabsContent value="settings">
          <SettingsTab />
        </TabsContent>
      </Tabs>
    </div>
   );
}
 
export default SettingsPage;