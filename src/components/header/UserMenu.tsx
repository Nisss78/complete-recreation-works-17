import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Coins } from "lucide-react";
import { Profile } from "@/types/database";
import { useLanguage } from "@/contexts/LanguageContext";

export const UserMenu = ({ userId }: { userId: string }) => {
  const { t } = useLanguage();
  const { data: profile } = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Coins className="h-5 w-5 text-yellow-500" />
        <span className="font-semibold">{t('credits.amount', { amount: profile?.credits || 0 })}</span>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={profile?.avatar_url || ''} alt={profile?.username || t('profile.noUsername')} />
              <AvatarFallback>
                {profile?.username?.[0]?.toUpperCase() || '?'}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuItem asChild>
            <Link to={`/profile/${userId}`}>{t('nav.profile')}</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/settings">{t('nav.settings')}</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/bookmarks">{t('nav.viewBookmarks')}</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/my-app">{t('nav.myApp')}</Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSignOut}>
            {t('nav.logout')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};