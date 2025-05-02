"use client";

import { ActivityItem } from "@/components/activity-item";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetLogs } from "@/features/organizations/api/use-get-logs";
import { useOrganizationId } from "@/features/organizations/hooks/use-organization-id";

export const ActivityList = () => {

  const organizationId = useOrganizationId();
  const { data: rawLogs, isLoading: isLoadingLogs } = useGetLogs({
    organizationId
  })

  if(isLoadingLogs) return <ActivityList.Skeleton />

  if(!rawLogs) return null;

  const logs = rawLogs.data.map((log) => ({
    ...log,
    createdAt: new Date(log.createdAt),
    updatedAt: new Date(log.updatedAt),
  }));

  return (
    <ol className="space-y-4 mt-4">
      <p className="hidden last:block text-xs text-center text-muted-foreground">
        No activity found inside this organization
      </p>
      {logs && logs.length !== 0 && logs.map((log) => (
        <ActivityItem key={log.id} data={log} />
      ))}
    </ol>
  )
}

ActivityList.Skeleton = function SkeletonActivityList() {
  return (
    <ol className="space-y-4 mt-4">
      <Skeleton className="h-14 w-[90%]"/>
      <Skeleton className="h-14 w-[70%]"/>
      <Skeleton className="h-14 w-[80%]"/>
      <Skeleton className="h-14 w-[75%]"/>
      <Skeleton className="h-14 w-[90%]"/>
    </ol>
  )
}