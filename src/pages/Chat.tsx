import { useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Menu, 
  MessageSquare, 
  Search, 
  Code, 
  Lightbulb,
  ClipboardList,
  PenLine,
  MoreHorizontal,
  Plus,
  Globe
} from "lucide-react";

const ChatPage = () => {
  const [messages, setMessages] = useState<Array<{ text: string; isSent: boolean }>>([]);
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { text: newMessage, isSent: true }]);
      setNewMessage("");
      // デモ用のレスポンス
      setTimeout(() => {
        setMessages(prev => [...prev, { text: "お手伝いできることはありますか？", isSent: false }]);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const actionButtons = [
    { icon: MessageSquare, label: "解決する", color: "text-pink-500" },
    { icon: Code, label: "コード", color: "text-blue-500" },
    { icon: Lightbulb, label: "ブレーンストーミング", color: "text-yellow-500" },
    { icon: ClipboardList, label: "計画", color: "text-yellow-500" },
    { icon: PenLine, label: "ライティング支援", color: "text-pink-500" },
    { icon: MoreHorizontal, label: "詳細", color: "text-gray-500" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 flex">
        {/* Sidebar - Hidden on mobile */}
        <div className="w-64 border-r bg-white hidden md:block">
          <div className="p-4">
            <Button variant="outline" className="w-full justify-start gap-2">
              <Plus className="h-4 w-4" />
              新しいチャット
            </Button>
          </div>
          <ScrollArea className="h-[calc(100vh-9rem)]">
            <div className="p-4 space-y-2">
              <div className="text-sm text-muted-foreground">
                最近のチャット履歴がここに表示されます
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Mobile sidebar trigger */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden absolute left-4 top-20">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="p-4">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Plus className="h-4 w-4" />
                新しいチャット
              </Button>
            </div>
            <ScrollArea className="h-[calc(100vh-8rem)]">
              <div className="p-4 space-y-2">
                <div className="text-sm text-muted-foreground">
                  最近のチャット履歴がここに表示されます
                </div>
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>

        {/* Main chat area */}
        <div className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 p-4">
            <div className="max-w-3xl mx-auto">
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <h2 className="text-2xl font-bold mb-8">お手伝いできることはありますか？</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-2xl mx-auto px-4">
                    {actionButtons.map((button, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="h-auto py-3 px-4 flex flex-col items-center gap-2 bg-white hover:bg-gray-50"
                      >
                        <button.icon className={`h-5 w-5 ${button.color}`} />
                        <span className="text-sm text-gray-700">{button.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          message.isSent
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        {message.text}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
          
          <div className="border-t p-4">
            <div className="max-w-3xl mx-auto relative">
              <div className="relative flex items-center">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="absolute left-2 h-8 w-8 text-gray-500"
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="absolute left-12 h-8 w-8 text-gray-500"
                >
                  <Globe className="h-4 w-4" />
                </Button>
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="ChatGPTにメッセージを送信する"
                  className="pl-24 pr-20"
                />
                <div className="absolute right-2 flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8 text-gray-500"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                  <Button 
                    onClick={handleSend}
                    size="icon"
                    className="h-8 w-8"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatPage;