
import { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ArrowLeft,
  ChevronDown,
  SendHorizontal,
  Settings,
  Share,
  Info, 
  MoreHorizontal,
  Paperclip
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// APIキー用の環境変数名
const API_KEY_NAME = "OPENAI_API_KEY";

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
  const [apiKey, setApiKey] = useState<string | null>(localStorage.getItem(API_KEY_NAME));
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  // 自動スクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // テキストエリアの高さを自動調整
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      if (inputValue) {
        textareaRef.current.style.height = Math.min(
          textareaRef.current.scrollHeight,
          140
        ) + "px";
      }
    }
  }, [inputValue]);

  const saveApiKey = (key: string) => {
    localStorage.setItem(API_KEY_NAME, key);
    setApiKey(key);
    setIsApiKeyModalOpen(false);
    toast({
      title: "APIキーを保存しました",
      description: "ChatGPT APIとの接続が有効になりました",
    });
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === "" || isLoading) return;

    // APIキーがない場合
    if (!apiKey) {
      toast({
        title: "APIキーが設定されていません",
        description: "設定から OpenAI APIキーを設定してください",
        variant: "destructive",
      });
      setIsApiKeyModalOpen(true);
      return;
    }

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

    try {
      // 実際のAPI呼び出し用のコードを準備
      // ここではシミュレーションで実装
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "お手伝いできることがあれば、お気軽にお尋ねください。実際のAPIが接続されると、ここにOpenAIからの応答が表示されます。",
          isUser: false,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
        setIsLoading(false);
      }, 1500);

      /* 
      // 本番環境でのAPI呼び出し
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            ...messages.map(msg => ({
              role: msg.isUser ? "user" : "assistant",
              content: msg.content
            })),
            { role: "user", content: inputValue }
          ],
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.choices[0].message.content,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiMessage]);
      */
    } catch (error) {
      console.error("API Error:", error);
      toast({
        title: "エラーが発生しました",
        description: "メッセージの送信に失敗しました。APIキーを確認してください。",
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

  // APIキー入力モーダル（ここはDummy）
  const ApiKeyModal = () => {
    if (!isApiKeyModalOpen) return null;
    
    const [tempApiKey, setTempApiKey] = useState("");
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-medium mb-4">OpenAI APIキーの設定</h3>
          <p className="text-sm text-gray-600 mb-4">
            OpenAI APIキーを入力してください。キーは安全にローカルに保存されます。
          </p>
          <input
            type="password"
            value={tempApiKey}
            onChange={(e) => setTempApiKey(e.target.value)}
            placeholder="sk-..."
            className="w-full p-2 border rounded mb-4"
          />
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsApiKeyModalOpen(false)}
            >
              キャンセル
            </Button>
            <Button 
              onClick={() => saveApiKey(tempApiKey)}
              disabled={!tempApiKey.startsWith('sk-')}
            >
              保存
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* チャットエリア */}
      <div className="flex-1 flex flex-col overflow-hidden">
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
              variant="ghost" 
              size="icon" 
              className="rounded-lg"
              onClick={() => setIsApiKeyModalOpen(true)}
            >
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-lg">
              <Share className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-lg">
              <Info className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* メッセージエリア */}
        <ScrollArea className="flex-1 p-4 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-4">
              <h2 className="text-2xl font-bold mb-3">こんにちは、何をお手伝いできますか？</h2>
              <p className="text-gray-500 mb-6 max-w-md">
                質問、アイデア、作文など、どんなことでもお気軽にお尋ねください。
              </p>
              {!apiKey && (
                <Button 
                  variant="outline"
                  onClick={() => setIsApiKeyModalOpen(true)}
                  className="mt-4"
                >
                  APIキーを設定する
                </Button>
              )}
            </div>
          ) : (
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
          )}
        </ScrollArea>

        {/* 入力エリア */}
        <div className="border-t p-3">
          <div className="flex items-end max-w-3xl mx-auto bg-secondary rounded-lg px-3 py-2">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full flex-shrink-0">
              <Paperclip className="h-5 w-5 text-muted-foreground" />
            </Button>
            
            <Textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="メッセージを入力..."
              className="resize-none border-none bg-transparent flex-1 py-2 px-2 focus-visible:ring-0 focus-visible:ring-offset-0 max-h-[140px]"
              style={{ minHeight: '40px' }}
            />
            
            <Button
              onClick={handleSendMessage}
              disabled={inputValue.trim() === "" || isLoading}
              variant="ghost"
              size="icon"
              className={cn(
                "h-9 w-9 rounded-full flex-shrink-0",
                inputValue.trim() ? "text-primary" : "text-muted-foreground"
              )}
            >
              <SendHorizontal className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex justify-between items-center max-w-3xl mx-auto px-3 mt-2">
            <div className="flex items-center gap-2">
              <div className="flex gap-1 items-center text-xs text-muted-foreground">
                <span>GPT-4o</span>
                <ChevronDown className="h-3 w-3" />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1 cursor-pointer">
                <input type="checkbox" className="w-3 h-3" />
                <span className="text-xs text-muted-foreground">ウェブ検索</span>
              </label>
              <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full">
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* APIキー設定モーダル */}
      <ApiKeyModal />
    </div>
  );
};

export default ChatPage;
