import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarProvider,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { User, Settings, LogOut, Bell, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
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

  const menuItems = [
    {
      title: "プロフィール",
      icon: User,
      onClick: () => navigate("/profile"),
    },
    {
      title: "マイプロダクト",
      icon: Package,
      onClick: () => navigate("/"),
    },
    {
      title: "設定",
      icon: Settings,
      onClick: () => navigate("/settings"),
    },
    {
      title: "API ダッシュボード",
      icon: Bell,
      onClick: () => navigate("/api"),
    },
    {
      title: "ログアウト",
      icon: LogOut,
      onClick: handleLogout,
    },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        onClick={item.onClick}
                        className="w-full justify-start"
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <div className="flex-1">
          <Header />
          <main className="container mx-auto py-8 px-4">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
};