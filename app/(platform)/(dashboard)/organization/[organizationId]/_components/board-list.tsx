"use client"

import { FormPopover } from "@/components/form-popover"
import { Hint } from "@/components/hint"
import { Skeleton } from "@/components/ui/skeleton";
import { useGetBoards } from "@/features/boards/api/use-get-boards";
import { useOrganizationId } from "@/features/organizations/hooks/use-organization-id";
import { HelpCircle, User2 } from "lucide-react"
import Link from "next/link";

export const BoardList = () => {

  const organizationId = useOrganizationId();

  const { data: boards, isLoading } = useGetBoards({ organizationId });

  if(isLoading){
    return <BoardList.Skeleton />
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center font-semibold text-lg text-neutral-700">
        <User2 className="size-6 mr-2" />
        Your boards
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {boards && boards?.data.map((board) => (
          <Link
            key={board.id}
            href={`/${organizationId}/board/${board.id}`}
            className="group relative aspect-video bg-no-repeat bg-center bg-cover bg-sky-700 rounded-sm h-full w-full p-2 overflow-hidden"
            style={{backgroundImage: `url(${board.imageThumbUrl})`}}
          >
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />
            <p className="relative font-semibold text-white">
              {board.title}
            </p>
          </Link>
        ))}
        <FormPopover side="right" sideOffset={10}>
          <div role="button"
            className="aspect-video relative size-full bg-muted rounded-sm flex flex-col gap-y-1 items-center justify-center hover:opacity-75 transition"
          >
            <p className="text-sm">Create new board</p>
            <span className="text-xs">
              5 remaining
            </span>
            <Hint 
              sideOffset={40}
              description={`
                Free workspaces can have up to 5 open boards. For unlimited boards upgrade this workspace.
              `}
            >
              <HelpCircle className="absolute bottom-2 right-2 size-[14px]" />
            </Hint>
          </div>
        </FormPopover>
      </div>
    </div>
  )
}

BoardList.Skeleton = function SkeletonBoardList(){
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
    </div>
  )
}