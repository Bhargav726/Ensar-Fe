
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full overflow-hidden bg-background">
        <AppSidebar />
        
        <main className="flex flex-1 flex-col overflow-hidden">
          <header className="h-12 flex items-center border-b border-border bg-background px-4 shrink-0">
            <SidebarTrigger className="mr-2" />
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Find people</span>
            </div>
          </header>

          <div className="flex-1 overflow-hidden">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
