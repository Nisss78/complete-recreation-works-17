
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
import { Bookmark, Coins, CreditCard, LogOut, Settings, User } from "lucide-react";
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
      return data as Profile;
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
        <DropdownMenuContent className="w-56 bg-white rounded-lg shadow-lg p-1 border border-gray-100" align="end" forceMount>
          <DropdownMenuLabel className="flex flex-col space-y-1 px-3 py-2">
            <p className="text-sm font-medium leading-none text-gray-900">
              {profile?.username || t('profile.noUsername')}
            </p>
            <div className="flex items-center pt-2">
              <Coins className="h-4 w-4 text-yellow-500 mr-1.5" />
              <span className="text-xs text-gray-500">{profile?.credits || 0} クレジット</span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-gray-100" />
          <DropdownMenuItem asChild className="cursor-pointer px-3 py-2 mx-1 my-0.5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md">
            <Link to={`/profile/${userId}`} className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              <span>{t('nav.profile')}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer px-3 py-2 mx-1 my-0.5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md">
            <Link to="/settings" className="flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              <span>{t('nav.settings')}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer px-3 py-2 mx-1 my-0.5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md">
            <Link to="/bookmarks" className="flex items-center">
              <Bookmark className="mr-2 h-4 w-4" />
              <span>{t('nav.viewBookmarks')}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer px-3 py-2 mx-1 my-0.5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md">
            <Link to="/my-app" className="flex items-center">
              <CreditCard className="mr-2 h-4 w-4" />
              <span>{t('nav.myApp')}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-gray-100" />
          <DropdownMenuItem 
            onClick={handleSignOut} 
            className="cursor-pointer px-3 py-2 mx-1 my-0.5 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-md"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>{t('nav.logout')}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
