"use client";

import { Loader2, RotateCcw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDictionary } from "@/hooks/use-dictionary";

interface MenuActionsProps {
  onReset: () => void;
  onSave: () => void;
  isLoading: boolean;
}

export function MenuActions({ onReset, onSave, isLoading }: MenuActionsProps) {
  const { dictionary } = useDictionary();

  return (
    <div className="flex items-center justify-between gap-3 w-full sm:w-auto">
      <Button
        variant="outline"
        onClick={onReset}
        className="flex-1 sm:flex-initial bg-transparent"
      >
        <RotateCcw className="h-4 w-4 mr-2" />
        {dictionary.common.cancel + " " + dictionary.common.changes}
      </Button>
      <Button
        onClick={onSave}
        disabled={isLoading}
        className="flex-1 sm:flex-initial"
      >
        {isLoading ? (
          <Loader2 className="animate-spin" />
        ) : (
          <>
            <Save className="h-4 w-4 mr-2" />
            {dictionary.common.submit + " " + dictionary.common.final}
          </>
        )}
      </Button>
    </div>
  );
}
