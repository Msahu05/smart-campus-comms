import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import StudentAuth from "./pages/StudentAuth";
import StudentDashboard from "./pages/StudentDashboard";
import ProfessorAuth from "./pages/ProfessorAuth";
import ProfessorDashboard from "./pages/ProfessorDashboard";
import HodAuth from "./pages/HodAuth";
import HodDashboard from "./pages/HodDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/student-auth" element={<StudentAuth />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/professor-auth" element={<ProfessorAuth />} />
          <Route path="/professor-dashboard" element={<ProfessorDashboard />} />
          <Route path="/hod-auth" element={<HodAuth />} />
          <Route path="/hod-dashboard" element={<HodDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
