// First, let's split the Header component into smaller parts for better maintainability

import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { ProductSubmissionDialog } from "./ProductSubmissionDialog";
import { supabase } from "@/integrations/supabase/client";
import { UserMenu } from "./header/UserMenu";

export const Header = () => {
  const [showSubmissionDialog, setShowSubmissionDialog] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();

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
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="font-bold text-xl text-gray-900 hover:text-gray-700 transition-colors">
          Producto
        </Link>
        
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Button 
                variant="default"
                className="flex items-center gap-2 bg-[#9b87f5] hover:bg-[#7E69AB] shadow-sm"
                onClick={() => setShowSubmissionDialog(true)}
              >
                <Plus className="w-4 h-4" />
                投稿
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