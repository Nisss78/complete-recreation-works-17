import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Building2, Users, Globe, Award, Target, TrendingUp, Calendar, MapPin, ArrowRight, ExternalLink } from "lucide-react";
import { X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import unoImage from "@/assets/uno.jpg";
import FloatingParticles from "@/components/FloatingParticles";
import FloatingLogos from "@/components/FloatingLogos";

export default function About() {
  const { language } = useLanguage();
  const isJapanese = language === 'ja';
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-white relative overflow-hidden">
          <FloatingParticles />
          <FloatingLogos />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-28 md:pt-32 relative z-10">
            <h1 className="text-6xl font-bold mb-4 text-left" style={{
              background: 'linear-gradient(135deg, #7bc61e, #10c876, #15b8e5)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              ABOUT
            </h1>
            <p className="text-xl text-gray-700 text-left">
              {isJapanese ? "会社概要" : "About Us"}
            </p>
          </div>
        </div>

        {/* About Us Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-16">
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-8 text-left">
                {isJapanese ? "私たちについて" : "About Us"}
              </h2>
              
              {/* Our Purpose */}
              <div className="mb-12 max-w-3xl">
                <h3 className="text-2xl md:text-3xl font-semibold mb-5 text-gray-900">
                  {isJapanese ? "私たちの存在意義" : "Our Purpose"}
                </h3>
                <p className="text-lg md:text-xl text-gray-700 leading-8 mb-5">
                  {isJapanese 
                    ? <>ProtoductAI株式会社は、<strong className="text-gray-900">「AIで可能性を拡張し、想像力を爆発させる未来体験を創造する」</strong>ことを使命に、京都で誕生しました。</>
                    : <>ProtoductAI Inc. was born in Kyoto with the mission to <strong className="text-gray-900">"expand possibilities with AI and create future experiences that ignite imagination."</strong></>}
                </p>
                <p className="text-lg md:text-xl text-gray-700 leading-8">
                  {isJapanese 
                    ? '生成AIと最先端のノーコード／AIcodingツールを駆使し、アイデアからローンチまでを「最速」で駆け抜ける。それが私たちのスタイルであり、カルチャーです。'
                    : "We leverage generative AI and cutting-edge no-code/AI coding tools to sprint from idea to launch at 'maximum speed.' This is our style and our culture."}
                </p>
              </div>

              {/* What We Do - removed per request */}

              {/* Our Strengths - removed per request */}

              {/* Vision */}
              <div className="mb-12 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-xl">
                <h3 className="text-2xl font-bold mb-4">
                  {isJapanese ? "ビジョン" : "Vision"}
                </h3>
                <p className="text-xl">
                  {isJapanese 
                    ? "クールな未来体験を、世界へ最速で届けるプラットフォームになる。"
                    : "To become the platform that delivers cool future experiences to the world at maximum speed."}
                </p>
                <p className="mt-4 text-blue-100">
                  {isJapanese 
                    ? "私たちはスピードと挑戦を武器に、AIと人が共創する新しいカルチャーと経済圏を切り拓きます。"
                    : "Armed with speed and challenge, we pioneer new cultures and economic zones where AI and humans co-create."}
                </p>
              </div>

              {/* Core Values - removed per request */}

              {/* Founding Story */}
              <div className="mb-12 max-w-3xl">
                <h3 className="text-2xl md:text-3xl font-semibold mb-5 text-gray-900">
                  {isJapanese ? "創業ストーリー" : "Founding Story"}
                </h3>
                <p className="text-lg md:text-xl text-gray-700 leading-8 mb-5">
                  {isJapanese 
                    ? "「学生こそ世界を揺らすイノベーションを起こせる」。"
                    : "'Students can create innovations that shake the world.'"}
                </p>
                <p className="text-lg md:text-xl text-gray-700 leading-8 mb-5">
                  {isJapanese 
                    ? "その想いを共有した仲間が集まり、2025年3月に ProtoductAI を設立。"
                    : "Companions who shared this belief gathered and established ProtoductAI in March 2025."}
                </p>
                <p className="text-lg md:text-xl text-gray-700 leading-8 mb-5">
                  {isJapanese 
                    ? <>合言葉は <strong className="text-blue-600">"Create Cool Experience"</strong>。</>
                    : <>Our motto is <strong className="text-blue-600">"Create Cool Experience"</strong>.</>}
                </p>
                <p className="text-lg md:text-xl text-gray-700 leading-8">
                  {isJapanese 
                    ? "以来、スタジオ（自社サービス）・受託・エンタメ の3軸で事業を加速させています。"
                    : "Since then, we've been accelerating our business across three pillars: Studio (in-house services), Contract Development, and Entertainment."}
                </p>
              </div>
            </div>

            {/* Company Table moved below Team Members */}
          </div>
        </section>

        {/* Team Members */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-8 text-left">
              Member
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

        {/* Company Table (moved below Team Members) */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-8">
              <div className="max-w-4xl md:max-w-5xl mx-auto">
                <div className="mb-8 text-center">
                  <h3 className="text-3xl font-bold text-blue-600 mb-2">COMPANY</h3>
                  <div>
                    <span className="text-2xl font-medium">会社概要</span>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 sm:p-8 border border-gray-200">
                  <table className="w-full table-fixed">
                    <tbody>
                      <tr className="border-b border-gray-300">
                        <td className="py-4 pr-8 font-medium text-gray-900 w-36 sm:w-40 align-top">会社名</td>
                        <td className="py-4 text-gray-700">ProtoductAI株式会社</td>
                      </tr>
                      <tr className="border-b border-gray-300">
                        <td className="py-4 pr-8 font-medium text-gray-900 w-36 sm:w-40 align-top">住所</td>
                        <td className="py-4 text-gray-700">
                          〒605-0074<br />
                          京都市東山区祇園町南側582
                        </td>
                      </tr>
                      <tr className="border-b border-gray-300">
                        <td className="py-4 pr-8 font-medium text-gray-900 w-36 sm:w-40 align-top">代表者</td>
                        <td className="py-4 text-gray-700">代表取締役 CEO</td>
                      </tr>
                      <tr className="border-b border-gray-300">
                        <td className="py-4 pr-8 font-medium text-gray-900 w-36 sm:w-40 align-top">設立</td>
                        <td className="py-4 text-gray-700">2025年3月7日</td>
                      </tr>
                      <tr className="border-b border-gray-300">
                        <td className="py-4 pr-8 font-medium text-gray-900 w-36 sm:w-40 align-top">事業内容</td>
                        <td className="py-4 text-gray-700">
                          AIソフトウェア開発<br />
                          AI研修・コンサルティング<br />
                          受託開発
                        </td>
                      </tr>
                      <tr>
                        <td className="py-4 pr-8 font-medium text-gray-900 w-36 sm:w-40 align-top">従業員数</td>
                        <td className="py-4 text-gray-700">6人（業務委託含む）</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact and Recruitment Section */}
        <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Contact Section */}
              <div className="text-white">
                <h2 className="text-3xl font-bold mb-4">
                  {isJapanese ? "お問い合わせ" : "Contact Us"}
                </h2>
                <p className="text-blue-100 mb-8 leading-relaxed">
                  {isJapanese 
                    ? "サービスに関するご質問や、取材・パートナーシップのご相談などはこちらからお気軽にご連絡ください。"
                    : "Feel free to contact us for any questions about our services, media inquiries, or partnership opportunities."}
                </p>
                <Button
                  onClick={() => navigate("/contact")}
                  className="bg-white text-blue-600 hover:bg-gray-100 rounded-full px-8 py-6 text-lg font-medium"
                  size="lg"
                >
                  <ArrowRight className="mr-2 h-5 w-5" />
                  {isJapanese ? "お問い合わせはこちら" : "Contact Us Here"}
                </Button>
              </div>

              {/* Vertical Divider */}
              <div className="hidden md:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-32 w-px bg-white/30"></div>

              {/* Recruitment Section */}
              <div className="text-white md:border-l md:border-white/30 md:pl-8">
                <h2 className="text-3xl font-bold mb-4">
                  {isJapanese ? "採用について" : "Careers"}
                </h2>
                <p className="text-blue-100 mb-8 leading-relaxed">
                  {isJapanese 
                    ? "チームのビジョンに共感し、共に前進できる仲間を探しています。一緒に働いてみませんか？"
                    : "We're looking for talented individuals who share our vision and can help us move forward. Would you like to work with us?"}
                </p>
                <Button
                  onClick={() => navigate("/careers")}
                  className="bg-white text-blue-600 hover:bg-gray-100 rounded-full px-8 py-6 text-lg font-medium"
                  size="lg"
                >
                  <ExternalLink className="mr-2 h-5 w-5" />
                  {isJapanese ? "採用情報はこちら" : "View Career Opportunities"}
                </Button>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
