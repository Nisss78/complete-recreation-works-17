import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AuthPage from "./pages/Auth";
import ProfilePage from "./pages/Profile";
import SettingsPage from "./pages/Settings";
import BookmarksPage from "./pages/Bookmarks";
import Articles from "./pages/Articles";
import ArticleDetail from "./pages/ArticleDetail";
import ArticleNew from "./pages/ArticleNew";

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
        <BrowserRouter basename="/">
          <Toaster />
          <Sonner />
          <div className="min-h-screen w-full flex">
            <div className="flex-1 flex flex-col">
              <Routes>
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/bookmarks" element={<BookmarksPage />} />
                <Route path="/articles" element={<Articles />} />
                <Route path="/articles/new" element={<ArticleNew />} />
                <Route path="/articles/:id" element={<ArticleDetail />} />
                <Route path="/posts/:productId" element={<Index />} />
                <Route path="/" element={<Index />} />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;