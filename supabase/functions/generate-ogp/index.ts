import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createCanvas, loadImage } from 'https://deno.land/x/canvas@v1.4.1/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { type, data } = await req.json()
    const canvas = createCanvas(1200, 630)
    const ctx = canvas.getContext('2d')

    // 背景を白に設定
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, 1200, 630)

    if (type === 'product') {
      const { name, imageUrl } = data
      
      // 商品画像を読み込んで描画
      if (imageUrl) {
        const image = await loadImage(imageUrl)
        ctx.drawImage(image, 60, 60, 500, 500)
      }

      // 商品名を描画
      ctx.font = 'bold 48px sans-serif'
      ctx.fillStyle = '#000000'
      ctx.fillText(name, 600, 120, 540)

      // サービスロゴを描画
      const logo = await loadImage('https://example.com/logo.png') // ロゴのURLを設定
      ctx.drawImage(logo, 600, 480, 200, 100)
    } 
    else if (type === 'article') {
      const { title, authorName, authorIcon } = data

      // タイトルを描画
      ctx.font = 'bold 48px sans-serif'
      ctx.fillStyle = '#000000'
      ctx.fillText(title, 60, 120, 1080)

      // 投稿者アイコンを読み込んで描画
      if (authorIcon) {
        const icon = await loadImage(authorIcon)
        ctx.save()
        ctx.beginPath()
        ctx.arc(60, 500, 40, 0, Math.PI * 2)
        ctx.clip()
        ctx.drawImage(icon, 20, 460, 80, 80)
        ctx.restore()
      }

      // 投稿者名を描画
      ctx.font = '32px sans-serif'
      ctx.fillStyle = '#666666'
      ctx.fillText(authorName, 160, 500)
    }

    const buffer = canvas.toBuffer()
    
    return new Response(buffer, { 
      headers: { 
        ...corsHeaders,
        'Content-Type': 'image/png'
      } 
    })
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})