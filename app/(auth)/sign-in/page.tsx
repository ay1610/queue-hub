"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import { Banner } from "@/components/ui/banner";
import Link from "next/link";
import { z } from "zod";
import { useRegionStore } from "@/lib/stores/region-store";

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
import { Lock, Copy } from "lucide-react";

function Page() {
  const isProd = process.env.NODE_ENV === "production";
  // 1. Define your form.
  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const demoEmail = "demo@example.com";
  const demoPassword = "demo1234";

  function handleDemoButton() {
    form.setValue("email", demoEmail, { shouldDirty: true });
    form.setValue("password", demoPassword, { shouldDirty: true });
    toast.success("Demo credentials applied", { duration: 2000 });
    setTimeout(() => {
      onSubmit({ email: demoEmail, password: demoPassword });
    }, 1000);
  }

  async function handleCopy(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label} copied`, { duration: 1500 });
    } catch {
      toast.error("Copy failed");
    }
  }

  // 2. Define a submit handler.
  const [signedIn, setSignedIn] = React.useState(false);

  React.useEffect(() => {
    if (signedIn) {
      useRegionStore.getState().initializeFromCookie();
    }
  }, [signedIn]);

  async function onSubmit(values: z.infer<typeof signInFormSchema>) {
    const { email, password } = values;
    const { error } = await authClient.signIn.email(
      {
        email,
        password,
        callbackURL: "/",
      },
      {
        onRequest() {
          toast.loading("Signing in...", {
            id: "signin",
            duration: Infinity,
          });
        },
        onResponse() {
          toast.dismiss("signin");
        },
        onSuccess() {
          form.reset();
          setSignedIn(true);
          toast.success("Signed in! Redirecting...", {
            duration: 2000,
          });
        },
        onError(context) {
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
      toast.error(error.message || "Failed to sign in. Please try again.", {
        duration: 4000,
      });
    }
  }

  // React effect to initialize region store after sign-in

  return (
    <>

      <Card className={cn("w-full max-w-md mx-auto")}>
        {isProd && (
          <div className="px-4 pt-4">
            <Banner className="text-sm rounded-lg p-3 bg-white/95 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 shadow-sm">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-slate-500 dark:text-slate-300" aria-hidden />
                  <span className="font-medium text-slate-800 dark:text-slate-100">Try the demo account</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600 dark:text-slate-300">Email</span>
                  <code className="font-mono text-sm px-2 py-1 rounded bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100">{demoEmail}</code>
                  <button
                    type="button"
                    onClick={() => handleCopy(demoEmail, "Email")}
                    aria-label="Copy demo email"
                    className="p-1 rounded text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                  >
                    <Copy className="h-4 w-4" aria-hidden />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600 dark:text-slate-300">Password</span>
                  <code className="font-mono text-sm px-2 py-1 rounded bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100">{demoPassword}</code>
                  <button
                    type="button"
                    onClick={() => handleCopy(demoPassword, "Password")}
                    aria-label="Copy demo password"
                    className="p-1 rounded text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                  >
                    <Copy className="h-4 w-4" aria-hidden />
                  </button>
                </div>
                <div className="flex justify-end">
                  <Button type="button" size="sm" onClick={handleDemoButton} aria-label="Fill demo credentials">
                    Use demo
                  </Button>
                </div>
              </div>
            </Banner>
          </div>
        )}
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

export default Page;
