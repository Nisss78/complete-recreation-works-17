import { useAllArticleBookmarks } from "@/hooks/useAllArticleBookmarks";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { useLanguage } from "@/contexts/LanguageContext";

const BookmarksPage = () => {
  const { bookmarks, isLoading } = useAllArticleBookmarks();
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="animate-pulse text-gray-500">{t('loading')}</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto py-4 sm:py-8 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8">{t('bookmarks.title')}</h1>
          
          <div className="space-y-4">
            {bookmarks && bookmarks.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                {t('bookmarks.empty')}
              </div>
            ) : (
              bookmarks?.map((article) => (
                <ArticleCard
                  key={article.id}
                  id={article.id}
                  title={article.title}
                  author={{
                    id: article.profiles.id,
                    name: article.profiles.username || '',
                    avatar: article.profiles.avatar_url || '',
                  }}
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