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
import ProfessorAvailability from "./pages/student/ProfessorAvailability";
import AskQuestion from "./pages/student/AskQuestion";
import MyQueries from "./pages/student/MyQueries";
import AIAssistant from "./pages/student/AIAssistant";
import BookAppointment from "./pages/student/BookAppointment";
import MyAppointments from "./pages/student/MyAppointments";
import QueriesInbox from "./pages/professor/QueriesInbox";
import OfficeHours from "./pages/professor/OfficeHours";
import Appointments from "./pages/professor/Appointments";
import EngagementStats from "./pages/professor/EngagementStats";
import MyStudents from "./pages/professor/MyStudents";
import AISuggestions from "./pages/professor/AISuggestions";
import UserManagement from "./pages/hod/UserManagement";
import AnalyticsDashboard from "./pages/hod/AnalyticsDashboard";
import AIInsights from "./pages/hod/AIInsights";
import ReputationPanel from "./pages/hod/ReputationPanel";
import SystemSettings from "./pages/hod/SystemSettings";
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
          <Route path="/student/professor-availability" element={<ProfessorAvailability />} />
          <Route path="/student/ask-question" element={<AskQuestion />} />
          <Route path="/student/my-queries" element={<MyQueries />} />
          <Route path="/student/ai-assistant" element={<AIAssistant />} />
          <Route path="/professor-auth" element={<ProfessorAuth />} />
          <Route path="/professor-dashboard" element={<ProfessorDashboard />} />
          <Route path="/professor/queries-inbox" element={<QueriesInbox />} />
          <Route path="/professor/office-hours" element={<OfficeHours />} />
          <Route path="/professor/appointments" element={<Appointments />} />
          <Route path="/professor/engagement-stats" element={<EngagementStats />} />
          <Route path="/professor/my-students" element={<MyStudents />} />
          <Route path="/professor/ai-suggestions" element={<AISuggestions />} />
          <Route path="/hod-auth" element={<HodAuth />} />
          <Route path="/hod-dashboard" element={<HodDashboard />} />
          <Route path="/hod/user-management" element={<UserManagement />} />
          <Route path="/hod/analytics-dashboard" element={<AnalyticsDashboard />} />
          <Route path="/hod/ai-insights" element={<AIInsights />} />
          <Route path="/hod/reputation-panel" element={<ReputationPanel />} />
          <Route path="/hod/system-settings" element={<SystemSettings />} />
          <Route path="/student/book-appointment" element={<BookAppointment />} />
          <Route path="/student/my-appointments" element={<MyAppointments />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
