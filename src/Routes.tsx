import { Routes as RouterRoutes, Route } from "react-router-dom";
import Articles from "@/pages/Articles";
import ArticleDetail from "@/pages/ArticleDetail";
import ArticleNew from "@/pages/ArticleNew";
import Auth from "@/pages/Auth";
import Index from "@/pages/Index";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import Bookmarks from "@/pages/Bookmarks";

export const Routes = () => {
  return (
    <RouterRoutes>
      <Route path="/" element={<Index />} />
      <Route path="/articles" element={<Articles />} />
      <Route path="/articles/:id" element={<ArticleDetail />} />
      <Route path="/articles/new" element={<ArticleNew />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/profile/:id" element={<Profile />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/bookmarks" element={<Bookmarks />} />
    </RouterRoutes>
  );
};