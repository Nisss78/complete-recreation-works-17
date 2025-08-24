-- Create news table
CREATE TABLE IF NOT EXISTS public.news (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    date DATE NOT NULL,
    title_ja TEXT NOT NULL,
    title_en TEXT NOT NULL,
    content_ja TEXT NOT NULL,
    content_en TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('announcement', 'event', 'media', 'other')),
    logo_type TEXT DEFAULT 'new' CHECK (logo_type IN ('old', 'new')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- Create RLS policies
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read news
CREATE POLICY "Anyone can read news" ON public.news
    FOR SELECT
    USING (true);

-- Only admins can insert news
CREATE POLICY "Only admins can insert news" ON public.news
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.is_admin = true
        )
    );

-- Only admins can update news
CREATE POLICY "Only admins can update news" ON public.news
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.is_admin = true
        )
    );

-- Only admins can delete news
CREATE POLICY "Only admins can delete news" ON public.news
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.is_admin = true
        )
    );

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_news_updated_at
    BEFORE UPDATE ON public.news
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample news data
INSERT INTO public.news (date, title_ja, title_en, content_ja, content_en, category, logo_type)
VALUES 
    ('2025-06-04', 
     'Athena Technologies コーポレートロゴ刷新のお知らせ', 
     'Athena Technologies Corporate Logo Renewal Announcement',
     'この度、株式会社Athena Technologiesはブランドイメージ刷新に伴いコーポレートロゴを刷新いたしました。

ロゴリニューアルの背景

当社は創業以来、「セキュアなAIにより持続可能な未来を拓く」というVisionを掲げ、AIセキュリティ・DX領域で事業を展開してまいりました。

近年、生成AIの社会実装が急速に進む中で、当社の提供価値は「セキュリティ × 先進性 × グローバルスケール」へと拡大しています。こうした変化をより分かりやすく、かつ力強く示すため、ブランドの象徴であるロゴを刷新する運びとなりました。',
     'We are pleased to announce that Athena Technologies has renewed its corporate logo as part of our brand image refresh.

Background of Logo Renewal

Since our founding, we have been developing our business in the AI security and DX fields under our vision of "Opening a sustainable future through secure AI."

In recent years, as the social implementation of generative AI rapidly progresses, our value proposition has expanded to "Security × Innovation × Global Scale." To clearly and powerfully demonstrate these changes, we have decided to renew our logo, which is the symbol of our brand.',
     'announcement',
     'new'),
     
    ('2025-06-03', 
     'Athenaがデジタル化・DX推進展【東京】に出展いたします', 
     'Athena Will Exhibit at Digital Transformation Expo [Tokyo]',
     '株式会社Athena Technologiesは、2025年7月10日から12日まで東京ビッグサイトで開催される「デジタル化・DX推進展【東京】」に出展いたします。

展示内容：
- 最新のAIセキュリティソリューション
- エンタープライズ向けDX支援サービス
- グローバル展開事例の紹介

皆様のご来場を心よりお待ちしております。',
     'Athena Technologies will exhibit at the Digital Transformation Expo [Tokyo] held at Tokyo Big Sight from July 10-12, 2025.

Exhibition Contents:
- Latest AI security solutions
- Enterprise DX support services
- Global deployment case studies

We look forward to your visit.',
     'event',
     'old'),
     
    ('2025-06-01', 
     '東京大学大学院教授 松尾豊氏が当社の技術顧問に就任', 
     'Professor Yutaka Matsuo of the University of Tokyo Appointed as Technical Advisor',
     '株式会社Athena Technologiesは、東京大学大学院工学系研究科の松尾豊教授が当社の技術顧問に就任したことをお知らせいたします。

松尾教授は、日本のAI研究の第一人者として知られ、深層学習を中心とした人工知能技術の研究開発に従事されています。今回の就任により、当社のAI技術開発力のさらなる強化を図ってまいります。',
     'Athena Technologies is pleased to announce that Professor Yutaka Matsuo of the Graduate School of Engineering at the University of Tokyo has been appointed as our technical advisor.

Professor Matsuo is known as a leading AI researcher in Japan and is engaged in research and development of artificial intelligence technology centered on deep learning. With this appointment, we will further strengthen our AI technology development capabilities.',
     'announcement',
     'old'),
     
    ('2025-05-23', 
     'AthenaがJapan IT Week【名古屋】に出展いたします', 
     'Athena Will Exhibit at Japan IT Week [Nagoya]',
     '株式会社Athena Technologiesは、2025年6月15日から17日まで名古屋国際展示場で開催される「Japan IT Week【名古屋】」に出展いたします。

ブース番号：A-123
展示テーマ：「AIで変革する未来のビジネス」

最新のAIソリューションをご体験いただけます。',
     'Athena Technologies will exhibit at Japan IT Week [Nagoya] held at Nagoya International Exhibition Hall from June 15-17, 2025.

Booth Number: A-123
Exhibition Theme: "Business Future Transformed by AI"

You can experience our latest AI solutions.',
     'event',
     'old');