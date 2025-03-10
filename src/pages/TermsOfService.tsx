
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MetaTags } from "@/components/MetaTags";
import { useLanguage } from "@/contexts/LanguageContext";

const TermsOfService = () => {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen w-full flex flex-col bg-white">
      <MetaTags 
        title={language === 'en' ? "Terms of Service - Protoduct" : "利用規約 - Protoduct"}
        description={language === 'en' ? "Terms of Service for Protoduct" : "Protoductの利用規約"}
      />
      <Header />
      <main className="flex-1">
        <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {language === 'en' ? "Terms of Service" : "利用規約"}
          </h1>
          
          {language === 'en' ? (
            <div className="prose prose-blue max-w-none">
              <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing or using Protoduct, you agree to be bound by these Terms of Service. If you do not agree to these terms, 
                please do not use our service.
              </p>
              
              <h2>2. Description of Service</h2>
              <p>
                Protoduct provides a platform for uploading and sharing prototype applications developed by users. We offer these 
                services subject to these Terms.
              </p>
              
              <h2>3. User Accounts</h2>
              <p>
                To use certain features of our service, you must create an account. You are responsible for maintaining the security of 
                your account, and you are fully responsible for all activities that occur under your account.
              </p>
              
              <h2>4. User Content</h2>
              <p>
                You retain all rights to the content you post on Protoduct. By posting content, you grant us a non-exclusive, 
                worldwide, royalty-free license to use, display, and distribute your content in connection with our service.
              </p>
              
              <h2>5. Prohibited Conduct</h2>
              <p>You agree not to:</p>
              <ul>
                <li>Post content that infringes on intellectual property rights</li>
                <li>Use the service for any illegal purpose</li>
                <li>Harass, abuse, or harm others</li>
                <li>Impersonate any person or entity</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with other users' enjoyment of the service</li>
              </ul>
              
              <h2>6. Termination</h2>
              <p>
                We reserve the right to terminate or suspend your account at any time for any reason, including violation of these Terms.
              </p>
              
              <h2>7. Changes to Terms</h2>
              <p>
                We may modify these Terms at any time. Your continued use of the service after any changes indicates your acceptance of 
                the modified Terms.
              </p>
              
              <h2>8. Disclaimer of Warranties</h2>
              <p>
                The service is provided "as is" without warranties of any kind, either express or implied.
              </p>
              
              <h2>9. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, Protoduct shall not be liable for any indirect, incidental, special, consequential, 
                or punitive damages resulting from your use of the service.
              </p>
              
              <h2>10. Governing Law</h2>
              <p>
                These Terms shall be governed by the laws of Japan, without regard to its conflict of law principles.
              </p>
              
              <h2>11. Contact</h2>
              <p>
                If you have any questions about these Terms, please contact us at support@protoduct.com.
              </p>
            </div>
          ) : (
            <div className="prose prose-blue max-w-none">
              <p>最終更新日: {new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              
              <h2>1. 規約の同意</h2>
              <p>
                Protoductにアクセスまたは使用することにより、あなたはこの利用規約に拘束されることに同意したことになります。
                これらの条件に同意しない場合は、当社のサービスを使用しないでください。
              </p>
              
              <h2>2. サービスの説明</h2>
              <p>
                Protoductは、ユーザーが開発したプロトタイプアプリケーションをアップロードして共有するためのプラットフォームを提供します。
                当社はこれらのサービスを本規約に従って提供します。
              </p>
              
              <h2>3. ユーザーアカウント</h2>
              <p>
                当社のサービスの特定の機能を使用するには、アカウントを作成する必要があります。
                あなたはアカウントのセキュリティを維持する責任があり、アカウントの下で発生するすべての活動に対して完全に責任を負います。
              </p>
              
              <h2>4. ユーザーコンテンツ</h2>
              <p>
                あなたはProtoductに投稿するコンテンツに関するすべての権利を保持します。
                コンテンツを投稿することにより、当社のサービスに関連してあなたのコンテンツを使用、表示、配布するための
                非独占的、世界的、ロイヤリティフリーのライセンスを当社に付与します。
              </p>
              
              <h2>5. 禁止行為</h2>
              <p>あなたは以下の行為を行わないことに同意します：</p>
              <ul>
                <li>知的財産権を侵害するコンテンツの投稿</li>
                <li>サービスを違法な目的で使用すること</li>
                <li>他者へのハラスメント、虐待、または危害を与えること</li>
                <li>個人または団体を偽装すること</li>
                <li>当社のシステムへの不正アクセスを試みること</li>
                <li>他のユーザーのサービス享受を妨げること</li>
              </ul>
              
              <h2>6. 終了</h2>
              <p>
                当社は、これらの規約に違反した場合を含め、理由の如何を問わず、いつでもあなたのアカウントを終了または停止する権利を留保します。
              </p>
              
              <h2>7. 規約の変更</h2>
              <p>
                当社はいつでもこれらの規約を変更することがあります。
                変更後も引き続きサービスを利用することは、変更された規約に同意したことを意味します。
              </p>
              
              <h2>8. 保証の免責</h2>
              <p>
                サービスは、明示または黙示を問わず、いかなる種類の保証もなく「現状のまま」提供されます。
              </p>
              
              <h2>9. 責任の制限</h2>
              <p>
                法律で許可される最大限の範囲において、Protoductはサービスの使用から生じる間接的、偶発的、特別、結果的、
                または懲罰的損害に対して責任を負いません。
              </p>
              
              <h2>10. 準拠法</h2>
              <p>
                これらの規約は、その法の抵触に関する原則にかかわらず、日本の法律に準拠するものとします。
              </p>
              
              <h2>11. お問い合わせ</h2>
              <p>
                これらの規約について質問がある場合は、support@protoduct.comまでお問い合わせください。
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;
