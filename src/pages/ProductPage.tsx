
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

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

  useEffect(() => {
    // Redirect to home page with the slug in the URL
    if (slug) {
      navigate(`/?product=${slug}`, { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  }, [slug, navigate]);

  return null; // This component doesn't render anything, just redirects
};

export default ProductPage;
