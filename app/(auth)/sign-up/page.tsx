"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { z } from "zod";

import React, { useEffect } from "react";
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
import { formSchema } from "@/lib/auth-schema";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface SignUpProps {
  /**
   * Delay in milliseconds before redirecting after successful sign up. Defaults to 1500ms.
   * Set to 0 for instant redirect (useful for tests).
   */
  readonly redirectDelayMs?: number;
}

export function SignUp({ redirectDelayMs = 1500 }: SignUpProps) {
  useEffect(() => {
    return () => {};
  }, []);

  const router = useRouter();
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { name, email, password } = values;
    const { error } = await authClient.signUp.email(
      {
        email,
        password,
        name,
        callbackURL: "/sign-in",
      },
      {
        onRequest() {
          toast.loading("Creating your account...", {
            id: "signup",
            duration: Infinity,
          });
        },
        onResponse() {
          toast.dismiss("signup");
        },
        onSuccess() {
          form.reset();
          toast.success("Account created! Redirecting to login...", {
            duration: 2000,
          });
          setTimeout(() => {
            router.push("/sign-in");
          }, redirectDelayMs);
        },
        onError(context) {
          toast.error(
            typeof context === "string" ? context : "Failed to create account. Please try again.",
            { duration: 4000 }
          );
        },
      }
    );
    if (error) {
      toast.error(
        typeof error.message === "string" ? error.message : "Something went wrong during signup",
        { duration: 4000 }
      );
    }
  }
  // Debug: log what is being rendered
  const renderOutput = (
    <Card className={cn("w-full max-w-md mx-auto")}>
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>Welcome back! Please Sign in to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="john doe" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
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
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Confirm your password" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit">
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className={cn("flex justify-center")}>
        <p className={cn("text-sm text-muted-foreground")}>
          Already have an account?{" "}
          <Link href="/sign-in" className={cn("text-primary hover:underline")}>
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );

  return renderOutput;
}
