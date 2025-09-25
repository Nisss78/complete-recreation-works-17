
import { Routes as RouterRoutes, Route, useLocation } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import LoadingScreen from "@/components/LoadingScreen";

// Lazy load all pages for better performance
const Articles = lazy(() => import("@/pages/Articles"));
const ArticleDetail = lazy(() => import("@/pages/ArticleDetail"));
const ArticleNew = lazy(() => import("@/pages/ArticleNew"));
const Auth = lazy(() => import("@/pages/Auth"));
const Index = lazy(() => import("@/pages/Index"));
const Home = lazy(() => import("@/pages/Home"));
const Profile = lazy(() => import("@/pages/Profile"));
const Settings = lazy(() => import("@/pages/Settings"));
const Bookmarks = lazy(() => import("@/pages/Bookmarks"));
const MyApp = lazy(() => import("@/pages/MyApp"));
const Chat = lazy(() => import("@/pages/Chat"));
const ProductPage = lazy(() => import("@/pages/ProductPage"));
const TermsOfService = lazy(() => import("@/pages/TermsOfService"));
const PrivacyPolicy = lazy(() => import("@/pages/PrivacyPolicy"));
const News = lazy(() => import("@/pages/News"));
const NewsDetail = lazy(() => import("@/pages/NewsDetail"));
const Careers = lazy(() => import("@/pages/Careers"));
const Contact = lazy(() => import("@/pages/Contact"));
const About = lazy(() => import("@/pages/About"));

export const Routes = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Suspense fallback={<LoadingScreen fullScreen />}>
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
        <Route path="/careers" element={<Careers />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
      </RouterRoutes>
    </Suspense>
  );
};
