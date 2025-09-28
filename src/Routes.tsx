
import { Routes as RouterRoutes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Articles from "@/pages/Articles";
import ArticleDetail from "@/pages/ArticleDetail";
import ArticleNew from "@/pages/ArticleNew";
import Auth from "@/pages/Auth";
import Index from "@/pages/Index";
import Home from "@/pages/Home";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import Bookmarks from "@/pages/Bookmarks";
import MyApp from "@/pages/MyApp";
import Chat from "@/pages/Chat";
import ProductPage from "@/pages/ProductPage";
import TermsOfService from "@/pages/TermsOfService";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import News from "@/pages/News";
import NewsDetail from "@/pages/NewsDetail";
import Contact from "@/pages/Contact";
import About from "@/pages/About";

export const Routes = () => {
  const location = useLocation();

  useEffect(() => {
    // More reliable scroll reset
    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, 0);
  }, [location.pathname]);

  return (
    <RouterRoutes>
      <Route path="/" element={<Index />} />
      <Route path="/home" element={<Home />} />
      <Route path="/articles" element={<Articles />} />
      <Route path="/articles/:id" element={<ArticleDetail />} />
      <Route path="/articles/new" element={<ArticleNew />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/admin" element={<Auth />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile/:id" element={<Profile />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/bookmarks" element={<Bookmarks />} />
      <Route path="/my-app" element={<MyApp />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/products/:slug" element={<ProductPage />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/news" element={<News />} />
      <Route path="/news/:id" element={<NewsDetail />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/about" element={<About />} />
    </RouterRoutes>
  );
};
