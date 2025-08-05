import type { MenuItem } from "@/types/menu";

export const findItemById = (
  id: number,
  items: MenuItem[]
): MenuItem | null => {
  for (const item of items) {
    if (item.id === id) return item; // item.id is now guaranteed to be a number
    if (item.children) {
      const found = findItemById(id, item.children);
      if (found) return found;
    }
  }
  return null;
};

export const reorderItems = (
  items: MenuItem[],
  activeId: number,
  overId: number
): MenuItem[] => {
  const newItems = [...items];
  const activeItem = findItemById(activeId, newItems);
  const overItem = findItemById(overId, newItems);

  if (!activeItem || !overItem) return newItems;

  // If items are at the same level (same parent or both at top level)
  if (activeItem.parentId === overItem.parentId) {
    const parentItems = activeItem.parentId
      ? findItemById(activeItem.parentId, newItems)?.children || newItems
      : newItems;

    const activeIndex = parentItems.findIndex((item) => item.id === activeId);
    const overIndex = parentItems.findIndex((item) => item.id === overId);

    if (activeIndex !== -1 && overIndex !== -1) {
      const [removed] = parentItems.splice(activeIndex, 1);
      parentItems.splice(overIndex, 0, removed);
      parentItems.forEach((item, index) => {
        item.priority = index + 1;
      });
    }
  } else {
    // Moving between different levels (from one parent to another or to top level)
    const sourceParent = activeItem.parentId
      ? findItemById(activeItem.parentId, newItems)
      : null;
    const sourceItems = sourceParent?.children || newItems;

    const destParent = overItem.parentId
      ? findItemById(overItem.parentId, newItems)
      : null;
    const destItems = destParent?.children || newItems;

    const activeIndex = sourceItems.findIndex((item) => item.id === activeId);
    const overIndex = destItems.findIndex((item) => item.id === overId);

    if (activeIndex !== -1 && overIndex !== -1) {
      const [removed] = sourceItems.splice(activeIndex, 1);
      removed.parentId = overItem.parentId;
      removed.level = overItem.level;
      destItems.splice(overIndex, 0, removed);

      sourceItems.forEach((item, index) => {
        item.priority = index + 1;
      });
      destItems.forEach((item, index) => {
        item.priority = index + 1;
      });
    }
  }
  return newItems;
};

export const updateMenuItem = (
  items: MenuItem[],
  updatedItem: MenuItem
): MenuItem[] => {
  return items.map((item) => {
    if (item.id === updatedItem.id) {
      // item.id is now guaranteed to be a number
      return {
        ...updatedItem,
        children: item.children || updatedItem.children,
      };
    }
    if (item.children) {
      return {
        ...item,
        children: updateMenuItem(item.children, updatedItem),
      };
    }
    return item;
  });
};

export const deleteMenuItem = (items: MenuItem[], id: number): MenuItem[] => {
  return items
    .filter((item) => item.id !== id) // item.id is now guaranteed to be a number
    .map((item) => ({
      ...item,
      children: item.children ? deleteMenuItem(item.children, id) : undefined,
    }));
};

export const addChildToParent = (
  items: MenuItem[],
  parentId: number,
  newChild: MenuItem
): MenuItem[] => {
  return items.map((item) => {
    if (item.id === parentId) {
      // item.id is now guaranteed to be a number
      const children = item.children || [];
      newChild.priority = children.length + 1;
      newChild.level = item.level + 1;
      return {
        ...item,
        children: [...children, newChild],
      };
    }
    if (item.children) {
      return {
        ...item,
        children: addChildToParent(item.children, parentId, newChild),
      };
    }
    return item;
  });
};

export const stripImageFields = (items: MenuItem[]): MenuItem[] => {
  return items.map((item) => {
    const { ...rest } = item;
    return {
      ...rest,
      children: item.children ? stripImageFields(item.children) : undefined,
    };
  });
};
