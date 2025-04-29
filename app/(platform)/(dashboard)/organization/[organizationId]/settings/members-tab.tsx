"use client";
import { format } from "date-fns";

import { useGetMembers } from "@/features/members/api/use-get-members"
import { useOrganizationId } from "@/features/organizations/hooks/use-organization-id";

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCurrentUser } from "@/hooks/use-current-user";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, MoreHorizontal } from "lucide-react";
import { useGetCurrentMember } from "@/features/members/api/use-get-current-member";
import { useUpdateMemberRole } from "@/features/members/api/use-update-member-role";
import { toast } from "sonner";
import { UserRole } from "@prisma/client";

export const MembersTab = () => {

  const user = useCurrentUser();
  const organizationId = useOrganizationId();
  const { data, isLoading } = useGetMembers({ organizationId });
  const { data: currentMember, isLoading: isCurrentMemberLoading } = useGetCurrentMember({ organizationId });
  const { mutate: updateMember, isPending } = useUpdateMemberRole();

  if(isCurrentMemberLoading) return null;

  const onUpdate = async (memberId: string, role: "ADMIN" | "MEMBER") => {

    updateMember({ 
      json: { role }, 
      param: { organizationId, memberId} 
    }, {
      onSuccess(){
        toast.success("Member's role updated");
      },
      onError(error){
        console.log("erro:", error);
        toast.error(error.message);
      }
    });
  }

  return (
    <Card className="border-0 shadow-none bg-transparent rounded-none border-l border-border h-full">
      <CardHeader>
        <CardTitle className="text-2xl md:text-3xl">Members</CardTitle>
        <CardDescription>View and manage organization members</CardDescription>
      </CardHeader>
      <CardContent>
      <Table>
        <TableCaption>A list of organization members.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="">User</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && <TableRow><TableCell colSpan={4}>Loading...</TableCell></TableRow>}
          {data?.map((member) => (
            <TableRow key={member.id}>
              <TableCell className="font-medium">
                <div className="flex items-center space-x-2">
                  <Avatar className="rounded-full">
                    <AvatarImage src={member?.user?.image || ""} />
                    <AvatarFallback>{member?.user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <div className="flex items-center">
                      <p className="font-medium leading-none">{member.user.name}</p>
                      {member.userId === user?.id && <Badge className="ml-2 bg-blue-500/10 border-blue-500 text-blue-700">You</Badge>}
                    </div>
                    <span className="text-xs text-muted-foreground">{member.user.email}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>{format(member.createdAt, "dd/MM/yyyy")}</TableCell>
              <TableCell>
              {currentMember?.role === "ADMIN" ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" disabled={isPending} className="w-full shrink capitalize">
                      {member.role} <ChevronDownIcon className="size-4 ml-2"/>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuRadioGroup
                      value={member.role}
                      onValueChange={(role) => onUpdate(member.id, role as "ADMIN" | "MEMBER")}
                    >
                      <DropdownMenuRadioItem value={UserRole.ADMIN}>
                        Admin
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value={UserRole.MEMBER}>
                        Member
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              ): (
                <Button variant="outline" disabled className="w-full shrink capitalize">
                  {member.role}
                </Button>
              )}
              </TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="icon">
                  <MoreHorizontal className="size-4"/>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </CardContent>
    </Card>
  )
}