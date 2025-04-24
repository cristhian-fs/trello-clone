"use client"

import { signIn } from "next-auth/react"
import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"

import { Button } from "../ui/button"
import { DEFAULT_LOGIN_REDIRECT } from "@/routes"

export const Social = () => {

  const onClick = (provider: "google" | "github") => {
    signIn(provider, {
      redirectTo: DEFAULT_LOGIN_REDIRECT
    })
  }

  return( 
    <div className="flex items-center w-full gap-x-2">
      <Button 
        size="lg"
        variant="outline"
        onClick={() => onClick("google")}
        className="w-full shrink"
      >
        <FcGoogle className="h-5 w-5"/>
      </Button>
      <Button 
        size="lg"
        variant="outline"
        onClick={() => onClick("github")}
        className="w-full shrink"
      >
        <FaGithub className="h-5 w-5"/>
      </Button>
    </div>
  )
}