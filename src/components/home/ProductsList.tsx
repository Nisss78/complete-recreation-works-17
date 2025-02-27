
import { format } from "date-fns";
import { ProductCard } from "@/components/ProductCard";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProductsListProps {
  groupedProducts: Record<string, any[]>;
  onProductClick: (product: any) => void;
  sortByLikes?: boolean;
}

export const ProductsList = ({ groupedProducts, onProductClick, sortByLikes = false }: ProductsListProps) => {
  const { t } = useLanguage();
  const dates = Object.keys(groupedProducts).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  const formatDateHeader = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return t('products.today');
    } else if (date.toDateString() === yesterday.toDateString()) {
      return t('products.yesterday');
    } else {
      return format(date, 'yyyy/MM/dd');
    }
  };

  if (dates.length === 0) {
    return (
      <div className="text-center py-20 border border-gray-200 rounded-xl bg-white shadow-luxury">
        <p className="text-gray-500">{t('products.noProductsYet')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {dates.map((date) => (
        <div key={date} className="animate-fadeIn">
          <div className="flex items-center mb-4">
            <h2 className="text-lg font-serif font-medium text-luxury-navy uppercase tracking-wider">
              {formatDateHeader(date)}
            </h2>
            <div className="ml-3 flex-grow h-px bg-gradient-to-r from-luxury-gold/30 to-transparent"></div>
          </div>
          <div className="grid gap-4">
            {groupedProducts[date].map((product, idx) => (
              <div key={`${product.id}-${idx}`} className="card-hover">
                <ProductCard
                  product={product}
                  onClick={() => onProductClick(product)}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
