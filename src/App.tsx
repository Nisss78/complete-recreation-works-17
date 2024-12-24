import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { BookmarkSidebar } from "@/components/BookmarkSidebar";
import Index from "./pages/Index";
import AuthPage from "./pages/Auth";
import ProfilePage from "./pages/Profile";
import SettingsPage from "./pages/Settings";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider>
          <BrowserRouter basename="/">
            <Toaster />
            <Sonner />
            <div className="flex w-full">
              <Routes>
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/posts/:productId" element={<Index />} />
                <Route path="/" element={<Index />} />
              </Routes>
              <BookmarkSidebar />
            </div>
          </BrowserRouter>
        </SidebarProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;