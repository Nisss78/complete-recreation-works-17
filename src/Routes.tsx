import { Routes as RouterRoutes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Articles from "@/pages/Articles";
import ArticleDetail from "@/pages/ArticleDetail";
import ArticleNew from "@/pages/ArticleNew";
import Auth from "@/pages/Auth";
import Index from "@/pages/Index";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import Bookmarks from "@/pages/Bookmarks";
import MyApp from "@/pages/MyApp";
import Chat from "@/pages/Chat";

export const Routes = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <RouterRoutes>
      <Route path="/" element={<Index />} />
      <Route path="/articles" element={<Articles />} />
      <Route path="/articles/:id" element={<ArticleDetail />} />
      <Route path="/articles/new" element={<ArticleNew />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile/:id" element={<Profile />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/bookmarks" element={<Bookmarks />} />
      <Route path="/my-app" element={<MyApp />} />
      <Route path="/chat" element={<Chat />} />
    </RouterRoutes>
  );
};