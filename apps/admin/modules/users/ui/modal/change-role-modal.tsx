"use client";

import { useEffect } from "react";
import { z } from "zod";
import { Shield, Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
  zodResolver,
} from "@workspace/ui/components/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Button } from "@workspace/ui/components/button";

import { USER_ROLES } from "@workspace/schema";
import { useUpdateUser } from "@workspace/api-client";

const changeRoleSchema = z.object({
  role: z.enum(USER_ROLES),
});

type ChangeRoleFormValues = z.infer<typeof changeRoleSchema>;

interface ChangeRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
  userName: string | null;
  currentRole: string | null;
}

export function ChangeRoleModal({
  isOpen,
  onClose,
  userId,
  userName,
  currentRole,
}: ChangeRoleModalProps) {
  const { mutateAsync: updateUser, isPending } = useUpdateUser();

  const form = useForm<ChangeRoleFormValues>({
    resolver: zodResolver(changeRoleSchema),
    defaultValues: {
      role: "USER",
    },
  });

  useEffect(() => {
    if (isOpen && currentRole) {
      form.reset({ role: currentRole as any });
    }
  }, [isOpen, currentRole, form]);

  const onSubmit = async (data: ChangeRoleFormValues) => {
    if (!userId) return;

    try {
      await updateUser({ id: userId, role: data.role });
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] rounded-3xl p-6 bg-surface shadow-2xl border border-outline/10">
        <DialogHeader className="mb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-2xl bg-primary/10 text-primary">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <DialogTitle className="text-xl font-black text-on-surface">Change Role</DialogTitle>
              <DialogDescription className="text-sm font-medium text-on-surface-variant">
                Update access level for <span className="font-bold text-on-surface">{userName}</span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-primary" />
                    New Role
                  </FormLabel>
                  <Select
                    disabled={isPending}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12 w-full px-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/40 transition-all">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl shadow-ambient border-outline/10">
                      {USER_ROLES.map((role) => (
                        <SelectItem key={role} value={role} className="rounded-lg font-medium cursor-pointer focus:bg-primary/10 focus:text-primary">
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-[11px] font-bold text-rose-500" />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-8 gap-3 sm:gap-0">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={isPending}
                className="h-12 px-6 rounded-2xl font-bold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="h-12 px-8 rounded-2xl font-black bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20"
              >
                {isPending && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                Confirm Role
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
