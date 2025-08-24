
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";

// ProductPageコンポーネント - /products/:slug にアクセスした場合、
// ホームページにリダイレクトしてダイアログを開く
const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    // スラッグをクエリパラメータとしてホームページにリダイレクト
    if (slug) {
      navigate(`/?product=${slug}`, { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  }, [slug, navigate]);

  // リダイレクト中は何も表示しない
  return null;
};

export default ProductPage;
