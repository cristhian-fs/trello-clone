"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from 'zod'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { CardWrapper } from "./card-wrapper";

// schemas
import { LoginSchema } from "@/schemas/index"
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSucess } from "../form-sucess";
// import { login } from "@/actions/login";
import Link from "next/link";
import { useLogin } from "@/features/auth/api/use-login";
import { useState } from "react";


export const LoginForm = () => {

  const { mutate, isPending } = useLogin();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  })

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const handleSubmit = (values: z.infer<typeof LoginSchema>) => {
    mutate({
      json: values
    }, {
      onSuccess: () => {
        setSuccess("Registered successfully");
      },
      onError: (error) => {
        setError(error.message);
      }
    })
  }

  return ( 
    <CardWrapper
      headerLabel="Welcome Back"
      backButtonLabel="Don't have an account?"
      backButtonHref="/auth/register"
      showSocial={false}
    >
      <Form {...form}>
        <form 
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-6"
        >
          <div className="space-y-4">
            <FormField 
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      disabled={isPending}
                      placeholder="johndoe@example.com"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField 
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      disabled={isPending}
                      placeholder="********"
                      type="password"
                    />
                  </FormControl>
                  <Button asChild variant="link" size="sm" className="px-0 w-fit">
                    <Link href="/auth/reset">
                      Forgot password
                    </Link>
                  </Button>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError 
            message={error}
          />
          <FormSucess 
            message={success}
          />
            <Button 
              type="submit"
              className="w-full"
              disabled={isPending}
            >
              Login
            </Button>
        </form>
      </Form>
    </CardWrapper>
   );
}