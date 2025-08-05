import { Button } from "@/components/ui/button";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Building2, Globe, Home, MapPin, MessageSquare, Star, Users } from "lucide-react";
import React from "react";
import { NavLink, useLocation } from "react-router-dom";

const mainItems = [{
  title: "Home",
  url: "/",
  icon: Home
}];

const prospectItems = [{
  title: "Find people",
  url: "/find-people",
  icon: Users
}];

const businessItems = [{
  title: "Business types",
  url: "/business-types",
  icon: Building2,
}, {
  title: "Types by location",
  url: "/types-by-location",
  icon:  MapPin
},{
  title: "Websites",
  url: "/websites",
  icon: Globe
},{
  title: "Sales plans",
  url: "/sales-plans",
  icon: MessageSquare
},{
  title: "Leads",
  url: "/leads",
  icon: Building2
},{
  title: "Leads plans",
  url: "/leads-plans",
  icon: MessageSquare
}];

export function AppSidebar() {
  const {
    state
  } = useSidebar();
  const location = useLocation();
  const collapsed = state === "collapsed";
  const isActive = (path: string) => location.pathname === path;

  const CustomSidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar, state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Button
      ref={ref}
      data-sidebar="trigger"
      variant="ghost"
      size="icon"
      className={cn("h-7 w-7", className)}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      <span className="text-sm font-mono">
        {isCollapsed ? "<<" : ">>"}
      </span>
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
})
CustomSidebarTrigger.displayName = "CustomSidebarTrigger"

  
  return <Sidebar className={collapsed ? "w-24" : "w-60"} collapsible="icon">
      <SidebarHeader className="p-4">
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center flex-shrink-0">
              <Star className="w-4 h-4 text-primary-foreground" />
            </div>
            {!collapsed && <span className="font-semibold text-lg">Ensar Sales</span>}
          </div>
           {!collapsed && <CustomSidebarTrigger className="mr-2" />}
        </div>
      </SidebarHeader>

      <SidebarContent className={`${collapsed ? 'px-0' : 'px-2'}`}>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map(item => <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url} className={`flex items-center ${collapsed ? 'justify-center' : 'gap-2'}`}>
                      <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-4 h-4" />
                      </div>
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>Prospect & manage records</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {prospectItems.map(item => <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url} className={`flex items-center ${collapsed ? 'justify-center' : 'gap-2'}`}>
                      <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-4 h-4" />
                      </div>
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>Business Data</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {businessItems.map(item => <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url} className={`flex items-center ${collapsed ? 'justify-center' : 'gap-2'}`}>
                      <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-4 h-4" />
                      </div>
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-2">
          {!collapsed}
        </div>

      </SidebarContent>
    </Sidebar>;
}
