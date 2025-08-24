
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
    <div className="min-h-screen w-full bg-white flex items-center justify-center">
      <div className="w-full max-w-md px-4 relative">
        <div className="text-center mb-8 relative">
          <Link 
            to="/" 
            className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center text-gray-600 hover:text-gray-900 hover:underline bg-white/80 backdrop-blur-sm rounded-md px-2 py-1 z-10"
            style={{ 
              zIndex: 20,
              position: 'relative',
              display: 'inline-flex'
            }}
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 text-blue-gradient">
            Protoduct
          </h1>
        </div>
        <div className="bg-white py-8 px-4 shadow-xl rounded-xl sm:px-10 border border-gray-100">
          <Auth
            supabaseClient={supabase}
            view="sign_in"
            showLinks={false}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#4f46e5',
                    brandAccent: '#4338ca',
                    inputBackground: 'white',
                    inputBorder: '#e5e7eb',
                    inputBorderFocus: '#4f46e5',
                    inputBorderHover: '#d1d5db',
                    inputLabelText: '#6b7280',
                    inputText: '#374151',
                  },
                  borderWidths: {
                    buttonBorderWidth: '1px',
                    inputBorderWidth: '1px',
                  },
                  radii: {
                    borderRadiusButton: '0.5rem',
                    buttonBorderRadius: '0.5rem',
                    inputBorderRadius: '0.5rem',
                  },
                },
              },
              className: {
                container: 'auth-container',
                button: 'auth-button',
                input: 'auth-input',
                label: 'text-gray-600',
                anchor: 'text-indigo-600 hover:text-indigo-500',
                divider: 'my-4 border-t border-gray-200',
                message: 'text-sm text-gray-600 mt-2',
              },
            }}
            providers={[]}
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
                forgotten_password: {
                  email_label: 'メールアドレス',
                  password_label: 'パスワード',
                  button_label: 'パスワードを再設定',
                  loading_button_label: "送信中...",
                  link_text: "パスワードをお忘れですか？",
                  confirmation_text: "パスワード再設定メールを確認してください",
                },
                magic_link: {
                  email_input_label: 'メールアドレス',
                  button_label: 'マジックリンクを送信',
                  loading_button_label: "送信中...",
                  link_text: "マジックリンクを送信",
                  confirmation_text: "マジックリンクを確認してください",
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
