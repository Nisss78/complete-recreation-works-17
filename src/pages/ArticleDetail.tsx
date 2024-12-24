import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArticleHeader } from "@/components/articles/ArticleHeader";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

const ArticleDetail = () => {
  const article = {
    title: "MCPツールをClaudeデスクトップアプリで活用し日常タスクを自動化する方法",
    author: {
      name: "生成AI活用研究部",
      avatar: "/lovable-uploads/d52af139-0d12-4cd2-aec0-d6d4e07ffd34.png"
    },
    postedAt: "2024年12月18日 21:13",
    thumbnailUrl: "/lovable-uploads/6bbd01fe-acf0-40d4-81c6-3adc8f714a4a.png",
    content: `
# MCPツールの基礎

MCPは、Claudeのようなアシスタントとさまざまなシステムを安全に接続する新しい標準です。この記事では、MCPの基本から始め、Claudeデスクトップアプリでの具体的なセットアップ方法と、日常業務を簡略化する実例を解説します。

## MCPの基本構造

MCPは、メッセージプロトコルスタンダードのクライアント実装です。主な機能は以下のサービスメッセージとプロトコールシーケンスに関係します。

- MCPプロトコル / Claudeデスクトップアプリケーションソリューション
- MCPクライアント / 独自のクライアント機能を実装するためのコアポーネント
- MCPサーバー / 独自の機能を付加可能なプロトコル

## MCPがサポートするリソース

- ローカルリソース / コンピューターのハードウェアリソースを活用
- リモートリソース / APIやクラウドリソースサービス
    `,
    likes: 16,
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <article className="max-w-3xl mx-auto py-8 px-4">
          <ArticleHeader 
            title={article.title}
            author={article.author}
            postedAt={article.postedAt}
            likes={article.likes}
            thumbnailUrl={article.thumbnailUrl}
          />

          <div className="prose prose-gray max-w-none">
            <ReactMarkdown>{article.content}</ReactMarkdown>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default ArticleDetail;