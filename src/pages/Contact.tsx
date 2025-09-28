import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import FloatingParticles from "@/components/FloatingParticles";
import FloatingLogos from "@/components/FloatingLogos";

export default function Contact() {
  const { language } = useLanguage();
  const isJapanese = language === 'ja';
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    inquiryType: "general",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-contact-email`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast({
          title: isJapanese ? "送信完了" : "Sent Successfully",
          description: isJapanese
            ? "お問い合わせを受け付けました。担当者より2営業日以内にご連絡いたします。"
            : "We have received your inquiry. Our team will contact you within 2 business days.",
        });
        setFormData({
          name: "",
          email: "",
          company: "",
          inquiryType: "general",
          message: ""
        });
      } else {
        throw new Error(data.error || 'Failed to send email');
      }
    } catch (error) {
      console.error('Error sending contact form:', error);
      toast({
        title: isJapanese ? "送信エラー" : "Error",
        description: isJapanese
          ? "送信中にエラーが発生しました。もう一度お試しください。"
          : "An error occurred while sending. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const inquiryTypes = [
    { value: "general", labelJa: "一般的なお問い合わせ", labelEn: "General Inquiry" },
    { value: "support", labelJa: "技術サポート", labelEn: "Technical Support" },
    { value: "business", labelJa: "ビジネス・提携", labelEn: "Business Partnership" },
    { value: "media", labelJa: "メディア取材", labelEn: "Media Inquiry" },
    { value: "other", labelJa: "その他", labelEn: "Other" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Page Title */}
        <div className="bg-white border-b relative overflow-hidden">
          <FloatingParticles />
          <FloatingLogos />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-28 md:pt-32 relative z-10">
            <h1
              className="text-5xl sm:text-6xl font-bold mb-4 text-left"
              style={{
                background: 'linear-gradient(135deg, #7bc61e, #10c876, #15b8e5)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              CONTACT
            </h1>
            <p className="text-xl text-gray-700 text-left">
              {isJapanese ? "お問い合わせ" : "Contact Us"}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{isJapanese ? "連絡先情報" : "Contact Information"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-medium">{isJapanese ? "メール" : "Email"}</p>
                      <p className="text-gray-600">protoduct3@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-medium">{isJapanese ? "住所" : "Address"}</p>
                      <p className="text-gray-600">
                        {isJapanese 
                          ? "〒605-0074\n京都市東山区祇園町南側582" 
                          : "582 Gion-machi Minamigawa\nHigashiyama-ku, Kyoto 605-0074, Japan"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-medium">{isJapanese ? "営業時間" : "Business Hours"}</p>
                      <p className="text-gray-600">
                        {isJapanese 
                          ? "平日 9:00 - 18:00 (JST)" 
                          : "Mon-Fri 9:00 AM - 6:00 PM (JST)"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>{isJapanese ? "お問い合わせフォーム" : "Contact Form"}</CardTitle>
                  <CardDescription>
                    {isJapanese 
                      ? "必要事項をご記入の上、送信してください" 
                      : "Please fill out the form and submit"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">
                          {isJapanese ? "お名前" : "Name"} <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder={isJapanese ? "山田太郎" : "John Doe"}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">
                          {isJapanese ? "メールアドレス" : "Email"} <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="example@email.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company">
                        {isJapanese ? "会社名" : "Company"}
                      </Label>
                      <Input
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder={isJapanese ? "株式会社Example" : "Example Inc."}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>{isJapanese ? "お問い合わせ種別" : "Inquiry Type"} <span className="text-red-500">*</span></Label>
                      <RadioGroup 
                        value={formData.inquiryType} 
                        onValueChange={(value) => setFormData({...formData, inquiryType: value})}
                      >
                        {inquiryTypes.map((type) => (
                          <div key={type.value} className="flex items-center space-x-2">
                            <RadioGroupItem value={type.value} id={type.value} />
                            <Label htmlFor={type.value} className="font-normal cursor-pointer">
                              {isJapanese ? type.labelJa : type.labelEn}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">
                        {isJapanese ? "お問い合わせ内容" : "Message"} <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        placeholder={isJapanese 
                          ? "お問い合わせ内容をご記入ください" 
                          : "Please enter your message"}
                      />
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">
                        {isJapanese 
                          ? "※ ご入力いただいた個人情報は、お問い合わせへの対応のみに使用いたします。" 
                          : "* Your personal information will only be used to respond to your inquiry."}
                      </p>
                    </div>

                    <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                      <Send className="h-4 w-4 mr-2" />
                      {isSubmitting
                        ? (isJapanese ? "送信中..." : "Sending...")
                        : (isJapanese ? "送信する" : "Send Message")}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
