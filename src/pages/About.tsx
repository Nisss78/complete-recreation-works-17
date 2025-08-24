import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, Globe, Award, Target, TrendingUp, Calendar, MapPin } from "lucide-react";
import { X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import unoImage from "@/assets/uno.jpg";

export default function About() {
  const { language } = useLanguage();
  const isJapanese = language === 'ja';

  const milestones = [
    {
      year: "2025",
      titleJa: "会社設立",
      titleEn: "Company Founded",
      descriptionJa: "ProtoductAI株式会社を設立",
      descriptionEn: "ProtoductAI Inc. established"
    },
    {
      year: "2025",
      titleJa: "AI開発本格化",
      titleEn: "AI Development Launch",
      descriptionJa: "AIソフトウェア開発事業を本格開始",
      descriptionEn: "Full-scale launch of AI software development"
    },
    {
      year: "2025",
      titleJa: "プラットフォーム開発",
      titleEn: "Platform Development",
      descriptionJa: "Protoductプラットフォームの開発開始",
      descriptionEn: "Started development of Protoduct platform"
    },
    {
      year: "2025",
      titleJa: "AI研修事業開始",
      titleEn: "AI Training Launch",
      descriptionJa: "企業向けAI研修プログラムを提供開始",
      descriptionEn: "Started providing AI training programs for enterprises"
    },
    {
      year: "2025",
      titleJa: "受託開発事業",
      titleEn: "Contract Development",
      descriptionJa: "AI関連の受託開発事業を展開",
      descriptionEn: "Expanded AI-related contract development business"
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
                    ? "ProtoductAIは、最先端のAI技術を活用したソフトウェア開発と、開発者向けプラットフォームの提供を行う企業です。私たちは、AIの力で開発プロセスを革新し、より多くの人々がテクノロジーの恩恵を受けられる社会の実現を目指しています。"
                    : "ProtoductAI is a company that provides cutting-edge AI software development and developer platforms. We aim to revolutionize the development process with the power of AI and create a society where more people can benefit from technology."}
                </p>
                <p className="text-gray-600 mb-4">
                  {isJapanese 
                    ? "2025年の設立以来、私たちはAIソフトウェア開発、AI研修、受託開発の3つの事業を軸に、お客様のデジタルトランスフォーメーションを支援しています。"
                    : "Since our founding in 2025, we have been supporting our customers' digital transformation through three main businesses: AI software development, AI training, and contract development."}
                </p>
              </div>
              <div className="space-y-6">
                <div>
                  <div className="mb-8">
                    <h3 className="text-3xl font-bold text-blue-600 mb-2">COMPANY</h3>
                    <div>
                      <span className="text-2xl font-medium">会社概要</span>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-6">
                    <table className="w-full">
                      <tbody>
                        <tr className="border-b border-gray-300">
                          <td className="py-4 pr-8 font-medium text-gray-900 w-32 align-top">会社名</td>
                          <td className="py-4 text-gray-700">ProtoductAI株式会社</td>
                        </tr>
                        <tr className="border-b border-gray-300">
                          <td className="py-4 pr-8 font-medium text-gray-900 w-32 align-top">住所</td>
                          <td className="py-4 text-gray-700">
                            〒605-0074<br />
                            京都市東山区祇園町南側582
                          </td>
                        </tr>
                        <tr className="border-b border-gray-300">
                          <td className="py-4 pr-8 font-medium text-gray-900 w-32 align-top">代表者</td>
                          <td className="py-4 text-gray-700">代表取締役 CEO</td>
                        </tr>
                        <tr className="border-b border-gray-300">
                          <td className="py-4 pr-8 font-medium text-gray-900 w-32 align-top">設立</td>
                          <td className="py-4 text-gray-700">2025年3月7日</td>
                        </tr>
                        <tr className="border-b border-gray-300">
                          <td className="py-4 pr-8 font-medium text-gray-900 w-32 align-top">事業内容</td>
                          <td className="py-4 text-gray-700">
                            AIソフトウェア開発<br />
                            AI研修・コンサルティング<br />
                            受託開発
                          </td>
                        </tr>
                        <tr>
                          <td className="py-4 pr-8 font-medium text-gray-900 w-32 align-top">従業員数</td>
                          <td className="py-4 text-gray-700">6人（業務委託含む）</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
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

        {/* Team Members */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-16 text-gray-900">
              {isJapanese ? "メンバー紹介" : "Our Team"}
            </h2>
            {/* First row - 2 members */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-6">
              {/* 宇野慎一郎 */}
              <div className="relative group">
                <div className="relative rounded-2xl bg-white border border-gray-200 shadow-lg p-5 w-full h-80 flex items-end">
                  {/* Image - vertical rectangle, positioned at bottom-left with margin */}
                  <div className="absolute bottom-5 left-5 w-3/5 h-5/6 rounded-lg overflow-hidden">
                    <img 
                      src={unoImage} 
                      alt="宇野慎一郎" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* X Icon - aligned with top of image */}
                  <a 
                    href="https://x.com/protoduct_ai" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="absolute top-[18%] right-6 w-12 h-12 rounded-xl border border-gray-300 bg-white shadow-md flex items-center justify-center hover:shadow-lg transition-shadow"
                  >
                    <X className="w-6 h-6 text-gray-700" />
                  </a>
                  
                  {/* Name and title - bottom right */}
                  <div className="absolute bottom-6 right-6 text-right">
                    <h3 className="text-gray-900 font-semibold text-base">宇野慎一郎</h3>
                    <p className="text-gray-600 text-sm mt-1">Founder</p>
                  </div>
                </div>
              </div>

              {/* イギョンウク */}
              <div className="relative group">
                <div className="relative rounded-2xl bg-white border border-gray-200 shadow-lg p-5 w-full h-80 flex items-end">
                  {/* Image - vertical rectangle, positioned at bottom-left with margin */}
                  <div className="absolute bottom-5 left-5 w-3/5 h-5/6 rounded-lg overflow-hidden bg-gray-200">
                  </div>
                  
                  {/* X Icon - aligned with top of image */}
                  <div className="absolute top-[18%] right-6 w-12 h-12 rounded-xl border border-gray-300 bg-white shadow-md flex items-center justify-center">
                    <X className="w-6 h-6 text-gray-700" />
                  </div>
                  
                  {/* Name and title - bottom right */}
                  <div className="absolute bottom-6 right-6 text-right">
                    <h3 className="text-gray-900 font-semibold text-base">イギョンウク</h3>
                    <p className="text-gray-600 text-sm mt-1">Co-founder</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Second row - 3 members */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {/* 山内泰嘉 */}
              <div className="relative group">
                <div className="relative rounded-2xl bg-white border border-gray-200 shadow-lg p-5 w-full h-80 flex items-end">
                  {/* Image - vertical rectangle, positioned at bottom-left with margin */}
                  <div className="absolute bottom-5 left-5 w-3/5 h-5/6 rounded-lg overflow-hidden bg-gray-200">
                  </div>
                  
                  {/* X Icon - aligned with top of image */}
                  <div className="absolute top-[18%] right-6 w-12 h-12 rounded-xl border border-gray-300 bg-white shadow-md flex items-center justify-center">
                    <X className="w-6 h-6 text-gray-700" />
                  </div>
                  
                  {/* Name and title - bottom right */}
                  <div className="absolute bottom-6 right-6 text-right">
                    <h3 className="text-gray-900 font-semibold text-base">山内泰嘉</h3>
                    <p className="text-gray-600 text-sm mt-1">Co-founder</p>
                  </div>
                </div>
              </div>

              {/* 奥谷大地 */}
              <div className="relative group">
                <div className="relative rounded-2xl bg-white border border-gray-200 shadow-lg p-5 w-full h-80 flex items-end">
                  {/* Image - vertical rectangle, positioned at bottom-left with margin */}
                  <div className="absolute bottom-5 left-5 w-3/5 h-5/6 rounded-lg overflow-hidden bg-gray-200">
                  </div>
                  
                  {/* X Icon - aligned with top of image */}
                  <div className="absolute top-[18%] right-6 w-12 h-12 rounded-xl border border-gray-300 bg-white shadow-md flex items-center justify-center">
                    <X className="w-6 h-6 text-gray-700" />
                  </div>
                  
                  {/* Name and title - bottom right */}
                  <div className="absolute bottom-6 right-6 text-right">
                    <h3 className="text-gray-900 font-semibold text-base">奥谷大地</h3>
                    <p className="text-gray-600 text-sm mt-1">Co-founder</p>
                  </div>
                </div>
              </div>

              {/* 中塚一晃 */}
              <div className="relative group">
                <div className="relative rounded-2xl bg-white border border-gray-200 shadow-lg p-5 w-full h-80 flex items-end">
                  {/* Image - vertical rectangle, positioned at bottom-left with margin */}
                  <div className="absolute bottom-5 left-5 w-3/5 h-5/6 rounded-lg overflow-hidden bg-gray-200">
                  </div>
                  
                  {/* X Icon - aligned with top of image */}
                  <div className="absolute top-[18%] right-6 w-12 h-12 rounded-xl border border-gray-300 bg-white shadow-md flex items-center justify-center">
                    <X className="w-6 h-6 text-gray-700" />
                  </div>
                  
                  {/* Name and title - bottom right */}
                  <div className="absolute bottom-6 right-6 text-right">
                    <h3 className="text-gray-900 font-semibold text-base">中塚一晃</h3>
                    <p className="text-gray-600 text-sm mt-1">Co-founder</p>
                  </div>
                </div>
              </div>
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