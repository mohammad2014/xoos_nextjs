import { useTransition } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Dictionary } from "@/lib/dict";

type FailedItem = {
  id: number;
  title: string;
  reason: string[];
};

type ActionResponse = {
  status: string;
  message: string;
  data: {
    ids?: number[];
    failed_items?: FailedItem[];
  };
};

type ConfirmDeleteProps = {
  onCancel: () => void;
  onSuccess: () => void;
  ids: number[];
  action: (ids: number[]) => Promise<ActionResponse>;
  dictionary: Dictionary;
};

export default function ConfirmDelete({
  onCancel,
  onSuccess,
  ids,
  action,
  dictionary,
}: ConfirmDeleteProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    startTransition(async () => {
      try {
        const result = await action(ids);
        console.log(result);

        if (result.status === "success") {
          toast.success(result.message);
          onSuccess();
        } else {
          const description = result.data.failed_items
            ? result.data.failed_items
                .map((item: FailedItem) => `• ${item.reason.join(";")}`)
                .join("\n")
            : undefined;

          toast.error(result.message, {
            description,
          });
        }
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : dictionary.common.error
        );
      }
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-2">
        <Button
          variant="destructive"
          disabled={isPending}
          onClick={handleDelete}
        >
          {isPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            dictionary.common.delete
          )}
        </Button>
        <Button variant="outline" onClick={onCancel}>
          {dictionary.common.cancel}
        </Button>
      </div>
    </div>
  );
}
