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
import { createAvatar } from "@dicebear/core";
import { botttsNeutral } from "@dicebear/collection";
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

function Page() {
  const redirectDelayMs = 1500;

  const router = useRouter();
  const isProd = process.env.NODE_ENV === "production";
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
    if (isProd) {
      toast.info("Please use the demo account on sign-in page");
      return;
    }

    try {
      const avatarSvg = createAvatar(botttsNeutral, {
        seed: name,
        backgroundColor: ["b6e3f4", "00acc1", "d1d4f9", "039be5"],
        backgroundType: ["gradientLinear"],
        eyes: ["bulging", "dizzy", "eva", "happy", "hearts", "glow"],
        size: 120,
        radius: 20,
      }).toDataUri();
      const { error } = await authClient.signUp.email(
        {
          email,
          password,
          name,
          image: avatarSvg,
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
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Failed to create account", { duration: 4000 });
    }
  }

  if (isProd) {
    return (
      <Card className={cn("w-full max-w-md mx-auto")}>
        <CardHeader>
          <CardTitle>Sign Ups Disabled</CardTitle>
          <CardDescription>
            New user registrations are disabled in production. Please use the demo account on the sign-in page.
          </CardDescription>
        </CardHeader>
        <CardFooter className={cn("flex justify-center")}>
          <Link href="/sign-in" className={cn("text-primary hover:underline")}>
            Sign in
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className={cn("w-full max-w-md mx-auto")}>
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>Create a new account to get personalized recommendations</CardDescription>
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
            <Button className="w-full" type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Creating account..." : "Submit"}
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
}

export default Page;
