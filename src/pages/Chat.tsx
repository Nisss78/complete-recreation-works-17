
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
  Paperclip,
  ArrowUp,
  RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// APIキー用の環境変数名
const API_KEY_NAME = "GEMINI_API_KEY";

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
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [useWebSearch, setUseWebSearch] = useState(false);

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

  // 入力時にチャットモードに変更
  useEffect(() => {
    if (inputValue.trim() !== "" && !hasStartedChat) {
      setHasStartedChat(true);
    }
  }, [inputValue, hasStartedChat]);

  const saveApiKey = (key: string) => {
    localStorage.setItem(API_KEY_NAME, key);
    setApiKey(key);
    setIsApiKeyModalOpen(false);
    toast({
      title: "APIキーを保存しました",
      description: "Gemini APIキーが正常に保存されました。",
    });
  };

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
      // Gemini API呼び出し (APIキーが設定されている場合)
      if (apiKey) {
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
            content: "申し訳ありません、Gemini APIとの通信中にエラーが発生しました。APIキーが正しいことを確認するか、後でもう一度お試しください。",
            isUser: false,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, aiMessage]);
        }
      } else {
        // APIキーが設定されていない場合はデモ回答を表示
        setTimeout(() => {
          const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: "Gemini APIキーが設定されていません。設定アイコンからAPIキーを設定してください。APIキーは https://ai.google.dev/ から取得できます。",
            isUser: false,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, aiMessage]);
        }, 1000);
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

  // APIキー設定モーダル
  const ApiKeyModal = () => {
    const [inputKey, setInputKey] = useState(apiKey || "");

    return (
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center ${isApiKeyModalOpen ? "" : "hidden"}`}>
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">Gemini APIキーを設定</h2>
          <p className="text-sm text-gray-600 mb-4">
            Gemini APIを使用するには、APIキーが必要です。
            <a href="https://ai.google.dev/" target="_blank" className="text-blue-500 underline ml-1">
              Google AIスタジオ
            </a>
            でAPIキーを取得できます。
          </p>
          <input
            type="text"
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            placeholder="APIキーを入力"
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsApiKeyModalOpen(false)}
            >
              キャンセル
            </Button>
            <Button
              onClick={() => saveApiKey(inputKey)}
              disabled={!inputKey.trim()}
            >
              保存
            </Button>
          </div>
        </div>
      </div>
    );
  };

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
            variant="ghost" 
            size="icon" 
            className="rounded-full"
            onClick={() => setIsApiKeyModalOpen(true)}
          >
            <Settings className="h-5 w-5" />
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
        
        {/* 入力エリア - 画像に合わせて改善 */}
        <div className="w-full max-w-2xl mb-4">
          <div className="relative bg-gray-50 rounded-2xl shadow-sm">
            <Textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="メッセージを入力..."
              className="resize-none min-h-[60px] rounded-2xl pl-10 pr-14 py-4 focus-visible:ring-1 bg-gray-50 border-none"
            />
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute left-2 top-1/2 transform -translate-y-1/2"
            >
              <Paperclip className="h-5 w-5 text-gray-400" />
            </Button>
            
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Button
                onClick={handleSendMessage}
                disabled={inputValue.trim() === ""}
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
                <MoreHorizontal className="h-4 w-4 text-gray-500" />
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

      {/* 入力エリア */}
      <div className="border-t p-3">
        <div className="flex items-end max-w-3xl mx-auto bg-gray-50 rounded-xl px-3 py-2">
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
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* APIキー設定モーダル */}
      <ApiKeyModal />
      
      {/* チャットが始まっていない場合はウェルカム画面、そうでなければチャットUIを表示 */}
      {!hasStartedChat || messages.length === 0 ? <WelcomeScreen /> : <ChatUI />}
    </div>
  );
};

export default ChatPage;
