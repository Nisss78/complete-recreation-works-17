
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, FileText, MessageSquare, Menu, Home, PenLine, Package, Newspaper, Briefcase, Mail, Building2 } from "lucide-react";
import logoImage from "@/assets/logo.png";
import { useState, useEffect } from "react";
import { ProductSubmissionDialog } from "./ProductSubmissionDialog";
import { supabase } from "@/integrations/supabase/client";
import { UserMenu } from "./header/UserMenu";
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
        "inline-flex items-center px-3 py-2 text-sm font-medium border-b-2 transition-colors",
        isActive(path) 
          ? "border-blue-500 text-blue-600"
          : "border-transparent text-gray-600 hover:text-blue-600 hover:border-blue-300"
      )}
    >
      <span className="mr-2">{icon}</span>
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
        <SheetContent side="right" className="bg-white">
          <SheetHeader className="mb-4">
            <SheetTitle>{t('menu')}</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-1">
            <SheetClose asChild>
              <Link
                to="/home"
                className={cn(
                  "flex items-center gap-2 px-4 py-3 rounded-md text-sm font-medium",
                  isActive("/home") ? "bg-blue-50 text-blue-700" : "hover:bg-gray-100"
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
                  isActive("/") ? "bg-blue-50 text-blue-700" : "hover:bg-gray-100"
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
                  isActive("/articles") ? "bg-blue-50 text-blue-700" : "hover:bg-gray-100"
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
                  isActive("/news") ? "bg-blue-50 text-blue-700" : "hover:bg-gray-100"
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
                  isActive("/about") ? "bg-blue-50 text-blue-700" : "hover:bg-gray-100"
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
                  isActive("/contact") ? "bg-blue-50 text-blue-700" : "hover:bg-gray-100"
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
                      isActive("/articles/new") ? "bg-blue-50 text-blue-700" : "hover:bg-gray-100"
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
                        isActive("/chat") ? "bg-blue-50 text-blue-700" : "hover:bg-gray-100"
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
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-blue">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-24">
          <div className="flex items-center">
            <Link to="/" className="flex items-center hover:opacity-90 transition-opacity mr-8">
              <img src={logoImage} alt="Protoduct" className="h-20 w-auto" />
            </Link>
            
            <nav className="hidden md:flex items-center space-x-2 flex-1">
              <NavItem path="/home" icon={<Home className="h-4 w-4" />} label="Home" />
              <NavItem path="/" icon={<Package className="h-4 w-4" />} label={t('home')} />
              <NavItem path="/articles" icon={<FileText className="h-4 w-4" />} label={t("articles")} />
              <NavItem path="/news" icon={<Newspaper className="h-4 w-4" />} label={t("news")} />
              <NavItem path="/about" icon={<Building2 className="h-4 w-4" />} label={t("about")} />
              {/* <NavItem path="/careers" icon={<Briefcase className="h-4 w-4" />} label={t("careers")} /> */}
              <Button
                onClick={() => navigate('/contact')}
                className={cn(
                  "flex items-center gap-2 font-semibold ml-2 backdrop-blur-xl border transition-all duration-300",
                  isActive("/contact") 
                    ? "bg-blue-600/70 border-blue-500/50 text-white hover:bg-blue-600/80"
                    : "bg-black/70 border-white/10 text-white hover:bg-black/80 hover:border-white/20 hover:text-blue-600"
                )}
                style={{
                  background: isActive("/contact") 
                    ? "linear-gradient(135deg, rgba(59, 130, 246, 0.7) 0%, rgba(37, 99, 235, 0.7) 100%)"
                    : "linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.6) 100%)",
                  backdropFilter: "blur(10px) saturate(1.2)",
                  WebkitBackdropFilter: "blur(10px) saturate(1.2)",
                }}
                size="sm"
              >
                <Mail className="h-4 w-4" />
                <span>{t("contact")}</span>
              </Button>
              {isAuthenticated && isAdmin && (
                <NavItem path="/chat" icon={<MessageSquare className="h-4 w-4" />} label={t("chat")} />
              )}
            </nav>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            {isAuthenticated ? (
              <>
                <Button 
                  onClick={() => navigate('/articles/new')}
                  className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white hidden md:flex items-center gap-2"
                >
                  <PenLine className="h-4 w-4" />
                  <span>{t('writeArticle')}</span>
                </Button>
                
                {isAdmin && (
                  <Button 
                    variant="outline"
                    size={isMobile ? "icon" : "default"}
                    className="gap-2 hidden md:flex"
                    onClick={() => setShowSubmissionDialog(true)}
                  >
                    <Plus className="h-4 w-4" />
                    {!isMobile && <span>製品を投稿</span>}
                  </Button>
                )}

                {userId && <UserMenu userId={userId} />}
              </>
            ) : null}
            
            <div className="md:hidden">
              <MobileMenu />
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
