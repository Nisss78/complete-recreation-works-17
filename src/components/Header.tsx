
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, FileText, MessageSquare, Menu, Home, PenLine, Package, Newspaper, Briefcase, Mail, Building2 } from "lucide-react";
import logoImage from "@/assets/logo.png";
import { useState, useEffect } from "react";
import { ProductSubmissionDialog } from "./ProductSubmissionDialog";
import { supabase } from "@/integrations/supabase/client";
import { UserMenu } from "./header/UserMenu";
import { LanguageToggle } from "./header/LanguageToggle";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export const Header = () => {
  const [showSubmissionDialog, setShowSubmissionDialog] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { t } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      setUserId(session?.user?.id || null);

      if (session?.user?.id) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();
        
        setIsAdmin(profileData?.is_admin || false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      setUserId(session?.user?.id || null);
      if (session?.user?.id) {
        supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profileData }) => {
            setIsAdmin(profileData?.is_admin || false);
          });
      } else {
        setIsAdmin(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const NavItem = ({ path, icon, label }: { path: string; icon: React.ReactNode; label: string }) => (
    <Link 
      to={path} 
      className={cn(
        "inline-flex items-center gap-2 px-2 sm:px-3 py-2 text-[13px] md:text-sm lg:text-[15px] font-medium rounded-xl transition-colors whitespace-nowrap",
        isActive(path)
          ? "bg-white/40 text-[#10c876] shadow-sm"
          : "text-gray-800 hover:bg-white/20 hover:text-[#10c876]"
      )}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </Link>
  );

  const MobileMenu = () => {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="bg-white/20 backdrop-blur-xl border-l border-white/25">
          <SheetHeader className="mb-4">
            <SheetTitle>{t('menu')}</SheetTitle>
          </SheetHeader>
          {/* Language toggle (mobile only, with separator) */}
          <div className="mb-3 pb-2 border-b border-gray-200">
            <LanguageToggle />
          </div>
          <div className="flex flex-col gap-1">
            <SheetClose asChild>
              <Link
                to="/home"
                className={cn(
                  "flex items-center gap-2 px-4 py-3 rounded-md text-sm font-medium",
                  isActive("/home") ? "bg-green-50 text-[#10c876]" : "hover:bg-gray-100"
                )}
              >
                <Home className="h-5 w-5" />
                <span>{t('homeLink') || 'Home'}</span>
              </Link>
            </SheetClose>
            
            <SheetClose asChild>
              <Link
                to="/"
                className={cn(
                  "flex items-center gap-2 px-4 py-3 rounded-md text-sm font-medium",
                  isActive("/") ? "bg-green-50 text-[#10c876]" : "hover:bg-gray-100"
                )}
              >
                <Package className="h-5 w-5" />
                <span>{t('home')}</span>
              </Link>
            </SheetClose>
            
            <SheetClose asChild>
              <Link
                to="/articles"
                className={cn(
                  "flex items-center gap-2 px-4 py-3 rounded-md text-sm font-medium",
                  isActive("/articles") ? "bg-green-50 text-[#10c876]" : "hover:bg-gray-100"
                )}
              >
                <FileText className="h-5 w-5" />
                <span>{t('articles')}</span>
              </Link>
            </SheetClose>
            
            <SheetClose asChild>
              <Link
                to="/news"
                className={cn(
                  "flex items-center gap-2 px-4 py-3 rounded-md text-sm font-medium",
                  isActive("/news") ? "bg-green-50 text-[#10c876]" : "hover:bg-gray-100"
                )}
              >
                <Newspaper className="h-5 w-5" />
                <span>{t('news')}</span>
              </Link>
            </SheetClose>
            
            <SheetClose asChild>
              <Link
                to="/about"
                className={cn(
                  "flex items-center gap-2 px-4 py-3 rounded-md text-sm font-medium",
                  isActive("/about") ? "bg-green-50 text-[#10c876]" : "hover:bg-gray-100"
                )}
              >
                <Building2 className="h-5 w-5" />
                <span>{t('about')}</span>
              </Link>
            </SheetClose>
            
            {/* <SheetClose asChild>
              <Link
                to="/careers"
                className={cn(
                  "flex items-center gap-2 px-4 py-3 rounded-md text-sm font-medium",
                  isActive("/careers") ? "bg-blue-50 text-blue-700" : "hover:bg-gray-100"
                )}
              >
                <Briefcase className="h-5 w-5" />
                <span>{t('careers')}</span>
              </Link>
            </SheetClose> */}
            
            <SheetClose asChild>
              <Link
                to="/contact"
                className={cn(
                  "flex items-center gap-2 px-4 py-3 rounded-md text-sm font-medium",
                  isActive("/contact") ? "bg-green-50 text-[#10c876]" : "hover:bg-gray-100"
                )}
              >
                <Mail className="h-5 w-5" />
                <span>{t('contact')}</span>
              </Link>
            </SheetClose>
            
            {isAuthenticated && (
              <>
                <SheetClose asChild>
                  <Link
                    to="/articles/new"
                    className={cn(
                      "flex items-center gap-2 px-4 py-3 rounded-md text-sm font-medium",
                      isActive("/articles/new") ? "bg-green-50 text-[#10c876]" : "hover:bg-gray-100"
                    )}
                  >
                    <PenLine className="h-5 w-5" />
                    <span>{t('writeArticle')}</span>
                  </Link>
                </SheetClose>
                
                {isAdmin && (
                  <SheetClose asChild>
                    <Link
                      to="/chat"
                      className={cn(
                        "flex items-center gap-2 px-4 py-3 rounded-md text-sm font-medium",
                        isActive("/chat") ? "bg-green-50 text-[#10c876]" : "hover:bg-gray-100"
                      )}
                    >
                      <MessageSquare className="h-5 w-5" />
                      <span>{t('chat')}</span>
                    </Link>
                  </SheetClose>
                )}
                
                {isAdmin && (
                  <SheetClose asChild>
                    <button
                      onClick={() => setShowSubmissionDialog(true)}
                      className="flex items-center gap-2 px-4 py-3 rounded-md text-sm font-medium hover:bg-gray-100 text-left w-full"
                    >
                      <Plus className="h-5 w-5" />
                      <span>{t('post')}</span>
                    </button>
                  </SheetClose>
                )}
              </>
            )}
            
          </div>
        </SheetContent>
      </Sheet>
    );
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 relative"
        style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 10px)", paddingRight: "calc(env(safe-area-inset-right, 0px) + 0px)" }}
      >
        {/* Language toggle pinned to top-right on md+; not inside nav */}
        <div className="hidden md:block absolute right-2 sm:right-4 top-[calc(env(safe-area-inset-top,0px)+6px)] z-[60]">
          <LanguageToggle />
        </div>
        {/* Glass nav bar container (centered, wider for JA labels) */}
        <div className="mt-3 md:mt-4 mb-2 rounded-full liquid-glass-nav max-w-[44rem] md:max-w-[52rem] mx-auto">
          <div className="h-16 md:h-20 px-1.5 sm:px-2 grid grid-cols-[1fr_auto_1fr] items-center">
            {/* Left spacer (keeps center true centered) */}
            <div className="hidden md:block" />

            {/* Center group: logo + nav + contact + user */}
            <div className="flex items-center justify-center gap-1 sm:gap-1.5">
              <Link to="/home" className="flex items-center hover:opacity-90 transition-opacity">
                <img src={logoImage} alt="Protoduct" className="h-12 md:h-16 w-auto" />
              </Link>
              <nav className="hidden md:flex items-center gap-1.5 sm:gap-2">
                <NavItem path="/home" icon={<Home className="h-4 w-4" />} label="Home" />
                <NavItem path="/" icon={<Package className="h-4 w-4" />} label={t('home')} />
                <NavItem path="/articles" icon={<FileText className="h-4 w-4" />} label={t("articles")} />
                <NavItem path="/news" icon={<Newspaper className="h-4 w-4" />} label={t("news")} />
                <NavItem path="/about" icon={<Building2 className="h-4 w-4" />} label={t("about")} />
                {isAuthenticated && isAdmin && (
                  <NavItem path="/chat" icon={<MessageSquare className="h-4 w-4" />} label={t("chat")} />
                )}
              </nav>
              <Button
                onClick={() => navigate('/contact')}
                className={cn(
                  "flex items-center gap-2 font-semibold transition-all duration-300 rounded-full text-white",
                  isActive("/contact") 
                    ? "hover:bg-[#10c876]/80"
                    : "hover:bg-white/30",
                  "liquid-glass-pill"
                )}
                style={{
                  background: isActive("/contact") 
                    ? "linear-gradient(135deg, rgba(123, 198, 30, 0.7) 0%, rgba(16, 200, 118, 0.7) 50%, rgba(21, 184, 229, 0.7) 100%)"
                    : undefined,
                }}
                size="sm"
              >
                <Mail className="h-4 w-4" />
                <span>{t("contact")}</span>
              </Button>
              {userId && <UserMenu userId={userId} />}
            </div>

            {/* Right group: mobile menu (sm). Language toggle stays pinned above on md+ */}
            <div className="flex items-center justify-end gap-2 sm:gap-3">
              <div className="md:hidden">
                <MobileMenu />
              </div>
            </div>
          </div>
        </div>
      </div>

      {showSubmissionDialog && isAuthenticated && (
        <ProductSubmissionDialog 
          open={showSubmissionDialog} 
          onOpenChange={setShowSubmissionDialog} 
        />
      )}
    </header>
  );
};
