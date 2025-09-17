import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNews } from "@/hooks/useNews";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewsForm } from "@/components/news/NewsForm";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function News() {
  const { language } = useLanguage();
  const isJapanese = language === 'ja';
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showNewsForm, setShowNewsForm] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const { data: newsItems, isLoading } = useNews(selectedCategory);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();
        
        setIsAdmin(profileData?.is_admin || false);
      }
    };
    checkAdmin();
  }, []);

  const categories = [
    { value: "all", labelJa: "すべての記事", labelEn: "All Articles" },
    { value: "announcement", labelJa: "お知らせ", labelEn: "Announcements" },
    { value: "event", labelJa: "イベント", labelEn: "Events" },
    { value: "media", labelJa: "メディア", labelEn: "Media" },
  ];

  const categoryBadges = {
    announcement: { ja: "お知らせ", en: "Announcement", color: "text-white", style: { backgroundColor: '#10c876' } },
    event: { ja: "イベント", en: "Event", color: "text-white", style: { backgroundColor: '#7bc61e' } },
    media: { ja: "メディア", en: "Media", color: "text-white", style: { backgroundColor: '#15b8e5' } },
    other: { ja: "その他", en: "Other", color: "bg-gray-500 text-white", style: {} },
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <h1 className="text-6xl font-bold mb-4 text-left" style={{
              background: 'linear-gradient(135deg, #7bc61e, #10c876, #15b8e5)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              NEWS
            </h1>
            <p className="text-xl text-gray-700 text-left">
              {isJapanese ? "お知らせ" : "Announcements"}
            </p>
          </div>
        </div>

        {/* Admin Add Button */}
        {isAdmin && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Button 
              onClick={() => setShowNewsForm(true)}
              className="bg-gradient-to-r from-[#10c876] to-[#15b8e5] hover:from-[#0fb368] hover:to-[#13a5d0] text-white"
            >
              <Plus className="h-5 w-5 mr-2" />
              {isJapanese ? "ニュース追加" : "Add News"}
            </Button>
          </div>
        )}

        {/* Category Tabs */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={cn(
                    "py-4 px-2 border-b-2 font-medium text-sm transition-colors",
                    selectedCategory === category.value
                      ? "border-[#10c876] text-[#10c876]"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  )}
                >
                  {isJapanese ? category.labelJa : category.labelEn}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* News List */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading...</p>
            </div>
          ) : newsItems && newsItems.length > 0 ? (
            <div className="space-y-6">
              {newsItems.map((item) => (
                <Link
                  key={item.id}
                  to={`/news/${item.id}`}
                  className="block hover:opacity-90 transition-opacity"
                >
                  <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                    <div className="flex">
                      {/* Thumbnail */}
                      {item.thumbnail_url && (
                        <div className="w-48 h-32 flex-shrink-0">
                          <img 
                            src={item.thumbnail_url} 
                            alt={isJapanese ? item.title_ja : (item.title_en || item.title_ja)}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      {/* Content */}
                      <div className={cn("flex-1 p-6", item.thumbnail_url ? "" : "")}>
                        <div className="flex items-start gap-4">
                          <span 
                            className={cn(
                              "inline-block px-3 py-1 rounded-full text-sm font-medium",
                              categoryBadges[item.category].color
                            )}
                            style={categoryBadges[item.category].style}
                          >
                            {isJapanese 
                              ? categoryBadges[item.category].ja 
                              : categoryBadges[item.category].en}
                          </span>
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-2">
                              <span className="text-gray-500 text-sm">
                                {format(new Date(item.date), 'yyyy.M.d')}
                              </span>
                            </div>
                            <h3 className="text-xl font-medium text-gray-900 line-clamp-2 text-left">
                              {isJapanese ? item.title_ja : (item.title_en || item.title_ja)}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {isJapanese ? "ニュースはまだありません" : "No news available yet"}
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
      
      {/* News Form Dialog */}
      {showNewsForm && (
        <NewsForm 
          open={showNewsForm} 
          onOpenChange={setShowNewsForm}
        />
      )}
    </div>
  );
}
