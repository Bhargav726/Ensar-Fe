import { Home, Users, Building2, DollarSign, List, BarChart3, Search, Phone, Settings, ChevronDown, Star, MapPin, Globe, MessageSquare } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
const mainItems = [{
  title: "Home",
  url: "/",
  icon: Home
}];
const prospectItems = [{
  title: "Find people",
  url: "/find-people",
  icon: Users,
  active: true
}, {
  title: "Find companies",
  url: "/find-companies",
  icon: Building2
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
  return <Sidebar className={collapsed ? "w-14" : "w-60"} collapsible="icon">
      <SidebarHeader className="p-4">
        {!collapsed && <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <Star className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg">Ensar Sales</span>
          </div>}
      </SidebarHeader>

      <SidebarContent className="px-2">
        

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map(item => <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url} className="flex items-center gap-2">
                      <item.icon className="w-4 h-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Prospect & manage records</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {prospectItems.map(item => <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={item.active || isActive(item.url)} className={item.active ? "bg-accent text-accent-foreground font-medium" : ""}>
                    <NavLink to={item.url} className="flex items-center gap-2">
                      <item.icon className="w-4 h-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>


        <SidebarGroup>
          <SidebarGroupLabel>Business Data</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {businessItems.map(item => <SidebarMenuItem key={item.title}>
                    <NavLink to={item.url} className="flex items-center gap-2">
                      <item.icon className="w-4 h-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
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