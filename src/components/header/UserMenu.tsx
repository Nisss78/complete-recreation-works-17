
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Coins, CreditCard, LogOut, Settings, User } from "lucide-react";
import { Profile } from "@/types/database";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

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
      <div className="hidden sm:flex items-center gap-2">
        <Coins className="h-5 w-5 text-yellow-500" />
        <span className="font-semibold">{profile?.credits || 0}</span>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-transparent focus:ring-0 focus:ring-offset-0">
            <Avatar className="h-9 w-9 border border-primary/10">
              <AvatarImage 
                src={profile?.avatar_url || ''} 
                alt={profile?.username || t('profile.noUsername')} 
                objectPosition={profile?.avatar_position || 'center'}
              />
              <AvatarFallback className="bg-primary/5 text-primary">
                {profile?.username?.[0]?.toUpperCase() || '?'}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {profile?.username || t('profile.noUsername')}
            </p>
            <div className="flex items-center pt-2">
              <Coins className="h-4 w-4 text-yellow-500 mr-1.5" />
              <span className="text-xs text-muted-foreground">{profile?.credits || 0} クレジット</span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link to={`/profile/${userId}`} className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              <span>{t('nav.profile')}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link to="/settings" className="flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              <span>{t('nav.settings')}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link to="/bookmarks" className="flex items-center">
              <CreditCard className="mr-2 h-4 w-4" />
              <span>{t('nav.viewBookmarks')}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link to="/my-app" className="flex items-center">
              <CreditCard className="mr-2 h-4 w-4" />
              <span>{t('nav.myApp')}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600 focus:text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            <span>{t('nav.logout')}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
