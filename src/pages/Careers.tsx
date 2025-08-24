import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Briefcase, Users, Heart, Rocket, Target } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Position {
  id: number;
  titleJa: string;
  titleEn: string;
  departmentJa: string;
  departmentEn: string;
  locationJa: string;
  locationEn: string;
  type: "full-time" | "part-time" | "contract" | "internship";
  experienceJa: string;
  experienceEn: string;
  descriptionJa: string;
  descriptionEn: string;
  requirementsJa: string[];
  requirementsEn: string[];
}

const positions: Position[] = [
  {
    id: 1,
    titleJa: "フロントエンドエンジニア",
    titleEn: "Frontend Engineer",
    departmentJa: "プロダクト開発部",
    departmentEn: "Product Development",
    locationJa: "東京（リモート可）",
    locationEn: "Tokyo (Remote Available)",
    type: "full-time",
    experienceJa: "3年以上",
    experienceEn: "3+ years",
    descriptionJa: "React/TypeScriptを使用したWebアプリケーションの開発",
    descriptionEn: "Develop web applications using React/TypeScript",
    requirementsJa: [
      "React/TypeScriptの実務経験3年以上",
      "モダンなフロントエンド開発の知識",
      "チームワークを大切にできる方"
    ],
    requirementsEn: [
      "3+ years of React/TypeScript experience",
      "Knowledge of modern frontend development",
      "Strong team collaboration skills"
    ]
  },
  {
    id: 2,
    titleJa: "バックエンドエンジニア",
    titleEn: "Backend Engineer",
    departmentJa: "プロダクト開発部",
    departmentEn: "Product Development",
    locationJa: "東京（リモート可）",
    locationEn: "Tokyo (Remote Available)",
    type: "full-time",
    experienceJa: "3年以上",
    experienceEn: "3+ years",
    descriptionJa: "Node.js/Supabaseを使用したAPIの開発と運用",
    descriptionEn: "Develop and maintain APIs using Node.js/Supabase",
    requirementsJa: [
      "Node.jsの実務経験3年以上",
      "データベース設計の経験",
      "クラウドインフラの基礎知識"
    ],
    requirementsEn: [
      "3+ years of Node.js experience",
      "Database design experience",
      "Basic cloud infrastructure knowledge"
    ]
  },
  {
    id: 3,
    titleJa: "プロダクトデザイナー",
    titleEn: "Product Designer",
    departmentJa: "デザイン部",
    departmentEn: "Design",
    locationJa: "東京",
    locationEn: "Tokyo",
    type: "full-time",
    experienceJa: "2年以上",
    experienceEn: "2+ years",
    descriptionJa: "ユーザー体験を重視したプロダクトデザイン",
    descriptionEn: "User-centered product design",
    requirementsJa: [
      "Figmaを使用したデザイン経験",
      "UIデザインの実務経験2年以上",
      "ユーザーリサーチの経験"
    ],
    requirementsEn: [
      "Experience with Figma",
      "2+ years of UI design experience",
      "User research experience"
    ]
  }
];

const typeColors = {
  "full-time": "bg-green-100 text-green-800",
  "part-time": "bg-blue-100 text-blue-800",
  "contract": "bg-purple-100 text-purple-800",
  "internship": "bg-orange-100 text-orange-800"
};

const typeLabels = {
  "full-time": { ja: "正社員", en: "Full-time" },
  "part-time": { ja: "パートタイム", en: "Part-time" },
  "contract": { ja: "契約社員", en: "Contract" },
  "internship": { ja: "インターン", en: "Internship" }
};

export default function Careers() {
  const { language } = useLanguage();
  const isJapanese = language === 'ja';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {isJapanese ? "採用情報" : "Careers"}
            </h1>
            <p className="text-xl text-gray-600">
              {isJapanese 
                ? "一緒に未来を創る仲間を募集しています" 
                : "Join us in building the future"}
            </p>
          </div>
        </div>

        {/* Company Values */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">
              {isJapanese ? "私たちの価値観" : "Our Values"}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <Rocket className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {isJapanese ? "イノベーション" : "Innovation"}
                </h3>
                <p className="text-gray-600">
                  {isJapanese 
                    ? "常に新しいアイデアを追求し、技術の限界に挑戦します" 
                    : "Always pursuing new ideas and pushing technological boundaries"}
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {isJapanese ? "チームワーク" : "Teamwork"}
                </h3>
                <p className="text-gray-600">
                  {isJapanese 
                    ? "多様性を尊重し、お互いを支え合いながら成長します" 
                    : "Respecting diversity and growing together through mutual support"}
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                  <Target className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {isJapanese ? "ユーザー中心" : "User-Centric"}
                </h3>
                <p className="text-gray-600">
                  {isJapanese 
                    ? "ユーザーの声を大切にし、最高の体験を提供します" 
                    : "Valuing user feedback and delivering the best experience"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">
              {isJapanese ? "福利厚生" : "Benefits"}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <Heart className="h-8 w-8 text-red-500 mb-2" />
                  <CardTitle className="text-lg">
                    {isJapanese ? "健康保険" : "Health Insurance"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    {isJapanese ? "充実した健康保険制度" : "Comprehensive health coverage"}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <MapPin className="h-8 w-8 text-blue-500 mb-2" />
                  <CardTitle className="text-lg">
                    {isJapanese ? "リモートワーク" : "Remote Work"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    {isJapanese ? "柔軟な働き方を支援" : "Flexible work arrangements"}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <Briefcase className="h-8 w-8 text-green-500 mb-2" />
                  <CardTitle className="text-lg">
                    {isJapanese ? "スキルアップ支援" : "Skill Development"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    {isJapanese ? "研修・カンファレンス参加支援" : "Training and conference support"}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <Users className="h-8 w-8 text-purple-500 mb-2" />
                  <CardTitle className="text-lg">
                    {isJapanese ? "チームイベント" : "Team Events"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    {isJapanese ? "定期的な交流イベント" : "Regular team building events"}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">
              {isJapanese ? "募集中のポジション" : "Open Positions"}
            </h2>
            <div className="grid gap-6">
              {positions.map((position) => (
                <Card key={position.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-2xl mb-2">
                          {isJapanese ? position.titleJa : position.titleEn}
                        </CardTitle>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge className={typeColors[position.type]}>
                            {isJapanese ? typeLabels[position.type].ja : typeLabels[position.type].en}
                          </Badge>
                          <Badge variant="outline">
                            <MapPin className="h-3 w-3 mr-1" />
                            {isJapanese ? position.locationJa : position.locationEn}
                          </Badge>
                          <Badge variant="outline">
                            <Briefcase className="h-3 w-3 mr-1" />
                            {isJapanese ? position.experienceJa : position.experienceEn}
                          </Badge>
                        </div>
                        <CardDescription className="text-base">
                          {isJapanese ? position.descriptionJa : position.descriptionEn}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">
                        {isJapanese ? "必要なスキル" : "Requirements"}
                      </h4>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        {(isJapanese ? position.requirementsJa : position.requirementsEn).map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>
                    <Button className="w-full sm:w-auto">
                      {isJapanese ? "このポジションに応募" : "Apply for this position"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {positions.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  {isJapanese ? "現在募集中のポジションはありません" : "No open positions at the moment"}
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}