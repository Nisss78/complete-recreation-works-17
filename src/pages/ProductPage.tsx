
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";

// この関数はスラッグから製品を取得します
const fetchProductBySlug = async (slug: string) => {
  console.log('Fetching product with slug:', slug);
  
  // すべての製品を取得
  const { data: products, error } = await supabase
    .from('products')
    .select(`
      *,
      product_tags (
        tag
      ),
      product_images (
        image_url
      )
    `);

  if (error) throw error;

  // スラッグに一致する製品を探す
  const product = products.find(p => 
    p.name.toLowerCase().replace(/\s+/g, '-') === slug
  );

  if (!product) {
    throw new Error('Product not found');
  }

  // いいね数を取得
  const { count } = await supabase
    .from('product_likes')
    .select('*', { count: 'exact' })
    .eq('product_id', product.id);

  return {
    id: product.id,
    name: product.name,
    tagline: product.tagline,
    description: product.description,
    icon: product.icon_url,
    URL: product.URL,
    tags: product.product_tags?.map(t => t.tag) || [],
    upvotes: count || 0,
    comments: 0,
    launchDate: new Date(product.created_at),
    images: product.product_images?.map(img => img.image_url) || []
  };
};

const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product-by-slug', slug],
    queryFn: () => fetchProductBySlug(slug!),
    enabled: !!slug,
  });

  // 3秒後にホームページにリダイレクト（OGPクローラーが情報を取得する時間を確保）
  useEffect(() => {
    const timer = setTimeout(() => {
      if (slug) {
        navigate(`/?product=${slug}`, { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [slug, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
        <Helmet>
          <title>Loading... | Protoduct</title>
        </Helmet>
        <Header />
        <main className="container max-w-4xl mx-auto py-8 px-4">
          <div className="space-y-8">
            <Skeleton className="h-64 w-full rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
        <Helmet>
          <title>Product Not Found | Protoduct</title>
        </Helmet>
        <Header />
        <main className="container max-w-4xl mx-auto py-8 px-4">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              プロダクトが見つかりませんでした
            </h1>
            <p className="text-gray-600">
              お探しのプロダクトは削除されたか、URLが間違っている可能性があります。
            </p>
            <p className="text-sm text-gray-500 mt-4">
              3秒後にホームページにリダイレクトします...
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // OGP画像とメタタグの設定
  const ogpImageUrl = `https://viaxlwsbhrzwheekrycv.supabase.co/functions/v1/generate-ogp?type=product&name=${encodeURIComponent(product.name)}&tags=${encodeURIComponent(product.tags.join(','))}`;
  const productUrl = window.location.href;
  const description = product.description.substring(0, 150) + '...';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      <Helmet>
        <title>{`${product.name} | Protoduct`}</title>
        <meta name="description" content={description} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="product" />
        <meta property="og:url" content={productUrl} />
        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogpImageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Protoduct" />
        <meta property="product:brand" content="Protoduct" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={productUrl} />
        <meta name="twitter:title" content={product.name} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogpImageUrl} />
      </Helmet>
      <Header />
      <main className="container max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-center gap-4 mb-6">
            {product.icon && (
              <img 
                src={product.icon} 
                alt={`${product.name} icon`}
                className="w-16 h-16 rounded-lg object-cover"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              <p className="text-xl text-gray-600 mt-2">{product.tagline}</p>
            </div>
          </div>
          
          <p className="text-gray-700 mb-6">{product.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {product.tags.map((tag, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          {product.images.length > 0 && (
            <div className="mb-6">
              <img 
                src={product.images[0]} 
                alt={`${product.name} screenshot`}
                className="w-full max-w-2xl mx-auto rounded-lg shadow-md"
              />
            </div>
          )}

          <div className="text-center py-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg">
              <span className="animate-spin">🔄</span>
              <span>3秒後にメインページにリダイレクトします...</span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductPage;
