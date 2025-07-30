
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-full flex w-full bg-background">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <header className="h-12 flex items-center border-b border-border bg-background px-4">
            <SidebarTrigger className="mr-2" />
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Find people</span>
            </div>
          </header>
          <div className="flex-1">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
