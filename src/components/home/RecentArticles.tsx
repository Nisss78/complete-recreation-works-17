import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const RecentArticles = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const { data: recentArticles = [] } = useQuery({
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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">{t('index.recentArticles')}</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/articles')}
          className="text-gray-600 hover:text-gray-900"
        >
          {t('index.viewMore')}
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-4">
        {recentArticles.map((article: any) => (
          <Card
            key={article.id}
            className="p-3 hover:bg-gray-50 transition-colors cursor-pointer"
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
              <div>
                <h3 className="font-medium text-gray-900 line-clamp-2">{article.title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {article.profiles?.username || t('index.unknownUser')}
                </p>
              </div>
            </div>
          </Card>
        ))}
        {recentArticles.length === 0 && (
          <p className="text-center text-gray-500 py-4">
            {t('index.noArticles')}
          </p>
        )}
      </div>
    </div>
  );
};