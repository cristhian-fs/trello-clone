import { MAX_FREE_BOARDS } from "@/constants/boards";
import { db } from "./db";

export const incrementAvailableCount = async ({ organizationId }: { organizationId: string }) => {
  const orgLimit = await db.organizationLimit.findUnique({
    where: { organizationId }
  });

  if(orgLimit){
    await db.organizationLimit.update({
      where: { organizationId },
      data: { count: orgLimit.count + 1 }
    })
  } else {
    await db.organizationLimit.create({
      data: { organizationId, count: 1 }
    })
  }
}

export const decreaseAvailableCount = async ({ organizationId }: { organizationId: string }) => {
  const orgLimit = await db.organizationLimit.findUnique({
    where: { organizationId }
  });

  if(orgLimit){
    await db.organizationLimit.update({
      where: { organizationId },
      data: { count: orgLimit.count > 0 ? orgLimit.count - 1 : 0 }
    })
  } else {
    await db.organizationLimit.create({
      data: { organizationId, count: 1 }
    })
  }
}

export const hasAvailableCount = async ({ organizationId }: { organizationId: string }) => {
  const orgLimit = await db.organizationLimit.findUnique({
    where: { organizationId }
  });

  if(!orgLimit || orgLimit.count < MAX_FREE_BOARDS){
    return true;
  } else {
    return false
  }
}

export const getAvailableCount = async ({ organizationId }: { organizationId: string }) =>{
  const orgLimit = await db.organizationLimit.findUnique({
    where: { organizationId }
  });

  if(!orgLimit){
    return 0;
  }

  return orgLimit.count;
}