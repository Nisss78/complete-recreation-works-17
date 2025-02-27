
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";

const SettingsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const { language, setLanguage, t } = useLanguage();
  const isMobile = useIsMobile();

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

  const handleLanguageChange = async (value: string) => {
    try {
      await setLanguage(value as 'en' | 'ja');
      toast({
        title: t('success.languageUpdated'),
      });
    } catch (error) {
      console.error('Error updating language preference:', error);
      toast({
        title: t('error.occurred'),
        description: t('error.updateLanguage'),
        variant: "destructive",
      });
    }
  };

  if (!userId) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="container max-w-4xl mx-auto py-8 px-4">
          <div className="flex items-center justify-center h-32">
            <div className="animate-pulse text-gray-500">{t('common.loading')}</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container max-w-4xl mx-auto py-4 sm:py-8 px-4 sm:px-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('common.settings')}</h1>
            <p className="text-gray-500 mt-1">{t('settings.description')}</p>
          </div>

          <div className="p-4 sm:p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('settings.language')}</h2>
              <p className="text-gray-500 mb-4">{t('settings.languageDescription')}</p>
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-full sm:w-[280px]">
                  <SelectValue placeholder={t('settings.selectLanguage')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ja">日本語</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid grid-cols-2 sm:w-[400px] mb-4">
              <TabsTrigger value="profile">{t('common.profile')}</TabsTrigger>
              <TabsTrigger value="account">{t('common.account')}</TabsTrigger>
            </TabsList>
            <TabsContent value="profile" className="p-0">
              <div className="p-4 sm:p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
                <ProfileForm />
              </div>
            </TabsContent>
            <TabsContent value="account" className="p-0">
              <div className="p-4 sm:p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('settings.accountSettings')}</h2>
                <p className="text-gray-500">{t('settings.accountDescription')}</p>
                
                {/* アカウント設定項目をここに追加 */}
                <div className="mt-4">
                  <p className="text-sm text-gray-500 italic">{t('settings.comingSoon')}</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SettingsPage;
