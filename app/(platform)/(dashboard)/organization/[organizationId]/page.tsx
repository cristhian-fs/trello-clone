import { Separator } from "@/components/ui/separator";
import { Info } from "./_components/info";
import { BoardList } from "./_components/board-list";
import { db } from "@/lib/db";

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props){
  const slug = (await params).id;

  const organization = await db.organization.findFirst({
    where: {
      id: slug
    }
  });

  if(!organization){
    return {
      title: "Organization not found"
    }
  }

  return {
    title: organization.name,
  }

}

const OrganizationPage = () => {
  return ( 
    <div className="w-full mb-20">
      <Info />
      <Separator className="my-4"/>
      <div className="px-2 md:px-4">
        <BoardList />
      </div>
    </div>
   );
}
 
export default OrganizationPage;