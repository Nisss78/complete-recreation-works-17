
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight, Inbox } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { format } from "date-fns";

export const RecentArticles = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const { data: recentArticles = [], isLoading } = useQuery({
    queryKey: ['recentArticles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          profiles:profiles!articles_user_id_fkey (
            id,
            username,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">{t('index.recentArticles')}</h2>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex gap-3">
                <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">{t('index.recentArticles')}</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/articles')}
          className="text-gray-600 hover:text-gray-900 flex items-center gap-1 px-2"
        >
          {t('index.viewMore')}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-3">
        {recentArticles.map((article: any) => (
          <Card
            key={article.id}
            className="p-3 hover:bg-gray-50 transition-colors cursor-pointer border-0 shadow-none"
            onClick={() => navigate(`/articles/${article.id}`)}
          >
            <div className="flex gap-3">
              {article.thumbnail_url && (
                <img
                  src={article.thumbnail_url}
                  alt={article.title}
                  className="w-16 h-16 object-cover rounded-lg"
                />
              )}
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-gray-900 text-sm line-clamp-2">{article.title}</h3>
                <div className="flex items-center mt-1">
                  <p className="text-xs text-gray-500 truncate">
                    {article.profiles?.username || t('index.unknownUser')}
                  </p>
                  <span className="mx-1 text-gray-300">•</span>
                  <p className="text-xs text-gray-500">
                    {format(new Date(article.created_at), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        ))}
        {recentArticles.length === 0 && (
          <div className="text-center text-gray-500 py-6">
            <Inbox className="mx-auto h-8 w-8 mb-2 text-gray-400" />
            <p className="text-sm">{t('index.noArticles')}</p>
          </div>
        )}
      </div>
    </div>
  );
};
