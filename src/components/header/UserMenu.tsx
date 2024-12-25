import { User, Settings, LogOut, Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
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
  const { t } = useLanguage();

  const { data: articleBookmarks } = useQuery({
    queryKey: ["articleBookmarks"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return [];

      const { data } = await supabase
        .from('article_bookmarks')
        .select(`
          article_id,
          articles (
            id,
            title,
            thumbnail_url,
            created_at,
            profile:profiles!articles_user_id_fkey (
              username,
              avatar_url
            )
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      return data?.map(bookmark => ({
        id: bookmark.articles.id,
        title: bookmark.articles.title,
        thumbnail: bookmark.articles.thumbnail_url,
        author: {
          name: bookmark.articles.profile.username || "Unknown User",
          avatar: bookmark.articles.profile.avatar_url || "/placeholder.svg"
        }
      })) || [];
    }
  });

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
        title: t('success.loggedOut'),
        description: t('success.logoutCompleted'),
      });
      navigate("/auth");
      
    } catch (error) {
      console.error("Logout process error:", error);
      
      toast({
        title: t('error.occurred'),
        description: t('error.sessionCleared'),
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
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel>{t('nav.account')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate("/profile")}>
          <User className="w-4 h-4 mr-2" />
          {t('nav.profile')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/settings")}>
          <Settings className="w-4 h-4 mr-2" />
          {t('nav.settings')}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate("/my-app")}>
          <Bookmark className="w-4 h-4 mr-2" />
          My App
        </DropdownMenuItem>
        <DropdownMenuLabel>Recent Article Bookmarks</DropdownMenuLabel>
        <DropdownMenuGroup className="max-h-[200px] overflow-y-auto">
          {!articleBookmarks || articleBookmarks.length === 0 ? (
            <DropdownMenuItem disabled>
              No bookmarked articles
            </DropdownMenuItem>
          ) : (
            articleBookmarks.map((bookmark) => (
              <DropdownMenuItem
                key={bookmark.id}
                onClick={() => navigate(`/articles/${bookmark.id}`)}
              >
                <div className="flex items-center gap-2 w-full">
                  <img
                    src={bookmark.thumbnail || "/placeholder.svg"}
                    alt={bookmark.title}
                    className="w-8 h-8 rounded object-cover"
                  />
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-sm font-medium truncate">
                      {bookmark.title}
                    </span>
                    <span className="text-xs text-gray-500">
                      By {bookmark.author.name}
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
          {t('nav.logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};