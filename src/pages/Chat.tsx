
import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ArrowLeft,
  ChevronDown,
  SendHorizontal,
  Settings,
  Share,
  ArrowUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// APIキーを直接設定
const DEFAULT_API_KEY = "AIzaSyDDFVDO9twnoLpzPr7La9ecmX-PsgLWe7k";

type Message = {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
};

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey] = useState<string>(DEFAULT_API_KEY);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [useWebSearch, setUseWebSearch] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  const navigate = useNavigate();

  // 管理者権限チェック
  useEffect(() => {
    const checkAdminStatus = async () => {
      setIsCheckingAdmin(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }
      
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', session.user.id)
        .single();
      
      if (error) {
        console.error("Error checking admin status:", error);
        toast({
          title: "エラーが発生しました",
          description: "管理者権限の確認に失敗しました。",
          variant: "destructive",
        });
        navigate("/");
        return;
      }
      
      setIsAdmin(profileData?.is_admin || false);
      
      // 管理者でない場合はホームページにリダイレクト
      if (!profileData?.is_admin) {
        toast({
          title: "アクセス権限がありません",
          description: "このページは管理者のみアクセスできます。",
          variant: "destructive",
        });
        navigate("/");
        return;
      }
      
      setIsCheckingAdmin(false);
    };

    checkAdminStatus();
  }, [navigate, toast]);

  // 自動スクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 入力時にチャットモードに変更
  useEffect(() => {
    if (inputValue.trim() !== "" && !hasStartedChat) {
      setHasStartedChat(true);
    }
  }, [inputValue, hasStartedChat]);

  const handleSendMessage = async () => {
    if (inputValue.trim() === "" || isLoading) return;

    // ユーザーメッセージを追加
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    setHasStartedChat(true);

    try {
      // Gemini API呼び出し
      try {
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + apiKey, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: messages
                      .map(msg => msg.isUser ? `User: ${msg.content}` : `AI: ${msg.content}`)
                      .join('\n') + `\nUser: ${inputValue}`
                  }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            }
          })
        });

        const data = await response.json();
        
        // 応答を確認
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
          const aiResponse = data.candidates[0].content.parts[0].text;
          
          const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: aiResponse.replace(/^AI: /, ''),
            isUser: false,
            timestamp: new Date(),
          };
          
          setMessages((prev) => [...prev, aiMessage]);
        } else {
          throw new Error('Invalid response from Gemini API');
        }
      } catch (error) {
        console.error("API Error:", error);
        toast({
          title: "エラーが発生しました",
          description: "Gemini APIからの応答に問題がありました。",
          variant: "destructive",
        });

        // エラー時はデモ回答を表示
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "申し訳ありません、Gemini APIとの通信中にエラーが発生しました。しばらくしてからもう一度お試しください。",
          isUser: false,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "エラーが発生しました",
        description: "メッセージの送信に失敗しました。",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderMessageContent = (content: string) => {
    return content.split("\n").map((line, i) => (
      <span key={i}>
        {line}
        {i < content.split("\n").length - 1 && <br />}
      </span>
    ));
  };

  // 管理者権限チェック中のローディング表示
  if (isCheckingAdmin) {
    return (
      <div className="flex flex-col h-screen justify-center items-center bg-white">
        <div className="flex space-x-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse"></div>
          <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse delay-100"></div>
          <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse delay-200"></div>
        </div>
        <p className="text-gray-600">ロード中...</p>
      </div>
    );
  }

  // 管理者でない場合のレンダリングはuseEffectでリダイレクトするので行わない
  if (!isAdmin) {
    return null;
  }

  // ウェルカム画面
  const WelcomeScreen = () => (
    <div className="flex flex-col h-full bg-white">
      {/* ヘッダー */}
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-1 mb-1">
            <ArrowLeft className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-500">ホームに戻る</span>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline"
            size="sm"
            className="rounded-md text-gray-600 border-gray-300 hover:bg-gray-50 hover:border-gray-300 gap-2"
          >
            <Settings className="h-4 w-4" />
            <span className="text-sm">設定</span>
          </Button>
        </div>
      </div>
      
      <div className="mt-2 text-center">
        <Link to="/" className="font-medium text-2xl text-black hover:opacity-90 transition-colors">
          <span className="text-blue-gradient">Protoduct</span>
        </Link>
      </div>
      
      {/* メインコンテンツ */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <h2 className="text-2xl font-bold mb-2">Protoductへようこそ</h2>
        <p className="text-lg text-center text-gray-600 mb-10">
          今日はどのようにお手伝いしましょうか？
        </p>
        
        {/* 入力エリア - 修正済み */}
        <div className="w-full max-w-2xl mb-4">
          <div className="relative bg-gray-50 rounded-2xl shadow-sm">
            <div className="relative">
              <div 
                contentEditable={true}
                className="w-full min-h-[60px] rounded-2xl pl-4 pr-14 py-4 focus:outline-none bg-gray-50 border-none overflow-auto max-h-[140px]"
                onInput={(e) => setInputValue(e.currentTarget.textContent || "")}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                style={{ wordWrap: 'break-word' }}
              ></div>
              {!inputValue && (
                <div className="absolute top-4 left-4 pointer-events-none text-gray-400">
                  メッセージを入力...
                </div>
              )}
            </div>
            
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                variant="ghost"
                size="icon"
                className="rounded-full text-gray-400 hover:text-gray-600"
              >
                <ArrowUp className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <div className="flex justify-between items-center px-2 pt-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Gemini Pro</span>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </div>
            
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="w-3 h-3"
                  checked={useWebSearch}
                  onChange={(e) => setUseWebSearch(e.target.checked)}
                />
                <span className="text-xs text-gray-500">ウェブ検索</span>
              </label>
              <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full p-0">
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // チャットUI
  const ChatUI = () => (
    <div className="flex-1 flex flex-col overflow-hidden bg-white">
      {/* サブヘッダー */}
      <div className="flex items-center justify-between py-2 px-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Link to="/">
            <Button variant="ghost" size="icon" className="rounded-lg">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">AIチャット</h1>
        </div>
        <div className="flex items-center gap-1">
          <Button 
            variant="outline"
            size="sm"
            className="rounded-md text-gray-600 border-gray-300 hover:bg-gray-50 hover:border-gray-300 gap-2"
          >
            <Settings className="h-4 w-4" />
            <span className="text-sm">設定</span>
          </Button>
          <Button 
            variant="outline"
            size="sm"
            className="rounded-md text-gray-600 border-gray-300 hover:bg-gray-50 hover:border-gray-300 gap-2 ml-2"
          >
            <Share className="h-4 w-4" />
            <span className="text-sm">共有</span>
          </Button>
        </div>
      </div>
      
      {/* メッセージエリア */}
      <ScrollArea className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-6 max-w-3xl mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.isUser ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] px-4 py-3 rounded-lg shadow-sm",
                  message.isUser
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                )}
              >
                {renderMessageContent(message.content)}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] px-4 py-3 rounded-lg bg-secondary text-secondary-foreground shadow-sm">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-100"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-200"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* 入力エリア - 修正済み */}
      <div className="border-t p-3">
        <div className="flex items-center max-w-3xl mx-auto bg-gray-50 rounded-xl px-4 py-2">
          <div className="relative w-full">
            <div 
              contentEditable={true}
              className="w-full min-h-[40px] py-2 px-0 focus:outline-none bg-transparent overflow-auto max-h-[140px]"
              onInput={(e) => setInputValue(e.currentTarget.textContent || "")}
              onKeyDown={handleKeyPress}
              style={{ wordWrap: 'break-word' }}
            ></div>
            {!inputValue && (
              <div className="absolute top-2 left-0 pointer-events-none text-gray-400">
                メッセージを入力...
              </div>
            )}
          </div>
          
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            variant="ghost"
            size="icon"
            className={cn(
              "h-9 w-9 rounded-full flex-shrink-0 ml-2",
              inputValue.trim() ? "text-primary" : "text-muted-foreground"
            )}
          >
            <SendHorizontal className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex justify-between items-center max-w-3xl mx-auto px-3 mt-2">
          <div className="flex items-center gap-2">
            <div className="flex gap-1 items-center text-xs text-muted-foreground">
              <span>Gemini Pro</span>
              <ChevronDown className="h-3 w-3" />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1 cursor-pointer">
              <input 
                type="checkbox" 
                className="w-3 h-3"
                checked={useWebSearch}
                onChange={(e) => setUseWebSearch(e.target.checked)}
              />
              <span className="text-xs text-muted-foreground">ウェブ検索</span>
            </label>
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full">
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* チャットが始まっていない場合はウェルカム画面、そうでなければチャットUIを表示 */}
      {!hasStartedChat || messages.length === 0 ? <WelcomeScreen /> : <ChatUI />}
    </div>
  );
};

export default ChatPage;
