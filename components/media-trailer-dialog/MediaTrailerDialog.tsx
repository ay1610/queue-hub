import * as React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { PlayIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface MediaTrailerDialogProps {
  trailer?: {
    key: string;
    name: string;
  };
}

/**
 * Renders a button that opens a modal dialog to play a YouTube trailer for any media type.
 * @param trailer - The trailer object with YouTube key and name.
 */
export function MediaTrailerDialog({ trailer }: MediaTrailerDialogProps) {
  if (!trailer) return null;
  return (
    <Dialog modal>
      <DialogTrigger asChild>
        <Button size="sm" className={cn("gap-2", "self-start")}>
          <PlayIcon size={18} />
          Watch Trailer
        </Button>
      </DialogTrigger>
      <DialogOverlay className="backdrop-blur-sm" />
      <DialogContent className="!w-[75vw] !max-w-none !sm:max-w-none p-0 bg-black rounded-lg overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
        <VisuallyHidden>
          <DialogTitle>Trailer</DialogTitle>
        </VisuallyHidden>
        <div className="flex items-center justify-end px-6 pt-6 pb-2">
          <DialogClose className="text-white hover:text-gray-300 focus:outline-none text-2xl px-2">
            ×
          </DialogClose>
        </div>
        <div className="relative aspect-video">
          <iframe
            src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
            title={trailer.name}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full rounded-b-lg"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
