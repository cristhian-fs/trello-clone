import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { CreateCardSchema, UpdateCardSchema } from "../schemas";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

const app = new Hono()
  // copy a card by id
  .post(
    '/copy/:organizationId/:cardId',
    async (c) => {
      
      try{
        const user = await currentUser();

        // if somehow user is not logged in or don't have an id
        if(!user || !user.id){
          throw new Error("Unauthorized");
        }

        const cardId = c.req.param("cardId");
        const organizationId = c.req.param("organizationId");

        // membership verification
        const organization = await db.organization.findFirst({
          where: {
            id: organizationId
          },
          include: {
            memberships: true,
          }
        });

        if (!organization) {
          throw new Error("Organization not found");
        }
        
        const userIsMember = organization.memberships.some(
          (membership) => membership.userId === user.id
        );
        
        if (!userIsMember) {
          throw new Error("You are not a member of this organization");
        }

        const cardToCopy = await db.card.findUnique({
          where: {
            id: cardId,
            list: {
              board: {
                organizationId
              }
            }
          }
        });

        if(!cardToCopy){
          throw new Error("Card not found");
        }

        const lastCard = await db.card.findFirst({
          where: { listId: cardToCopy.listId },
          orderBy: { order: "desc" },
          select: { order: true },
        });


        const newOrder = lastCard ? lastCard.order + 1 : 1;

        const card = await db.card.create({
          data: {
            listId: cardToCopy.listId,
            title: `${cardToCopy.title} - Copy`,
            description: cardToCopy.description,
            order: newOrder,
          }
        });

        await createAuditLog({
          action: ACTION.CREATE,
          entityId: card.id,
          entityTitle: card.title,
          entityType: ENTITY_TYPE.CARD,
          organizationId,
          userId: user.id,
          userName: user.name!,
          userImage: user.image || ""
        })

        return c.json({
          data: card,
          success: true,
          error: null
        }, 200);

      } catch(error){
        const message = error instanceof Error ? error.message : "Failed to copy card.";
      
        return c.json({
          data: null,
          success: false,
          error: message
        }, 500);
      }
    }
  )
  // create a card 
  .post(
    '/:organizationId/:boardId/:listId',
    zValidator("form", CreateCardSchema),
    async (c) => {

      const user = await currentUser();
      // if somehow user is not logged in or don't have an id
      if(!user || !user.id){
        throw new Error("Unauthorized");
      }

      const organizationId = c.req.param("organizationId");
      const boardId = c.req.param("boardId");
      const listId = c.req.param("listId");

      try{
       
        const { title } = c.req.valid("form");

        const list = await db.list.findUnique({
          where: {
            id: listId,
            board: {
              id: boardId,
              organizationId
            }
          }
        })

        if(!list){
          throw new Error("List not found");
        }

        const lastCard = await db.card.findFirst({
          where: {
            listId
          },
          select: { order: true },
          orderBy: { order: "desc" }
        });

        const newOrder = lastCard?.order ? lastCard?.order + 1 : 1;

        const card = await db.card.create({
          data: {
            listId,
            title,
            order: newOrder
          }
        });

        await createAuditLog({
          action: ACTION.CREATE,
          entityId: card.id,
          entityTitle: card.title,
          entityType: ENTITY_TYPE.CARD,
          organizationId,
          userId: user.id,
          userName: user.name!,
          userImage: user.image || ""
        })

        return c.json({
          data: card,
          success: true,
          error: null
        }, 200)

      } catch(error){
        const message = error instanceof Error ? error.message : "Failed to create card.";

        return c.json({
          data: null,
          success: false,
          error: message
        }, 500);
      }
    }
  )
  // get a card by id
  .get(
    '/:organizationId/:cardId',
    async (c) => {
      try{
        const user = await currentUser();
  
        // if somehow user is not logged in or don't have an id
        if(!user || !user.id){
          throw new Error("Unauthorized");
        }

        const organizationId = c.req.param("organizationId");
        const cardId = c.req.param("cardId");

        const card = await db.card.findUnique({
          where: {
            id: cardId,
            list: {
              board: {
                organizationId
              }
            }
          },
          include: {
            list: {
              select: {
                title: true,
              }
            }
          }
        });

        if(!card){
          throw new Error("Card not found");
        }

        return c.json({
          data: card,
          success: true,
          error: null
        }, 200);

      } catch(error){
        const message = error instanceof Error ? error.message : "Failed to get card.";
      
        return c.json({
          data: null,
          success: false,
          error: message
        }, 500);
      }
    }
  )
  // get logs
  .get(
    '/:organizationId/:cardId/logs',
    async (c) => {
      const user = await currentUser();

      // if somehow user is not logged in or don't have an id
      if(!user || !user.id){
        throw new Error("Unauthorized");
      }

      const cardId = c.req.param("cardId");
      const organizationId = c.req.param("organizationId");

      try{
        const cardAudits = await db.auditLog.findMany({
          where: {
            organizationId,
            entityId: cardId,
            entityType: ENTITY_TYPE.CARD,
          },
          orderBy: {
            createdAt: "desc"
          },
          take: 3,
        })

        return c.json({
          data: cardAudits,
          success: true,
          error: null
        })
      } catch(error){
        const message = error instanceof Error ? error.message : "Failed to get card audits.";
      
        return c.json({
          data: null,
          success: false,
          error: message
        }, 500);
      }
    }
  )
  // update a card by id
  .patch(
    '/:organizationId/:cardId',
    zValidator("form", UpdateCardSchema),
    async (c) => {
      try{
        const user = await currentUser();
  
        // if somehow user is not logged in or don't have an id
        if(!user || !user.id){
          throw new Error("Unauthorized");
        }

        const organizationId = c.req.param("organizationId");
        const cardId = c.req.param("cardId");

        const card = await db.card.findUnique({
          where: {
            id: cardId,
            list: {
              board: {
                organizationId
              }
            }
          }
        });

        if(!card){
          throw new Error("Card not found");
        }

        const values = c.req.valid("form");

        const updatedCard = await db.card.update({
          where: {
            id: cardId
          },
          data: {
            ...values
          }
        });

        await createAuditLog({
          action: ACTION.UPDATE,
          entityId: updatedCard.id,
          entityTitle: updatedCard.title,
          entityType: ENTITY_TYPE.CARD,
          organizationId,
          userId: user.id,
          userName: user.name!,
          userImage: user.image || ""
        })

        return c.json({
          data: updatedCard,
          success: true,
          error: null
        }, 200);

      } catch(error){
        const message = error instanceof Error ? error.message : "Failed to update card.";
      
        return c.json({
          data: null,
          success: false,
          error: message
        }, 500);
      }
    }
  )
  // delete a card by id
  .delete(
    '/:organizationId/:cardId',
    async (c) => {
      const cardId = c.req.param("cardId");
      const organizationId = c.req.param("organizationId");

      try{
        const user = await currentUser();
  
        // if somehow user is not logged in or don't have an id
        if(!user || !user.id){
          throw new Error("Unauthorized");
        }

        const card = await db.card.delete({
          where: {
            id: cardId,
            list: {
              board: {
                organizationId
              }
            }
          }
        });

        await createAuditLog({
          action: ACTION.DELETE,
          entityId: card.id,
          entityTitle: card.title,
          entityType: ENTITY_TYPE.CARD,
          organizationId,
          userId: user.id,
          userName: user.name!,
          userImage: user.image || ""
        })

        return c.json({
          data: card,
          success: true,
          error: null
        }, 200);

      } catch(error){
        const message = error instanceof Error ? error.message : "Failed to delete card.";
      
        return c.json({
          data: null,
          success: false,
          error: message
        }, 500);
      }
    }
  )
  

export default app;