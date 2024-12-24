import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen } from "lucide-react";
import { useState, useEffect } from "react";
import { ProductSubmissionDialog } from "./ProductSubmissionDialog";
import { supabase } from "@/integrations/supabase/client";
import { UserMenu } from "./header/UserMenu";
import { useIsMobile } from "@/hooks/use-mobile";

export const Header = () => {
  const [showSubmissionDialog, setShowSubmissionDialog] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

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
        
        <div className="flex items-center gap-2 sm:gap-4">
          {isAuthenticated ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                onClick={() => navigate("/articles")}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                {!isMobile && "記事"}
              </Button>
              <Button 
                variant="default"
                size="sm"
                className="bg-gradient-to-r from-[#9b87f5] to-[#8e77f3] hover:from-[#8e77f3] hover:to-[#7d63f1] text-white shadow-sm transition-all duration-200 ease-in-out transform hover:scale-105"
                onClick={() => setShowSubmissionDialog(true)}
              >
                <Plus className="w-4 h-4" />
                {!isMobile && "投稿する"}
              </Button>
              <UserMenu />
            </>
          ) : (
            <Button 
              variant="ghost"
              onClick={() => navigate("/auth")}
              className="text-gray-700 hover:text-gray-900"
            >
              ログイン
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