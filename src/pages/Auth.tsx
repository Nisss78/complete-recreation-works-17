import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const AuthPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/");
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        navigate("/");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8 relative">
          <Link 
            to="/" 
            className={`absolute left-0 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900 ${isMobile ? 'p-2' : ''}`}
          >
            <Button 
              variant="ghost" 
              size={isMobile ? "icon" : "sm"}
              className={isMobile ? "w-8 h-8 p-0" : ""}
            >
              <ChevronLeft className="w-4 h-4" />
              {!isMobile && <span className="ml-1">Back to Home</span>}
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Protoduct
          </h1>
        </div>
        <div className="bg-white py-8 px-4 shadow-xl rounded-xl sm:px-10 border border-gray-100">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#9b87f5',
                    brandAccent: '#7E69AB',
                  },
                },
              },
              className: {
                container: 'auth-container',
                button: 'auth-button',
                input: 'auth-input',
              },
            }}
            providers={["google"]}
            localization={{
              variables: {
                sign_in: {
                  email_label: 'メールアドレス',
                  password_label: 'パスワード',
                  button_label: 'ログイン',
                  social_provider_text: "{{provider}}でログイン",
                  loading_button_label: "ログイン中...",
                  email_input_placeholder: "メールアドレスを入力",
                  password_input_placeholder: "パスワードを入力",
                },
                sign_up: {
                  email_label: 'メールアドレス',
                  password_label: 'パスワード',
                  button_label: '新規登録',
                  social_provider_text: "{{provider}}で登録",
                  loading_button_label: "登録中...",
                  email_input_placeholder: "メールアドレスを入力",
                  password_input_placeholder: "パスワードを入力",
                },
              },
            }}
            theme="default"
          />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;