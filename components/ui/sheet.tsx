"use client";
import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

const Sheet = SheetPrimitive.Root;
const SheetTrigger = SheetPrimitive.Trigger;
const SheetContent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Overlay className="fixed inset-0 z-50 bg-black/30" />
      <SheetPrimitive.Content
        ref={ref}
        className={cn(
          "fixed right-0 top-0 z-50 h-full w-80 bg-white dark:bg-zinc-900 shadow-lg p-6 flex flex-col gap-6",
          className
        )}
        {...props}
      />
    </SheetPrimitive.Portal>
  )
);
SheetContent.displayName = "SheetContent";

export { Sheet, SheetTrigger, SheetContent };
