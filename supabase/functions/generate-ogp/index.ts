// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createCanvas, registerFont } from 'https://deno.land/x/canvas@v1.4.1/mod.ts'

// 日本語フォント対応
try {
  // Noto Sans JPフォントをGoogle Fontsから読み込み
  const fontResponse = await fetch('https://fonts.gstatic.com/s/notosansjp/v52/o-0IIpQlx3QUlC5A4PNr5TRASf6M7Q.woff2');
  if (fontResponse.ok) {
    const fontBuffer = await fontResponse.arrayBuffer();
    registerFont(new Uint8Array(fontBuffer), { family: 'Noto Sans JP' });
  }
} catch (e) {
  console.warn('日本語フォント読み込み失敗:', e);
}

const WIDTH = 1200;
const HEIGHT = 630;
const SERVICE_NAME = "Protoduct";

serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      } })
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const service = searchParams.get('service') || SERVICE_NAME;

    // テキスト取得
    let mainText = '';
    let subText = '';
    
    if (type === 'article') {
      mainText = searchParams.get('title') || 'Article';
      subText = searchParams.get('author') || '';
    } else if (type === 'product') {
      mainText = searchParams.get('name') || 'Product';
      subText = searchParams.get('tags') || '';
    } else {
      mainText = 'OGPカード';
    }

    // canvas初期化
    const canvas = createCanvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext('2d');

    // グラデーション背景
    const grad = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
    grad.addColorStop(0, '#0070F3');
    grad.addColorStop(1, '#00A8FF');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // メインテキスト（中央上部）
    ctx.font = 'bold 56px "Noto Sans JP", Arial, sans-serif';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // 長い場合は省略
    const displayText = mainText.length > 35 ? mainText.slice(0, 35) + '…' : mainText;
    ctx.fillText(displayText, WIDTH / 2, HEIGHT / 2 - 40, WIDTH - 100);

    // サブテキスト（中央下部）
    if (subText) {
      ctx.font = 'normal 32px "Noto Sans JP", Arial, sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      const displaySubText = subText.length > 50 ? subText.slice(0, 50) + '…' : subText;
      ctx.fillText(displaySubText, WIDTH / 2, HEIGHT / 2 + 40, WIDTH - 100);
    }

    // サービス名（右下）
    ctx.font = 'bold 36px "Noto Sans JP", Arial, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.textAlign = 'right';
    ctx.fillText(service, WIDTH - 60, HEIGHT - 60);

    // ロゴ的な装飾（左上）
    ctx.font = 'bold 28px Arial, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.textAlign = 'left';
    ctx.fillText('🚀', 60, 80);

    // PNGバッファを返す
    const buffer = canvas.toBuffer();
    
    // X（Twitter）対応のヘッダー
    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        'Access-Control-Allow-Origin': '*',
        'Content-Length': buffer.length.toString(),
        'X-Content-Type-Options': 'nosniff',
        'Accept-Ranges': 'bytes',
      },
    });
    
  } catch (error) {
    console.error('OGP画像生成エラー:', error);
    
    // エラー時のフォールバック画像
    const canvas = createCanvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext('2d');
    
    // シンプルな背景
    ctx.fillStyle = '#0070F3';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    
    // エラーメッセージ
    ctx.font = 'bold 48px "Noto Sans JP", Arial, sans-serif';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Protoduct', WIDTH / 2, HEIGHT / 2);
    
    const fallbackBuffer = canvas.toBuffer();
    
    return new Response(fallbackBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  }
});