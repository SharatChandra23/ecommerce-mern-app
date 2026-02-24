import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import ProductCard from "../components/ProductCard";

import { debounce } from "lodash";
import ProductSkeleton from "../components/common/ProductSkeleton";
// import Loader from "../components/common/Loader";

function Catalogue() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [rating, setRating] = useState(0);

  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const { data } = await axiosInstance.get("/products", {
        params: {
          page,
          search,
          category,
          sort,
          minPrice,
          maxPrice,
          rating,
        },
      });

      setProducts(data.products);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    const { data } = await axiosInstance.get("/categories");
    setCategories(data);
  };

  useEffect(() => {
    fetchProducts();
  }, [page, search, category, sort, minPrice, maxPrice, rating]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const debouncedSearch = debounce((value) => {
    setSearch(value);
    setPage(1);
  }, 500);

  return (
    <div className="max-w-7xl mx-auto p-6 flex flex-col md:flex-row gap-8">

      {/* SIDEBAR */}
      <div className="md:w-1/4 border p-4 rounded-lg">

        {/* Categories */}
        <h3 className="font-bold mb-3">Categories</h3>
        <button onClick={() => setCategory("")} className="block mb-2">All</button>
        {categories.map(cat => (
          <button
            key={cat._id}
            onClick={() => setCategory(cat._id)}
            className="block mb-2"
          >
            {cat.name}
          </button>
        ))}

        {/* Price Range */}
        <h3 className="font-bold mt-6 mb-3">Price Range</h3>
        <div className="flex flex-col gap-2">
          <button onClick={() => { setMinPrice(0); setMaxPrice(100); }}>
            Under $100
          </button>
          <button onClick={() => { setMinPrice(100); setMaxPrice(500); }}>
            $100 - $500
          </button>
          <button onClick={() => { setMinPrice(500); setMaxPrice(1000); }}>
            $500 - $1000
          </button>
          <button onClick={() => { setMinPrice(1000); setMaxPrice(100000); }}>
            Over $1000
          </button>
        </div>

        {/* Ratings */}
        <h3 className="font-bold mt-6 mb-3">Rating</h3>
        <div className="flex flex-col gap-2">
          <button onClick={() => setRating(4)}>4+ Stars</button>
          <button onClick={() => setRating(3)}>3+ Stars</button>
          <button onClick={() => setRating(2)}>2+ Stars</button>
          <button onClick={() => setRating(1)}>1+ Stars</button>
        </div>

        {/* Benefits */}
        <div className="mt-8 border-t pt-4 text-sm text-gray-600">
          <p>✓ Free Shipping</p>
          <p>✓ 30-Day Returns</p>
          <p>✓ 2-Year Warranty</p>
        </div>

      </div>

      {/* PRODUCTS */}
      <div className="md:w-3/4">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            <div className="search-input">
              <input
                type="text"
                placeholder="Search products..."
                onChange={(e) => debouncedSearch(e.target.value)}
                className="border p-2 rounded w-1/2"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {products.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-8 gap-3">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setPage(index + 1)}
                  className={`px-4 py-2 border rounded ${page === index + 1
                    ? "bg-slate-900 text-white"
                    : ""
                    }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Catalogue;