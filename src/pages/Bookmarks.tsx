import { useArticleBookmarks } from "@/hooks/useArticleBookmarks";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { useLanguage } from "@/contexts/LanguageContext";

const BookmarksPage = () => {
  const { bookmarks, isLoading } = useArticleBookmarks();
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-gray-500">Loading bookmarks...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold mb-8">{t('bookmarks.title')}</h1>
          
          <div className="space-y-4">
            {bookmarks.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                {t('bookmarks.empty')}
              </div>
            ) : (
              bookmarks.map((article) => (
                <ArticleCard
                  key={article.id}
                  id={article.id}
                  title={article.title}
                  author={article.profiles}
                  likes={article.likes_count || 0}
                  postedAt={article.created_at}
                  thumbnail_url={article.thumbnail_url}
                />
              ))
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookmarksPage;