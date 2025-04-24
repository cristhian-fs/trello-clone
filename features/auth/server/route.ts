import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator"
import { LoginSchema, RegisterSchema } from "@/schemas";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import bcrypt from "bcryptjs";
import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";

const app = new Hono()
  .post(
    "/register",
    zValidator("json", RegisterSchema),
    async (c) => {
      const { email, name, password} = c.req.valid("json");

      const hashedPassword = await bcrypt.hash(password, 10);

      const existingUser = await getUserByEmail(email);

      if(existingUser) {
        return c.json({error: "Email already in use"})
      }

      await db.user.create({
        data: {
          name,
          email,
          password: hashedPassword
        }
      })

      return c.json({ success: "User created successfully"})
    }
  )
  .post(
    "/login",
    zValidator("json", LoginSchema),
    async (c) => {
      const { email, password } = c.req.valid("json");

      const existingUser = await getUserByEmail(email);

      if(!existingUser || !existingUser.email || !existingUser.password){
        return c.json({ error: "Email does not exist!"}, 401);
      }

      // ⚠️ Verifying passoword
      const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

      if (!isPasswordCorrect) {
        return c.json({ error: "Invalid credentials!" }, 401);
      }

      try{
        await signIn("credentials",{
          email,
          password,
          redirect: false,
        })
        return c.json({ success: "Logged in successfully" });
      } catch(error){
        if(error instanceof AuthError){
          switch(error.cause){
            case "CredentialsSignin":
              return c.json({ error: "Invalid Credentials!" }, 401)
            default: 
              return c.json({ error: "Something went wrong!"}, 500)
          }
        }
        return c.json({ error: JSON.stringify(error) }, 500);
      }
    }
  )
  .post(
    '/logout',
    async () => {
      await signOut();
    }
  )

export default app;