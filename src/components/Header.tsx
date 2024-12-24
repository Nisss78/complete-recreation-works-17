import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen, FilePlus } from "lucide-react";
import { useState, useEffect } from "react";
import { ProductSubmissionDialog } from "./ProductSubmissionDialog";
import { supabase } from "@/integrations/supabase/client";
import { UserMenu } from "./header/UserMenu";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage } from "@/contexts/LanguageContext";

export const Header = () => {
  const [showSubmissionDialog, setShowSubmissionDialog] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { t } = useLanguage();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-bold text-xl text-gray-900 hover:text-gray-700 transition-colors">
          Producto
        </Link>
        
        <div className="flex items-center gap-3 sm:gap-4">
          {isAuthenticated ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-700 hover:text-gray-900 hover:bg-gray-50 h-9"
                onClick={() => navigate("/articles")}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                {!isMobile && t('nav.articles')}
              </Button>
              <Button 
                variant="ghost"
                size="sm"
                className="text-gray-700 hover:text-gray-900 hover:bg-gray-50 h-9"
                onClick={() => navigate("/articles/new")}
              >
                <FilePlus className="w-4 h-4 mr-2" />
                {!isMobile && t('nav.writeArticle')}
              </Button>
              <Button 
                variant="outline"
                size="sm"
                className="bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 h-9"
                onClick={() => setShowSubmissionDialog(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                {!isMobile && t('nav.post')}
              </Button>
              <UserMenu />
            </>
          ) : (
            <Button 
              variant="outline"
              onClick={() => navigate("/auth")}
              className="bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 h-9"
            >
              {t('nav.login')}
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