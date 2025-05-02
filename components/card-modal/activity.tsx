"use client"

import { AuditLog } from "@prisma/client"
import { Skeleton } from "../ui/skeleton"
import { ActivityIcon } from "lucide-react"
import { ActivityItem } from "../activity-item"

interface ActiviyProps {
  items: AuditLog[]
}

export const Activity = ({ items }:ActiviyProps) => {
  return (
    <div className="flex items-start gap-x-3">
      <ActivityIcon className="size-5 mt-0.5 text-neutral-700" />
      <div className="w-full">
        <p className="font-semibold text-neutral-700 mb-2">Activity</p>
        <ol className="mt-2 space-y-4">
          {items.map((item) => (
           <ActivityItem key={item.id} data={item} />
          ))}
        </ol>
      </div>
    </div>
  )
}

Activity.Skeleton = function SkeletonActivity() {
  return (
    <div className="flex items-start gap-x-3 w-full">
      <Skeleton className="bg-neutral-200 size-6" />
      <div className="w-full">
        <Skeleton className="w-24 h-6 mb-2 bg-neutral-200" />
        <Skeleton className="w-full h-10 mb-2 bg-neutral-200" />
      </div>
    </div>
  )
}