import { client } from "@/lib/rpc";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<typeof client.api.members[":organizationId"][":memberId"]["update-role"]["$patch"]>
type RequestType = InferRequestType<typeof client.api.members[":organizationId"][":memberId"]["update-role"]["$patch"]>

type UpdateRoleSuccess = { success: true; data: string };
type UpdateRoleError = { success: false; error: string };
type UpdateRoleResponse = UpdateRoleSuccess | UpdateRoleError;


export const useUpdateMemberRole = () => {
  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationKey: ["members", "current"],
    mutationFn: async ({ json, param }) => {
      const response = await client.api.members[":organizationId"][":memberId"]["update-role"]["$patch"]({ 
        param, json
      });
      
      if(!response.ok){
        const data: UpdateRoleResponse = await response.json();

        if(!data.success){
          throw new Error(data.error)
        }

        throw new Error("Failed to update member role");
      }
      
      return await response.json();
    }
  });

  return mutation;
}