import { NavLink } from "@/components/NavLink";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { ReactNode, useState } from "react";
import { useLocation } from "react-router-dom";

const navItems = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/calendar", label: "Calendar" },
  { to: "/analytics", label: "Analytics" },
  { to: "/templates", label: "Templates", adminOnly: true },
  { to: "/checklists", label: "My Checklists" },
];

const bottomNavItems = [
  { to: "/settings", label: "Settings" },
  { to: "/help", label: "Help & Support" },
];

function AppSidebar() {
  const { user, isAdmin, signOut } = useAuth();
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);

  const filteredItems = navItems.filter(
    (item) => !item.adminOnly || isAdmin
  );

  const getInitials = (email: string) => {
    return email
      .split('@')[0]
      .split('.')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-sidebar-border bg-sidebar shadow-sm"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo & Brand */}
      <div className="relative h-16 flex items-center px-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3 flex-1">
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <h1 className="text-base font-semibold text-sidebar-foreground truncate">
                Transport QC
              </h1>
              <p className="text-xs text-sidebar-foreground/60 truncate">
                Compliance Dashboard
              </p>
            </div>
          )}
          {collapsed && (
            <span className="text-sm font-semibold text-sidebar-foreground">QC</span>
          )}
        </div>

        {/* Collapse toggle button - appears on hover */}
        {(isHovered || collapsed) && (
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSidebar}
            className="absolute -right-10 top-4 h-7 px-2 text-[11px] bg-sidebar shadow-sm"
          >
            {collapsed ? "Expand" : "Collapse"}
          </Button>
        )}
      </div>

      {/* Search - only when expanded */}
      {!collapsed && (
        <div className="px-4 py-3">
          <Input
            placeholder="Search..."
            className="h-9 bg-sidebar-accent/50 border-sidebar-border text-sidebar-foreground text-sm placeholder:text-sidebar-foreground/40"
          />
        </div>
      )}

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider">
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => {
                const isActive = item.to === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(item.to);

                return (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.to}
                        end={item.end}
                        className={({ isActive }) =>
                          [
                            "group relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                            isActive
                              ? "bg-sidebar-primary/10 text-sidebar-primary font-semibold"
                              : "text-sidebar-foreground/70 hover:bg-sidebar-hover hover:text-sidebar-foreground",
                          ].join(" ")
                        }
                      >
                        {({ isActive }) => (
                          <>
                            {isActive && (
                              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-sidebar-primary rounded-r-full" />
                            )}
                            {!collapsed && (
                              <span className="flex-1 text-sm">{item.label}</span>
                            )}

                            {item.adminOnly && !collapsed && (
                              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                                Admin
                              </Badge>
                            )}
                          </>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Bottom Navigation */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {bottomNavItems.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.to}
                      className="group flex items-center px-3 py-2 rounded-lg text-sidebar-foreground/60 hover:bg-sidebar-hover hover:text-sidebar-foreground transition-colors"
                    >
                      {!collapsed && <span className="text-sm">{item.label}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* User Section */}
      <div className="border-t border-sidebar-border p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full h-auto p-2 hover:bg-sidebar-hover transition-colors"
            >
              <div className="flex items-center gap-3 w-full">
                <Avatar className="w-8 h-8 border-2 border-sidebar-border shadow-sm">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white text-xs">
                    {user?.email ? getInitials(user.email) : 'U'}
                  </AvatarFallback>
                </Avatar>

                {!collapsed && (
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-xs font-medium text-sidebar-foreground truncate">
                      {user?.email?.split('@')[0] || 'User'}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      {isAdmin ? (
                        <span className="text-[10px] text-sidebar-primary font-medium">Admin</span>
                      ) : (
                        <span className="text-[10px] text-sidebar-foreground/50">Standard User</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut} className="text-red-600">
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Sidebar>
  );
}

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-background">
        {/* Top Header - Mobile & Desktop */}
        <header className="h-16 sm:h-16 lg:h-18 flex items-center justify-between px-4 sm:px-5 lg:px-6 xl:px-8 border-b border-border bg-card">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="md:hidden" />
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            {/* User Info - Desktop */}
            <div className="hidden md:flex items-center gap-3 lg:gap-4">
              <div className="text-right">
                <p className="text-sm lg:text-base font-medium text-foreground">
                  {user?.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-xs lg:text-sm text-muted-foreground hidden sm:block">
                  {user?.email}
                </p>
              </div>
              <Avatar className="w-9 h-9 lg:w-10 lg:h-10 border-2 border-border">
                <AvatarFallback className="bg-secondary text-secondary-foreground text-sm">
                  {user?.email ? user.email[0].toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 sm:p-5 lg:p-6 xl:p-8">
          <div className="w-full max-w-[95rem] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
