import { useState } from "react";
import { useLocation, Link } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, ChevronDown, ChevronRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { navigationGroups } from "@/lib/constants";
import { useAuth } from "@/hooks/use-auth";
import { getInitials } from "@/lib/utils";
import unionBankLogo from "@assets/image_1768419831653.png";

export function AppSidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const userName = user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email || "User" : "User";

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  return (
    <Sidebar className="border-r-2 border-sidebar-border">
      <SidebarHeader className="p-4 border-b-2 border-sidebar-border">
        <Link href="/" className="flex items-center justify-start">
          <img
            src={unionBankLogo}
            alt="Union Bank"
            className="h-12 w-auto object-contain"
          />
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        {navigationGroups.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="text-xs font-medium text-sidebar-foreground/50 uppercase tracking-wider px-3 mb-2">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = location === item.href ||
                    (item.href !== "/" && location.startsWith(item.href));
                  const hasChildren = item.children && item.children.length > 0;
                  const isOpen = openMenus.includes(item.title);

                  if (hasChildren) {
                    return (
                      <Collapsible
                        key={item.title}
                        open={isOpen}
                        onOpenChange={() => toggleMenu(item.title)}
                      >
                        <SidebarMenuItem>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton
                              isActive={isActive}
                              className="group w-full"
                              data-testid={`nav-${item.href.replace(/\//g, "-").slice(1) || "dashboard"}`}
                            >
                              <item.icon className="w-4 h-4" />
                              <span className="flex-1">{item.title}</span>
                              <ChevronRight
                                className={`w-4 h-4 transition-transform duration-200 ${
                                  isOpen ? "rotate-90" : ""
                                }`}
                              />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {item.children!.map((child) => {
                                const isChildActive = location === child.href;
                                return (
                                  <SidebarMenuSubItem key={child.title}>
                                    <SidebarMenuSubButton
                                      asChild
                                      isActive={isChildActive}
                                    >
                                      <Link href={child.href}>
                                        <child.icon className="w-4 h-4" />
                                        <span>{child.title}</span>
                                      </Link>
                                    </SidebarMenuSubButton>
                                  </SidebarMenuSubItem>
                                );
                              })}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </SidebarMenuItem>
                      </Collapsible>
                    );
                  }

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className="group"
                        data-testid={`nav-${item.href.replace(/\//g, "-").slice(1) || "dashboard"}`}
                      >
                        <Link href={item.href}>
                          <item.icon className="w-4 h-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                      {item.badge !== undefined && item.badge > 0 && (
                        <SidebarMenuBadge className="bg-primary text-primary-foreground text-xs">
                          {item.badge}
                        </SidebarMenuBadge>
                      )}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-4 border-t-2 border-sidebar-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 px-2 h-auto py-2 hover:bg-sidebar-accent"
              data-testid="button-user-menu"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.profileImageUrl || undefined} alt={userName} />
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  {getInitials(userName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start flex-1 min-w-0">
                <span className="text-sm font-medium text-sidebar-foreground truncate w-full text-left">
                  {userName}
                </span>
                <span className="text-xs text-sidebar-foreground/60 truncate w-full text-left">
                  {user?.role || "Super Admin"}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 text-sidebar-foreground/60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem asChild>
              <Link href="/settings" className="cursor-pointer">
                Profile Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => logout()}
              className="text-destructive focus:text-destructive cursor-pointer"
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
