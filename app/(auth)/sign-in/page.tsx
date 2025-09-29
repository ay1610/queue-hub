"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import { Banner } from "@/components/ui/banner";
import Link from "next/link";
import { z } from "zod";
import { useRegionStore } from "@/lib/stores/region-store";

import React, { useEffect, useRef, useState, useCallback } from "react";
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
import { useSearchParams } from "next/navigation";

function Page() {
  const isProd = process.env.NODE_ENV === "production";
  const searchParams = useSearchParams();
  const manualMode = searchParams.get("manual") === "1"; // ?manual=1 disables auto demo

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

  // State to manage quick auto submit (simplified)
  const [autoDemoSubmitting, setAutoDemoSubmitting] = useState(false);
  const autoDemoTimeoutRef = useRef<number | null>(null); // kept for safety/cleanup though only microtasks now

  const [signedIn, setSignedIn] = useState(false);

  // Submit handler defined early so downstream callbacks can reference it
  const onSubmit = useCallback(async (values: z.infer<typeof signInFormSchema>) => {
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
          type Ctx = { error?: string | { message?: string } };
          if (typeof context === "string") {
            message = context;
          } else if (context && typeof context === "object") {
            const c = context as Ctx;
            if (typeof c.error === "string") {
              message = c.error;
            } else if (c.error && typeof c.error.message === "string") {
              message = c.error.message;
            }
          }
          toast.error(message, { duration: 4000 });
        },
      }
    );

    if (error) {
      toast.error(error.message || "Failed to sign in. Please try again.", {
        duration: 4000,
      });
    }
  }, [form]);

  const handleDemoButton = useCallback((manual = false) => {
    // Immediate credential fill & microtask submit
    form.setValue("email", demoEmail, { shouldDirty: false });
    form.setValue("password", demoPassword, { shouldDirty: false });
    toast.success(manual ? "Demo credentials applied" : "Signing in demo...", { duration: 1000 });
    setAutoDemoSubmitting(true);
    queueMicrotask(() => {
      onSubmit({ email: demoEmail, password: demoPassword });
      setAutoDemoSubmitting(false);
    });
  }, [demoEmail, demoPassword, form, onSubmit]);

  async function handleCopy(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label} copied`, { duration: 1500 });
    } catch {
      toast.error("Copy failed");
    }
  }

  useEffect(() => {
    if (signedIn) {
      useRegionStore.getState().initializeFromCookie();
    }
  }, [signedIn]);

  // Near-instant auto demo: fill + submit immediately on first paint (prod & not manual override)
  useEffect(() => {
    if (isProd && !manualMode) {
      handleDemoButton(false);
    }
    return () => {
      if (autoDemoTimeoutRef.current) {
        window.clearTimeout(autoDemoTimeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manualMode]);

  // Early user interaction guard (if user somehow focuses & types before microtask submit)
  useEffect(() => {
    const subscription = form.watch((_vals, info) => {
      if (autoDemoSubmitting && info.type === "change") {
        // User intervened extremely early; abort auto submit by clearing any residual timeout
        if (autoDemoTimeoutRef.current) {
          window.clearTimeout(autoDemoTimeoutRef.current);
          autoDemoTimeoutRef.current = null;
        }
        setAutoDemoSubmitting(false);
        toast.info("Auto demo aborted", { duration: 1200 });
      }
    });
    return () => subscription.unsubscribe();
  }, [autoDemoSubmitting, form]);

  return (
    <>
      <Card className={cn("w-full max-w-md mx-auto")}>
        {isProd && (
          <div className="px-4 pt-4">
            <Banner className="text-sm rounded-lg p-3 bg-white/95 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 shadow-sm">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-slate-500 dark:text-slate-300" aria-hidden />
                  <span className="font-medium text-slate-800 dark:text-slate-100">Demo account</span>
                  {manualMode && (
                    <span className="text-xs text-amber-600 dark:text-amber-400 border border-amber-300/50 dark:border-amber-600/50 rounded px-2 py-0.5 ml-auto">manual mode</span>
                  )}
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
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => handleDemoButton(true)}
                    aria-label="Use demo credentials"
                    disabled={autoDemoSubmitting}
                    className={cn(autoDemoSubmitting && "opacity-60 cursor-not-allowed")}
                  >
                    {autoDemoSubmitting && (
                      <span className="mr-1 inline-block h-3 w-3 rounded-full bg-emerald-400 animate-ping" />
                    )}
                    Use demo
                  </Button>
                  {manualMode && (
                    <span className="text-[10px] text-slate-500 self-center">Auto login disabled via ?manual=1</span>
                  )}
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
