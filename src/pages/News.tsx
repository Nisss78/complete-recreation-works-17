import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface NewsItem {
  id: number;
  date: string;
  titleJa: string;
  titleEn: string;
  descriptionJa: string;
  descriptionEn: string;
  category: "update" | "release" | "event" | "press";
}

const newsItems: NewsItem[] = [
  {
    id: 1,
    date: "2024-01-15",
    titleJa: "Protoduct バージョン2.0をリリースしました",
    titleEn: "Protoduct Version 2.0 Released",
    descriptionJa: "新しいUIデザインと改善されたパフォーマンスを含む大規模アップデートをリリースしました。",
    descriptionEn: "Major update released with new UI design and improved performance.",
    category: "release"
  },
  {
    id: 2,
    date: "2024-01-10",
    titleJa: "月間アクティブユーザー10万人突破",
    titleEn: "100,000 Monthly Active Users Achieved",
    descriptionJa: "おかげさまで月間アクティブユーザー数が10万人を突破しました。",
    descriptionEn: "Thanks to our community, we've reached 100,000 monthly active users.",
    category: "press"
  },
  {
    id: 3,
    date: "2024-01-05",
    titleJa: "開発者向けオンラインイベント開催のお知らせ",
    titleEn: "Online Developer Event Announcement",
    descriptionJa: "2月1日に開発者向けのオンラインイベントを開催します。参加登録受付中です。",
    descriptionEn: "We'll be hosting an online developer event on February 1st. Registration is now open.",
    category: "event"
  },
  {
    id: 4,
    date: "2023-12-20",
    titleJa: "新機能：AIによるプロダクト推薦システム",
    titleEn: "New Feature: AI-Powered Product Recommendations",
    descriptionJa: "機械学習を活用した新しい推薦システムを導入しました。",
    descriptionEn: "Introduced a new recommendation system powered by machine learning.",
    category: "update"
  }
];

const categoryColors = {
  update: "bg-blue-100 text-blue-800",
  release: "bg-green-100 text-green-800",
  event: "bg-purple-100 text-purple-800",
  press: "bg-orange-100 text-orange-800"
};

const categoryLabels = {
  update: { ja: "アップデート", en: "Update" },
  release: { ja: "リリース", en: "Release" },
  event: { ja: "イベント", en: "Event" },
  press: { ja: "プレス", en: "Press" }
};

export default function News() {
  const { language } = useLanguage();
  const isJapanese = language === 'ja';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {isJapanese ? "ニュース" : "News"}
            </h1>
            <p className="text-xl text-gray-600">
              {isJapanese 
                ? "Protoductの最新情報をお届けします" 
                : "Stay updated with the latest from Protoduct"}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid gap-6">
            {newsItems.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${categoryColors[item.category]}`}>
                        {isJapanese ? categoryLabels[item.category].ja : categoryLabels[item.category].en}
                      </span>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Calendar className="h-4 w-4 mr-1" />
                        {item.date}
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                  </div>
                  <CardTitle className="text-2xl">
                    {isJapanese ? item.titleJa : item.titleEn}
                  </CardTitle>
                  <CardDescription className="text-base mt-2">
                    {isJapanese ? item.descriptionJa : item.descriptionEn}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          {newsItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {isJapanese ? "ニュースはまだありません" : "No news available yet"}
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}