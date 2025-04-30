import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { CreateCardSchema } from "../schemas";

const app = new Hono()
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

export default app;