
import { useState, useRef, useEffect } from "react";
import { Header } from "@/components/Header";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ArrowLeft,
  ChevronDown,
  SendHorizontal,
  Edit,
  Share,
  PlusCircle, 
  MoreHorizontal,
  Paperclip
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  const handleSendMessage = () => {
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

    // AIの返信をシミュレート(実際の実装では非同期APIなどを使用)
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "お手伝いできることがあれば、お気軽にお尋ねください。",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
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

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* ヘッダー */}
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center gap-2">
          <Link to="/">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">AIチャット</h1>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Edit className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Share className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <PlusCircle className="h-5 w-5" />
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
                    "max-w-[80%] px-4 py-3 rounded-2xl",
                    message.isUser
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-800"
                  )}
                >
                  {renderMessageContent(message.content)}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] px-4 py-3 rounded-2xl bg-gray-100 text-gray-500">
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
        <div className="flex items-end max-w-3xl mx-auto bg-gray-100 rounded-2xl px-3 py-2">
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full flex-shrink-0">
            <Paperclip className="h-5 w-5 text-gray-500" />
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
              inputValue.trim() ? "text-blue-500" : "text-gray-400"
            )}
          >
            <SendHorizontal className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex justify-between items-center max-w-3xl mx-auto px-3 mt-2">
          <div className="flex items-center gap-2">
            <div className="flex gap-1 items-center text-xs text-gray-500">
              <span>GPT-4o</span>
              <ChevronDown className="h-3 w-3" />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1 cursor-pointer">
              <input type="checkbox" className="w-3 h-3" />
              <span className="text-xs text-gray-500">ウェブ検索</span>
            </label>
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full">
              <MoreHorizontal className="h-4 w-4 text-gray-500" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
