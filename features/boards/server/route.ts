import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { CreateBoardSchema, UpdateBoardSchema } from "../schemas";
import { UpdateCardsOrder, UpdateListOrder } from "@/features/lists/schemas";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { 
  incrementAvailableCount, 
  hasAvailableCount, 
  decreaseAvailableCount
} from "@/lib/org-limit";

const app = new Hono()  
  .post(
    '/:organizationId',
    zValidator("form", CreateBoardSchema),
    async (c) => {
      try{
        const user = await currentUser();
  
        // if somehow user is not logged in or don't have an id
        if(!user || !user.id){
          throw new Error("Unauthorized");
        }

        const organizationId = c.req.param("organizationId")
        const { title, image } = c.req.valid("form");

        const canCreate = await hasAvailableCount({
          organizationId
        });

        if(!canCreate){
          throw new Error("You have reached your board limit. Please upgrade to create more.");
        }

        const [
          imageId,
          imageThumbUrl,
          imageFullUrl,
          imageLinkHTML,
          imageUserName
        ] = image.split("|");

        if(!imageId || !imageThumbUrl || !imageFullUrl || !imageLinkHTML || !imageUserName){
          throw new Error("Missing fields. Failed to create board");
        }

        const board = await db.board.create({
          data: {
            title,
            imageId,
            imageThumbUrl,
            imageFullUrl,
            imageLinkHTML,
            imageUserName,
            organizationId,
          }
        });
        
        await incrementAvailableCount({
          organizationId
        })

        await createAuditLog({
          action: ACTION.CREATE,
          entityId: board.id,
          entityTitle: board.title,
          entityType: ENTITY_TYPE.BOARD,
          organizationId,
          userId: user.id,
          userName: user.name!,
          userImage: user.image || ""
        });

        return c.json({
          data: board,
          success: true,
          error: null
        }, 200);

      } catch(error){
        const message = error instanceof Error ? error.message : "Failed to create board.";
      
        return c.json({
          data: null,
          success: false,
          error: message
        }, 500);
      }
    }
  )
  .get(
    '/:organizationId',
    async (c) => {
      try{
        const user = await currentUser();
  
        // if somehow user is not logged in or don't have an id
        if(!user || !user.id){
          throw new Error("Unauthorized");
        }

        const organizationId = c.req.param("organizationId");

        const boards = await db.board.findMany({
          where: {
            organizationId
          },
          orderBy: {
            createdAt: "desc"
          }
        });

        return c.json({
          data: boards,
          success: true,
          error: null
        }, 200);

      } catch(error){
        const message = error instanceof Error ? error.message : "Failed to get boards.";
      
        return c.json({
          data: null,
          success: false,
          error: message
        }, 500);
      }
    }
  )
  .get(
    '/:organizationId/:boardId',
    async (c) => {
      try{
        const user = await currentUser();
  
        // if somehow user is not logged in or don't have an id
        if(!user || !user.id){
          throw new Error("Unauthorized");
        }

        const organizationId = c.req.param("organizationId");
        const boardId = c.req.param("boardId");

        const board = await db.board.findFirst({
          where: {
            id: boardId,
            organizationId: organizationId
          }
        });
        
        if (!board) {
          throw new Error("Board not found or does not belong to the organization");
        }

        return c.json({
          data: board,
          success: true,
          error: null
        }, 200);

      } catch(error){
        const message = error instanceof Error ? error.message : "Failed to get board.";
      
        return c.json({
          data: null,
          success: false,
          error: message
        }, 500);
      }
    }
  )
  .patch(
    '/:organizationId/:boardId',
    zValidator("form", UpdateBoardSchema),
    async (c) => {
      try{
        const user = await currentUser();
  
        // if somehow user is not logged in or don't have an id
        if(!user || !user.id){
          throw new Error("Unauthorized");
        }

        const organizationId = c.req.param("organizationId");
        const boardId = c.req.param("boardId");

        const organization = await db.organization.findFirst({
          where: {
            id: organizationId
          }
        });

        if(!organization){
          throw new Error("Organization not found");
        }

        const { title } = c.req.valid("form");

        const board = await db.board.findFirst({
          where: {
            id: boardId,
            organizationId: organizationId
          }
        });
        
        if (!board) {
          throw new Error("Board not found or does not belong to the organization");
        }
        
        // update:
        const updatedBoard = await db.board.update({
          where: { id: boardId },
          data: { title }
        });

        await createAuditLog({
          action: ACTION.UPDATE,
          entityId: updatedBoard.id,
          entityTitle: updatedBoard.title,
          entityType: ENTITY_TYPE.BOARD,
          organizationId,
          userId: user.id,
          userName: user.name!,
          userImage: user.image || ""
        })

        return c.json({
          data: updatedBoard,
          success: true,
          error: null
        }, 200);


      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to update board.";
      
        return c.json({
          data: null,
          success: false,
          error: message
        }, 500);
      }
    }
  )
  .patch(
    '/:organizationId/:boardId/reorder-list',
    zValidator("json", UpdateListOrder),
    async (c) => {
      const organizationId = c.req.param("organizationId");
      const boardId = c.req.param("boardId");
      const { items } = c.req.valid("json");

      try{
        const user = await currentUser();
  
        // if somehow user is not logged in or don't have an id
        if(!user || !user.id){
          throw new Error("Unauthorized");
        }

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

        const board = await db.board.findFirst({
          where: {
            id: boardId,
            organizationId
          }
        });
        
        if (!board) {
          throw new Error("Board not found or does not belong to the organization");
        }

        const transaction = items.map((list) => 
          db.list.update({
            where: {
              id: list.id,
              board: {
                organizationId
              }
            },
            data: {
              order: list.order
            }
          })
        );

        const lists = await db.$transaction(transaction);

        if (!lists) {
          throw new Error("Failed to reorder lists");
        }

        return c.json({
          data: lists,
          success: true,
          error: null
        }, 200)
        
      } catch(error){
        const message = error instanceof Error ? error.message : "Failed to reorder lists.";
      
        return c.json({
          data: null,
          success: false,
          error: message
        }, 500);
      }
    } 
  )
  .patch(
    '/:organizationId/:boardId/reorder-card',
    zValidator("json", UpdateCardsOrder),
    async (c) => {
      const organizationId = c.req.param("organizationId");
      const boardId = c.req.param("boardId");
      const { items } = c.req.valid("json");

      try{
        const user = await currentUser();
  
        // if somehow user is not logged in or don't have an id
        if(!user || !user.id){
          throw new Error("Unauthorized");
        }

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

        const board = await db.board.findFirst({
          where: {
            id: boardId,
            organizationId
          }
        });
        
        if (!board) {
          throw new Error("Board not found or does not belong to the organization");
        }

        const transaction = items.map((card) => 
          db.card.update({
            where: {
              id: card.id,
              list: {
                board: {
                  organizationId
                }
              }
            },
            data: {
              order: card.order,
              listId: card.listId
            }
          })
        );

        const cards = await db.$transaction(transaction);

        if (!cards) {
          throw new Error("Failed to reorder card");
        }

        return c.json({
          data: cards,
          success: true,
          error: null
        }, 200)
        
      } catch(error){
        const message = error instanceof Error ? error.message : "Failed to reorder card.";
      
        return c.json({
          data: null,
          success: false,
          error: message
        }, 500);
      }
    } 
  )
  .delete(
    '/:organizationId/:boardId',
    async (c) => {
      try{
        const user = await currentUser();
  
        // if somehow user is not logged in or don't have an id
        if(!user || !user.id){
          throw new Error("Unauthorized");
        }

        const boardId = c.req.param("boardId");
        const organizationId = c.req.param("organizationId");

        const board = await db.board.findFirst({
          where: {
            id: boardId,
          }
        });
        
        if (!board) {
          throw new Error("Board not found");
        }
        
        // delete:
        const deletedBoard = await db.board.delete({
          where: { id: boardId }
        });

        await decreaseAvailableCount({
          organizationId
        })

        await createAuditLog({
          action: ACTION.DELETE,
          entityId: deletedBoard.id,
          entityTitle: deletedBoard.title,
          entityType: ENTITY_TYPE.BOARD,
          organizationId,
          userId: user.id,
          userName: user.name!,
          userImage: user.image || ""
        })

        return c.json({
          data: deletedBoard,
          success: true,
          error: null
        }, 200);

      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to delete board.";
      
        return c.json({
          data: null,
          success: false,
          error: message
        }, 500);
      }
    }
  );

export default app;