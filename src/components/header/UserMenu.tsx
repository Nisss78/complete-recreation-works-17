import { User, Settings, LogOut, Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
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
import { Button } from "@/components/ui/button";

export const UserMenu = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { bookmarks } = useBookmarks();

  const handleLogout = async () => {
    console.log("Starting logout process...");
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Current session:", session);

      if (!session) {
        console.log("No active session found, clearing local state only");
        navigate("/auth");
        return;
      }

      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Signout error:", error);
        if (error.message.includes("session_not_found")) {
          navigate("/auth");
          return;
        }
        throw error;
      }

      toast({
        title: "ログアウト完了",
        description: "ログアウトしました",
      });
      navigate("/auth");
      
    } catch (error) {
      console.error("Logout process error:", error);
      
      toast({
        title: "注意",
        description: "セッションをクリアしました",
        variant: "destructive",
      });
      
      navigate("/auth");
    }
  };

  return (
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
  );
};