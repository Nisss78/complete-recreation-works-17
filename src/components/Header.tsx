import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, User, Plus, LogOut } from "lucide-react";
import { useState } from "react";
import { ProductSubmissionDialog } from "./ProductSubmissionDialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const Header = () => {
  const [showSubmissionDialog, setShowSubmissionDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "ログアウト完了",
        description: "ログアウトしました",
      });
      navigate("/auth");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "エラー",
        description: "ログアウトに失敗しました",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="font-bold text-xl">
            Solomaker
          </Link>
          
          <div className="flex items-center gap-4">
            <Button 
              variant="default"
              className="flex items-center gap-2 bg-[#9b87f5] hover:bg-[#7E69AB]"
              onClick={() => setShowSubmissionDialog(true)}
            >
              <Plus className="w-4 h-4" />
              投稿
            </Button>
            <Button variant="ghost" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              記事
            </Button>
            <Button 
              variant="ghost" 
              className="flex items-center gap-2"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              ログアウト
            </Button>
          </div>
        </div>
      </header>

      <ProductSubmissionDialog 
        open={showSubmissionDialog} 
        onOpenChange={setShowSubmissionDialog} 
      />
    </>
  );
};