// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const client = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const SERVICE_NAME = "Protoduct";

export const config = {
  auth: false,
};

serve(async (req) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return new Response("製品IDが指定されていません", { status: 400 });
  }

  // 製品データ取得
  const { data, error } = await client
    .from("products")
    .select(`
      *,
      product_tags (tag)
    `)
    .eq("id", id)
    .single();

  if (error || !data) {
    return new Response("製品が見つかりません", { status: 404 });
  }

  const name = data.name || "製品名";
  const tagline = data.tagline || "";
  const tags = (data.product_tags || []).map((t: any) => t.tag).join(", ");
  const description = tagline + (tags ? ` / ${tags}` : "");
  const ogImageUrl = `${SUPABASE_URL}/functions/v1/generate-ogp?type=product&name=${encodeURIComponent(name)}&tags=${encodeURIComponent(tags)}&service=${encodeURIComponent(SERVICE_NAME)}`;
  const canonicalUrl = `${SUPABASE_URL.replace(/\/functions.*/, '')}/products/${id}`;

  // OGPタグ付きHTMLを返す
  const html = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <title>${name} - ${SERVICE_NAME}</title>
  <meta name="description" content="${description}">
  <meta property="og:title" content="${name} - ${SERVICE_NAME}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${ogImageUrl}">
  <meta property="og:type" content="product">
  <meta property="og:url" content="${canonicalUrl}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${name} - ${SERVICE_NAME}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${ogImageUrl}">
  <meta http-equiv="refresh" content="0;url=${canonicalUrl}">
</head>
<body>
  <p>リダイレクト中...</p>
</body>
</html>`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=600"
    }
  });
}); 