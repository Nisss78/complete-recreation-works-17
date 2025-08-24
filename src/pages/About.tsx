import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, Globe, Award, Target, TrendingUp, Calendar, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function About() {
  const { language } = useLanguage();
  const isJapanese = language === 'ja';

  const milestones = [
    {
      year: "2020",
      titleJa: "会社設立",
      titleEn: "Company Founded",
      descriptionJa: "Protoduct株式会社を設立",
      descriptionEn: "Protoduct Inc. established"
    },
    {
      year: "2021",
      titleJa: "サービス開始",
      titleEn: "Service Launch",
      descriptionJa: "プロダクト共有プラットフォームを正式リリース",
      descriptionEn: "Official launch of product sharing platform"
    },
    {
      year: "2022",
      titleJa: "10万ユーザー突破",
      titleEn: "100K Users",
      descriptionJa: "登録ユーザー数が10万人を突破",
      descriptionEn: "Reached 100,000 registered users"
    },
    {
      year: "2023",
      titleJa: "グローバル展開",
      titleEn: "Global Expansion",
      descriptionJa: "多言語対応を開始し、世界中のユーザーへ",
      descriptionEn: "Started multi-language support for global users"
    },
    {
      year: "2024",
      titleJa: "AI機能追加",
      titleEn: "AI Features",
      descriptionJa: "AIによる推薦システムを導入",
      descriptionEn: "Introduced AI-powered recommendation system"
    }
  ];

  const stats = [
    {
      valueJa: "100万+",
      valueEn: "1M+",
      labelJa: "月間アクティブユーザー",
      labelEn: "Monthly Active Users"
    },
    {
      valueJa: "50,000+",
      valueEn: "50,000+",
      labelJa: "登録プロダクト",
      labelEn: "Registered Products"
    },
    {
      valueJa: "150+",
      valueEn: "150+",
      labelJa: "対応国",
      labelEn: "Countries Served"
    },
    {
      valueJa: "99.9%",
      valueEn: "99.9%",
      labelJa: "稼働率",
      labelEn: "Uptime"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {isJapanese ? "会社概要" : "About Us"}
            </h1>
            <p className="text-xl text-gray-600">
              {isJapanese 
                ? "開発者のためのプロダクト共有プラットフォーム" 
                : "Product sharing platform for developers"}
            </p>
          </div>
        </div>

        {/* Company Info */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold mb-6">
                  {isJapanese ? "私たちについて" : "Who We Are"}
                </h2>
                <p className="text-gray-600 mb-4">
                  {isJapanese 
                    ? "Protoductは、開発者が自分のプロダクトやアイデアを世界中の人々と共有できるプラットフォームです。私たちは、イノベーションを促進し、開発者コミュニティの成長を支援することを使命としています。"
                    : "Protoduct is a platform where developers can share their products and ideas with people around the world. Our mission is to foster innovation and support the growth of the developer community."}
                </p>
                <p className="text-gray-600 mb-4">
                  {isJapanese 
                    ? "2020年の設立以来、私たちは継続的にプラットフォームを改善し、開発者にとって最高の体験を提供することに注力してきました。"
                    : "Since our founding in 2020, we have continuously improved our platform and focused on providing the best experience for developers."}
                </p>
              </div>
              <div className="space-y-6">
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl">{isJapanese ? "企業情報" : "Company Information"}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Building2 className="h-5 w-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="font-medium">{isJapanese ? "会社名" : "Company Name"}</p>
                        <p className="text-gray-600">
                          {isJapanese ? "Protoduct株式会社" : "Protoduct Inc."}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="font-medium">{isJapanese ? "設立" : "Founded"}</p>
                        <p className="text-gray-600">2020{isJapanese ? "年4月" : " April"}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="font-medium">{isJapanese ? "代表取締役" : "CEO"}</p>
                        <p className="text-gray-600">{isJapanese ? "山田太郎" : "Taro Yamada"}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="font-medium">{isJapanese ? "本社所在地" : "Headquarters"}</p>
                        <p className="text-gray-600">
                          {isJapanese 
                            ? "〒100-0001 東京都千代田区千代田1-1-1" 
                            : "1-1-1 Chiyoda, Chiyoda-ku, Tokyo 100-0001"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Globe className="h-5 w-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="font-medium">{isJapanese ? "事業内容" : "Business"}</p>
                        <p className="text-gray-600">
                          {isJapanese 
                            ? "プロダクト共有プラットフォームの開発・運営" 
                            : "Development and operation of product sharing platform"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <Target className="h-10 w-10 text-blue-600 mb-3" />
                  <CardTitle>{isJapanese ? "ミッション" : "Mission"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    {isJapanese 
                      ? "開発者の創造性を解放し、世界中のイノベーションを加速する" 
                      : "Unleash developer creativity and accelerate innovation worldwide"}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <TrendingUp className="h-10 w-10 text-green-600 mb-3" />
                  <CardTitle>{isJapanese ? "ビジョン" : "Vision"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    {isJapanese 
                      ? "すべての開発者が自由にアイデアを共有できる世界を創る" 
                      : "Create a world where all developers can freely share their ideas"}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Award className="h-10 w-10 text-purple-600 mb-3" />
                  <CardTitle>{isJapanese ? "バリュー" : "Values"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    {isJapanese 
                      ? "透明性、革新性、コミュニティ、そして相互尊重" 
                      : "Transparency, Innovation, Community, and Mutual Respect"}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">
              {isJapanese ? "数字で見るProtoduct" : "Protoduct by Numbers"}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-4xl font-bold text-blue-600 mb-2">
                    {isJapanese ? stat.valueJa : stat.valueEn}
                  </p>
                  <p className="text-gray-600">
                    {isJapanese ? stat.labelJa : stat.labelEn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">
              {isJapanese ? "私たちの歩み" : "Our Journey"}
            </h2>
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gray-300"></div>
              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className="flex-1" />
                    <div className="relative z-10 w-24 h-24 bg-white rounded-full border-4 border-blue-500 flex items-center justify-center">
                      <span className="font-bold text-blue-600">{milestone.year}</span>
                    </div>
                    <div className="flex-1 px-8">
                      <Card className={index % 2 === 0 ? 'ml-8' : 'mr-8'}>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">
                            {isJapanese ? milestone.titleJa : milestone.titleEn}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600">
                            {isJapanese ? milestone.descriptionJa : milestone.descriptionEn}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}