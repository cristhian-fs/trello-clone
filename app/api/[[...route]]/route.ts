import { Hono } from "hono";
import { handle } from "hono/vercel";
import authRoutes from "@/features/auth/server/route"
import orgsRoutes from "@/features/organizations/server/route"
import membersRoutes from "@/features/members/server/route"
import boardsRoutes from "@/features/boards/server/route"
import listsRoutes from "@/features/lists/server/route"
import cardsRoutes from "@/features/cards/server/route"

const app = new Hono().basePath('/api')
  .route('/auth', authRoutes)
  .route('/organizations', orgsRoutes)
  .route('/members', membersRoutes)
  .route('/boards', boardsRoutes)
  .route('/lists', listsRoutes)
  .route('/cards', cardsRoutes)

export type AppType = typeof app;

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);