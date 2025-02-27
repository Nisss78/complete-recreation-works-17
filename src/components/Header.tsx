
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen, FilePlus, User, MessageSquare, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { ProductSubmissionDialog } from "./ProductSubmissionDialog";
import { supabase } from "@/integrations/supabase/client";
import { UserMenu } from "./header/UserMenu";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Header = () => {
  const [showSubmissionDialog, setShowSubmissionDialog] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { t } = useLanguage();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      setUserId(session?.user?.id || null);

      if (session?.user?.id) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('is_admin, username, avatar_url')
          .eq('id', session.user.id)
          .single();
        
        setIsAdmin(profileData?.is_admin || false);
        setProfile(profileData);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      setUserId(session?.user?.id || null);
      if (session?.user?.id) {
        supabase
          .from('profiles')
          .select('is_admin, username, avatar_url')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profileData }) => {
            setIsAdmin(profileData?.is_admin || false);
            setProfile(profileData);
          });
      } else {
        setIsAdmin(false);
        setProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const NavigationMenuDemo = () => {
    return (
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>コンテンツ</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-4 w-[220px]">
                <li>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/articles"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        <div className="text-sm font-medium">{t("nav.articles")}</div>
                      </div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        最新の記事やチュートリアルを読む
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
                {isAuthenticated && (
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/articles/new"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="flex items-center gap-2">
                          <FilePlus className="h-4 w-4" />
                          <div className="text-sm font-medium">{t("nav.writeArticle")}</div>
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          新しい記事を作成する
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                )}
                {isAuthenticated && (
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/chat"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          <div className="text-sm font-medium">{t("nav.chat")}</div>
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          他のユーザーとチャットする
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                )}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
  };

  const MobileMenu = () => {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader className="mb-4">
            <SheetTitle>メニュー</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-4">
            <SheetClose asChild>
              <Link
                to="/articles"
                className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent"
              >
                <BookOpen className="h-5 w-5" />
                <span>{t("nav.articles")}</span>
              </Link>
            </SheetClose>
            
            {isAuthenticated && (
              <>
                <SheetClose asChild>
                  <Link
                    to="/articles/new"
                    className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent"
                  >
                    <FilePlus className="h-5 w-5" />
                    <span>{t("nav.writeArticle")}</span>
                  </Link>
                </SheetClose>
                
                <SheetClose asChild>
                  <Link
                    to="/chat"
                    className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent"
                  >
                    <MessageSquare className="h-5 w-5" />
                    <span>{t("nav.chat")}</span>
                  </Link>
                </SheetClose>
                
                {isAdmin && (
                  <SheetClose asChild>
                    <button
                      onClick={() => setShowSubmissionDialog(true)}
                      className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent text-left w-full"
                    >
                      <Plus className="h-5 w-5" />
                      <span>{t("nav.post")}</span>
                    </button>
                  </SheetClose>
                )}
                
                <SheetClose asChild>
                  <Link
                    to={`/profile/${userId}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent"
                  >
                    <User className="h-5 w-5" />
                    <span>{t("nav.profile")}</span>
                  </Link>
                </SheetClose>
                
                <SheetClose asChild>
                  <Link
                    to="/settings"
                    className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent"
                  >
                    <User className="h-5 w-5" />
                    <span>{t("nav.settings")}</span>
                  </Link>
                </SheetClose>
                
                <SheetClose asChild>
                  <button
                    onClick={async () => await supabase.auth.signOut()}
                    className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent text-left w-full"
                  >
                    <User className="h-5 w-5" />
                    <span>{t("nav.logout")}</span>
                  </button>
                </SheetClose>
              </>
            )}
            
            {!isAuthenticated && (
              <SheetClose asChild>
                <Link
                  to="/auth"
                  className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent"
                >
                  <User className="h-5 w-5" />
                  <span>{t("nav.login")}</span>
                </Link>
              </SheetClose>
            )}
          </div>
        </SheetContent>
      </Sheet>
    );
  };

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-bold text-2xl text-gray-900 hover:text-gray-700 transition-colors">
          Protoduct
        </Link>
        
        <div className="hidden md:flex items-center gap-2 sm:gap-4">
          <NavigationMenuDemo />
          
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <Button 
                  variant="outline"
                  size={isMobile ? "icon" : "default"}
                  className="gap-2"
                  onClick={() => setShowSubmissionDialog(true)}
                >
                  <Plus className="h-4 w-4" />
                  {!isMobile && <span>{t("nav.post")}</span>}
                </Button>
              )}

              {userId && <UserMenu userId={userId} />}
            </>
          ) : (
            <Button 
              variant="outline"
              onClick={() => navigate("/auth")}
              className="gap-2"
            >
              <User className="h-4 w-4" />
              {t("nav.login")}
            </Button>
          )}
        </div>
        
        <div className="md:hidden">
          <MobileMenu />
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
