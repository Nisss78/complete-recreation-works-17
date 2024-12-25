import { format } from "date-fns";
import { ProductCard } from "@/components/ProductCard";
import { useLanguage } from "@/contexts/LanguageContext";

interface Product {
  id: number;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  URL: string;
  tags: string[];
  upvotes: number;
  comments: number;
  launchDate: Date;
}

interface ProductsListProps {
  groupedProducts: Record<string, Product[]>;
  onProductClick: (product: Product) => void;
  sortByLikes: boolean;
}

export const ProductsList = ({ groupedProducts, onProductClick, sortByLikes }: ProductsListProps) => {
  const { t } = useLanguage();

  return (
    <div>
      {Object.entries(groupedProducts).map(([date, products]: [string, any]) => (
        <div key={date} className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">
            {format(new Date(date), 'MMMM d, yyyy')}
          </h2>
          <div className="space-y-3 sm:space-y-4 bg-white rounded-xl shadow-sm border border-gray-200 divide-y">
            {products.map((product: Product) => (
              <ProductCard 
                key={`${product.id}-${date}`}
                {...product}
                onClick={() => onProductClick(product)}
              />
            ))}
          </div>
        </div>
      ))}
      {Object.keys(groupedProducts).length === 0 && (
        <div className="text-center text-gray-500 mt-8 p-6 sm:p-8 bg-white rounded-xl shadow-sm border border-gray-200">
          {t('index.noProducts')}
        </div>
      )}
    </div>
  );
};