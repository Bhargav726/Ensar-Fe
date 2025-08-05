
import { AppSidebar } from "@/components/AppSidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <AppSidebar />
        
        <main className="flex flex-1 flex-col overflow-hidden">
          <header className="h-12 flex items-center border-b border-border bg-background px-4 shrink-0">
            <SidebarTrigger className="mr-2" />
          </header>

          <div className="flex-1 overflow-hidden">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
