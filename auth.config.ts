import { NextAuthConfig } from "next-auth";
// import { PrismaAdapter } from "@auth/prisma-adapter";

// import { db } from "@/lib/db";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "@/schemas";
import { getUserByEmail } from "./data/user";
import bcrypt from "bcryptjs";

export default { 
  providers: [
    Credentials({
      async authorize(credentials){
        const validatedFields = LoginSchema.safeParse(credentials);

        if(validatedFields.success) {
          const { password, email } = validatedFields.data;

          const user = await getUserByEmail(email);

          if(!user || !user.password) return null;

          const passwordsMatch = await bcrypt.compare(
            password,
            user.password
          )
          if(passwordsMatch) return user;
        }
        return null
      }
    })
] 
} satisfies NextAuthConfig