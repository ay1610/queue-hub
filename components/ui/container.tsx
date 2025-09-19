import * as React from "react";
import { cn } from "@/lib/utils";

type ContainerProps = React.HTMLAttributes<HTMLDivElement>;

export function Container({ className, ...props }: ContainerProps) {
    return (
        <div
            className={cn("max-w-4xl mx-auto px-4 mt-16 mb-12", className)}
            {...props}
        />
    );
}