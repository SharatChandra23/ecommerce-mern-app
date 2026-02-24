function ProductSkeleton() {
  return (
    <div className="border rounded-lg p-4 animate-pulse bg-white">
      <div className="h-48 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 mt-4 w-3/4 rounded"></div>
      <div className="h-4 bg-gray-200 mt-2 w-1/2 rounded"></div>
      <div className="h-8 bg-gray-200 mt-4 rounded"></div>
    </div>
  );
}

export default ProductSkeleton;