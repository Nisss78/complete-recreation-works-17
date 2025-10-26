import React from 'react';

const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 animate-pulse">
      <div className="flex items-start gap-4">
        {/* Icon skeleton */}
        <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0"></div>

        <div className="flex-1 min-w-0">
          {/* Title skeleton */}
          <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>

          {/* Description skeleton */}
          <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>

          {/* Tags skeleton */}
          <div className="flex gap-2 mt-3">
            <div className="h-6 bg-gray-200 rounded-full w-16"></div>
            <div className="h-6 bg-gray-200 rounded-full w-20"></div>
            <div className="h-6 bg-gray-200 rounded-full w-14"></div>
          </div>
        </div>

        {/* Stats skeleton */}
        <div className="flex flex-col items-end gap-2">
          <div className="h-4 bg-gray-200 rounded w-12"></div>
          <div className="h-4 bg-gray-200 rounded w-12"></div>
        </div>
      </div>
    </div>
  );
};

export const ProductsListSkeleton: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* Date header skeleton */}
      <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>

      {/* Product cards */}
      {[1, 2, 3, 4, 5].map((i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};

export default ProductCardSkeleton;
