
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Globe, User } from "lucide-react";
import type { Language } from "@/contexts/LanguageContext";

const SettingsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUserId(session.user.id);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate("/auth");
      } else if (session) {
        setUserId(session.user.id);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const { data: profile, isLoading, error, refetch } = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        toast({
          title: t('error.occurred'),
          description: t('error.fetchProfile'),
          variant: "destructive",
        });
        throw error;
      }

      return data;
    },
    enabled: !!userId,
  });

  const handleLanguageChange = async (newLanguage: Language) => {
    try {
      await setLanguage(newLanguage);
      toast({
        title: t('success.languageUpdated'),
        description: t('success.languageUpdated'),
      });
    } catch (error) {
      toast({
        title: t('error.occurred'),
        description: t('error.updateLanguage'),
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
        <Header />
        <main className="container max-w-4xl mx-auto py-8 px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-64 bg-white/50 rounded-xl" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      <Header />
      <main className="container max-w-4xl mx-auto py-8 px-4">
        <div className="space-y-8">
          <h1 className="text-2xl font-bold">{t('settings.title')}</h1>
          
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {t('settings.profile')}
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                {t('settings.language')}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>{t('settings.profile')}</CardTitle>
                  <CardDescription>
                    {t('settings.profileSettings')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ProfileForm onSuccess={() => refetch()} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle>{t('settings.language')}</CardTitle>
                  <CardDescription>
                    {t('settings.selectLanguage')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="w-fit">
                            <Select value={language} onValueChange={handleLanguageChange}>
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder={t('settings.selectLanguage')} />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="en">
                                  <div className="flex items-center gap-2">
                                    <span>🇺🇸</span>
                                    <span>English</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="ja">
                                  <div className="flex items-center gap-2">
                                    <span>🇯🇵</span>
                                    <span>日本語</span>
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{t('settings.selectLanguage')}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SettingsPage;
