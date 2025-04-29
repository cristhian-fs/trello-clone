import * as z from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { UserRole } from "@prisma/client";

const app = new Hono()
  .get('/:organizationId', async (c) => {
    const user = await currentUser();

    // if somehow user is not logged in
    if(!user){
      return c.json({ error: "Unauthorized" }, 401);
    }

    const organizationId = c.req.param("organizationId");

    // Get the organization members
    const members = await db.membership.findMany({
      where: {
        organizationId
      },
      include: {
        user: true
      }
    });

    return c.json(members);
  })
  .get('/current/:organizationId', async (c) => {
    const user = await currentUser();

    const organizationId = c.req.param("organizationId");

    // if somehow user is not logged in
    if(!user){
      return c.json({ error: "Unauthorized" }, 401);
    }

    // get the current member
    const member = await db.membership.findFirst({
      where: {
        organizationId,
        userId: user.id
      }
    });

    return c.json(member);
  })
  .patch(
    '/:organizationId/:memberId/update-role', 
    zValidator("json", z.object({ role: z.enum(["ADMIN", "MEMBER"])})),
    async (c) => {
    const user = await currentUser();

    const memberId = c.req.param("memberId");
    const organizationId = c.req.param("organizationId");
    const { role } = c.req.valid("json");

    // if somehow user is not logged in
    if (!user) {
      return c.json({ success: false, error: "Unauthorized" }, 401);
    }

    const currentMember = await db.membership.findFirst({
      where: {
        userId: user.id,
        organizationId
      }
    });

    if(role === UserRole.MEMBER) {
      const allMembers = await db.membership.findMany({
        where: {
          organizationId,
          role: UserRole.ADMIN
        }
      });
      
      if(allMembers.length === 1 && allMembers[0].id === memberId){
        return c.json({ success: false, error: "Cannot downgrade the last admin" }, 400);
      }
    }

    // if the current member is not found
    if(!currentMember){
      return c.json({ success: false, error: "Member not found" }, 404);
    }

    // if the current member is not an admin
    if (currentMember.role !== UserRole.ADMIN) {
      return c.json({ success: false, error: "You are not an admin" }, 400);
    }

    if((currentMember.role === "ADMIN" && role === "ADMIN") && (currentMember.userId === memberId)){
      return c.json({ success: false, error: "You're already an admin" }, 400);
    }

    if(currentMember.role === "ADMIN" && role === "MEMBER" && currentMember.userId === memberId){
      return c.json({ success: false, error: "Cannot downgrade yourself" }, 400);
    }

    await db.membership.update({
      where: {
        id: memberId
      },
      data: {
        role
      }
    })

    return c.json({success: true, data: memberId});
  })

export default app;