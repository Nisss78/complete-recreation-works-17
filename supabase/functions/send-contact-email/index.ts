import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ContactFormData {
  name: string;
  email: string;
  company: string;
  inquiryType: string;
  message: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { name, email, company, inquiryType, message }: ContactFormData = await req.json()

    // Validate required fields
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      )
    }

    // Get Resend API key from environment variables
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set')
      return new Response(
        JSON.stringify({ error: 'Email service configuration error' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        }
      )
    }

    // Map inquiry type to Japanese labels
    const inquiryTypeLabels: Record<string, string> = {
      general: '一般的なお問い合わせ',
      support: '技術サポート',
      business: 'ビジネス・提携',
      media: 'メディア取材',
      other: 'その他'
    }

    // Prepare email content
    const emailHtml = `
      <h2>新しいお問い合わせがあります</h2>
      <p><strong>お名前:</strong> ${name}</p>
      <p><strong>メールアドレス:</strong> ${email}</p>
      <p><strong>会社名:</strong> ${company || '（未入力）'}</p>
      <p><strong>お問い合わせ種別:</strong> ${inquiryTypeLabels[inquiryType] || inquiryType}</p>
      <p><strong>お問い合わせ内容:</strong></p>
      <p style="white-space: pre-wrap;">${message}</p>
      <hr>
      <p style="color: #666; font-size: 12px;">このメールはProtoductのお問い合わせフォームから送信されました。</p>
    `

    const emailText = `
新しいお問い合わせがあります

お名前: ${name}
メールアドレス: ${email}
会社名: ${company || '（未入力）'}
お問い合わせ種別: ${inquiryTypeLabels[inquiryType] || inquiryType}

お問い合わせ内容:
${message}

---
このメールはProtoductのお問い合わせフォームから送信されました。
    `

    // Send email using Resend API
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Protoduct Contact Form <onboarding@resend.dev>',
        to: ['protoduct3@gmail.com'],
        reply_to: email,
        subject: `【Protoduct】${inquiryTypeLabels[inquiryType] || 'お問い合わせ'} - ${name}様より`,
        html: emailHtml,
        text: emailText,
      }),
    })

    const data = await res.json()

    if (res.ok) {
      console.log('Email sent successfully:', data)
      return new Response(
        JSON.stringify({ success: true, message: 'Email sent successfully' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      )
    } else {
      console.error('Failed to send email:', data)
      return new Response(
        JSON.stringify({ error: 'Failed to send email', details: data }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        }
      )
    }
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred', details: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})