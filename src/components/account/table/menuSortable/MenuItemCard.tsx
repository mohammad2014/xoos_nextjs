"use client";
import { useState } from "react";
import Image from "next/image";
import type { MenuItem } from "@/types/menu";
import { useDictionary } from "@/hooks/use-dictionary";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  GripVertical,
  ChevronDown,
  ChevronRight,
  LinkIcon,
  ImageIcon,
  Globe,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";

interface MenuItemCardProps {
  item: MenuItem;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: number) => void;
  onAddChild: (id: number) => void;
  depth?: number;
}

export function MenuItemCard({
  item,
  onEdit,
  onDelete,
  onAddChild,
  depth = 0,
}: MenuItemCardProps) {
  const { dictionary } = useDictionary();
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id?.toString() ?? String(Date.now()), // اطمینان از وجود ID
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const hasChildren = item.children && item.children.length > 0;

  const levelColors = {
    1: "bg-blue-50 border-blue-200",
    2: "bg-green-50 border-green-200",
    3: "bg-purple-50 border-purple-200",
  };
  const levelBadgeColors = {
    1: "bg-blue-100 text-blue-700",
    2: "bg-green-100 text-green-700",
    3: "bg-purple-100 text-purple-700",
  };

  const displayImageUrl = item.imageUrl ?? "/placeholder.svg";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "animate-fade-in",
        isDragging && "opacity-50",
        depth > 0 && "ms-6 border-muted"
      )}
    >
      <Card
        className={cn(
          "p-4 bg-gradient-card shadow-elegant transition-all duration-300",
          levelColors[item.level as keyof typeof levelColors] || "bg-card",
          isDragging && "ring-2 ring-primary"
        )}
      >
        <div className="flex items-center gap-4">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-primary/10 rounded transition-colors"
          >
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </div>
          {hasChildren && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 h-6 w-6"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          )}
          <div className="relative">
            {displayImageUrl && (
              <Image
                src={displayImageUrl}
                alt={item.title}
                width={64}
                height={64}
                className="rounded-lg object-cover shadow-sm"
              />
            )}

            <div className="absolute -top-2 -right-2">
              <Badge
                className={cn(
                  "text-xs px-2 py-1 shadow-sm",
                  levelBadgeColors[item.level as keyof typeof levelColors]
                )}
              >
                L{item.level}
              </Badge>
            </div>
          </div>
          <div className="flex-1 space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  {dictionary.ui.language.fa}
                </p>
                <h3 className="font-semibold text-foreground">{item.title}</h3>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  {dictionary.ui.language.ar}
                </p>
                <h3 className="font-medium text-foreground" dir="rtl">
                  {item.title_ar ?? ""}
                </h3>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  {dictionary.ui.language.en}
                </p>
                <h3 className="font-medium text-foreground">
                  {item.title_en ?? ""}
                </h3>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <LinkIcon className="h-3 w-3" />
                <code className="px-2 py-1 bg-muted/50 rounded text-xs">
                  {item.link}
                </code>
              </div>
              {item.imageName && (
                <div className="flex items-center gap-1">
                  <ImageIcon className="h-3 w-3" />
                  <span>{item.imageName}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                <span>ترتیب: {item.priority}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAddChild(item.id ?? Date.now())} // مدیریت id پیش‌فرض
              className="h-8 w-8 p-0 hover:bg-green-100 hover:text-green-600 transition-colors"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(item)}
              className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(item.id ?? Date.now())} // مدیریت id پیش‌فرض
              className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
      {hasChildren && isExpanded && (
        <div className="mt-4 space-y-3 animate-slide-up">
          {item.children!.map((child) => (
            <MenuItemCard
              key={child.id?.toString() ?? String(Date.now())} // اطمینان از کلید منحصربه‌فرد
              item={child}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddChild={onAddChild}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
