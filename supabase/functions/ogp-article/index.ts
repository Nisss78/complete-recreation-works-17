import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// SupabaseクライアントをDenoで使う場合のimport例
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const client = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const SERVICE_NAME = "Protoduct";

serve(async (req) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return new Response("記事IDが指定されていません", { status: 400 });
  }

  // 記事データ取得
  const { data, error } = await client
    .from("articles")
    .select(`
      *,
      profile:profiles!articles_user_id_fkey (
        id,
        username,
        avatar_url
      )
    `)
    .eq("id", id)
    .single();

  if (error || !data) {
    return new Response("記事が見つかりません", { status: 404 });
  }

  const title = data.title || "記事タイトル";
  const description = (data.content || "").substring(0, 100);
  const author = data.profile?.username || "Unknown User";
  const ogImageUrl = `${SUPABASE_URL}/functions/v1/generate-ogp?type=article&title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}&service=${encodeURIComponent(SERVICE_NAME)}`;
  const canonicalUrl = `${SUPABASE_URL.replace(/\/functions.*/, '')}/articles/${id}`;

  // OGPタグ付きHTMLを返す
  const html = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <title>${title} - ${SERVICE_NAME}</title>
  <meta name="description" content="${description}">
  <meta property="og:title" content="${title} - ${SERVICE_NAME}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${ogImageUrl}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${canonicalUrl}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title} - ${SERVICE_NAME}">
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