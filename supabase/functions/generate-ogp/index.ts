// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createCanvas, registerFont } from 'https://deno.land/x/canvas@v1.4.1/mod.ts'

// 日本語フォント（Noto Sans JPなど）を使いたい場合はここでregisterFontする
// registerFont('/path/to/NotoSansJP-Regular.otf', { family: 'Noto Sans JP' })

const WIDTH = 1200;
const HEIGHT = 630;
const SERVICE_NAME = "Protoduct";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    } })
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');
  const service = searchParams.get('service') || SERVICE_NAME;

  // テキスト取得
  let mainText = '';
  if (type === 'article') {
    mainText = searchParams.get('title') || '';
  } else if (type === 'product') {
    mainText = searchParams.get('name') || '';
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

  // メインテキスト（中央）
  ctx.font = 'bold 64px "Noto Sans JP", sans-serif';
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  // 長い場合は省略
  let displayText = mainText.length > 32 ? mainText.slice(0, 32) + '…' : mainText;
  ctx.fillText(displayText, WIDTH / 2, HEIGHT / 2, WIDTH - 160);

  // サービス名（下部）
  ctx.font = 'bold 36px "Noto Sans JP", sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.textAlign = 'right';
  ctx.fillText(service, WIDTH - 60, HEIGHT - 60);

  // PNGバッファを返す
  const buffer = canvas.toBuffer();
  return new Response(buffer, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=86400',
    },
  });
});