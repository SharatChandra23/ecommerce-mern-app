import { useEffect, useState } from "react";
import API from "../api/api";
import ProductCard from "../components/ProductCard";

import debounce from "lodash/debounce";
import ProductSkeleton from "../components/common/ProductSkeleton";
import AppButton from "../components/common/AppButton";
import CustomSearchInput from "../components/common/customSearchInput";
import { FaCheck } from "react-icons/fa";
// import Loader from "../components/common/Loader";

function Catalogue() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(Number.MAX_SAFE_INTEGER);
  const [rating, setRating] = useState(0);

  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const { data } = await API.get("/products", {
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
    const { data } = await API.get("/categories");
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
        <AppButton key={'categoryBtn'} onClick={() => setCategory("")} variant="primary" fullWidth className="mb-2">All</AppButton>
        {categories.map(cat => (
          <AppButton
            key={cat._id}
            onClick={() => setCategory(cat._id)}
            variant="primary"
            fullWidth
            className="mb-2"
          >
            {cat.name}
          </AppButton>
        ))}

        {/* Price Range */}
        <h3 className="font-bold mt-6 mb-3">Price Range</h3>
        <div className="flex flex-col gap-2">
          <AppButton onClick={() => { setMinPrice(0); setMaxPrice(100); }}>
            Under $100
          </AppButton>
          <AppButton onClick={() => { setMinPrice(100); setMaxPrice(500); }}>
            $100 - $500
          </AppButton>
          <AppButton onClick={() => { setMinPrice(500); setMaxPrice(1000); }}>
            $500 - $1000
          </AppButton>
          <AppButton onClick={() => { setMinPrice(1000); setMaxPrice(100000); }}>
            Over $1000
          </AppButton>
        </div>

        {/* Ratings */}
        <h3 className="font-bold mt-6 mb-3">Rating</h3>
        <div className="flex flex-col gap-2">
          <AppButton onClick={() => setRating(4)}>4+ Stars</AppButton>
          <AppButton onClick={() => setRating(3)}>3+ Stars</AppButton>
          <AppButton onClick={() => setRating(2)}>2+ Stars</AppButton>
          <AppButton onClick={() => setRating(1)}>1+ Stars</AppButton>
        </div>

        {/* Benefits */}
        <div className="mt-8 border-t pt-4">
          <p className="flex gap-1 justify-center align-center"> <span> <FaCheck size={14} /> </span> <span>Free Shipping </span> </p>
          <p className="flex gap-1 justify-center align-center"> <span> <FaCheck size={14} /> </span> <span>30-Day Returns </span></p>
          <p className="flex gap-1 justify-center align-center"> <span> <FaCheck size={14} /> </span> <span> 2-Year Warranty </span></p>
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
            <div className="mb-4">
              <CustomSearchInput debouncedSearch={debouncedSearch} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {products.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-8 gap-3">
              {Array.from({ length: totalPages }).map((_, index) => (
                <AppButton
                  key={index}
                  onClick={() => setPage(index + 1)}
                  variant="primary"
                  className={`px-4 py-2 border rounded ${page === index + 1
                    ? "bg-slate-900 text-white"
                    : ""
                    }`}
                >
                  {index + 1}
                </AppButton>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Catalogue;