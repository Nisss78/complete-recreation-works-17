import { format } from "date-fns";
import { ProductCard } from "@/components/ProductCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { Inbox } from "lucide-react";

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
    <div className="w-full">
      {Object.entries(groupedProducts).map(([date, products]: [string, any]) => (
        <div key={date} className="mb-4 sm:mb-6 md:mb-8">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-3 md:mb-4 text-gray-800 px-2 sm:px-0">
            {format(new Date(date), 'MMMM d, yyyy')}
          </h2>
          <div className="space-y-2 sm:space-y-3 md:space-y-4 bg-white rounded-xl shadow-sm border border-gray-200 divide-y">
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
        <div className="text-center text-gray-500 mt-6 sm:mt-8 p-4 sm:p-6 md:p-8 bg-white rounded-xl shadow-sm border border-gray-200">
          <Inbox className="mx-auto h-8 w-8 sm:h-10 sm:w-10 mb-2 text-gray-400" />
          <p>{t('index.noProducts')}</p>
        </div>
      )}
    </div>
  );
};