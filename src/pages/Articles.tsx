import { BookOpen } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArticleCard } from "@/components/articles/ArticleCard";

const Articles = () => {
  const articles = [
    {
      id: 1,
      date: "12/34",
      title: "最強の機械学習フレームワークを作りたい その1「何がしたいか、Lean 4の基礎とともに」",
      author: {
        name: "tony",
        blog: "mutex Official Tech Blog",
        avatar: "/lovable-uploads/d52af139-0d12-4cd2-aec0-d6d4e07ffd34.png"
      },
      likes: 17,
      postedAt: "8日前"
    },
    {
      id: 2,
      title: "import / exportの配法だけではない、CommonJS modulesとES modulesの違い",
      author: {
        name: "syumai",
        avatar: "/lovable-uploads/d52af139-0d12-4cd2-aec0-d6d4e07ffd34.png"
      },
      likes: 105,
      postedAt: "20日前"
    },
    {
      id: 3,
      title: "第1回 社内用生成AI Webアプリケーションをどのように作っているか 連載予告編",
      author: {
        name: "Toshihiro Yagi",
        blog: "Ubie テックブログ",
        avatar: "/lovable-uploads/d52af139-0d12-4cd2-aec0-d6d4e07ffd34.png"
      },
      likes: 65,
      postedAt: "20日前"
    }
  ];

  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50/50">
      <Header />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Recent</h1>
          <div className="space-y-4">
            {articles.map((article) => (
              <ArticleCard key={article.id} {...article} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Articles;