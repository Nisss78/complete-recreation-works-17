import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNewsById } from "@/hooks/useNews";
import { useParams, Link } from "react-router-dom";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NewsDetail() {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const isJapanese = language === 'ja';
  const { data: newsItem, isLoading } = useNewsById(id || '');

  const categoryBadges = {
    announcement: { ja: "お知らせ", en: "Announcement", color: "bg-blue-500 text-white" },
    event: { ja: "イベント", en: "Event", color: "bg-purple-500 text-white" },
    media: { ja: "メディア", en: "Media", color: "bg-green-500 text-white" },
    other: { ja: "その他", en: "Other", color: "bg-gray-500 text-white" },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <p className="text-center text-gray-500">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!newsItem) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <p className="text-center text-gray-500">
              {isJapanese ? "記事が見つかりません" : "Article not found"}
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link to="/news">
              <Button variant="ghost" className="mb-6">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {isJapanese ? "ニュース一覧に戻る" : "Back to News"}
              </Button>
            </Link>

            {/* Logo Display for rebranding news */}
            {newsItem.logo_type === 'new' && newsItem.title_ja.includes('ロゴ') && (
              <div className="mb-12 py-8 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-center gap-8">
                  <div className="text-center">
                    <div className="mb-4">
                      <svg width="120" height="120" viewBox="0 0 120 120" className="mx-auto">
                        <circle cx="60" cy="60" r="50" fill="#000000" />
                        <text x="60" y="75" fill="white" fontSize="40" textAnchor="middle" fontFamily="Arial, sans-serif">A</text>
                      </svg>
                    </div>
                    <p className="text-sm text-gray-600 font-medium">旧ロゴ</p>
                  </div>
                  <div className="text-4xl">→</div>
                  <div className="text-center">
                    <div className="mb-4">
                      <svg width="120" height="120" viewBox="0 0 120 120" className="mx-auto">
                        <rect x="35" y="40" width="10" height="40" fill="#0066FF" />
                        <rect x="50" y="40" width="10" height="40" fill="#0066FF" />
                        <rect x="65" y="40" width="10" height="40" fill="#0066FF" />
                        <rect x="30" y="35" width="50" height="10" fill="#0066FF" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-600 font-medium">新ロゴ</p>
                  </div>
                </div>
              </div>
            )}

            {/* Article Header */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${categoryBadges[newsItem.category].color}`}>
                  {isJapanese 
                    ? categoryBadges[newsItem.category].ja 
                    : categoryBadges[newsItem.category].en}
                </span>
                <span className="text-gray-500">
                  {format(new Date(newsItem.date), 'yyyy.MM.dd')}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-6 text-left">
                {isJapanese ? newsItem.title_ja : (newsItem.title_en || newsItem.title_ja)}
              </h1>
              
              {/* Thumbnail Image */}
              {newsItem.thumbnail_url && (
                <div className="mb-8">
                  <img 
                    src={newsItem.thumbnail_url} 
                    alt={isJapanese ? newsItem.title_ja : (newsItem.title_en || newsItem.title_ja)}
                    className="w-full max-h-96 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {isJapanese ? newsItem.content_ja : (newsItem.content_en || newsItem.content_ja)}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
