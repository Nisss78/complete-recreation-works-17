import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Helmet } from "react-helmet-async";

const TermsOfService = () => {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50">
      <Helmet>
        <title>{language === 'en' ? "Specified Commercial Transaction Act | Protoduct" : "特定商取引法に基づく表記 | Protoduct (プロトダクト)"}</title>
        <meta name="description" content={language === 'en'
          ? "Legal information and commercial transaction act details for Protoduct platform services."
          : "Protoductプラットフォームサービスの特定商取引法に基づく法的情報。"} />
        <meta property="og:title" content={language === 'en' ? "Specified Commercial Transaction Act | Protoduct" : "特定商取引法に基づく表記 | Protoduct (プロトダクト)"} />
        <meta property="og:description" content={language === 'en'
          ? "Legal information and commercial transaction act details for Protoduct platform services."
          : "Protoductプラットフォームサービスの特定商取引法に基づく法的情報。"} />
        <meta property="og:image" content={language === 'ja' ? "/og-image-ja.png" : "/og-image.png"} />
        <meta property="og:url" content="https://protoduct.jp/terms" />
        <meta property="twitter:title" content={language === 'en' ? "Specified Commercial Transaction Act | Protoduct" : "特定商取引法に基づく表記 | Protoduct"} />
        <meta property="twitter:description" content={language === 'en'
          ? "Legal information for Protoduct platform services."
          : "Protoductプラットフォームサービスの法的情報。"} />
        <link rel="canonical" href="https://protoduct.jp/terms" />
      </Helmet>
      <Header />
      <main className="flex-1 pt-24 md:pt-28">
        <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-2" style={{
              background: 'linear-gradient(135deg, #7bc61e, #10c876, #15b8e5)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              {language === 'en' ? "Specified Commercial Transaction Act" : "特定商取引法に基づく表記"}
            </h1>
            <p className="text-gray-600">
              {language === 'en' ? "Legal Information" : "法的情報"}
            </p>
          </div>

          {/* Commercial Transactions Act */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">
                {language === 'en' ? "Specified Commercial Transaction Act" : "特定商取引法に基づく表記"}
              </CardTitle>
              <p className="text-sm text-gray-500">
                {language === 'en' ? "For Corporate Transactions" : "法人用"}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {language === 'en' ? "Business Operator" : "販売事業者"}
                    </h4>
                    <p className="text-gray-700">ProtoductAI株式会社</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {language === 'en' ? "Representative" : "運営責任者"}
                    </h4>
                    <p className="text-gray-700">宇野 慎一郎</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {language === 'en' ? "Address" : "所在地"}
                    </h4>
                    <p className="text-gray-700">
                      〒605-0074<br />
                      京都市東山区祇園町南側582
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {language === 'en' ? "Contact" : "連絡先"}
                    </h4>
                    <p className="text-gray-700">
                      {language === 'en' ? "Email: " : "メールアドレス："}protoduct3@gmail.com
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {language === 'en'
                        ? "※Please contact us by email in principle"
                        : "※原則メールでのお問い合わせをお願いしております"}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-6 space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {language === 'en' ? "Sales Price" : "販売価格"}
                    </h4>
                    <p className="text-gray-700">
                      {language === 'en'
                        ? "Service fees are listed on each service website (e.g., ¥980/month inc. tax)"
                        : "各サービスの利用料金は、サービスごとのウェブサイトに記載します（例：月額980円（税込））。"}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {language === 'en' ? "Additional Charges" : "商品代金以外の必要料金"}
                    </h4>
                    <p className="text-gray-700">
                      {language === 'en'
                        ? "Internet connection and communication charges are borne by the customer."
                        : "インターネット接続料金・通信料等はお客様のご負担となります。"}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {language === 'en' ? "Payment Methods" : "支払い方法"}
                    </h4>
                    <p className="text-gray-700">
                      {language === 'en' ? "Credit Card (Stripe)" : "クレジットカード（Stripe決済）"}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {language === 'en' ? "Payment Timing" : "支払い時期"}
                    </h4>
                    <p className="text-gray-700">
                      {language === 'en'
                        ? "Initial payment upon registration, then automatic monthly billing based on subscription plan."
                        : "初回登録時に決済、その後は契約プランに基づき毎月自動決済。"}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {language === 'en' ? "Service Provision" : "サービス提供時期"}
                    </h4>
                    <p className="text-gray-700">
                      {language === 'en'
                        ? "Available immediately after payment completion."
                        : "決済完了後、ただちに利用可能です。"}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {language === 'en' ? "Cancellation" : "解約について"}
                    </h4>
                    <p className="text-gray-700">
                      {language === 'en'
                        ? "Cancellation is available anytime from the user's account page. No charges will occur after the next renewal date."
                        : "ユーザーのマイページからいつでも解約可能です。解約後は次回更新日以降の請求は発生しません。"}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {language === 'en' ? "Returns & Cancellations" : "返品・キャンセルについて"}
                    </h4>
                    <p className="text-gray-700">
                      {language === 'en'
                        ? "Due to the nature of the service, refunds cannot be provided after service provision has begun. However, refunds may be considered in cases deemed necessary by our company."
                        : "サービスの性質上、提供開始後の返金には応じられません。ただし、当社が必要と認めた場合には返金に応じる場合があります。"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;