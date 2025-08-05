
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { FindPeople } from "./components/FindPeople";
import { Layout } from "./components/Layout";
import BusinessType from "./pages/BusinessTypes";
import Index from "./pages/Index";
import Leads from "./pages/Leads";
import LeadsPlans from "./pages/LeadsPlans";
import NotFound from "./pages/NotFound";
import SalesPlans from "./pages/SalesPlans";
import TypesByLocations from "./pages/TypesByLocation";
import WebsitesManager from "./pages/Websites";
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
          <Route path="/business-types" element={<Layout><BusinessType /></Layout>} />
          <Route path="/types-by-location" element={<Layout><TypesByLocations /></Layout>} />
          <Route path="/leads" element={<Layout><Leads /></Layout>} />
          <Route path="/websites" element={<Layout><WebsitesManager /></Layout>} />
          <Route path="/sales-plans" element={<Layout><SalesPlans /></Layout>} />
          <Route path="/leads-plans" element={<Layout><LeadsPlans /></Layout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
