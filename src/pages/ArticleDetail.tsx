import { Heart, MessageCircle, Share2 } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollArea } from "@/components/ui/scroll-area";

const ArticleDetail = () => {
  const article = {
    title: "MCPツールをClaudeデスクトップアプリで活用し日常タスクを自動化する方法",
    author: {
      name: "まるまるPG",
      avatar: "/lovable-uploads/d52af139-0d12-4cd2-aec0-d6d4e07ffd34.png"
    },
    postedAt: "2024年2月10日",
    content: `
      本記事は、MCPツールをClaudeデスクトップアプリで活用し、日常タスクを自動化する方法について解説します。

      本日は「How to Use MCP Tools on Claude Desktop App and Automate Your Daily Tasks」について解説していきます。

      MCPツール（Message Protocol API）は、Claudeデスクトップアプリケーションを使用してタスクを自動化し、効率を向上させる強力なツールです。このガイドでは、MCPツールの基本概念、Claudeデスクトップアプリでの活用方法からアップデートまで、詳細な手順について説明を行っていきます。

      ## MCPツールの基礎

      ### MCPの基本機能

      MCPは、メッセージプロトコルスタンダードのクライアント実装です。主な機能は以下のサービスメッセージとプロトコールシーケンスに関係します。

      - MCPプロトコル / Claudeデスクトップアプリケーションソリューション
      - MCPクライアント / 独自のクライアント機能を実装するためのコアポーネント
      - MCPサーバー / 独自の機能を付加可能なプロトコル

      ## MCPがサポートするリソース

      - ローカルリソース / コンピューターのハードウェアリソースを活用
      - リモートリソース / APIやクラウドリソースサービス

      ## Claudeデスクトップアプリでのツールの設定方法

      ### 手順1: Claudeデスクトップアプリのインストール

      Claudeのオフィシャルサイトからアプリケーションをダウンロード、インストールしていきます。

      ### 手順2: 設定ファイルの作成

      ターゲットとなるプロトコルを実行して設定ファイルを作成します。

      ### 手順3: Brave Search MCPツールの導入

      「Save MCP」をインストールします。

      ### 手順4: Claudeアプリの再起動

      アプリを起動して「MCPツール」ツールを起動し、設定されたかどうかを確認します。

      ## MCPツールの活用事例

      ### 例1: リアルタイム情報の取得

      Claudeで、Webスクレイピングを実行して、リアルタイムなBrave Searchの結果を手軽に取得してみましょう。以下の機能を確認します。

      ### 例2: スポーツの試合結果の要約

      「ツイッターメッセージ」「スポーツニュース記事」などの情報を集めて、要約を作成します。Claudeの処理の結果を待つだけで、必要な情報が要約されます。

      ## MCPツールがもたらすメリット

      ### 日常業務の効率化

      アプリケーションのAPIコールやタスクの自動化が可能となり、業務効率が上がります。

      ### カスタマイズ可能なMCPサーバー

      Pythonは独自のMCPサーバーを実装でき、さらなる自動化が可能な環境を作ることができます。

      ## まとめ

      MCPツールとClaudeデスクトップアプリを組み合わせれば、日常業務の自動化を実現することができます。本記事を参考に、ぜひ効率的なタスク自動化を実践してみてください。
    `,
    likes: 42,
    comments: 15,
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <article className="max-w-4xl mx-auto py-8 px-4">
          {/* Article Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {article.title}
            </h1>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={article.author.avatar}
                  alt=""
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="font-medium text-gray-900">
                    {article.author.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {article.postedAt}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700">
                  <Heart className="w-5 h-5" />
                  <span>{article.likes}</span>
                </button>
                <button className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700">
                  <MessageCircle className="w-5 h-5" />
                  <span>{article.comments}</span>
                </button>
                <button className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <ScrollArea className="h-[calc(100vh-300px)] pr-6">
            <div className="prose prose-gray max-w-none">
              {article.content.split('\n').map((paragraph, index) => (
                <p key={index} className="whitespace-pre-wrap">
                  {paragraph}
                </p>
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