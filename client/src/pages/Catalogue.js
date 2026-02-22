import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import products from "../data/products";

function Catalogue() {
  return (
    <>

      <div className="bg-slate-900 text-white p-12 text-center">
        <h1 className="text-3xl font-bold">
          Up to 40% Off on Electronics
        </h1>
        <button className="mt-6 bg-white text-slate-900 px-6 py-3 rounded-md">
          Shop Deals
        </button>
      </div>

      <div className="max-w-7xl mx-auto p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}

export default Catalogue;