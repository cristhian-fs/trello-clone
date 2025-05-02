import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { db } from "./db";

interface Props {
  entityId: string;
  entityType: ENTITY_TYPE;
  entityTitle: string;
  action: ACTION;
  organizationId: string;
  userId: string;
  userName: string;
  userImage: string;
}

export const createAuditLog = async (props: Props) => {
  try{
    const { action, entityId, entityTitle, entityType, organizationId, userName, userId, userImage } = props;

    await db.auditLog.create({
      data: {
        organizationId,
        action,
        entityId,
        entityTitle,
        entityType,
        userName,
        userId,
        userImage
      }
    })
  } catch(error){
    console.log("[AUDIT_LOG_ERROR]", error);
  }
}