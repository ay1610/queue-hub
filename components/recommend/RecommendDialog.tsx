import { Dialog, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUsers } from "@/lib/hooks/useUsers";
import { Combobox } from "@/components/ui/combobox";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface RecommendDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mediaId: number | undefined;
  mediaType: "movie" | "tv" | undefined;
  mediaTitle: string;
  onSubmit: (toUserId: string, message: string) => void;
}

const recommendSchema = z.object({
  toUserId: z.string().min(1, { message: "Please select a user." }),
  message: z.string().optional(),
});

type RecommendFormValues = z.infer<typeof recommendSchema>;

export function RecommendDialog({
  open,
  onOpenChange,
  mediaTitle,
  onSubmit,
}: RecommendDialogProps) {
  const { data: userData, isLoading, error } = useUsers();
  const form = useForm<RecommendFormValues>({
    resolver: zodResolver(recommendSchema),
    defaultValues: {
      toUserId: "",
      message: "",
    },
  });

  const handleFormSubmit = async (values: RecommendFormValues) => {
    await onSubmit(values.toUserId, values.message ?? "");
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Recommend this {mediaTitle}</DialogTitle>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <label htmlFor="toUserId" className="block text-sm font-medium mb-1">
              To User
            </label>
            <Controller
              control={form.control}
              name="toUserId"
              render={({ field, fieldState }) => (
                <>
                  <Combobox
                    className="w-full"
                    options={
                      userData?.users.map((user) => ({
                        value: user.id,
                        label: user.name || user.email || "",
                      })) || []
                    }
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={isLoading ? "Loading users..." : "Select a user"}
                    disabled={isLoading}
                  />
                  {fieldState.error && (
                    <div className="text-xs text-red-500 mt-1">{fieldState.error.message}</div>
                  )}
                  {error && <div className="text-xs text-red-500 mt-1">Error loading users</div>}
                </>
              )}
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-1">
              Message
            </label>
            <Controller
              control={form.control}
              name="message"
              render={({ field, fieldState }) => (
                <>
                  <textarea
                    id="message"
                    {...field}
                    className="w-full border rounded px-2 py-1"
                    rows={3}
                  />
                  {fieldState.error && (
                    <div className="text-xs text-red-500 mt-1">{fieldState.error.message}</div>
                  )}
                </>
              )}
            />
          </div>
          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Sending..." : "Send Recommendation"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
