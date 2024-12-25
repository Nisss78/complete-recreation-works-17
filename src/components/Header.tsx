import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen, FilePlus, User } from "lucide-react";
import { useState, useEffect } from "react";
import { ProductSubmissionDialog } from "./ProductSubmissionDialog";
import { supabase } from "@/integrations/supabase/client";
import { UserMenu } from "./header/UserMenu";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage } from "@/contexts/LanguageContext";

export const Header = () => {
  const [showSubmissionDialog, setShowSubmissionDialog] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { t } = useLanguage();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);

      if (session?.user?.id) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();
        
        setIsAdmin(profile?.is_admin || false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      if (session?.user?.id) {
        supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profile }) => {
            setIsAdmin(profile?.is_admin || false);
          });
      } else {
        setIsAdmin(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-bold text-xl text-gray-900 hover:text-gray-700 transition-colors">
          Protoduct
        </Link>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            variant="ghost"
            size={isMobile ? "icon" : "default"}
            className="text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            onClick={() => navigate("/articles")}
          >
            <BookOpen className="h-5 w-5" />
            {!isMobile && <span className="ml-2">{t('nav.articles')}</span>}
          </Button>
          
          {isAuthenticated ? (
            <>
              <Button 
                variant="ghost"
                size={isMobile ? "icon" : "default"}
                className="text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => navigate("/articles/new")}
              >
                <FilePlus className="h-5 w-5" />
                {!isMobile && <span className="ml-2">{t('nav.writeArticle')}</span>}
              </Button>

              {isAdmin && (
                <Button 
                  variant="ghost"
                  size={isMobile ? "icon" : "default"}
                  className="text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => setShowSubmissionDialog(true)}
                >
                  <Plus className="h-5 w-5" />
                  {!isMobile && <span className="ml-2">{t('nav.post')}</span>}
                </Button>
              )}

              <UserMenu />
            </>
          ) : (
            <Button 
              variant={isMobile ? "ghost" : "default"}
              size={isMobile ? "icon" : "default"}
              onClick={() => navigate("/auth")}
              className={isMobile ? 
                "text-gray-700 hover:text-gray-900 hover:bg-gray-50" : 
                "bg-white hover:bg-gray-50 text-gray-900"
              }
            >
              {isMobile ? (
                <User className="h-5 w-5" />
              ) : (
                t('nav.login')
              )}
            </Button>
          )}
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