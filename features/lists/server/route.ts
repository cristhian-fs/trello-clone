import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { CreateListSchema, UpdateListSchema } from "../schemas";


const app = new Hono()  
  .post(
    '/:organizationId/:boardId/lists',
    zValidator("form", CreateListSchema),
    async (c) => {
      const organizationId = c.req.param("organizationId");
      const boardId = c.req.param("boardId");

      try{
        const user = await currentUser();
  
        // if somehow user is not logged in or don't have an id
        if(!user || !user.id){
          throw new Error("Unauthorized");
        }

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
            organizationId
          }
        });
        
        if (!board) {
          throw new Error("Board not found or does not belong to the organization");
        }

        const lastList = await db.list.findFirst({
          where: { boardId},
          orderBy: { order: "desc" },
          select: { order: true }
        });

        const newOrder = lastList?.order ? lastList?.order + 1 : 1;

        const list = await db.list.create({
          data: {
            title,
            boardId,
            order: newOrder
          }
        });

        return c.json({
          data: list,
          success: true,
          error: null 
        })

      } catch(error){
        const message = error instanceof Error ? error.message : "Failed to create list.";
      
        return c.json({
          data: null,
          success: false,
          error: message
        }, 500);
      }
    }
  )
  .post(
    '/:organizationId/:boardId/:listId/copy-list',
    async (c) => {
      try{
        const user = await currentUser();
  
        // if somehow user is not logged in or don't have an id
        if(!user || !user.id){
          throw new Error("Unauthorized");
        }

        const organizationId = c.req.param("organizationId");
        const boardId = c.req.param("boardId");
        const listId = c.req.param("listId");

        const organization = await db.organization.findFirst({
          where: {
            id: organizationId
          },
          include: {
            memberships: true,
          }
        });

        const userIsMember = organization?.memberships.some((membership) => membership.userId === user.id);

        if(!organization || !userIsMember){
          throw new Error("Organization not found or you are not a member of this organization");
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

        const listToCopy = await db.list.findFirst({
          where: {
            id: listId,
            boardId,
            board: {
              organizationId
            }
          },
          include: {
            cards: true
          }
        });

        if(!listToCopy){
          throw new Error("List not found");
        }

        const lastList = await db.list.findFirst({
          where: { boardId},
          orderBy: { order: "desc" },
          select: { order: true }
        });

        const newOrder = lastList?.order ? lastList?.order + 1 : 1;

        const list = await db.list.create({
          data: {
            boardId,
            title: `${listToCopy.title} - Copy`,
            order: newOrder,
            cards: {
              createMany: {
                data: listToCopy.cards.map((card) => ({
                  title: card.title,
                  description: card.description,
                  order: card.order,
                }))
              }
            }
          },
          include: {
            cards: true
          }
        })

        return c.json({
          data: list,
          success: true,
          error: null 
        })
      
      } catch(error){
        const message = error instanceof Error ? error.message : "Failed to create list.";
      
        return c.json({
          data: null,
          success: false,
          error: message
        }, 500);
      }
    }
  )
  .get(
    '/:organizationId/:boardId/lists',
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
            organizationId
          }
        })
        
        if (!board) {
          throw new Error("Board not found or does not belong to the organization");
        }
        
        const lists = await db.list.findMany({
          where: {
            boardId,
            board:{
              organizationId
            }
          },
          include: {
            cards: {
              orderBy: {
                order: "asc"
              }
            }
          },
          orderBy: {
            order: "asc"
          }
        })

        return c.json({
          data: lists,
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
  .patch(
    '/:organizationId/:boardId/:listId',
    zValidator("form", UpdateListSchema),
    async (c) => {
      const organizationId = c.req.param("organizationId");
      const boardId = c.req.param("boardId");
      const listId = c.req.param("listId");

      const { title } = c.req.valid("form");

      try{
        const user = await currentUser();
  
        // if somehow user is not logged in or don't have an id
        if(!user || !user.id){
          throw new Error("Unauthorized");
        }

        const list = await db.list.update({
          where: {
            id: listId,
            boardId,
            board: {
              organizationId
            }
          },
          data: {
            title
          }
        });

        return c.json({
          data: list,
          success: true,
          error: null
        }, 200);
        
      } catch(error){
        const message = error instanceof Error ? error.message : "Failed to update list.";
      
        return c.json({
          data: null,
          success: false,
          error: message
        }, 500);
      }
    }
  )
  .delete(
    '/:organizationId/:boardId/:listId',
    async (c) => {
      const boardId = c.req.param("boardId");
      const listId = c.req.param("listId");
      const organizationId = c.req.param("organizationId");

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
            organizationId: organization.id
          }
        });
        
        if (!board) {
          throw new Error("Board not found or doesn't belong to this organization");
        }
        
        const list = await db.list.findFirst({
          where: {
            id: listId,
            boardId,
          }
        });
        
        if (!list) {
          throw new Error("List not found");
        }
        
        // delete:
        const deletedList = await db.list.delete({
          where: { id: listId }
        });

        return c.json({
          data: deletedList,
          success: true,
          error: null
        }, 200);

      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to delete list.";
      
        return c.json({
          data: null,
          success: false,
          error: message
        }, 500);
      }
    }
  )

export default app;