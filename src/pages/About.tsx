import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Building2, Users, Globe, Award, Target, TrendingUp, Calendar, MapPin, ArrowRight, ExternalLink } from "lucide-react";
import { XIcon } from "@/components/icons/XIcon";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";
import { StructuredData } from "@/components/StructuredData";
import unoImage from "@/assets/uno.jpg";
import FloatingParticles from "@/components/FloatingParticles";
import FloatingLogos from "@/components/FloatingLogos";

export default function About() {
  const { language } = useLanguage();
  const isJapanese = language === 'ja';
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Helmet>
        <title>{isJapanese ? "会社概要 | ProtoductAI Studio" : "About Us | ProtoductAI Studio"}</title>
        <meta name="description" content={isJapanese
          ? "ProtoductAI株式会社について。未来の没入体験ができるアプリを量産するスタジオとして、革新的なテクノロジーで次世代の体験を創造します。"
          : "About ProtoductAI Inc. As a studio for mass-producing apps that enable future immersive experiences, we create next-generation experiences with innovative technology."} />
        <meta property="og:title" content={isJapanese ? "会社概要 | ProtoductAI Studio" : "About Us | ProtoductAI Studio"} />
        <meta property="og:description" content={isJapanese
          ? "ProtoductAI株式会社について。未来の没入体験ができるアプリを量産するスタジオとして、革新的なテクノロジーで次世代の体験を創造します。"
          : "About ProtoductAI Inc. As a studio for mass-producing apps that enable future immersive experiences, we create next-generation experiences with innovative technology."} />
        <meta property="og:image" content={isJapanese ? "/og-image-ja.png" : "/og-image.png"} />
        <meta property="og:url" content={isJapanese ? "https://protoduct.jp/about" : "https://protoduct.jp/about"} />
        <meta property="twitter:title" content={isJapanese ? "会社概要 | ProtoductAI Studio" : "About Us | ProtoductAI Studio"} />
        <meta property="twitter:description" content={isJapanese
          ? "ProtoductAI株式会社について。未来の没入体験ができるアプリを量産するスタジオ。"
          : "About ProtoductAI Inc. A studio for mass-producing apps that enable future immersive experiences."} />
        <link rel="canonical" href="https://protoduct.jp/about" />
      </Helmet>
      <StructuredData
        type="organization"
        title={isJapanese ? "ProtoductAI株式会社 - 会社概要" : "ProtoductAI Inc. - About Us"}
        description={isJapanese
          ? "ProtoductAI株式会社について。未来の没入体験ができるアプリを量産するスタジオとして、革新的なテクノロジーで次世代の体験を創造します。"
          : "About ProtoductAI Inc. As a studio for mass-producing apps that enable future immersive experiences, we create next-generation experiences with innovative technology."}
        url="https://protoduct.jp/about"
      />
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
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-8 text-left" style={{
                background: 'linear-gradient(135deg, #7bc61e, #10c876, #15b8e5)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                {isJapanese ? "私たちについて" : "About Us"}
              </h2>
              
              {/* Our Purpose */}
              <div className="mb-12 max-w-3xl">
                <h3 className="text-2xl md:text-3xl font-semibold mb-5" style={{
                  background: 'linear-gradient(135deg, #7bc61e, #10c876, #15b8e5)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  {isJapanese ? "私たちの存在意義" : "Our Purpose"}
                </h3>
                <p className="text-base md:text-lg text-gray-700 leading-8 mb-5">
                  {isJapanese
                    ? <>ProtoductAI株式会社は、<strong className="text-gray-900 whitespace-nowrap">「AIで可能性を拡張し、想像力を爆発させる未来体験を創造する」</strong>ことを使命に、京都で誕生しました。</>
                    : <>ProtoductAI Inc. was born in Kyoto with the mission to <strong className="text-gray-900 whitespace-nowrap">"expand possibilities with AI and create future experiences that ignite imagination."</strong></>}
                </p>
                <p className="text-base md:text-lg text-gray-700 leading-8">
                  {isJapanese 
                    ? '生成AIと最先端のノーコード／AIcodingツールを駆使し、アイデアからローンチまでを「最速」で駆け抜ける。それが私たちのスタイルであり、カルチャーです。'
                    : "We leverage generative AI and cutting-edge no-code/AI coding tools to sprint from idea to launch at 'maximum speed.' This is our style and our culture."}
                </p>
              </div>

              {/* What We Do - removed per request */}

              {/* Our Strengths - removed per request */}

              {/* Core Values - removed per request */}

            </div>

            {/* Company Table moved below Team Members */}
          </div>
        </section>

        {/* Vision Section - Full Width */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #4a5568, #718096, #a0aec0)' }} />
          <FloatingParticles />
          <FloatingLogos />
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto text-white text-left">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Vision</h3>
              <p className="text-2xl md:text-3xl font-semibold leading-snug mb-6">
                {isJapanese ? "Speed & Quality を武器に、クールな未来体験を世界へ最速で届ける。" : "Deliver cool future experiences to the world with Speed & Quality."}
              </p>
              <p className="text-base md:text-lg text-blue-100 max-w-3xl">
                {isJapanese ? "私たちは究極のスピードと妥協なき品質を両立させ、AIと人が共創するカルチャーを世界中に広げていきます。" : "We pair ultimate speed with uncompromising quality to expand a culture where AI and people co-create across the globe."}
              </p>
            </div>
          </div>
        </section>

        {/* Founding Story Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl">
              <h3 className="text-2xl md:text-3xl font-semibold mb-6" style={{
                background: 'linear-gradient(135deg, #7bc61e, #10c876, #15b8e5)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                {isJapanese ? "創業ストーリー" : "Founding Story"}
              </h3>
              <p className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-6">
                {isJapanese
                  ? "「学生こそ世界を揺らすイノベーションを起こせる」。"
                  : "'Students can create innovations that shake the world.'"}
              </p>
              <p className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-6">
                {isJapanese
                  ? "その想いを共有した仲間が集まり、2025年3月に ProtoductAI を設立。"
                  : "Companions who shared this belief gathered and established ProtoductAI in March 2025."}
              </p>
              <p className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-6">
                {isJapanese
                  ? <>合言葉は <strong className="text-gray-900 font-bold">"Create Cool Experience"</strong>。</>
                  : <>Our motto is <strong className="text-gray-900 font-bold">"Create Cool Experience"</strong>.</>}
              </p>
            </div>
          </div>
        </section>

        {/* Team Members */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-8 text-left" style={{
              background: 'linear-gradient(135deg, #7bc61e, #10c876, #15b8e5)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Member
            </h2>
            {/* First row - 2 members (keep layout) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-6">
              {/* 宇野慎一郎 */}
              <div className="relative group">
                <div className="relative rounded-2xl bg-white border border-gray-200 shadow-lg p-5 w-full aspect-square flex items-end">
                  {/* Proportional vertical image rectangle (match bottom ratio) */}
                  <div className="absolute bottom-5 left-5 w-3/5 h-5/6 rounded-lg overflow-hidden">
                    <img 
                      src={unoImage} 
                      alt="宇野慎一郎" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <a 
                    href="https://x.com/protoduct_ai" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="absolute top-[18%] right-6 w-12 h-12 rounded-xl border border-gray-300 bg-white shadow-md flex items-center justify-center hover:shadow-lg transition-shadow"
                  >
                    <XIcon className="w-6 h-6 text-gray-700" />
                  </a>
                  <div className="absolute bottom-6 right-6 text-right">
                    <h3 className="text-gray-900 font-semibold text-base">宇野慎一郎</h3>
                    <p className="text-gray-600 text-sm mt-1">Founder</p>
                  </div>
                </div>
              </div>

              {/* イギョンウク */}
              <div className="relative group">
                <div className="relative rounded-2xl bg-white border border-gray-200 shadow-lg p-5 w-full aspect-square flex items-end">
                  {/* Proportional placeholder rectangle */}
                  <div className="absolute bottom-5 left-5 w-3/5 h-5/6 rounded-lg overflow-hidden bg-gray-200"></div>
                  <div className="absolute top-[18%] right-6 w-12 h-12 rounded-xl border border-gray-300 bg-white shadow-md flex items-center justify-center">
                    <XIcon className="w-6 h-6 text-gray-700" />
                  </div>
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
                <div className="relative rounded-2xl bg-white border border-gray-200 shadow-lg p-5 w-full aspect-square flex items-end">
                  <div className="absolute bottom-5 left-5 w-3/5 h-5/6 rounded-lg overflow-hidden bg-gray-200"></div>
                  <div className="absolute top-[18%] right-6 w-12 h-12 rounded-xl border border-gray-300 bg-white shadow-md flex items-center justify-center">
                    <XIcon className="w-6 h-6 text-gray-700" />
                  </div>
                  <div className="absolute bottom-6 right-6 text-right">
                    <h3 className="text-gray-900 font-semibold text-base">山内泰嘉</h3>
                    <p className="text-gray-600 text-sm mt-1">Co-founder</p>
                  </div>
                </div>
              </div>

              {/* 奥谷大地 */}
              <div className="relative group">
                <div className="relative rounded-2xl bg-white border border-gray-200 shadow-lg p-5 w-full aspect-square flex items-end">
                  <div className="absolute bottom-5 left-5 w-3/5 h-5/6 rounded-lg overflow-hidden bg-gray-200"></div>
                  <div className="absolute top-[18%] right-6 w-12 h-12 rounded-xl border border-gray-300 bg-white shadow-md flex items-center justify-center">
                    <XIcon className="w-6 h-6 text-gray-700" />
                  </div>
                  <div className="absolute bottom-6 right-6 text-right">
                    <h3 className="text-gray-900 font-semibold text-base">奥谷大地</h3>
                    <p className="text-gray-600 text-sm mt-1">Co-founder</p>
                  </div>
                </div>
              </div>

              {/* 中塚一晃 */}
              <div className="relative group">
                <div className="relative rounded-2xl bg-white border border-gray-200 shadow-lg p-5 w-full aspect-square flex items-end">
                  <div className="absolute bottom-5 left-5 w-3/5 h-5/6 rounded-lg overflow-hidden bg-gray-200"></div>
                  <div className="absolute top-[18%] right-6 w-12 h-12 rounded-xl border border-gray-300 bg-white shadow-md flex items-center justify-center">
                    <XIcon className="w-6 h-6 text-gray-700" />
                  </div>
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
                <div className="mb-8 text-left">
                  <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{
                    background: 'linear-gradient(135deg, #7bc61e, #10c876, #15b8e5)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    COMPANY
                  </h2>
                  <p className="text-xl md:text-2xl font-medium text-gray-600 mt-2">会社概要</p>
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
        <section
          className="relative py-20 overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #4a5568, #718096, #a0aec0)' }}
        >
          <FloatingParticles />
          <FloatingLogos />
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
            <div className="grid md:grid-cols-2 gap-8 text-white">
              {/* Contact Section */}
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  {isJapanese ? "お問い合わせ" : "Contact Us"}
                </h2>
                <p className="text-base text-blue-100 mb-8 leading-relaxed">
                  {isJapanese 
                    ? "サービスに関するご質問や、取材・パートナーシップのご相談などはこちらからお気軽にご連絡ください。"
                    : "Feel free to contact us for any questions about our services, media inquiries, or partnership opportunities."}
                </p>
                <Button
                  onClick={() => navigate("/contact")}
                  className="bg-black text-white hover:bg-gray-900 rounded-full px-8 py-6 text-lg font-medium"
                  size="lg"
                >
                  <ArrowRight className="mr-2 h-5 w-5" />
                  {isJapanese ? "お問い合わせはこちら" : "Contact Us Here"}
                </Button>
              </div>

              {/* Recruitment Section */}
              <div className="md:border-l md:border-white/30 md:pl-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  {isJapanese ? "採用について" : "Careers"}
                </h2>
                <p className="text-base text-blue-100 mb-8 leading-relaxed">
                  {isJapanese 
                    ? "チームのビジョンに共感し、共に前進できる仲間を探しています。一緒に働いてみませんか？"
                    : "We're looking for talented individuals who share our vision and can help us move forward. Would you like to work with us?"}
                </p>
                <Button
                  onClick={() => navigate("/careers")}
                  className="bg-black text-white hover:bg-gray-900 rounded-full px-8 py-6 text-lg font-medium"
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
