import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, User, Settings, LogOut, Bookmark } from "lucide-react";
import { useState, useEffect } from "react";
import { ProductSubmissionDialog } from "./ProductSubmissionDialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useBookmarks } from "@/hooks/useBookmarks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";

export const Header = () => {
  const [showSubmissionDialog, setShowSubmissionDialog] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { bookmarks } = useBookmarks();

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

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "ログアウト完了",
        description: "ログアウトしました",
      });
      setIsAuthenticated(false);
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
            Producto
          </Link>
          
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Button 
                  variant="default"
                  className="flex items-center gap-2 bg-[#9b87f5] hover:bg-[#7E69AB]"
                  onClick={() => setShowSubmissionDialog(true)}
                >
                  <Plus className="w-4 h-4" />
                  投稿
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <User className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>アカウント</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      <User className="w-4 h-4 mr-2" />
                      プロフィール
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/settings")}>
                      <Settings className="w-4 h-4 mr-2" />
                      設定
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/bookmarks")}>
                      <Bookmark className="w-4 h-4 mr-2" />
                      ブックマーク一覧を見る
                    </DropdownMenuItem>
                    <DropdownMenuLabel>最近のブックマーク</DropdownMenuLabel>
                    <DropdownMenuGroup className="max-h-[200px] overflow-y-auto">
                      {bookmarks.length === 0 ? (
                        <DropdownMenuItem disabled>
                          ブックマークはありません
                        </DropdownMenuItem>
                      ) : (
                        bookmarks.slice(0, 5).map((bookmark) => (
                          <DropdownMenuItem
                            key={bookmark.id}
                            onClick={() => {
                              const productSlug = bookmark.name
                                .toLowerCase()
                                .replace(/\s+/g, "-");
                              navigate(`/posts/${productSlug}`);
                            }}
                          >
                            <div className="flex items-center gap-2 w-full">
                              <img
                                src={bookmark.icon_url}
                                alt={bookmark.name}
                                className="w-6 h-6 rounded"
                              />
                              <div className="flex flex-col">
                                <span className="text-sm font-medium">
                                  {bookmark.name}
                                </span>
                                <span className="text-xs text-gray-500 truncate">
                                  {bookmark.tagline}
                                </span>
                              </div>
                            </div>
                          </DropdownMenuItem>
                        ))
                      )}
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="w-4 h-4 mr-2" />
                      ログアウト
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button 
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => navigate("/auth")}
              >
                <User className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      </header>

      {showSubmissionDialog && isAuthenticated && (
        <ProductSubmissionDialog 
          open={showSubmissionDialog} 
          onOpenChange={setShowSubmissionDialog} 
        />
      )}
    </>
  );
};