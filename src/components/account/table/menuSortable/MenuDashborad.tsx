"use client";
import { useState } from "react";
import {
  DndContext,
  type DragEndEvent,
  type DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useDictionary } from "@/hooks/use-dictionary";
import { useMenuState } from "@/hooks/use-menu";
import {
  findItemById,
  reorderItems,
  updateMenuItem,
  deleteMenuItem,
  addChildToParent,
} from "@/utils/menuUtils";
import type { MenuItem, Menu } from "@/types/menu";
import type { MenuFormData } from "@/schemas/menuSchema";
import { Heading } from "@/components/ui/Heading";
import MenuItemForm from "./MenuItemForm";
import { Button } from "@/components/ui/button";
import { MenuItemCard } from "./MenuItemCard";
import { MenuActions } from "./MenuActions";
import ContainerView from "../../ContainerView";
import ControlledTextInput from "../../input/ControlledTextInput";

interface MenuDashboardProps {
  defaultMenu?: Partial<Menu>;
}

export function MenuDashboard({ defaultMenu }: MenuDashboardProps) {
  const { dictionary } = useDictionary();
  const {
    menu,
    updateMenu,
    updateItems,
    saveAllChanges,
    resetChanges,
    isLoading,
  } = useMenuState(defaultMenu);

  const items = menu.items ?? []; // استفاده از ?? برای بررسی صریح undefined/null
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [parentId, setParentId] = useState<number | null>(null);
  const [defaultLevelForNewItem, setDefaultLevelForNewItem] = useState<
    number | undefined
  >(undefined);
  const [draggedItem, setDraggedItem] = useState<MenuItem | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const draggedId = event.active.id;
    const item = findItemById(Number(draggedId), items);
    if (item) setDraggedItem(item);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setDraggedItem(null);
    if (!over || active.id === over.id) return;

    const activeId = Number(active.id);
    const overId = Number(over.id);

    const newItems = reorderItems(items, activeId, overId);
    updateItems(newItems);
  };

  const handleSaveItem = (
    data: MenuFormData,
    displayImageUrl?: string,
    displayImageName?: string
  ) => {
    let newItem: MenuItem;
    if (editingItem) {
      newItem = {
        ...editingItem,
        title: data.title,
        title_en: data.title_en ?? "",
        title_ar: data.title_ar ?? "",
        link: data.link,
        level: data.level,
        image: data.image,
        imageUrl: displayImageUrl,
        imageName: displayImageName,
      };
      const updatedItems = updateMenuItem(items, newItem);
      updateItems(updatedItems);
    } else {
      newItem = {
        id: Date.now(),
        title: data.title,
        title_en: data.title_en ?? "",
        title_ar: data.title_ar ?? "",
        link: data.link,
        level: data.level,
        image: data.image,
        imageUrl: displayImageUrl,
        imageName: displayImageName,
        priority: 0,
        parentId: parentId ?? undefined,
        children: [],
      };

      if (parentId) {
        const newItems = addChildToParent(items, parentId, newItem);
        updateItems(newItems);
      } else {
        newItem.priority = items.length + 1;
        updateItems([...items, newItem]);
      }
    }
    setIsFormOpen(false);
    setEditingItem(null);
    setParentId(null);
    setDefaultLevelForNewItem(undefined);
  };

  const handleDeleteItem = (id: number) => {
    const newItems = deleteMenuItem(items, id);
    updateItems(newItems);
  };

  const handleAddChild = (parentId: number) => {
    const parentItem = findItemById(parentId, items);
    if (parentItem) {
      setParentId(parentId);
      setDefaultLevelForNewItem(parentItem.level + 1);
      setEditingItem(null);
      setIsFormOpen(true);
    }
  };

  const getAllItems = (items: MenuItem[]): MenuItem[] => {
    return items.flatMap((item) => [
      { ...item, level: item.level || 1 },
      ...(item.children ? getAllItems(item.children) : []),
    ]);
  };

  return (
    <div className="space-y-4 w-full">
      <div className="space-y-2">
        <Heading level={3}>
          {dictionary.common.add + " " + dictionary.nav.menu}
        </Heading>
        <p className="text-primary-600">
          {dictionary.common.addItemDescription}
        </p>
      </div>
      <ContainerView>
        <div className="w-full">
          <div className="mb-6 p-4 border rounded-md bg-muted/20 grid grid-cols-1 md:grid-cols-2 gap-4">
            <ControlledTextInput
              label="عنوان منو"
              name="menuTitle"
              value={menu.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateMenu({ title: e.target.value })
              }
              placeholder="عنوان کلی منو"
            />
            <ControlledTextInput
              label="نام منو (شناسه)"
              name="menuName"
              value={menu.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateMenu({ name: e.target.value })
              }
              placeholder="نام منو برای شناسایی"
            />
            <ControlledTextInput
              label="توضیحات منو"
              name="menuDescription"
              value={menu.description ?? ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateMenu({ description: e.target.value })
              }
              placeholder="توضیحات منو"
            />
          </div>
          <div className="flex items-center justify-between mb-6 flex-wrap-reverse gap-3">
            <Button
              onClick={() => {
                setEditingItem(null);
                setParentId(null);
                setDefaultLevelForNewItem(undefined);
                setIsFormOpen(true);
              }}
              className="w-full sm:w-auto"
            >
              <Plus className="h-4 w-4" />
              {dictionary.ui.form.menuAdd}
            </Button>
            <MenuActions
              onReset={resetChanges}
              onSave={saveAllChanges}
              isLoading={isLoading}
            />
          </div>
          <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <SortableContext
              items={getAllItems(items)
                .filter((item) => item.id !== undefined)
                .map((item) => item.id.toString())}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4 border-1 border-primary-300 rounded-md">
                {items.length === 0 ? (
                  <div className="p-8 text-center">
                    <Heading level={3}>هنوز منویی اضافه نشده</Heading>
                    <p className="text-primary-600 mb-5">
                      برای شروع، اولین آیتم منو را اضافه کنید
                    </p>
                    <Button onClick={() => setIsFormOpen(true)} className="">
                      <Plus className="h-4 w-4" />
                      {dictionary.ui.form.menuAdd}
                    </Button>
                  </div>
                ) : (
                  items.map((item: MenuItem) => (
                    <MenuItemCard
                      key={item.id?.toString() ?? Date.now()} // اطمینان از وجود کلید منحصربه‌فرد
                      item={item}
                      onEdit={(itemToEdit) => {
                        setEditingItem(itemToEdit);
                        setParentId(null);
                        setDefaultLevelForNewItem(undefined);
                        setIsFormOpen(true);
                      }}
                      onDelete={handleDeleteItem}
                      onAddChild={handleAddChild}
                    />
                  ))
                )}
              </div>
            </SortableContext>
            <DragOverlay>
              {draggedItem && (
                <div className="bg-card border border-primary/20 rounded-lg p-4 shadow-elegant opacity-90">
                  <div className="flex items-center gap-3">
                    {draggedItem.imageUrl && (
                      <Image
                        src={draggedItem.imageUrl ?? "/placeholder.svg"}
                        alt={draggedItem.title}
                        width={48}
                        height={48}
                        className="rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold">{draggedItem.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Level {draggedItem.level}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </DragOverlay>
          </DndContext>
          <MenuItemForm
            isOpen={isFormOpen}
            onClose={() => {
              setIsFormOpen(false);
              setEditingItem(null);
              setParentId(null);
              setDefaultLevelForNewItem(undefined);
            }}
            onSave={handleSaveItem}
            editingItem={editingItem}
            defaultLevel={defaultLevelForNewItem}
          />
        </div>
      </ContainerView>
    </div>
  );
}
