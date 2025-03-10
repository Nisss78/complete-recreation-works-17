
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MetaTags } from "@/components/MetaTags";
import { useLanguage } from "@/contexts/LanguageContext";

const PrivacyPolicy = () => {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen w-full flex flex-col bg-white">
      <MetaTags 
        title={language === 'en' ? "Privacy Policy - Protoduct" : "プライバシーポリシー - Protoduct"}
        description={language === 'en' ? "Privacy Policy for Protoduct" : "Protoductのプライバシーポリシー"}
      />
      <Header />
      <main className="flex-1">
        <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {language === 'en' ? "Privacy Policy" : "プライバシーポリシー"}
          </h1>
          
          {language === 'en' ? (
            <div className="prose prose-blue max-w-none">
              <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              
              <h2>1. Introduction</h2>
              <p>
                At Protoduct, we respect your privacy and are committed to protecting your personal data. This Privacy Policy
                explains how we collect, use, and safeguard your information when you use our service.
              </p>
              
              <h2>2. Information We Collect</h2>
              <p>We collect several types of information, including:</p>
              <ul>
                <li><strong>Personal Information:</strong> Name, email address, and profile information you provide when creating an account.</li>
                <li><strong>Usage Data:</strong> Information about how you interact with our service, including access times, pages viewed, and features used.</li>
                <li><strong>Device Information:</strong> Information about your device, browser type, IP address, and operating system.</li>
                <li><strong>Content:</strong> Products, comments, and other content you upload or post on our platform.</li>
              </ul>
              
              <h2>3. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul>
                <li>Provide, maintain, and improve our service</li>
                <li>Personalize your experience</li>
                <li>Process transactions and send related information</li>
                <li>Send notifications and updates related to your account</li>
                <li>Respond to your comments, questions, and requests</li>
                <li>Monitor and analyze trends, usage, and activities in connection with our service</li>
                <li>Detect, prevent, and address technical issues and security breaches</li>
              </ul>
              
              <h2>4. Information Sharing</h2>
              <p>We may share your information with:</p>
              <ul>
                <li><strong>Service Providers:</strong> Third parties that help us operate our service, such as hosting providers and analytics services.</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights or the safety of our users.</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, sale of company assets, financing, or acquisition.</li>
              </ul>
              <p>We will never sell your personal information to third parties.</p>
              
              <h2>5. Data Security</h2>
              <p>
                We implement appropriate security measures to protect your personal information. However, no method of transmission over
                the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
              </p>
              
              <h2>6. Your Rights</h2>
              <p>Depending on your location, you may have rights regarding your personal data, including:</p>
              <ul>
                <li>Accessing your personal information</li>
                <li>Correcting inaccurate information</li>
                <li>Deleting your information</li>
                <li>Restricting or objecting to processing</li>
                <li>Data portability</li>
              </ul>
              
              <h2>7. Children's Privacy</h2>
              <p>
                Our service is not intended for use by children under the age of 13. We do not knowingly collect personal information from
                children under 13. If you believe we have collected information from a child under 13, please contact us.
              </p>
              
              <h2>8. Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page
                and updating the "Last updated" date.
              </p>
              
              <h2>9. Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy, please contact us at privacy@protoduct.com.
              </p>
            </div>
          ) : (
            <div className="prose prose-blue max-w-none">
              <p>最終更新日: {new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              
              <h2>1. はじめに</h2>
              <p>
                Protoductでは、あなたのプライバシーを尊重し、個人データの保護に努めています。
                このプライバシーポリシーは、当社のサービスを利用する際に当社がどのように情報を収集、使用、
                および保護するかを説明するものです。
              </p>
              
              <h2>2. 収集する情報</h2>
              <p>当社は以下の種類の情報を収集します：</p>
              <ul>
                <li><strong>個人情報：</strong> アカウント作成時に提供される名前、メールアドレス、プロフィール情報。</li>
                <li><strong>利用データ：</strong> アクセス時間、閲覧したページ、使用した機能など、サービスとの相互作用に関する情報。</li>
                <li><strong>デバイス情報：</strong> デバイス、ブラウザの種類、IPアドレス、オペレーティングシステムに関する情報。</li>
                <li><strong>コンテンツ：</strong> プラットフォームにアップロードまたは投稿する製品、コメント、およびその他のコンテンツ。</li>
              </ul>
              
              <h2>3. 情報の使用方法</h2>
              <p>収集した情報は以下の目的で使用します：</p>
              <ul>
                <li>サービスの提供、維持、および改善</li>
                <li>体験のパーソナライズ</li>
                <li>取引の処理と関連情報の送信</li>
                <li>アカウントに関連する通知や更新の送信</li>
                <li>コメント、質問、およびリクエストへの対応</li>
                <li>サービスに関連するトレンド、使用状況、活動の監視と分析</li>
                <li>技術的問題やセキュリティ侵害の検出、防止、対処</li>
              </ul>
              
              <h2>4. 情報共有</h2>
              <p>当社は以下の場合に情報を共有することがあります：</p>
              <ul>
                <li><strong>サービスプロバイダー：</strong> ホスティングプロバイダーや分析サービスなど、サービスの運営を支援する第三者。</li>
                <li><strong>法的要件：</strong> 法律で要求される場合、または当社の権利やユーザーの安全を保護するため。</li>
                <li><strong>事業譲渡：</strong> 合併、会社資産の売却、資金調達、または買収に関連して。</li>
              </ul>
              <p>当社は個人情報を第三者に販売することはありません。</p>
              
              <h2>5. データセキュリティ</h2>
              <p>
                当社は個人情報を保護するために適切なセキュリティ対策を実施しています。
                ただし、インターネットでの送信や電子ストレージの方法は100%安全ではなく、絶対的なセキュリティを保証することはできません。
              </p>
              
              <h2>6. あなたの権利</h2>
              <p>所在地によっては、個人データに関して以下の権利を有する場合があります：</p>
              <ul>
                <li>個人情報へのアクセス</li>
                <li>不正確な情報の修正</li>
                <li>情報の削除</li>
                <li>処理の制限または反対</li>
                <li>データポータビリティ</li>
              </ul>
              
              <h2>7. 子どものプライバシー</h2>
              <p>
                当社のサービスは13歳未満の子どもの使用を意図していません。
                当社は13歳未満の子どもから意図的に個人情報を収集することはありません。
                13歳未満の子どもから情報を収集したと思われる場合は、当社にご連絡ください。
              </p>
              
              <h2>8. プライバシーポリシーの変更</h2>
              <p>
                当社は随時このプライバシーポリシーを更新することがあります。
                変更があった場合は、このページに新しいポリシーを掲載し、「最終更新日」を更新することでお知らせします。
              </p>
              
              <h2>9. お問い合わせ</h2>
              <p>
                このプライバシーポリシーについて質問がある場合は、privacy@protoduct.comまでお問い合わせください。
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
