
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { FindPeople } from "./components/FindPeople";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Index /></Layout>} />
          <Route path="/find-people" element={<Layout><FindPeople /></Layout>} />
          <Route path="/workflows" element={<Layout><div className="p-6">Workflows Page</div></Layout>} />
          <Route path="/analytics" element={<Layout><div className="p-6">Analytics Page</div></Layout>} />
          <Route path="/find-companies" element={<Layout><div className="p-6">Find Companies Page</div></Layout>} />
          <Route path="/people" element={<Layout><div className="p-6">People Page</div></Layout>} />
          <Route path="/companies" element={<Layout><div className="p-6">Companies Page</div></Layout>} />
          <Route path="/deals" element={<Layout><div className="p-6">Deals Page</div></Layout>} />
          <Route path="/lists" element={<Layout><div className="p-6">Lists Page</div></Layout>} />
          <Route path="/settings" element={<Layout><div className="p-6">Settings Page</div></Layout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
