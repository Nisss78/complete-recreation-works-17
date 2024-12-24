import { Heart, MessageCircle, Share2, User } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

const ArticleDetail = () => {
  const article = {
    title: "MCPツールをClaudeデスクトップアプリで活用し日常タスクを自動化する方法",
    author: {
      name: "生成AI活用研究部",
      avatar: "/lovable-uploads/d52af139-0d12-4cd2-aec0-d6d4e07ffd34.png"
    },
    postedAt: "2024年12月18日 21:13",
    content: `
      本記事については生成AIを活用して生成された記事となります。解説内容の正確性については読者ご自身でご確認いただきますようお願いいいたします。

      本記事はHow to Use MCP Tools on Claude Desktop App and Automate Your Daily Tasksの解説記事となります。

      Model Context Protocol (MCP)は、Claudeのようなアシスタントとさまざまなシステムを安全に接続する新しい標準です。この記事では、MCPの基本から始め、Claudeデスクトップアプリでの具体的なセットアップ方法と、日常業務を簡略化する実例を解説します。

      ## MCPツールの基礎

      ### MCPの基本構造

      MCPは、メッセージプロトコルスタンダードのクライアント実装です。主な機能は以下のサービスメッセージとプロトコールシーケンスに関係します。

      - MCPプロトコル / Claudeデスクトップアプリケーションソリューション
      - MCPクライアント / 独自のクライアント機能を実装するためのコアポーネント
      - MCPサーバー / 独自の機能を付加可能なプロトコル

      ## MCPがサポートするリソース

      - ローカルリソース / コンピューターのハードウェアリソースを活用
      - リモートリソース / APIやクラウドリソースサービス
    `,
    likes: 16,
    comments: 0,
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <article className="max-w-3xl mx-auto py-8 px-4">
          {/* Article Header */}
          <div className="mb-8 space-y-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
              {article.title}
            </h1>

            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={article.author.avatar} />
                <AvatarFallback>
                  <User className="w-6 h-6" />
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium text-gray-900">
                  {article.author.name}
                </div>
                <div className="text-sm text-gray-500">
                  {article.postedAt}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 border-y border-gray-100 py-4">
              <Button 
                variant="ghost" 
                size="sm"
                className={cn(
                  "gap-2 text-gray-500 hover:text-gray-900",
                  "hover:bg-gray-50"
                )}
              >
                <Heart className="w-5 h-5" />
                <span>{article.likes}</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className={cn(
                  "gap-2 text-gray-500 hover:text-gray-900",
                  "hover:bg-gray-50"
                )}
              >
                <MessageCircle className="w-5 h-5" />
                <span>{article.comments}</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className={cn(
                  "gap-2 text-gray-500 hover:text-gray-900",
                  "hover:bg-gray-50"
                )}
              >
                <Share2 className="w-5 h-5" />
                <span>シェア</span>
              </Button>
            </div>
          </div>

          {/* AI Generated Content Notice */}
          <Alert className="mb-8 bg-blue-50 border-blue-200">
            <AlertDescription className="text-sm text-blue-800">
              本記事については生成AIを活用して生成された記事となります。解説内容の正確性については読者ご自身でご確認いただきますようお願いいいたします。
            </AlertDescription>
          </Alert>

          {/* Article Content */}
          <ScrollArea className="h-[calc(100vh-400px)]">
            <div className="prose prose-gray max-w-none">
              {article.content.split('\n').map((paragraph, index) => (
                paragraph.trim() && (
                  <p 
                    key={index} 
                    className={cn(
                      "mb-4 leading-relaxed",
                      paragraph.startsWith('#') && "font-bold text-xl mt-8",
                      paragraph.startsWith('##') && "font-bold text-lg mt-6",
                      paragraph.startsWith('###') && "font-bold text-base mt-4",
                      paragraph.startsWith('-') && "pl-4"
                    )}
                  >
                    {paragraph.replace(/^#{1,3}\s/, '')}
                  </p>
                )
              ))}
            </div>
          </ScrollArea>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default ArticleDetail;