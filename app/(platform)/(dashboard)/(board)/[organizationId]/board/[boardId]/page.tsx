"use client"

import { useGetLists } from "@/features/lists/api/use-get-lists";
import { ListContainer } from "./_components/list-container";
import { useOrganizationId } from "@/features/organizations/hooks/use-organization-id";
import { useBoardId } from "@/features/boards/hooks/use-board-id";

const BoardPage = () => {

  const organizationId = useOrganizationId();
  const boardId = useBoardId();
  const { data, isLoading } = useGetLists({ organizationId, boardId });

  if(isLoading){
    return <p>Loading...</p>;
  }
  if(!data){
    return null;
  }

  return ( 
    <div className="p-4 h-full overflow-x-auto">
      <ListContainer 
        boardId={boardId}
        data={data}
      />
    </div>
   );
}
 
export default BoardPage;