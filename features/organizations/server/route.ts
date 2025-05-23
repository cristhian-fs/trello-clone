import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { CreateOrganizationSchema } from "../schemas";

const app = new Hono()
  .get('/', async (c) => {
    const user = await currentUser();

    // if somehow user is not logged in
    if(!user){
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Get organizations directly with a single query using include
    const organizations = await db.organization.findMany({
      where: {
        memberships: {
          some: {
            userId: user.id
          }
        }
      }
    });

    return c.json(organizations);
  })
  .get(
    '/:organizationId',
    async (c) => {
    const organizationId = c.req.param("organizationId");

    try{

      const user = await currentUser();

      // if somehow user is not logged in
      if(!user){
        throw new Error("Unauthorized");
      }
  
      // Get organizations directly with a single query using include
      const organization = await db.organization.findUnique({
        where: {
          id: organizationId
        }
      });
  
      // verify if the user is a member of the organization
      const membership = await db.membership.findFirst({
        where: {
          userId: user.id,
          organizationId: organizationId
        }
      });
  
      if(!organization || !membership){
        throw new Error("Unauthorized");
      }
  
      return c.json({
        data: organization,
        success: true,
        error: null
      });
    } catch(error){
      const message = error instanceof Error ? error.message : "Failed to get organization.";
      
      return c.json({
        data: null,
        success: false,
        error: message
      }, 500);
    }

  })
  .get(
    '/:organizationId/logs',
    async (c) => {
      const organizationId = c.req.param("organizationId");
      try{
        const user = await currentUser();

        // if somehow user is not logged in
        if(!user){
          throw new Error("Unauthorized");
        }

        // membership verification
        const organization = await db.organization.findFirst({
          where: { id: organizationId },
          include: { memberships: true, }
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

        const organizationAudits = await db.auditLog.findMany({
          where: { organizationId, },
          orderBy: { createdAt: "desc" }
        });

        return c.json({
          data: organizationAudits,
          success: true,
          error: null
        });
      } catch(error){
        const message = error instanceof Error ? error.message : "Failed to get organization logs.";
      
        return c.json({
          data: null,
          success: false,
          error: message
        }, 500);
      }
    }
  )
  .get(
    '/:organizationId/boards-remaining',
    async (c) => {
      const organizationId = c.req.param("organizationId");
      try{
        const user = await currentUser();

        // if somehow user is not logged in
        if(!user){
          throw new Error("Unauthorized");
        }

        // membership verification
        const organization = await db.organization.findFirst({
          where: { id: organizationId },
          include: { memberships: true, }
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

        const orgLimit = await db.organizationLimit.findUnique({
          where: { organizationId }
        });
      
        if(!orgLimit){
          return c.json({
            data: 0,
            success: true,
            error: null
          });
        }
      
        return c.json({
          data: orgLimit.count,
          success: true,
          error: null
        });

    } catch(error){
        const message = error instanceof Error ? error.message : "Failed to get organization boards remaining.";
        
        return c.json({
          data: null,
          success: false,
          error: message
        }, 500);
      }
    }
  )
  .post(
    '/', 
    zValidator("form", CreateOrganizationSchema),
    async (c) => {
      const user = await currentUser();
  
      // if somehow user is not logged in or don't have an id
      if(!user || !user.id){
        return c.json({ error: "Unauthorized" }, 401);
      }

      const { name, slug } = c.req.valid("form");

      const existingOrganization = await db.organization.findFirst({
        where: {
          slug
        }
      });

      if(existingOrganization){
        return c.json({ error: "Slug already in use", field: "slug" }, 400);
      }

      // create organization
      const organization = await db.organization.create({
        data: {
          name,
          slug,
          createdBy: user.id,
          membersCount: 1
        }
      });

      if(!organization){
        return c.json({ error: "Failed to create organization" }, 500);
      }

      // create membership
      const membership = await db.membership.create({
        data:{
          userId: user.id,
          organizationId: organization.id,
          role: "ADMIN",
        }
      });

      if(!membership){
        return c.json({ error: "Failed to create membership" }, 500);
      };

      return c.json({
        success: "Organization created successfully"
      });

  })


export default app;