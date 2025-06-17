"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import { z } from "zod";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signInFormSchema } from "@/lib/auth-schema";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function SignIn() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof signInFormSchema>) {
    // Password validation is now handled by Zod schema refinement
    // No need for manual check here

    const { email, password } = values;
    const { error } = await authClient.signIn.email(
      {
        email,
        password,
        callbackURL: "/",
      },
      {
        onRequest(context) {
          console.log("Request initiated:", context);
          toast.loading("Signing in...", {
            id: "signin",
            duration: Infinity,
          });
        },
        onResponse(context) {
          console.log("Response received:", context);
          toast.dismiss("signin");
        },
        onSuccess(context) {
          console.log("Sign in successful:", context);
          form.reset();
          toast.success("Signed in! Redirecting...", {
            duration: 2000,
          });
        },
        onError(context) {
          console.error("Sign in error:", context);
          let message = "Failed to sign in. Please try again.";
          if (typeof context === "string") {
            message = context;
          } else if (
            context &&
            typeof context === "object" &&
            "error" in context &&
            typeof context.error === "string"
          ) {
            message = context.error;
          } else if (
            context &&
            typeof context === "object" &&
            "error" in context &&
            context.error &&
            typeof context.error.message === "string"
          ) {
            message = context.error.message;
          }
          toast.error(message, {
            duration: 4000,
          });
        },
      }
    );

    // Handle error returned from the promise (not via onError handler)
    if (error) {
      toast.error(error.message || "Something went wrong during signup", {
        duration: 4000,
      });
    }
  }
  return (
    <>
      <Card className={cn("w-full max-w-md mx-auto")}>
        <CardHeader>
          <h1 className="font-semibold" data-slot="card-title">
            Sign In
          </h1>
          <CardDescription>Welcome back! Please Sign in to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john@mail.com" {...field} />
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
                      <Input type="password" placeholder="Enter your password" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="w-full" type="submit">
                Sign In
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className={cn("flex justify-center")}>
          <p className={cn("text-sm text-muted-foreground")}>
            Don&apos;t have an account yet?{" "}
            <Link href="/sign-up" className={cn("text-primary hover:underline")}>
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </>
  );
}
