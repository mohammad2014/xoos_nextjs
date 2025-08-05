"use client";
import type * as React from "react";
import {
  ChevronDown,
  ChevronRight,
  User,
  LogOut,
  UserCircle,
  FileCog,
  Key,
  Store,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useDirection } from "@/hooks/use-direction";
import { useDictionary } from "@/hooks/use-dictionary";
import { useAuth } from "@/contexts/authContext";
import Image from "next/image";
import { Heading } from "../ui/Heading";
import { useState } from "react";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import ChangePasswordForm from "./form/ChangePasswordForm";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [passwordOpen, setPasswordOpen] = useState(false);
  const { lang } = props;
  const direction = useDirection(lang ?? "fa");
  const { dictionary } = useDictionary();
  const { hasPermission, clearAuth } = useAuth();
  const accessUsersUl = hasPermission(
    ["AccessUsers", "AccessRoles", "AccessPermissions"],
    "any"
  );
  const accessWidgetsUl = hasPermission(
    ["AccessSliders", "AccessMenus"],
    "any"
  );
  const { state } = useAuth();
  const settingSection = accessUsersUl || accessWidgetsUl;
  const data = {
    user: {
      name: state.user?.full_name || dictionary.common.noname,
      mobile: state.user?.mobile,
      avatar: state.user?.avatar,
      id: state.user?.id,
    },
    settings: [
      {
        name:
          direction === "right"
            ? dictionary.nav.management + dictionary.nav.users
            : dictionary.nav.users + dictionary.nav.management,
        url: "#",
        icon: User,
        access: accessUsersUl,
        items: [
          {
            title: dictionary.nav.roles,
            url: "/admin/roles",
            access: hasPermission("AccessRoles"),
          },
          {
            title: dictionary.nav.permissions,
            url: "/admin/permissions",
            access: hasPermission("AccessPermissions"),
          },
          {
            title: dictionary.nav.users,
            url: "/admin/users",
            access: hasPermission("AccessUsers"),
          },
        ],
      },
      {
        name:
          direction === "right"
            ? dictionary.nav.management + dictionary.nav.widgets
            : dictionary.nav.widgets + dictionary.nav.management,
        url: "#",
        icon: FileCog,
        access: accessWidgetsUl,
        items: [
          {
            title: dictionary.nav.sliders,
            url: "/admin/sliders",
            access: hasPermission("AccessSliders"),
          },
          {
            title: dictionary.nav.menus,
            url: "/admin/menus",
            access: hasPermission("AccessMenus"),
          },
          {
            title: dictionary.nav.homewidgets,
            url: "/admin/widgets",
            access: hasPermission("AccessWidgets"),
          },
          {
            title: dictionary.nav.socialMedia,
            url: "/admin/socials",
            access: hasPermission("AccessWidgetSocialMedia"),
          },
        ],
      },
    ],
    shop: [
      {
        name:
          direction === "right"
            ? dictionary.nav.management + dictionary.nav.shop
            : dictionary.nav.shop + dictionary.nav.management,
        url: "#",
        icon: Store,
        access: accessUsersUl,
        items: [
          {
            title: dictionary.nav.tags,
            url: "/admin/shop/tags",
            access: hasPermission("AccessShopTags"),
          },
          {
            title: dictionary.nav.groups,
            url: "/admin/shop/groups",
            access: hasPermission("AccessShopTags"),
          },
        ],
      },
    ],
  };

  return (
    <>
      <Sidebar collapsible="icon" {...props} side={direction}>
        <SidebarHeader className="border-b-1 border-primary-200">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <div className="flex relative aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                      {data.user.avatar ? (
                        <Image
                          src={data.user.avatar}
                          alt={data.user.name}
                          fill
                          className="absolute object-cover rounded-full scale-130"
                        />
                      ) : (
                        <User className="size-4" />
                      )}
                    </div>
                    <div className="grid flex-1 text-start ms-1 text-sm leading-tight">
                      <Heading className="mb-2" level={4}>
                        {data.user.name}
                      </Heading>
                      <span className="truncate text-xs">
                        {data.user.mobile}
                      </span>
                    </div>
                    <ChevronDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] text-right min-w-56 rounded-lg"
                  side="bottom"
                  align="end"
                  style={{ direction: direction === "right" ? "rtl" : "ltr" }}
                  sideOffset={4}
                >
                  <DropdownMenuItem>
                    <UserCircle className="mr-2 size-4" />
                    <Link
                      className="w-full text-start"
                      href={`/admin/users/edit/${data.user.id}`}
                    >
                      {dictionary.forms.profile}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPasswordOpen(true)}>
                    <Key className="mr-2 size-4" />
                    {dictionary.forms.changePassword}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => clearAuth()}>
                    <LogOut className="mr-2 size-4" />
                    {dictionary.common.logout}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          {/* settings Section */}
          {settingSection && (
            <SidebarGroup>
              <SidebarGroupLabel>{dictionary.nav.settings}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {data.settings.map((item) => (
                    <Collapsible
                      key={item.name}
                      asChild
                      defaultOpen={item.name === "Website Redesign"}
                      className="group/collapsible"
                    >
                      {item.access && (
                        <SidebarMenuItem>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton tooltip={item.name}>
                              <item.icon />
                              <span>{item.name}</span>
                              <ChevronRight
                                className={`ms-auto ${
                                  direction === "right" && "rotate-180"
                                } transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90`}
                              />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          {item.items?.length ? (
                            <CollapsibleContent>
                              <SidebarMenuSub side={direction}>
                                {item.items.map((subItem) =>
                                  subItem.access ? (
                                    <SidebarMenuSubItem key={subItem.title}>
                                      <SidebarMenuSubButton asChild>
                                        <a href={subItem.url}>
                                          <span>{subItem.title}</span>
                                        </a>
                                      </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                  ) : null
                                )}
                              </SidebarMenuSub>
                            </CollapsibleContent>
                          ) : null}
                        </SidebarMenuItem>
                      )}
                    </Collapsible>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}

          <SidebarGroup>
            <SidebarGroupLabel>{dictionary.nav.shop}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {data.shop.map((item) => (
                  <Collapsible
                    key={item.name}
                    asChild
                    defaultOpen={item.name === "Website Redesign"}
                    className="group/collapsible"
                  >
                    {item.access && (
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton tooltip={item.name}>
                            <item.icon />
                            <span>{item.name}</span>
                            <ChevronRight
                              className={`ms-auto ${
                                direction === "right" && "rotate-180"
                              } transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90`}
                            />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        {item.items?.length ? (
                          <CollapsibleContent>
                            <SidebarMenuSub side={direction}>
                              {item.items.map((subItem) =>
                                subItem.access ? (
                                  <SidebarMenuSubItem key={subItem.title}>
                                    <SidebarMenuSubButton asChild>
                                      <a href={subItem.url}>
                                        <span>{subItem.title}</span>
                                      </a>
                                    </SidebarMenuSubButton>
                                  </SidebarMenuSubItem>
                                ) : null
                              )}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        ) : null}
                      </SidebarMenuItem>
                    )}
                  </Collapsible>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Settings">
              <a href="#">
                <Settings />
                <span>Settings</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter> */}
        <SidebarRail />
      </Sidebar>
      <Dialog open={passwordOpen} onOpenChange={setPasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-sm font-primary-bold text-primary-900">
              {dictionary.common.delete}
            </DialogTitle>
            <DialogDescription>
              {dictionary.common.deleteItemDescription}
            </DialogDescription>
          </DialogHeader>
          <ChangePasswordForm
            onSuccess={() => {
              setPasswordOpen(false);
            }}
            passwordToEditId={state?.user?.id}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
